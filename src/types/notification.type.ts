import { NotificationType } from "@src/enums/notification.enums";
import { Types } from "mongoose";

export type NotificationResponseType = {
  _id: Types.ObjectId;
  senderDetail: {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    username: string;
    avatar: string;
  };
  type: NotificationType;
  isRead: boolean;
  relatedEntity: Types.ObjectId;
  createdAt: Date;
};
