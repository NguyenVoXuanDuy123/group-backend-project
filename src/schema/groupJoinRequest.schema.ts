import { GroupJoinRequestStatus } from "@src/enums/group.enum";
import { model, Model, Schema, Types } from "mongoose";

// Define the GroupJoinRequest interface
interface IGroupJoinRequest {
  user_id: Types.ObjectId;
  group_id: Types.ObjectId;
  status: GroupJoinRequestStatus;
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

// Create the GroupJoinRequest model
const GroupJoinRequestModel: Model<IGroupJoinRequest> =
  model<IGroupJoinRequest>("group_join_requests", GroupJoinRequestSchema);

export default GroupJoinRequestModel;
