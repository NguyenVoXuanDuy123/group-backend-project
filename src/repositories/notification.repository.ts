import { validateDate } from "@src/helpers/validation";
import NotificationModel, {
  Notification,
} from "@src/schema/notification.schema";
import { NotificationResponseType } from "@src/types/notification.type";
import { Types } from "mongoose";

class NotificationRepository {
  public async pushNotification(notification: Partial<Notification>) {
    await NotificationModel.create(notification);
  }

  public async removeNotificationByEntityId(
    relatedEntity: string | Types.ObjectId
  ) {
    /*
     * relatedEntity is the _id of the entity that the notification is related to
     * It's away unique
     */
    await NotificationModel.findOneAndDelete({ relatedEntity });
  }

  public async removeNotificationsByEntityIds(
    relatedEntities: Array<Types.ObjectId>
  ) {
    /*
     * relatedEntity is the _id of the entity that the notification is related to
     * It's away unique
     */
    await NotificationModel.deleteMany({
      relatedEntity: { $in: relatedEntities },
    });
  }

  public async getUserNotifications(
    receiverId: string,
    beforeDate?: string,
    limit?: number,
    condition: { [key: string]: unknown } = {}
  ) {
    if (beforeDate) {
      // if beforeDate is invalid, method below will throw an error
      validateDate(beforeDate);
    }

    return await NotificationModel.aggregate<NotificationResponseType>([
      {
        $match: {
          receiver: new Types.ObjectId(receiverId),
          ...condition,
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $match: {
          createdAt: {
            $lt: beforeDate ? new Date(beforeDate) : new Date(),
          },
        },
      },
      { $limit: limit || 10 },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "senderDetail",
        },
      },
      { $unwind: { path: "$senderDetail", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          type: 1,
          message: 1,
          isRead: 1,
          relatedEntity: 1,
          senderDetail: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            username: 1,
            avatar: 1,
          },
          createdAt: 1,
        },
      },
    ]);
  }

  public async markNotificationAsRead(receiverId: string) {
    await NotificationModel.updateMany(
      { receiver: new Types.ObjectId(receiverId), isRead: false },
      { isRead: true }
    );
  }

  public async getUnreadNotificationCount(receiverId: string) {
    return await NotificationModel.countDocuments({
      receiver: new Types.ObjectId(receiverId),
      isRead: false,
    });
  }

  public async getUnreadNotifications(receiverId: string) {
    return await NotificationModel.find({
      receiver: new Types.ObjectId(receiverId),
      isRead: false,
    });
  }
}
export default new NotificationRepository();
