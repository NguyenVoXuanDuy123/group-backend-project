import {
  PostVisibilityLevel,
  ReactionTargetType,
  ReactionType,
} from "@src/enums/post.enum";
import { UserRole } from "@src/enums/user.enum";
import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";

import { removeNullValues } from "@src/helpers/removeNullValue";
import commentRepository from "@src/repositories/comment.repository";
import groupRepository from "@src/repositories/group.repository";
import postRepository from "@src/repositories/post.repository";
import reactionRepository from "@src/repositories/reaction.repository";
import userRepository from "@src/repositories/user.repository";
import { IComment } from "@src/schema/comment.schema";
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

    const { _id } = await commentRepository.createComment(comment);

    return this.getCommentById(_id, senderId);
  }

  public async getCommentById(
    commentId: Types.ObjectId | string,
    senderId: string | Types.ObjectId
  ) {
    const comment = await commentRepository.findCommentById(commentId);
    if (!comment) {
      throw new ApiError(ApiErrorCodes.COMMENT_NOT_FOUND);
    }
    const author = await userRepository.findById(comment.author, {
      first_name: 1,
      last_name: 1,
      username: 1,
      avatar: 1,
    });
    if (!author) {
      throw new ApiError(ApiErrorCodes.CRITICAL_DATA_INTEGRITY_ERROR);
    }
    return {
      _id: comment._id.toHexString(),
      content: comment.content,
      edit_history: comment.edit_history,
      author: {
        _id: author._id.toHexString(),
        first_name: author.first_name,
        last_name: author.last_name,
        username: author.username,
        avatar: author.avatar,
      },
      reaction_count: await reactionRepository.getReactionCountByTargetId(
        comment._id
      ),
      reactionSummary: await reactionRepository.getReactionSummaryByTargetId(
        comment._id
      ),
      userReaction: await reactionRepository.getReactionsByTargetIdAndUserId(
        commentId,
        senderId,
        {
          _id: 0,
          type: 1,
        }
      ),
      created_at: comment.created_at,
      updated_at: comment.updated_at,
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
    if (comment.content === updateCommentRequest.content) {
      return await this.getCommentById(commentId, senderId);
    }
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

  public async deleteComment(
    senderId: string,
    commentId: string,
    senderRole: UserRole
  ) {
    const comment = await commentRepository.findCommentById(commentId);
    if (!comment) {
      throw new ApiError(ApiErrorCodes.COMMENT_NOT_FOUND);
    }
    /**
     * sender can only delete comment if:
     * 1. sender is the author of the comment
     * 2. sender is the author of the post
     * 3. sender is the admin of the group where the comment is posted
     * 4. sender is an site admin
     */

    // site admin and author of the comment can delete the comment
    if (comment.author.equals(senderId) || senderRole === UserRole.ADMIN) {
      await commentRepository.deleteCommentById(commentId);
      return;
    }

    const post = await postRepository.findPostById(comment.post, {
      author: 1,
    });

    if (!post) {
      // there is no way when a comment exists, but the post cannot be found
      throw new ApiError(ApiErrorCodes.CRITICAL_DATA_INTEGRITY_ERROR);
    }

    // author of the post can delete the comment
    if (post.author.equals(senderId)) {
      await commentRepository.deleteCommentById(commentId);
      return;
    }

    // if the post visibility level is group, admin of the group can delete the comment
    if (post.visibility_level === PostVisibilityLevel.GROUP) {
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
        commentRepository.deleteCommentById(commentId);
        return;
      }
    }

    throw new ApiError(ApiErrorCodes.DELETE_COMMENT_FORBIDDEN);
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
