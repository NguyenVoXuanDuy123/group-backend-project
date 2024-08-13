import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import NotFoundError from "@src/error/NotFoundError";
import { removeNullValues } from "@src/helpers/removeNullValue";
import { FriendRequestStatus } from "@src/schema/friendRequest.schema";
import userRepository from "@src/repositories/user.repository";
import friendRequestService from "@src/services/friendRequest.service";
import { UpdateMeRequestType } from "@src/types/user.types";
import groupJoinRequestRepository from "@src/repositories/groupJoinRequest.repository";
import groupJoinRequestService from "@src/services/groupJoinRequest.service";

class UserService {
  public async getUser(_id: string) {
    const user = await userRepository.findById(_id, {
      password: 0,
      notifications: 0,
      __v: 0,
      created_at: 0,
      updated_at: 0,
    });
    if (!user) {
      throw new NotFoundError("user");
    }
    const { friends, groups, ...rest } = user;
    return {
      ...rest,
      friendCount: friends?.length || 0,
      groupCount: groups?.length || 0,
    };
  }

  public async updateUser(_id: string, updateMeRequest: UpdateMeRequestType) {
    await userRepository.updateUserById(
      _id,
      removeNullValues({
        first_name: updateMeRequest.firstName,
        last_name: updateMeRequest.lastName,
        avatar: updateMeRequest.avatar,
        bio: updateMeRequest.bio,
      })
    );
    return await this.getUser(_id);
  }

  public async sendFriendRequest(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      throw new ApiError(ApiErrorCodes.CANNOT_SEND_FRIEND_REQUEST_TO_SELF);
    }
    const user = await userRepository.findById(senderId);
    if (!user) {
      throw new NotFoundError("sender");
    }

    if (user.friends?.some((friend) => friend.toString() === receiverId)) {
      throw new ApiError(ApiErrorCodes.BOTH_USER_ALREADY_FRIENDS);
    }

    await friendRequestService.createFriendRequest(senderId, receiverId);
  }

  public async changeFriendRequestStatus(
    userId: string,
    requestId: string,
    status: FriendRequestStatus
  ) {
    await friendRequestService.changeFriendRequestStatus(
      userId,
      requestId,
      status
    );
  }

  public async addFriend(userId: string, friendId: string) {
    await userRepository.addFriend(userId, friendId);
  }

  public async removeFriend(userId: string, friendId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("user");
    }

    if (!user.friends?.some((friend) => friend.toString() === friendId)) {
      throw new ApiError(ApiErrorCodes.BOTH_USERS_NOT_FRIENDS);
    }
    await userRepository.removeFriend(userId, friendId);
  }

  public async getFriendsByUserId(userId: string) {
    if (!(await userRepository.checkUserExistsById(userId))) {
      throw new NotFoundError("user");
    }
    return await userRepository.getFriends(userId);
  }

  public async getMyPendingReceivedFriendRequests(userId: string) {
    if (!(await userRepository.checkUserExistsById(userId))) {
      throw new NotFoundError("user");
    }
    return await friendRequestService.getMyPendingReceivedFriendRequests(
      userId
    );
  }
  public async getGroupsByUserId(userId: string) {
    if (!(await userRepository.checkUserExistsById(userId))) {
      throw new NotFoundError("user");
    }
    return await userRepository.getGroups(userId);
  }

  public async getMyPendingReceivedGroupJoinRequests(userId: string) {
    if (!(await userRepository.checkUserExistsById(userId))) {
      throw new NotFoundError("user");
    }
    return await groupJoinRequestService.getMyPendingReceivedGroupJoinRequests(
      userId
    );
  }
}

export default new UserService();
