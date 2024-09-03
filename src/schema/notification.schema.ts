import { Schema, model, Types } from "mongoose";

// Enum for notification types
enum NotificationType {
  FRIEND_REQUEST = "friend_request",
  FRIEND_REQUEST_ACCEPTED = "friend_request_accepted",
  COMMENT = "comment",
  REACTION = "reaction",
  GROUP_CREATION_APPROVAL = "group_creation_approval",
  GROUP_MEMBER_REQUEST = "group_member_request",
  GROUP_MEMBER_REQUEST_ACCEPTED = "group_member_request_accepted",
}

// Interface for the Notification document
export interface INotification {
  receiver: Types.ObjectId;
  sender: Types.ObjectId; // User who triggered the notification (if applicable)
  type: NotificationType;
  relatedEntity: Types.ObjectId; // The entity (post, comment, group, etc.) related to the notification
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Notification Schema
const NotificationSchema = new Schema<INotification>(
  {
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    sender: { type: Schema.Types.ObjectId, ref: "users", require: true },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    relatedEntity: {
      type: Schema.Types.ObjectId,
      refPath: "type",
      unique: true,
      sparse: true,
      index: true,
    }, // Dynamically refer to the entity based on the type
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date },
  },
  { timestamps: { createdAt: true } }
);

// Indexes
NotificationSchema.index({ recipient: 1, createdAt: -1 });

const NotificationModel = model<INotification>(
  "Notification",
  NotificationSchema
);

export default NotificationModel;
