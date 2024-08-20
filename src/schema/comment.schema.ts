import { Schema, model, Types } from "mongoose";

// Define an interface representing a document in MongoDB.
export interface ICommentEditHistory {
  content: string;
  edited_at: Date;
}

export interface IComment {
  author: Types.ObjectId;
  post: Types.ObjectId;
  content: string;
  edit_history: ICommentEditHistory[];
  created_at: Date;
  updated_at: Date;
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
    edit_history: [
      {
        content: { type: String, required: true },
        edited_at: { type: Date, required: true, default: Date.now },
      },
    ],
    created_at: { type: Date },
    updated_at: { type: Date },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// Create a model based on the schema.
const CommentModel = model<IComment>("comments", commentSchema);

export default CommentModel;
