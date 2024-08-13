import { model, Model, Schema, Types } from "mongoose";

export enum GroupJoinRequestStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  CANCELED = "cancelled",
}
// Define the GroupJoinRequest interface
interface IGroupJoinRequest {
  user_id: Types.ObjectId;
  group_id: Types.ObjectId;
  status: string;
  created_at: Date;
  updated_at: Date;
}

// Define the GroupJoinRequest Schema
const GroupJoinRequestSchema: Schema<IGroupJoinRequest> = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "users" },
    group_id: { type: Schema.Types.ObjectId, ref: "groups" },
    status: {
      type: String,
      enum: GroupJoinRequestStatus,
      default: GroupJoinRequestStatus.PENDING,
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

// Create the GroupJoinRequest model
const GroupJoinRequestModel: Model<IGroupJoinRequest> =
  model<IGroupJoinRequest>("group_join_requests", GroupJoinRequestSchema);

export default GroupJoinRequestModel;
