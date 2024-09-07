import { NotificationType } from "@src/enums/notification.enums";
import { ReactionTargetType, ReactionType } from "@src/enums/post.enum";
import commentRepository from "@src/repositories/comment.repository";
import postRepository from "@src/repositories/post.repository";
import reactionRepository from "@src/repositories/reaction.repository";
import notificationService from "@src/services/notification.service";
import { Types } from "mongoose";

class ReactionService {
  public async createReaction(
    postID: string,
    userID: string,
    targetType: ReactionTargetType,
    type: ReactionType
  ) {
    const reaction = await reactionRepository.upsertReaction(
      postID,
      userID,
      targetType,
      type
    );

    let target;

    if (targetType === ReactionTargetType.POST) {
      target = await postRepository.findPostById(postID, {
        author: 1,
      });
    } else {
      target = await commentRepository.findCommentById(postID, {
        author: 1,
      });
    }

    // If the reaction is created for the first time, notify the author of the post
    if (reaction.createdAt.getTime() === reaction.updatedAt.getTime()) {
      //notify to the author of the post
      await notificationService.pushNotification({
        receiver: target?.author,
        sender: new Types.ObjectId(userID),
        type: NotificationType.REACTION,
        relatedEntity: new Types.ObjectId(reaction._id),
      });
    }

    return reaction;
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
