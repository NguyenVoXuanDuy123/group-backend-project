import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";

import { removeNullValues } from "@src/helpers/removeNullValue";
import { FriendRequestStatus } from "@src/schema/friendRequest.schema";
import userRepository from "@src/repositories/user.repository";
import friendRequestService from "@src/services/friendRequest.service";
import { UpdateMeRequestType } from "@src/types/user.types";
import friendRequestRepository from "@src/repositories/friendRequest.repository";
import { UserFriendRelation } from "@src/enums/user.enum";
import groupRepository from "@src/repositories/group.repository";

class UserService {
  public async getUser(userId: string, senderId: string) {
    const user = await userRepository.findById(userId, {
      password: 0,
      notifications: 0,
      __v: 0,
      created_at: 0,
      updated_at: 0,
    });
    if (!user) {
      throw new ApiError(ApiErrorCodes.USER_NOT_FOUND);
    }
    const { friends, groups, ...rest } = user;

    let UserFriendRelationship: UserFriendRelation | null = null;

    UserFriendRelationship = UserFriendRelation.NOT_FRIEND;

    let friendRequest = null;

    if (senderId === userId) {
      UserFriendRelationship = UserFriendRelation.SELF;
    } else if (friends?.some((friend) => friend.equals(senderId))) {
      UserFriendRelationship = UserFriendRelation.FRIEND;
    } else if (
      (friendRequest =
        await friendRequestRepository.getPendingFriendRequestBySenderIdAndReceiverId(
          senderId,
          userId
        ))
    ) {
      UserFriendRelationship = UserFriendRelation.INCOMING_REQUEST;
    } else if (
      (friendRequest =
        await friendRequestRepository.getPendingFriendRequestBySenderIdAndReceiverId(
          userId,
          senderId
        ))
    ) {
      UserFriendRelationship = UserFriendRelation.OUTGOING_REQUEST;
    }

    return {
      ...rest,
      friendCount: friends?.length || 0,
      groupCount: groups?.length || 0,
      UserFriendRelationship: UserFriendRelationship,
      friendRequest,
    };
  }

  public async updateUser(
    _id: string,
    senderId: string,
    updateMeRequest: UpdateMeRequestType
  ) {
    await userRepository.updateUserById(
      _id,
      removeNullValues({
        first_name: updateMeRequest.firstName,
        last_name: updateMeRequest.lastName,
        bio: updateMeRequest.bio,
      })
    );
  }

  public async updateAvatar(senderId: string, imageUrl: string) {
    await userRepository.updateUserById(senderId, {
      avatar: imageUrl,
    });
  }

  public async sendFriendRequest(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      throw new ApiError(ApiErrorCodes.CANNOT_SEND_FRIEND_REQUEST_TO_SELF);
    }
    const user = await userRepository.findById(senderId);

    if (!user) {
      throw new ApiError(ApiErrorCodes.USER_NOT_FOUND);
    }

    if (user.friends.some((friend) => friend.equals(receiverId))) {
      throw new ApiError(ApiErrorCodes.BOTH_USER_ALREADY_FRIENDS);
    }

    return await friendRequestService.createFriendRequest(senderId, receiverId);
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
      throw new ApiError(ApiErrorCodes.USER_NOT_FOUND);
    }

    if (!user.friends.some((friend) => friend.equals(friendId))) {
      throw new ApiError(ApiErrorCodes.BOTH_USERS_NOT_FRIENDS);
    }
    await userRepository.removeFriend(userId, friendId);
  }

  public async getFriendsByUserId(userId: string) {
    if (!(await userRepository.checkUserExistsById(userId))) {
      throw new ApiError(ApiErrorCodes.USER_NOT_FOUND);
    }
    return await userRepository.getFriends(userId);
  }

  public async getMyPendingReceivedFriendRequests(senderId: string) {
    return await friendRequestService.getMyPendingReceivedFriendRequests(
      senderId
    );
  }
  public async getGroupsByUserId(userId: string) {
    if (!(await userRepository.checkUserExistsById(userId))) {
      throw new ApiError(ApiErrorCodes.USER_NOT_FOUND);
    }
    return await userRepository.getUserGroups(userId);
  }

  public async leaveGroup(senderId: string, groupId: string) {
    const group = await groupRepository.findGroupById(groupId, {
      admin: 1,
      members: 1,
    });
    if (!group) {
      throw new ApiError(ApiErrorCodes.GROUP_NOT_FOUND);
    }

    if (!group.members.some((member) => member.equals(senderId))) {
      throw new ApiError(ApiErrorCodes.USER_NOT_IN_GROUP);
    }

    if (group.admin.equals(senderId)) {
      throw new ApiError(ApiErrorCodes.CANNOT_REMOVE_GROUP_ADMIN);
    }

    await userRepository.leaveGroup(senderId, groupId);
  }
}

export default new UserService();
