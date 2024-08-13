import { Schema, model, Document } from "mongoose";

const reactionSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Like", "Love", "Haha", "Angry"],
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  {
    timestamps: true,
  }
);

interface IReaction extends Document {
  type: "Like" | "Love" | "Haha" | "Angry";
  author: Schema.Types.ObjectId;
  post?: Schema.Types.ObjectId;
  comment?: Schema.Types.ObjectId;
}

const Reaction = model<IReaction>("Reaction", reactionSchema);

export { Reaction, IReaction };
