import { NotificationType } from "@src/enums/notification.enums";
import { ReactionTargetType } from "@src/enums/post.enum";
import commentRepository from "@src/repositories/comment.repository";
import groupRepository from "@src/repositories/group.repository";
import groupJoinRequestRepository from "@src/repositories/groupJoinRequest.repository";
import notificationRepository from "@src/repositories/notification.repository";
import postRepository from "@src/repositories/post.repository";
import reactionRepository from "@src/repositories/reaction.repository";
import userRepository from "@src/repositories/user.repository";
import { Notification } from "@src/schema/notification.schema";
import userService from "@src/services/user.service";
import { NotificationResponseType } from "@src/types/notification.type";
import { PaginationQueryType } from "@src/types/util.types";
import { Types } from "mongoose";

class NotificationService {
  public pushNotification = async (notification: Partial<Notification>) => {
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
    // Id of the user who is viewing the notification, also the receiver of the notification
    receiverId: string,
    paginationQuery: PaginationQueryType
  ) => {
    const notifications = await notificationRepository.getUserNotifications(
      receiverId,
      paginationQuery.beforeDate,
      Number(paginationQuery.limit)
    );

    // If the user is viewing the first page of the notification, mark all notifications as read
    if (!paginationQuery.beforeDate) {
      await notificationRepository.markNotificationAsRead(receiverId);
    }

    return Promise.all(
      notifications.map(async (notification) => {
        return await this.getNotificationDetail(notification, receiverId);
      })
    );
  };

  // Get the detail of the notification based on the notification type
  private getNotificationDetail = async (
    notification: NotificationResponseType,

    // Id of the user who is viewing the notification
    receiverId: string | Types.ObjectId
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
            reaction: {
              ...reaction,
              post,
            },
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
            reaction: {
              ...reaction,
              comment,
            },
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
      // If the notification is related to a friend request, just return the notification with mutual friends
      // because the notification already contains the sender detail and friendRequest id
      case NotificationType.FRIEND_REQUEST: {
        // Get the friends of the user who is viewing the notification
        const { friends } = (await userRepository.getUserById(receiverId, {
          friends: 1,
        })) || { friends: [] };

        // Get the friends of the sender of the friend request
        const { friends: senderFriends } = (await userRepository.getUserById(
          notification.senderDetail._id,
          {
            friends: 1,
          }
        )) || { friends: [] };

        const mutualFriendCount = await userService.countMutualFriends(
          friends,
          senderFriends
        );
        return {
          ...notification,
          senderDetail: {
            ...notification.senderDetail,
            mutualFriendCount,
          },
        };
      }
      // If the notification is related to a friend request accepted, just return the notification
      // because the notification already contains the sender detail
      case NotificationType.FRIEND_REQUEST_ACCEPTED: {
        return notification;
      }

      //If the notification is related to a group creation approval, get the group detail
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

      //If the notification is related to a group creation rejection, get the group detail
      case NotificationType.GROUP_JOIN_REQUEST: {
        const groupJoinRequest =
          await groupJoinRequestRepository.getGroupJoinRequestById(
            notification.relatedEntity,
            { group: 1 }
          );

        const group = await groupRepository.findGroupById(
          groupJoinRequest?.group || "",
          { name: 1 }
        );
        return {
          ...notification,
          group,
        };
      }
      //If the notification is related to a group join request accepted, get the group detail
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

  public getUnreadNotificationCount = async (
    // Id of the user who is viewing the notification, also the receiver of the notification
    receiverId: string
  ) => {
    return await notificationRepository.getUnreadNotificationCount(receiverId);
  };

  public getUnreadNotifications = async (
    // Id of the user who is viewing the notification, also the receiver of the notification
    receiverId: string
  ) => {
    const notifications = await notificationRepository.getUserNotifications(
      receiverId,
      undefined,
      20,
      { isRead: false }
    );
    await notificationRepository.markNotificationAsRead(receiverId);

    return Promise.all(
      notifications.map(async (notification) => {
        return await this.getNotificationDetail(notification, receiverId);
      })
    );
  };
}
export default new NotificationService();
