import { Schema, model, Types } from "mongoose";

export type CommentEditHistory = {
  content: string;
  editedAt: Date;
};

export type Comment = {
  author: Types.ObjectId;
  post: Types.ObjectId;
  content: string;
  editHistory: CommentEditHistory[];
  createdAt: Date;
  updatedAt: Date;
};

const commentSchema = new Schema<Comment>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "posts",
      required: true,
    },
    content: { type: String, required: true },
    editHistory: [
      {
        content: { type: String, required: true },
        editedAt: { type: Date, required: true, default: Date.now },
      },
    ],
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

// this is a compound index that improves the performance of queries getting comments by post id
commentSchema.index({ post: 1, createdAt: -1 });

// this is a compound index that improves the performance of queries getting comments by post id
commentSchema.index({ post: 1 });

// Create a model based on the schema.
const CommentModel = model<Comment>("comments", commentSchema);

export default CommentModel;
