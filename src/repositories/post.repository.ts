import PostModel, { IPost } from "@src/schema/post.schema";
import { ProjectionType, Types } from "mongoose";

class PostRepository {
  public async createPost(post: Partial<IPost>) {
    return await PostModel.create(post);
  }

  public async checkPostExistsById(postId: string | Types.ObjectId) {
    return !!(await this.findPostById(postId));
  }

  public async findPostById(
    postId: string | Types.ObjectId,
    projection: ProjectionType<IPost> = {}
  ) {
    return await PostModel.findById(postId, projection).lean();
  }

  public async updatePostById(
    postId: string | Types.ObjectId,
    post: Partial<IPost>
  ) {
    return await PostModel.findByIdAndUpdate(postId, { $set: post });
  }

  public async incrementReactionCount(postId: string | Types.ObjectId) {
    return await PostModel.findByIdAndUpdate(postId, {
      $inc: { numberOfReactions: 1 },
    });
  }

  public async decrementReactionCount(postId: string | Types.ObjectId) {
    return await PostModel.findByIdAndUpdate(postId, {
      $inc: { numberOfReactions: -1 },
    });
  }
}

export default new PostRepository();
