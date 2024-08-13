import { Schema, model, Document } from "mongoose";

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    visibility: {
      type: String,
      enum: ["Public", "Private"],
      default: "Public",
    },
  },
  {
    timestamps: true,
  }
);

interface IGroup extends Document {
  name: string;
  description: string;
  members: Schema.Types.ObjectId[];
  admins: Schema.Types.ObjectId[];
  posts: Schema.Types.ObjectId[];
  visibility: "Public" | "Private";
}

const Group = model<IGroup>("Group", groupSchema);

export { Group, IGroup };
