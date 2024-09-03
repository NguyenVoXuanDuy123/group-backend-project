import { GroupStatus, GroupVisibilityLevel } from "@src/enums/group.enum";
import { model, Model, Schema, Types } from "mongoose";

// Define the Group interface extending Document
export interface IGroup {
  admin: Types.ObjectId;
  name: string;
  description: string;
  visibilityLevel: GroupVisibilityLevel;
  members: Types.ObjectId[];
  status: GroupStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Group Schema
const GroupSchema: Schema<IGroup> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    admin: { type: Schema.Types.ObjectId, ref: "users", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "users", default: [] }],
    visibilityLevel: {
      type: String,
      enum: GroupVisibilityLevel,
      required: true,
    },
    status: {
      type: String,
      enum: GroupStatus,
      default: GroupStatus.PENDING,
    },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

// Create the Group model
const GroupModel: Model<IGroup> = model<IGroup>("groups", GroupSchema);

export default GroupModel;
