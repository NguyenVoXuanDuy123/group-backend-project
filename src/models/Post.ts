import { Schema, model, Document } from "mongoose";

const postSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    visibility: {
      type: String,
      enum: ["Public", "Friend"],
      default: "Public",
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    reactions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reaction",
      },
    ],
  },
  {
    timestamps: true,
  }
);

interface IPost extends Document {
  content: string;
  images: string[];
  author: Schema.Types.ObjectId;
  visibility: "Public" | "Friend";
  comments: Schema.Types.ObjectId[];
  reactions: Schema.Types.ObjectId[];
}

const Post = model<IPost>("Post", postSchema);

export { Post, IPost };
