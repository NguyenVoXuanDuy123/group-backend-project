import { ReactionTargetType, ReactionType } from "@src/enums/post.enum";

import reactionRepository from "@src/repositories/reaction.repository";

class ReactionService {
  public async createReaction(
    postID: string,
    userID: string,
    target_type: ReactionTargetType,
    type: ReactionType
  ) {
    console.log(type);
    return await reactionRepository.upsertReaction(
      postID,
      userID,
      target_type,
      type
    );
  }

  public async removeReactionFromPost(
    postID: string,
    userID: string,
    type: ReactionTargetType
  ) {
    await reactionRepository.removeReaction(postID, userID, type);
  }
}

export default new ReactionService();
