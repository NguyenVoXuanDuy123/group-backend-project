import { ReactionTargetType, ReactionType } from "@src/enums/post.enum";
import { model, Model, Schema, Types } from "mongoose";

// Define the Reaction interface
export interface IReaction {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  target_type: ReactionTargetType;
  target: Types.ObjectId;
  type: ReactionType;
  created_at: Date;
  updated_at: Date;
}

// Define the Reaction Schema
const ReactionSchema: Schema<IReaction> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    target_type: { type: String, enum: ReactionTargetType, required: true },
    target: {
      type: Schema.Types.ObjectId,
      ref: "comments" || "groups",
      required: true,
    },
    type: { type: String, enum: ReactionType, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// Create the Reaction model
const ReactionModel: Model<IReaction> = model<IReaction>(
  "reactions",
  ReactionSchema
);

export default ReactionModel;
