import { ReactionTargetType, ReactionType } from "@src/enums/post.enum";
import { model, Model, Schema, Types } from "mongoose";

// Define the Reaction interface
export interface IReaction {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  targetType: ReactionTargetType;
  target: Types.ObjectId;
  type: ReactionType;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Reaction Schema
const ReactionSchema: Schema<IReaction> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    targetType: { type: String, enum: ReactionTargetType, required: true },
    target: {
      type: Schema.Types.ObjectId,
      ref: "comments" || "groups",
      required: true,
    },
    type: { type: String, enum: ReactionType, required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

ReactionSchema.index({ user: 1, target: 1 }, { unique: true });
ReactionSchema.index({ target: 1 });

// Create the Reaction model
const ReactionModel: Model<IReaction> = model<IReaction>(
  "reactions",
  ReactionSchema
);

export default ReactionModel;
