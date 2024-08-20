import { GroupStatus, GroupVisibilityLevel } from "@src/enums/group.enum";
import { model, Model, Schema, Types } from "mongoose";

// Define the Group interface extending Document
export interface IGroup {
  admin: Types.ObjectId;
  name: string;
  description: string;
  visibility_level: GroupVisibilityLevel;
  members: Types.ObjectId[];
  status: GroupStatus;
  created_at: Date;
  updated_at: Date;
}

// Define the Group Schema
const GroupSchema: Schema<IGroup> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    admin: { type: Schema.Types.ObjectId, ref: "users", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "users", default: [] }],
    visibility_level: {
      type: String,
      enum: GroupVisibilityLevel,
      required: true,
    },
    status: {
      type: String,
      enum: GroupStatus,
      default: GroupStatus.PENDING,
    },
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

// Create the Group model
const GroupModel: Model<IGroup> = model<IGroup>("groups", GroupSchema);

export default GroupModel;
