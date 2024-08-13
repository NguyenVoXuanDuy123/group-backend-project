import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import NotFoundError from "@src/error/NotFoundError";
import { FriendRequestStatus } from "@src/models/friendRequest.schema";
import friendRequestRepository from "@src/repositories/friendRequest.repository";
import userRepository from "@src/repositories/user.repository";
import userService from "@src/services/user.service";

class FriendRequestService {
  public async createFriendRequest(senderId: string, receiverId: string) {
    if (!userRepository.checkUserExistsById(senderId)) {
      throw new NotFoundError("sender");
    }
    if (!userRepository.checkUserExistsById(receiverId)) {
      throw new NotFoundError("receiver");
    }
    // Check if the sender is trying to send a friend request which is already sent and pending
    if (
      await friendRequestRepository.checkFriendRequestExists(
        senderId,
        receiverId
      )
    ) {
      throw new ApiError(ApiErrorCodes.FRIEND_REQUEST_ALREADY_SENT);
    }

    // Check if the sender is trying to send a friend request to who  have already send a friend request to the sender
    if (
      await friendRequestRepository.checkFriendRequestExists(
        receiverId,
        senderId
      )
    ) {
      throw new ApiError(ApiErrorCodes.CANNOT_SEND_FRIEND_REQUEST_TO_SENDER);
    }

    await friendRequestRepository.createFriendRequest(senderId, receiverId);
  }

  public async changeFriendRequestStatus(
    userId: string,
    requestId: string,
    status: FriendRequestStatus
  ) {
    const friendRequest = await friendRequestRepository.getFriendRequestById(
      requestId
    );

    if (!friendRequest) {
      throw new NotFoundError("friend request");
    }

    //check if the user is the sender of the friend request and they are not trying to cancel the request
    if (
      userId === friendRequest.senderId.toHexString() &&
      status !== FriendRequestStatus.CANCELLED
    ) {
      throw new ApiError(ApiErrorCodes.FORBIDDEN);
    }

    //check if the user is the receiver of the friend request and they are not trying to accept or reject the request
    if (
      userId === friendRequest.receiverId.toHexString() &&
      status !== FriendRequestStatus.ACCEPTED &&
      status !== FriendRequestStatus.REJECTED
    ) {
      throw new ApiError(ApiErrorCodes.FORBIDDEN);
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

    if (status === FriendRequestStatus.ACCEPTED) {
      const senderId = friendRequest.senderId.toHexString();

      userService.addFriend(userId, senderId);
    }

    await friendRequestRepository.changeStatusFriendRequest(requestId, status);
  }
}

export default new FriendRequestService();
