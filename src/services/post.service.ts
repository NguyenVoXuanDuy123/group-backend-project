import postRepository from "@src/repositories/post.repository";
import { IPost } from "@src/schema/post.schema";
import { CreatePostRequestType } from "@src/types/post.types";
import { Types } from "mongoose";

class PostService {
  public async createPost(
    authorID: string,
    createPostRequest: CreatePostRequestType
  ) {
    const post: IPost = {
      author: new Types.ObjectId(authorID),
      group: createPostRequest.groupId
        ? new Types.ObjectId(createPostRequest.groupId)
        : null,
      visibility_level: createPostRequest.visibilityLevel,
      content: createPostRequest.content,
    };
    await postRepository.createPost(post);
  }

  public async reactToPost(postID: string, userID: string) {}
}

export default new PostService();
