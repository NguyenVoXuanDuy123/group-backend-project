import { Schema, model, Document } from "mongoose";

const notificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: [
        "FriendRequest",
        "FriendRequestAccepted",
        "Comment",
        "Reaction",
        "GroupCreationApproval",
      ],
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    details: {
      type: Schema.Types.Mixed, // Additional details about the notification (e.g., post ID, comment ID)
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

interface INotification extends Document {
  type:
    | "FriendRequest"
    | "FriendRequestAccepted"
    | "Comment"
    | "Reaction"
    | "GroupCreationApproval";
  recipient: Schema.Types.ObjectId;
  details?: unknown;
  read: boolean;
}

const Notification = model<INotification>("Notification", notificationSchema);

export { Notification, INotification };
