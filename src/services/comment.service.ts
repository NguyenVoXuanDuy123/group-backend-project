import { ReactionTargetType, ReactionType } from "@src/enums/post.enum";
import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import NotFoundError from "@src/error/NotFoundError";
import { removeNullValues } from "@src/helpers/removeNullValue";
import commentRepository from "@src/repositories/comment.repository";
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
      throw new NotFoundError("comment");
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
      throw new NotFoundError("comment");
    }
    if (!comment.author.equals(senderId)) {
      throw new ApiError(ApiErrorCodes.FORBIDDEN);
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

  public async deleteComment(senderId: string, commentId: string) {
    const comment = await commentRepository.findCommentById(commentId);
    if (!comment) {
      throw new NotFoundError("comment");
    }
    if (!comment.author.equals(senderId)) {
      throw new ApiError(ApiErrorCodes.FORBIDDEN);
    }
    await commentRepository.deleteCommentById(commentId);
  }

  public async reactToComment(
    senderId: string,
    commentId: string,
    type: ReactionType
  ) {
    const comment = await commentRepository.findCommentById(commentId);
    if (!comment) {
      throw new NotFoundError("comment");
    }
    // if the post does not exist, or not visible to the sender
    // the method below will throw an error
    // so that we reuse the method to check if the post exists and visible to the sender
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
    const comment = await commentRepository.findCommentById(commentId);
    if (!comment) {
      throw new NotFoundError("comment");
    }
    // if the post does not exist, or not visible to the sender
    // the method below will throw an error
    // so that we reuse the method to check if the post exists and visible to the sender
    await postService.getPostById(comment.post, senderId);
    await reactionService.removeReactionFromPost(
      commentId,
      senderId,
      ReactionTargetType.COMMENT
    );
  }
}
export default new CommentService();
