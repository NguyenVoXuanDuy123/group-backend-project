import { ReactionTargetType, ReactionType } from "@src/enums/post.enum";
import ReactionModel, { IReaction } from "@src/schema/reaction.schema";
import notificationService from "@src/services/notification.service";
import { ReactionDetailType } from "@src/types/post.types";
import { ProjectionType, Types } from "mongoose";

class ReactionRepository {
  public async upsertReaction(
    targetId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    targetType: ReactionTargetType,
    type: ReactionType
  ) {
    return await ReactionModel.findOneAndUpdate(
      {
        target: targetId,
        user: userId,
      },
      {
        targetType: targetType,
        type: type,
      },
      {
        new: true,
        // If the reaction does not exist, add a new reaction
        upsert: true,
        projection: { _id: 1, createdAt: 1, updatedAt: 1 },
      }
    );
  }

  public async getReactionCountByTargetId(targetId: string | Types.ObjectId) {
    return await ReactionModel.countDocuments({ target: targetId });
  }

  public async getReactionSummaryByTargetId(targetId: string | Types.ObjectId) {
    /**
     * We don't need to worry about the target type here
     * because the percentage of two targetId duplication is very low (almost 0)
     * it is not worth to add targetType to the query, it will slow down the query
     */
    const hahaCount = await ReactionModel.countDocuments({
      target: targetId,
      type: ReactionType.HAHA,
    });
    const likeCount = await ReactionModel.countDocuments({
      target: targetId,
      type: ReactionType.LIKE,
    });
    const loveCount = await ReactionModel.countDocuments({
      target: targetId,
      type: ReactionType.LOVE,
    });

    const angryCount = await ReactionModel.countDocuments({
      target: targetId,
      type: ReactionType.ANGRY,
    });
    return [
      { type: ReactionType.HAHA, count: hahaCount },
      { type: ReactionType.LIKE, count: likeCount },
      { type: ReactionType.LOVE, count: loveCount },
      { type: ReactionType.ANGRY, count: angryCount },
    ];
  }

  public async removeReaction(
    targetId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    targetType: ReactionTargetType
  ) {
    const res = await ReactionModel.findOneAndDelete({
      target: targetId,
      user: userId,
      targetType,
    });

    // Remove the notification related to the reaction
    if (res) {
      await notificationService.removeNotificationByEntityId(res._id);
    }
  }

  public async checkReactionExistsByTargetIdAndUserId(
    targetId: string | Types.ObjectId,
    userId: string | Types.ObjectId
  ) {
    return !!(await this.getReactionsByTargetIdAndUserId(targetId, userId, {
      _id: 1,
    }));
  }

  public async getReactionsByTargetIdAndUserId(
    targetId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    projection: ProjectionType<IReaction> = {}
  ) {
    /**
     * We don't need to worry about the target type here
     * because the percentage of two targetId duplication is very low (almost 0)
     * it is not worth to add targetType to the query, it will slow down the query
     */
    return await ReactionModel.findOne(
      {
        target: targetId,
        user: userId,
      },
      projection
    ).lean();
  }

  public async getReactionsByTargetId(
    targetId: string | Types.ObjectId,
    type: ReactionType
  ) {
    /**
     * We don't need to worry about the target type here
     * because the percentage of two targetId duplication is very low (almost 0)
     * it is not worth to add targetType to the query, it will slow down the query
     */

    return await ReactionModel.aggregate<ReactionDetailType>([
      {
        $match: {
          target: new Types.ObjectId(targetId),
          type: type,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: "$_id",
          type: "$type",
          targetType: "$targetType",
          user: {
            _id: "$user._id",
            firstName: "$user.firstName",
            lastName: "$user.lastName",
            avatar: "$user.avatar",
            username: "$user.username",
          },
        },
      },
    ]);
  }

  public async removeReactionsByTargetIds(targetIds: Types.ObjectId[]) {
    /**
     * We don't need to worry about the target type here
     * because the percentage of two targetId duplication is very low (almost 0)
     * it is not worth to add targetType to the query, it will slow down the query
     */
    const reactions = await ReactionModel.find(
      { target: { $in: targetIds } },
      {
        _id: 1,
      }
    ).lean();

    const reactionIds = reactions.map((reaction) => reaction._id);

    // remove notifications related to the reactions
    await notificationService.removeNotificationsByEntityIds(reactionIds);

    // remove the reactions
    await ReactionModel.deleteMany({ _id: { $in: reactionIds } });
  }

  public async getReactionById(
    reactionId: string | Types.ObjectId,
    projection: ProjectionType<IReaction> = {}
  ) {
    return await ReactionModel.findById(reactionId, projection).lean();
  }
}

export default new ReactionRepository();
