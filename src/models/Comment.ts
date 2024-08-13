import { Schema, model, Document } from "mongoose";

const commentSchema = new Schema(
  {
    content: {
      type: String,
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
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

interface IComment extends Document {
  content: string;
  author: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
}

const Comment = model<IComment>("Comment", commentSchema);

export { Comment, IComment };
