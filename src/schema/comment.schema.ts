import { Schema, model, Types } from "mongoose";

// Define an interface representing a document in MongoDB.
export interface ICommentEditHistory {
  content: string;
  editedAt: Date;
}

export interface IComment {
  author: Types.ObjectId;
  post: Types.ObjectId;
  content: string;
  editHistory: ICommentEditHistory[];
  createdAt: Date;
  updatedAt: Date;
}

// Create a schema corresponding to the document interface.
const commentSchema = new Schema<IComment>(
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
const CommentModel = model<IComment>("comments", commentSchema);

export default CommentModel;
