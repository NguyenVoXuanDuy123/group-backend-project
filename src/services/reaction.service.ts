import NotFoundError from "@src/error/NotFoundError";
import postRepository from "@src/repositories/post.repository";

class ReactionService {
  public async reactToPost(postID: string, userID: string) {
    const post = await postRepository.getPostById(postID);
    if (!post) {
      throw new NotFoundError("post");
    }
    // const reaction = reactionRepository.getReactionByPostIdAndUserId(
    //   postID,
    //   userID
    // );
  }
}

export default ReactionService;
