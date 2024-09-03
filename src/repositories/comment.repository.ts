import { validateDate } from "@src/helpers/validation";
import CommentModel, {
  IComment,
  ICommentEditHistory,
} from "@src/schema/comment.schema";
import ReactionModel from "@src/schema/reaction.schema";

import { ProjectionType, Types } from "mongoose";

class CommentRepository {
  public async createComment(comment: Partial<IComment>) {
    return await CommentModel.create(comment);
  }

  public async findCommentById(
    commentId: string | Types.ObjectId,
    projection: ProjectionType<IComment> = {}
  ) {
    return await CommentModel.findById(commentId, projection).lean();
  }

  public async updateCommentById(
    commentId: string | Types.ObjectId,
    comment: Partial<IComment>
  ) {
    return await CommentModel.findByIdAndUpdate(
      commentId,
      { $set: comment },
      { new: true }
    ).lean();
  }

  public async pushCommentEditHistory(
    commentId: string | Types.ObjectId,
    editHistory: Partial<ICommentEditHistory>
  ) {
    return await CommentModel.findByIdAndUpdate(commentId, {
      $push: { editHistory },
    }).lean();
  }

  public async deleteCommentById(commentId: string | Types.ObjectId) {
    await ReactionModel.deleteMany({ target: commentId });
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
}

export default new CommentRepository();
