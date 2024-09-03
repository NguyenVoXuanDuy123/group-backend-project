import { ReactionTargetType, ReactionType } from "@src/enums/post.enum";

import reactionRepository from "@src/repositories/reaction.repository";

class ReactionService {
  public async createReaction(
    postID: string,
    userID: string,
    targetType: ReactionTargetType,
    type: ReactionType
  ) {
    return await reactionRepository.upsertReaction(
      postID,
      userID,
      targetType,
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
