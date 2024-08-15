import PostModel, { IPost } from "@src/schema/post.schema";
import { ProjectionType, Types } from "mongoose";

class PostRepository {
  public async createPost(post: IPost) {
    await PostModel.create(post);
  }

  public async getPostById(
    postId: string | Types.ObjectId,
    projection?: ProjectionType<IPost>
  ) {
    return PostModel.findById(postId, projection).lean();
  }
}

export default new PostRepository();
