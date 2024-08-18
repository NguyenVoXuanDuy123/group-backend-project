import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";

import { FriendRequestStatus } from "@src/schema/friendRequest.schema";
import friendRequestRepository from "@src/repositories/friendRequest.repository";
import userRepository from "@src/repositories/user.repository";

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

    // Check if the sender is trying to send a friend request to who  have already send a friend request to the sender
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

    return friendRequestRepository.getFriendRequestById(friendRequest._id);
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
      !friendRequest.sender_id.equals(senderId) &&
      !friendRequest.receiver_id.equals(senderId)
    ) {
      throw new ApiError(ApiErrorCodes.FORBIDDEN);
    }

    //check if the user is the sender of the friend request and they are not trying to cancel the request
    if (
      friendRequest.sender_id.equals(senderId) &&
      status !== FriendRequestStatus.CANCELLED
    ) {
      throw new ApiError(ApiErrorCodes.CHANGE_STATUS_FRIEND_REQUEST_FORBIDDEN);
    }

    //check if the user is the receiver of the friend request and they are not trying to accept or reject the request
    if (
      friendRequest.receiver_id.equals(senderId) &&
      status !== FriendRequestStatus.ACCEPTED &&
      status !== FriendRequestStatus.REJECTED
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
      const senderId = friendRequest.sender_id;
      const receiverId = friendRequest.receiver_id;

      userRepository.addFriend(senderId, receiverId);
    }

    await friendRequestRepository.changeStatusFriendRequest(requestId, status);

    return friendRequestRepository.getFriendRequestById(requestId);
  }

  public async getMyPendingReceivedFriendRequests(senderId: string) {
    return await friendRequestRepository.getMyPendingReceivedFriendRequests(
      senderId
    );
  }
}

export default new FriendRequestService();
