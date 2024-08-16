import { model, Model, Schema, Types } from "mongoose";

// Define the Request interface
interface IFriendRequest {
  sender_id: Types.ObjectId;
  receiver_id: Types.ObjectId;
  status: FriendRequestStatus;
  created_at: Date;
  updated_at: Date;
}

// Define enums for status
export enum FriendRequestStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
}

// Define the Request Schema
const FriendRequestSchema: Schema<IFriendRequest> = new Schema(
  {
    sender_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
    receiver_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
    status: {
      type: String,
      enum: FriendRequestStatus,
      default: FriendRequestStatus.PENDING,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// Create the Request model
const FriendRequestModel: Model<IFriendRequest> = model<IFriendRequest>(
  "friend_requests",
  FriendRequestSchema
);

export default FriendRequestModel;
