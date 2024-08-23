import { validateDate } from "@src/helpers/validation";
import CommentModel, {
  IComment,
  ICommentEditHistory,
} from "@src/schema/comment.schema";

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
    edit_history: Partial<ICommentEditHistory>
  ) {
    return await CommentModel.findByIdAndUpdate(commentId, {
      $push: { edit_history },
    }).lean();
  }

  public async deleteCommentById(commentId: string | Types.ObjectId) {
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
          ...(beforeDate && { created_at: { $lt: new Date(beforeDate) } }),
        },
      },
      { $sort: { created_at: -1 } },
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
          "author.first_name": 1,
          "author.last_name": 1,
          "author.avatar": 1,
          content: 1,
          created_at: 1,
          edit_history: 1,
          updated_at: 1,
        },
      },
      { $project: { __v: 0 } },
    ]);
  }
}

export default new CommentRepository();
