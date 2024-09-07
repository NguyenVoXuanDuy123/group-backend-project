import { validateDate } from "@src/helpers/validation";
import reactionRepository from "@src/repositories/reaction.repository";
import CommentModel, {
  Comment,
  CommentEditHistory,
} from "@src/schema/comment.schema";
import ReactionModel from "@src/schema/reaction.schema";
import notificationService from "@src/services/notification.service";

import { ProjectionType, Types } from "mongoose";

class CommentRepository {
  public async createComment(comment: Partial<Comment>) {
    return await CommentModel.create(comment);
  }

  public async findCommentById(
    commentId: string | Types.ObjectId,
    projection: ProjectionType<Comment> = {}
  ) {
    return await CommentModel.findById(commentId, projection).lean();
  }

  public async updateCommentById(
    commentId: string | Types.ObjectId,
    comment: Partial<Comment>
  ) {
    return await CommentModel.findByIdAndUpdate(
      commentId,
      { $set: comment },
      { new: true }
    ).lean();
  }

  public async pushCommentEditHistory(
    commentId: string | Types.ObjectId,
    editHistory: Partial<CommentEditHistory>
  ) {
    return await CommentModel.findByIdAndUpdate(commentId, {
      $push: { editHistory },
    }).lean();
  }

  public async removeCommentById(commentId: string | Types.ObjectId) {
    await ReactionModel.deleteMany({ target: commentId });
    // Remove all notifications related to the comment
    await notificationService.removeNotificationByEntityId(commentId);
    return await CommentModel.findByIdAndDelete(commentId).lean();
  }

  public async getCommentCountByPostId(postId: string | Types.ObjectId) {
    return await CommentModel.countDocuments({ post: postId }).lean();
  }

  public async getCommentsByPostId(
    postId: string | Types.ObjectId,
    beforeDate: string | undefined,
    limit: number | undefined
  ) {
    if (beforeDate) {
      //if date is not valid, method below will throw an error
      validateDate(beforeDate);
    }

    if (!limit) {
      limit = 10;
    }
    return await CommentModel.aggregate<Record<string, never>>([
      {
        $match: {
          post: new Types.ObjectId(postId),
          ...(beforeDate && { createdAt: { $lt: new Date(beforeDate) } }),
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $project: {
          "author._id": 1,
          "author.username": 1,
          "author.firstName": 1,
          "author.lastName": 1,
          "author.avatar": 1,
          content: 1,
          createdAt: 1,
          editHistory: 1,
          updatedAt: 1,
        },
      },
      { $project: { __v: 0 } },
    ]);
  }

  public async removeCommentsByPostId(postId: string | Types.ObjectId) {
    const comments = await CommentModel.find(
      { post: postId },
      {
        _id: 1,
      }
    ).lean();
    const commentIds = comments.map((comment) => comment._id);

    // Remove all reactions related to the comments
    await reactionRepository.removeReactionsByTargetIds(commentIds);

    // Remove all notifications related to the comments
    await notificationService.removeNotificationsByEntityIds(commentIds);

    // Remove all comments related to the post
    return await CommentModel.deleteMany({ post: postId }).lean();
  }
}

export default new CommentRepository();
