import { PostVisibilityLevel } from "@src/enums/post.enum";
import { Schema, model, Types } from "mongoose";

export type PostEditHistory = {
  content: string;
  images: string[];
  editedAt: Date;
};

export type Post =
  | {
      author: Types.ObjectId;
      content: string;
      images: string[];
      editHistory: PostEditHistory[];
      createdAt: Date;
      updatedAt: Date;
    } & (GroupPost | HomePost);

type HomePost = {
  visibilityLevel: PostVisibilityLevel.PUBLIC | PostVisibilityLevel.FRIEND;
};

type GroupPost = {
  group: Types.ObjectId;
  visibilityLevel: PostVisibilityLevel.GROUP;
};

const postSchema = new Schema<Post>(
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
const PostModel = model<Post>("posts", postSchema);

export default PostModel;
