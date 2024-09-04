import { NotificationType } from "@src/enums/notification.enums";
import {
  PostVisibilityLevel,
  ReactionTargetType,
  ReactionType,
} from "@src/enums/post.enum";
import { UserRole } from "@src/enums/user.enums";
import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";

import { removeNullValues } from "@src/helpers/removeNullValue";
import commentRepository from "@src/repositories/comment.repository";
import groupRepository from "@src/repositories/group.repository";
import postRepository from "@src/repositories/post.repository";
import reactionRepository from "@src/repositories/reaction.repository";
import userRepository from "@src/repositories/user.repository";
import { IComment } from "@src/schema/comment.schema";
import notificationService from "@src/services/notification.service";
import postService from "@src/services/post.service";
import reactionService from "@src/services/reaction.service";
import {
  CommentDetailType,
  CreateCommentRequestType,
  UpdateCommentRequestType,
} from "@src/types/comment.types";
import { Types } from "mongoose";

class CommentService {
  public async createComment(
    senderId: string,
    postId: string,
    createCommentRequest: CreateCommentRequestType
  ): Promise<CommentDetailType> {
    const comment: Partial<IComment> = {
      content: createCommentRequest.content,
      author: new Types.ObjectId(senderId),
      post: new Types.ObjectId(postId),
    };

    const post = await postRepository.findPostById(postId, { author: 1 });

    const { _id } = await commentRepository.createComment(comment);

    // send notification to the author of the post
    await notificationService.pushNotification({
      sender: new Types.ObjectId(senderId),
      receiver: post!.author,
      type: NotificationType.COMMENT,
      relatedEntity: _id,
    });

    return await this.getCommentById(_id, senderId);
  }

