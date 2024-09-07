import { GroupStatus, GroupVisibilityLevel } from "@src/enums/group.enums";
import { model, Model, Schema, Types } from "mongoose";

export type Group = {
  admin: Types.ObjectId;
  name: string;
  description: string;
  visibilityLevel: GroupVisibilityLevel;
  members: Types.ObjectId[];
  status: GroupStatus;
  createdAt: Date;
  updatedAt: Date;

  // This field is only required when the group status is rejected
  rejectedReason?: string;
};

// Define the Group Schema
const GroupSchema: Schema<Group> = new Schema(
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
    rejectedReason: { type: String },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

// Create the Group model
const GroupModel: Model<Group> = model<Group>("groups", GroupSchema);

export default GroupModel;
