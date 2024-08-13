// src/models/Group.ts
import { model, Model, Schema, Types } from "mongoose";

// Define enums for visibility level and status
export enum GroupVisibilityLevel {
  PUBLIC = "public",
  FRIENDS = "friends",
}

export enum GroupStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

// Define the Group interface extending Document
export interface IGroup {
  admin: Types.ObjectId;
  name: string;
  description: string;
  visibilityLevel: GroupVisibilityLevel;
  members: Types.ObjectId[];
  status?: GroupStatus;
  created_at?: Date;
  updated_at?: Date;
}

// Define the Group Schema
const GroupSchema: Schema<IGroup> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    admin: { type: Schema.Types.ObjectId, ref: "users", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "users" }],
    visibilityLevel: {
      type: String,
      enum: Object.values(GroupVisibilityLevel),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(GroupStatus),
      default: GroupStatus.PENDING,
    },
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

// Create the Group model
const GroupModel: Model<IGroup> = model<IGroup>("groups", GroupSchema);

export default GroupModel;
