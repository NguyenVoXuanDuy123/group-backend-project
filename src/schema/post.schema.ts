import { PostVisibilityLevel } from "@src/enums/post.enums";
import { Schema, model, Types } from "mongoose";

// Define an interface representing a document in MongoDB.
export interface IPostEditHistory {
  content: string;
  images: string[];
  editedAt: Date;
}

export interface IPost {
  author: Types.ObjectId;
  content: string;
  images: string[];
  visibilityLevel: PostVisibilityLevel;
  group: Types.ObjectId | null;
  editHistory: IPostEditHistory[];
  createdAt: Date;
  updatedAt: Date;
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
    visibilityLevel: {
      type: String,
      enum: PostVisibilityLevel,
      required: true,
    },
    group: { type: Schema.Types.ObjectId, ref: "groups" },
    editHistory: [
      {
        content: { type: String, required: true },
        images: [{ type: String }, { default: [] }],
        editedAt: { type: Date, required: true },
      },
      {
        timestamps: {
          createdAt: "editedAt",
        },
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

// Create a model based on the schema.
const PostModel = model<IPost>("posts", postSchema);

export default PostModel;
