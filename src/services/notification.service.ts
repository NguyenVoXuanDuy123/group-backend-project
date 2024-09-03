import notificationRepository from "@src/repositories/notification.repository";
import { INotification } from "@src/schema/notification.schema";

class NotificationService {
  public pushNotification = async (notification: Partial<INotification>) => {
    await notificationRepository.pushNotification(notification);
  };
}
export default new NotificationService();
