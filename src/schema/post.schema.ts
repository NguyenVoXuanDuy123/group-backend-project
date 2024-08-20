import { PostVisibilityLevel } from "@src/enums/post.enum";
import { Schema, model, Types } from "mongoose";

// Define an interface representing a document in MongoDB.
export interface IPostEditHistory {
  content: string;
  images: string[];
  edited_at: Date;
}

export interface IPost {
  author: Types.ObjectId;
  content: string;
  images: string[];
  visibility_level: PostVisibilityLevel;
  group: Types.ObjectId | null;
  edit_history: IPostEditHistory[];
  created_at: Date;
  updated_at: Date;
}

// Create a schema corresponding to the document interface.
const postSchema = new Schema<IPost>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    content: { type: String, required: true },
    images: [{ type: String }, { default: [] }],
    visibility_level: {
      type: String,
      enum: PostVisibilityLevel,
      required: true,
    },
    group: { type: Schema.Types.ObjectId, ref: "groups" },
    edit_history: [
      {
        content: { type: String, required: true },
        images: [{ type: String }, { default: [] }],
        edited_at: { type: Date, required: true },
      },
      {
        timestamps: {
          createdAt: "edited_at",
        },
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
const PostModel = model<IPost>("posts", postSchema);

export default PostModel;
