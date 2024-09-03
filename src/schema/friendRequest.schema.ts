import { FriendRequestStatus } from "@src/enums/user.enum";
import { model, Model, Schema, Types } from "mongoose";

// Define the Request interface
export interface IFriendRequest {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  status: FriendRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Define enums for status

// Define the Request Schema
const FriendRequestSchema: Schema<IFriendRequest> = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "users", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "users", required: true },
    status: {
      type: String,
      enum: FriendRequestStatus,
      default: FriendRequestStatus.PENDING,
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

// Create a compound index that improves the performance of queries getting friend requests by sender id and receiver id
FriendRequestSchema.index({ sender: 1, receiver: 1 });

// Create a compound index that improves the performance of queries getting pending friend requests by receiver id
FriendRequestSchema.index({ receiver: 1, status: 1 });

// Create the Request model
const FriendRequestModel: Model<IFriendRequest> = model<IFriendRequest>(
  "friend_requests",
  FriendRequestSchema
);

export default FriendRequestModel;
