import { ReactionType } from "@src/enums/post.enum";
import { Schema, model, Types, Document } from "mongoose";

// Define an interface representing a document in MongoDB.
export interface IReaction {
  post: Types.ObjectId;
  user: Types.ObjectId;
  reaction_type: ReactionType;
  created_at: Date;
}

// Create a schema corresponding to the document interface.
const reactionSchema = new Schema<IReaction>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "posts",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    reaction_type: {
      type: String,
      required: true,
      enum: ReactionType,
    },
    created_at: { type: Date, default: Date.now },
  },
  {
    timestamps: {
      createdAt: "created_at",
    },
  }
);

// Create a model based on the schema.
const ReactionModel = model<IReaction>("reactions", reactionSchema);

export default ReactionModel;
