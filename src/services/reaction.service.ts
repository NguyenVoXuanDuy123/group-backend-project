import { ReactionTargetType, ReactionType } from "@src/enums/post.enum";
import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";

import reactionRepository from "@src/repositories/reaction.repository";

class ReactionService {
  public async reactToPost(
    postID: string,
    userID: string,
    target_type: ReactionTargetType,
    type: ReactionType
  ) {
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
    if (
      !(await reactionRepository.checkReactionExistsByTargetIdAndUserId(
        postID,
        userID
      ))
    ) {
      throw new ApiError(ApiErrorCodes.USER_NOT_REACTED);
    }
    await reactionRepository.removeReaction(postID, userID, type);
  }
}

export default new ReactionService();
