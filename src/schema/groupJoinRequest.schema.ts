import { GroupJoinRequestStatus } from "@src/enums/group.enums";
import { model, Model, Schema, Types } from "mongoose";

// Define the GroupJoinRequest interface
interface IGroupJoinRequest {
  user: Types.ObjectId;
  group: Types.ObjectId;
  status: GroupJoinRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Define the GroupJoinRequest Schema
const GroupJoinRequestSchema: Schema<IGroupJoinRequest> = new Schema(
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

// Create the GroupJoinRequest model
const GroupJoinRequestModel: Model<IGroupJoinRequest> =
  model<IGroupJoinRequest>("group_join_requests", GroupJoinRequestSchema);

export default GroupJoinRequestModel;
