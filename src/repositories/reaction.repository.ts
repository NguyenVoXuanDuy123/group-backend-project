import { ReactionTargetType, ReactionType } from "@src/enums/post.enum";
import ReactionModel, { IReaction } from "@src/schema/reaction.schema";
import { ReactionDetailType } from "@src/types/post.types";
import { ProjectionType, Types } from "mongoose";

class ReactionRepository {
  public async upsertReaction(
    targetId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    target_type: ReactionTargetType,
    type: ReactionType
  ) {
    return await ReactionModel.findOneAndUpdate(
      {
        target: targetId,
        user: userId,
        target_type,
      },
      {
        type: type,
      },
      {
        new: true,
        // If the reaction does not exist, add a new reaction
        upsert: true,
        projection: { __v: 0 },
      }
    );
  }

  public async getReactionCountByTargetId(targetId: string | Types.ObjectId) {
    return await ReactionModel.countDocuments({
      target: targetId,
    });
  }

  public async removeReaction(
    targetId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    target_type: ReactionTargetType
  ) {
    return await ReactionModel.findOneAndDelete({
      target: targetId,
      user: userId,
      target_type,
    });
  }

  public async checkReactionExistsByTargetIdAndUserId(
    targetId: string | Types.ObjectId,
    userId: string | Types.ObjectId
  ) {
    return !!(await this.getReactionsByTargetIdAndUserId(targetId, userId));
  }

  public async getReactionsByTargetIdAndUserId(
    targetId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    projection: ProjectionType<IReaction> = {}
  ) {
    /**
     * We don't need to worry about the target type here
     * because the percentage of two targetId duplication is very low (almost 0)
     * it is not worth to add target_type to the query, it will slow down the query
     */
    return await ReactionModel.findOne(
      {
        target: targetId,
        user: userId,
      },
      projection
    ).lean();
  }

  public async getReactionsByTargetId(targetId: string | Types.ObjectId) {
    /**
     * We don't need to worry about the target type here
     * because the percentage of two targetId duplication is very low (almost 0)
     * it is not worth to add target_type to the query, it will slow down the query
     */

    return await ReactionModel.aggregate<ReactionDetailType>([
      {
        $match: {
          target: new Types.ObjectId(targetId),
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
          target_type: "$target_type",
          user: {
            _id: "$user._id",
            first_name: "$user.first_name",
            last_name: "$user.last_name",
            avatar: "$user.avatar",
            username: "$user.username",
          },
        },
      },
    ]);
  }
}

export default new ReactionRepository();
