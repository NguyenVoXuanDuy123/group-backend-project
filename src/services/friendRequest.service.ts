import { NotificationType } from "@src/enums/notification.enums";
import { FriendRequestStatus } from "@src/enums/user.enums";
import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";

import friendRequestRepository from "@src/repositories/friendRequest.repository";
import userRepository from "@src/repositories/user.repository";
import notificationService from "@src/services/notification.service";
import userService from "@src/services/user.service";
import { Types } from "mongoose";

class FriendRequestService {
  public async createFriendRequest(senderId: string, receiverId: string) {
    if (!userRepository.checkUserExistsById(receiverId)) {
      throw new ApiError(ApiErrorCodes.USER_NOT_FOUND);
    }
    // Check if the sender is trying to send a friend request which is already sent and pending
    if (
      await friendRequestRepository.checkPendingFriendRequestExists(
        senderId,
        receiverId
      )
    ) {
      throw new ApiError(ApiErrorCodes.FRIEND_REQUEST_ALREADY_SENT);
    }

    // Check if the sender is trying to send a friend request to who have already send a friend request to the sender
    if (
      await friendRequestRepository.checkPendingFriendRequestExists(
        receiverId,
        senderId
      )
    ) {
      throw new ApiError(ApiErrorCodes.CANNOT_SEND_FRIEND_REQUEST_TO_SENDER);
    }

    const friendRequest = await friendRequestRepository.createFriendRequest(
      senderId,
      receiverId
    );
    await notificationService.pushNotification({
      receiver: new Types.ObjectId(receiverId),
      type: NotificationType.FRIEND_REQUEST,
      sender: new Types.ObjectId(senderId),
      relatedEntity: new Types.ObjectId(friendRequest._id),
    });

    return friendRequestRepository.getFriendRequestById(friendRequest._id, {
      _id: 1,
      status: 1,
      createdAt: 1,
    });
  }

  public async changeFriendRequestStatus(
    senderId: string,
    requestId: string,
    status: FriendRequestStatus
  ) {
    const friendRequest = await friendRequestRepository.getFriendRequestById(
      requestId
    );

    if (!friendRequest) {
      throw new ApiError(ApiErrorCodes.FRIEND_REQUEST_NOT_FOUND);
    }

    // check if someone outside the friend request is trying to change the status
    if (
      !friendRequest.sender.equals(senderId) &&
      !friendRequest.receiver.equals(senderId)
    ) {
      throw new ApiError(ApiErrorCodes.FORBIDDEN);
    }

    //check if the user is the receiver of the friend request and they are not trying to accept or reject the request
    if (
      friendRequest.receiver.equals(senderId) &&
      status !== FriendRequestStatus.ACCEPTED &&
      status !== FriendRequestStatus.REJECTED
    ) {
      throw new ApiError(ApiErrorCodes.CHANGE_STATUS_FRIEND_REQUEST_FORBIDDEN);
    }

    //check if the user is the sender of the friend request and they are not trying to cancel the request
    if (
      friendRequest.sender.equals(senderId) &&
      status !== FriendRequestStatus.CANCELLED
    ) {
      throw new ApiError(ApiErrorCodes.CHANGE_STATUS_FRIEND_REQUEST_FORBIDDEN);
    }

    // Check if the friend request is already accepted, rejected or cancelled
    // If it is, then it cannot be changed
    if (
      friendRequest.status === FriendRequestStatus.ACCEPTED ||
      friendRequest.status === FriendRequestStatus.REJECTED ||
      friendRequest.status === FriendRequestStatus.CANCELLED
    ) {
      throw new ApiError(ApiErrorCodes.CANNOT_CHANGE_FRIEND_REQUEST_STATUS);
    }

    //If the status is accepted, add the sender to the receiver's friend list and vice versa
    if (status === FriendRequestStatus.ACCEPTED) {
      const senderId = friendRequest.sender;
      const receiverId = friendRequest.receiver;

      await userRepository.addFriend(senderId, receiverId);

      // Send a notification to the sender that the friend request is accepted
      await notificationService.pushNotification({
        sender: new Types.ObjectId(receiverId),
        receiver: new Types.ObjectId(senderId),
        type: NotificationType.FRIEND_REQUEST_ACCEPTED,
      });
    }

    await friendRequestRepository.changeStatusFriendRequest(requestId, status);

    // Remove the notification if the status is changed to cancelled, accepted or rejected
    await notificationService.removeNotificationByEntityId(requestId);
    return friendRequestRepository.getFriendRequestById(requestId);
  }

  public async getMyPendingReceivedFriendRequests(
    senderId: string,
    beforeDate?: string,
    limit?: number
  ) {
    const friendRequests =
      await friendRequestRepository.getMyPendingReceivedFriendRequests(
        senderId,
        beforeDate,
        limit
      );

    // Get the sender's detail and count the mutual friends
    return Promise.all(
      friendRequests.map(async (friendRequest) => {
        const { friends, ...rest } = friendRequest.senderDetail;
        const sender = await userRepository.getUserById(senderId, {
          friends: 1,
        });
        const mutualFriendCount = await userService.countMutualFriends(
          friends,
          sender?.friends
        );
        return {
          ...friendRequest,
          senderDetail: {
            ...rest,
            mutualFriendCount,
          },
        };
      })
    );
  }
}

export default new FriendRequestService();
