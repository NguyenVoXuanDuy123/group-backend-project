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
}

export default new CommentRepository();
