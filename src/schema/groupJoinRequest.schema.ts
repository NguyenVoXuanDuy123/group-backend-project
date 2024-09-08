import { GroupJoinRequestStatus } from "@src/enums/group.enums";
import { model, Model, Schema, Types } from "mongoose";

type GroupJoinRequest = {
  user: Types.ObjectId;
  group: Types.ObjectId;
  status: GroupJoinRequestStatus;
  createdAt: Date;
  updatedAt: Date;
};

// Define the GroupJoinRequest Schema
const GroupJoinRequestSchema: Schema<GroupJoinRequest> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users" },
    group: { type: Schema.Types.ObjectId, ref: "groups" },
    status: {
      type: String,
      enum: GroupJoinRequestStatus,
      default: GroupJoinRequestStatus.PENDING,
    },
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

GroupJoinRequestSchema.index({ group: 1, user: 1 }, { unique: true });

GroupJoinRequestSchema.index({ group: 1, createdAt: -1 });

const GroupJoinRequestModel: Model<GroupJoinRequest> = model<GroupJoinRequest>(
  "groupJoinRequests",
  GroupJoinRequestSchema
);

export default GroupJoinRequestModel;
