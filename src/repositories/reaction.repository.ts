import ReactionModel from "@src/schema/reaction.schema";

class ReactionRepository {
  public async getReactionByPostIdAndUserId(postId: string, userId: string) {
    return ReactionModel.findOne({ post_id: postId, user_id: userId });
  }
}

export default new ReactionRepository();
