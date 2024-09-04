import { NotificationType } from "@src/enums/notification.enums";
import { ReactionTargetType } from "@src/enums/post.enum";
import commentRepository from "@src/repositories/comment.repository";
import groupRepository from "@src/repositories/group.repository";
import notificationRepository from "@src/repositories/notification.repository";
import postRepository from "@src/repositories/post.repository";
import reactionRepository from "@src/repositories/reaction.repository";
import { INotification } from "@src/schema/notification.schema";
import { NotificationResponseType } from "@src/types/notification.type";
import { PaginationQueryType } from "@src/types/util.types";
import { Types } from "mongoose";

class NotificationService {
  public pushNotification = async (notification: Partial<INotification>) => {
    // When a user make action on their own post or comment, no need to send notification
    if (notification.sender?.equals(notification.receiver)) {
      return;
    }
    await notificationRepository.pushNotification(notification);
  };

  public removeNotificationByEntityId = async (
    relatedEntity: string | Types.ObjectId
  ) => {
    await notificationRepository.removeNotificationByEntityId(relatedEntity);
  };

  public removeNotificationsByEntityIds = async (
    relatedEntities: Array<Types.ObjectId>
  ) => {
    await notificationRepository.removeNotificationsByEntityIds(
      relatedEntities
    );
  };

  public getUserNotifications = async (
    userId: string,
    paginationQuery: PaginationQueryType
  ) => {
    const notifications = await notificationRepository.getUserNotifications(
      userId,
      paginationQuery.beforeDate,
      Number(paginationQuery.limit)
    );

    return Promise.all(notifications.map(this.getNotificationDetail));
  };

  // Get the detail of the notification based on the notification type
  private getNotificationDetail = async (
    notification: NotificationResponseType
  ) => {
    switch (notification.type) {
      case NotificationType.REACTION: {
        const reaction = await reactionRepository.getReactionById(
          notification.relatedEntity,
          { type: 1, target: 1, targetType: 1 }
        );
        // If the reaction is related to a post, get the post detail
        if (reaction?.targetType === ReactionTargetType.POST) {
          const post = await postRepository.findPostById(reaction.target, {
            content: 1,
          });
          return {
            ...notification,
            reaction,
            post,
          };
        }
        // If the reaction is related to a comment, get the comment detail
        if (reaction?.targetType === ReactionTargetType.COMMENT) {
          const comment = await commentRepository.findCommentById(
            reaction.target,
            { content: 1, post: 1 }
          );
          return {
            ...notification,
            reaction,
            comment,
          };
        }
        return notification;
      }
      // If the notification is related to a comment, get the comment detail
      case NotificationType.COMMENT: {
        const comment = await commentRepository.findCommentById(
          notification.relatedEntity,
          { content: 1, post: 1 }
        );
        return {
          ...notification,
          comment,
        };
      }
      // If the notification is related to a friend request, just return the notification
      // because the notification already contains the sender detail and friendRequest id
      case NotificationType.FRIEND_REQUEST: {
        return notification;
      }
      case NotificationType.FRIEND_REQUEST_ACCEPTED: {
        return notification;
      }
      case NotificationType.GROUP_CREATION_APPROVAL: {
        const group = await groupRepository.findGroupById(
          notification.relatedEntity,
          { name: 1 }
        );
        return {
          ...notification,
          group,
        };
      }
      case NotificationType.GROUP_JOIN_REQUEST: {
        const group = await groupRepository.findGroupById(
          notification.relatedEntity,
          { name: 1 }
        );
        return {
          ...notification,
          group,
        };
      }
      case NotificationType.GROUP_JOIN_REQUEST_ACCEPTED: {
        const group = await groupRepository.findGroupById(
          notification.relatedEntity,
          { name: 1 }
        );
        return {
          ...notification,
          group,
        };
      }
    }
  };
}
export default new NotificationService();
