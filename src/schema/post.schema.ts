import { Schema, model, Types, Document } from "mongoose";

// Define an interface representing a document in MongoDB.
interface IEditHistory {
  content: string;
  edited_at: Date;
}

export enum PostVisibilityLevel {
  PUBLIC = "public",
  PRIVATE = "private",
}

export interface IPost {
  author: Types.ObjectId;
  content: string;
  images: string[];
  visibility_level: PostVisibilityLevel;
  group: Types.ObjectId | null;
  edit_history?: IEditHistory[];
  created_at?: Date;
  updated_at?: Date;
}

// Create a schema corresponding to the document interface.
const postSchema = new Schema<IPost>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
    },
    content: { type: String, required: true },
    images: [{ type: String }],
    visibility_level: {
      type: String,
      required: true,
      enum: Object.values(PostVisibilityLevel),
    },
    group: { type: Schema.Types.ObjectId, ref: "groups" },
    edit_history: [
      {
        content: { type: String, required: true },
        editedAt: { type: Date, required: true, default: Date.now },
      },
    ],
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

// Create a model based on the schema.
const PostModel = model<IPost>("posts", postSchema);

export default PostModel;
