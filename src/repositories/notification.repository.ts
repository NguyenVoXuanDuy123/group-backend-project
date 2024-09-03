import NotificationModel, {
  INotification,
} from "@src/schema/notification.schema";
import { Types } from "mongoose";

class NotificationRepository {
  public async pushNotification(notification: Partial<INotification>) {
    await NotificationModel.create(notification);
  }

  public async removeNotification(relatedEntity: string | Types.ObjectId) {
    /*
     * relatedEntity is the _id of the entity that the notification is related to
     * It's away unique
     */

    await NotificationModel.deleteOne({ relatedEntity });
  }
}
export default new NotificationRepository();
