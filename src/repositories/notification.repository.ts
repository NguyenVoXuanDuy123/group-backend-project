import { validateDate } from "@src/helpers/validation";
import NotificationModel, {
  INotification,
} from "@src/schema/notification.schema";
import { NotificationResponseType } from "@src/types/notification.type";
import { Types } from "mongoose";

class NotificationRepository {
  public async pushNotification(notification: Partial<INotification>) {
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
    userId: string,
    beforeDate?: string,
    limit?: number
  ) {
    if (beforeDate) {
      // if beforeDate is invalid, method below will throw an error
      validateDate(beforeDate);
    }

    return await NotificationModel.aggregate<NotificationResponseType>([
      { $match: { receiver: new Types.ObjectId(userId) } },
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
}
export default new NotificationRepository();