  public async getCommentById(
    commentId: Types.ObjectId | string,
    senderId: string | Types.ObjectId
  ) {
    const comment = await commentRepository.findCommentById(commentId);
    if (!comment) {
      throw new ApiError(ApiErrorCodes.COMMENT_NOT_FOUND);
    }
    const author = await userRepository.getUserById(comment.author, {
      firstName: 1,
      lastName: 1,
      username: 1,
      avatar: 1,
    });
    if (!author) {
      /** there is no way when a comment exists, but the author cannot be found */
      throw new ApiError(ApiErrorCodes.CRITICAL_DATA_INTEGRITY_ERROR);
    }

    const { reactionCount, reactionSummary, userReaction } =
      await postService.getPostOrCommentInfo(comment._id, senderId);

    return {
      _id: comment._id.toHexString(),
      content: comment.content,
      editHistory: comment.editHistory,
      author: {
        _id: author._id.toHexString(),
        firstName: author.firstName,
        lastName: author.lastName,
        username: author.username,
        avatar: author.avatar,
      },
      reactionCount,
      reactionSummary,
      userReaction,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  //todo: optimize this function later
  public async updateComment(
    senderId: string,
    commentId: string,
    updateCommentRequest: UpdateCommentRequestType
  ) {
    const comment = await commentRepository.findCommentById(commentId);

    if (!comment) {
      throw new ApiError(ApiErrorCodes.COMMENT_NOT_FOUND);
    }
    // only the author of the comment can update the comment
    if (!comment.author.equals(senderId)) {
      throw new ApiError(ApiErrorCodes.UPDATE_COMMENT_FORBIDDEN);
    }
    // if the content is not changed, return the comment without updating
    if (comment.content === updateCommentRequest.content) {
      return await this.getCommentById(commentId, senderId);
    }

    // if the content is changed, push the current content to the edit history
    if (updateCommentRequest.content) {
      await commentRepository.pushCommentEditHistory(commentId, {
        content: comment.content,
      });
    }
    await commentRepository.updateCommentById(
      commentId,
      removeNullValues(updateCommentRequest)
    );

    return await this.getCommentById(commentId, senderId);
  }

  public async removeComment(
    senderId: string,
    commentId: string,
    senderRole: UserRole
  ) {
    const comment = await commentRepository.findCommentById(commentId);
    if (!comment) {
      throw new ApiError(ApiErrorCodes.COMMENT_NOT_FOUND);
    }
    /**
     * A user (sender) can only remove a comment if:
     * 1. The sender is the author of the comment.
     * 2. The sender is the author of the post containing the comment.
     * 3. The sender is an admin of the group where the comment is posted.
     * 4. The sender is a site admin.
     */

    // site admin and author of the comment can remove the comment
    if (comment.author.equals(senderId) || senderRole === UserRole.ADMIN) {
      await commentRepository.removeCommentById(commentId);
      return;
    }

    const post = await postRepository.findPostById(comment.post, {
      author: 1,
    });

    if (!post) {
      // there is no way when a comment exists, but the post cannot be found
      throw new ApiError(ApiErrorCodes.CRITICAL_DATA_INTEGRITY_ERROR);
    }

    // author of the post can remove the comment
    if (post.author.equals(senderId)) {
      await commentRepository.removeCommentById(commentId);
      return;
    }

    // if the post visibility level is group, admin of the group can remove the comment
    if (post.visibilityLevel === PostVisibilityLevel.GROUP) {
      if (!post.group) {
        // there is no way when a post has a group visibility level,
        // but group is null
        throw new ApiError(ApiErrorCodes.CRITICAL_DATA_INTEGRITY_ERROR);
      }

      const group = await groupRepository.findGroupById(post.group, {
        admin: 1,
      });

      if (!group) {
        // there is no way when a post has a group visibility level,
        // but the group cannot be found
        throw new ApiError(ApiErrorCodes.CRITICAL_DATA_INTEGRITY_ERROR);
      }

      if (group.admin.equals(senderId)) {
        commentRepository.removeCommentById(commentId);
        return;
      }
    }

    throw new ApiError(ApiErrorCodes.REMOVE_COMMENT_FORBIDDEN);
  }

  public async reactToComment(
    senderId: string,
    commentId: string,
    type: ReactionType
  ) {
    const comment = await commentRepository.findCommentById(commentId);
    if (!comment) {
      throw new ApiError(ApiErrorCodes.COMMENT_NOT_FOUND);
    }
    /**
     * If the post does not exist, or not visible to the sender
     * the method below will throw an error
     * so that we reuse the method to check if the post exists and visible to the sender
     */
    await postService.getPostById(comment.post, senderId);
    const reaction = await reactionService.createReaction(
      commentId,
      senderId,
      ReactionTargetType.COMMENT,
      type
    );
    return reaction;
  }

  public async removeReactionFromComment(commentId: string, senderId: string) {
    const comment = await commentRepository.findCommentById(commentId, {
      _id: 1,
      post: 1,
    });
    if (!comment) {
      throw new ApiError(ApiErrorCodes.COMMENT_NOT_FOUND);
    }
    /**
     * If the post does not exist, or not visible to the sender
     * the method below will throw an error
     * so that we reuse the method to check if the post exists and visible to the sender
     */
    await postService.getPostById(comment.post, senderId);
    await reactionService.removeReactionFromPost(
      commentId,
      senderId,
      ReactionTargetType.COMMENT
    );
  }

  public async getCommentReactions(
    commentId: string,
    senderId: string,
    type: ReactionType
  ) {
    const comment = await commentRepository.findCommentById(commentId, {
      _id: 1,
      post: 1,
    });
    if (!comment) {
      throw new ApiError(ApiErrorCodes.COMMENT_NOT_FOUND);
    }

    if (Object.values(ReactionType).indexOf(type) === -1) {
      throw new ApiError(ApiErrorCodes.INVALID_REACTION_TYPE);
    }
    /**
     * If the post does not exist, or not visible to the sender
     * the method below will throw an error
     * so that we reuse the method to check if the post exists and visible to the sender
     */
    await postService.getPostById(comment.post, senderId);

    return await reactionRepository.getReactionsByTargetId(commentId, type);
  }
}

export default new CommentService();
