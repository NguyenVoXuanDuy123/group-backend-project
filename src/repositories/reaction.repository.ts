import { ReactionTargetType, ReactionType } from "@src/enums/post.enum";
import ReactionModel, { IReaction } from "@src/schema/reaction.schema";
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
    // we don't need worry about the target type here
    // because percentage of two targetId duplication is very low (almost 0)
    // it is not worth to add target_type to the query, it will slow down the query
    // since we have index on target and user
    return await ReactionModel.findOne(
      {
        target: targetId,
        user: userId,
      },
      projection
    ).lean();
  }
}

export default new ReactionRepository();
