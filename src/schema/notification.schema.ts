import { NotificationType } from "@src/enums/notification.enums";
import { Schema, model, Types } from "mongoose";

export type Notification = {
  receiver: Types.ObjectId;
  sender: Types.ObjectId; // User who triggered the notification (if applicable)
  type: NotificationType;
  relatedEntity: Types.ObjectId; // The entity (post, comment, group, etc.) related to the notification
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// Notification Schema
const NotificationSchema = new Schema<Notification>(
  {
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    sender: { type: Schema.Types.ObjectId, ref: "users" },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    relatedEntity: {
      type: Schema.Types.ObjectId,
      refPath: "type",
      sparse: true,
      index: true,
    }, // Dynamically refer to the entity based on the type
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date },
  },
  { timestamps: { createdAt: true } }
);

NotificationSchema.index({ recipient: 1, createdAt: -1 });

const NotificationModel = model<Notification>(
  "Notification",
  NotificationSchema
);

export default NotificationModel;
