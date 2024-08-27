import { FriendRequestStatus } from "@src/enums/user.enum";
import { model, Model, Schema, Types } from "mongoose";

// Define the Request interface
export interface IFriendRequest {
  sender_id: Types.ObjectId;
  receiver_id: Types.ObjectId;
  status: FriendRequestStatus;
  created_at: Date;
  updated_at: Date;
}

// Define enums for status

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

// Create a compound index that improves the performance of queries getting friend requests by sender id and receiver id
FriendRequestSchema.index({ sender_id: 1, receiver_id: 1 });

// Create a compound index that improves the performance of queries getting pending friend requests by receiver id
FriendRequestSchema.index({ receiver_id: 1, status: 1 });

// Create the Request model
const FriendRequestModel: Model<IFriendRequest> = model<IFriendRequest>(
  "friend_requests",
  FriendRequestSchema
);

export default FriendRequestModel;
