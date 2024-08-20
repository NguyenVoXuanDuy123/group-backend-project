import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";

import { removeNullValues } from "@src/helpers/removeNullValue";

import userRepository from "@src/repositories/user.repository";
import friendRequestService from "@src/services/friendRequest.service";
import { UpdateMeRequestType } from "@src/types/user.types";
import friendRequestRepository from "@src/repositories/friendRequest.repository";
import {
  FriendRequestStatus,
  UserFriendRelation,
  UserRole,
  UserStatus,
} from "@src/enums/user.enum";
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

    let userFriendRelation: UserFriendRelation = UserFriendRelation.NOT_FRIEND;

    let friendRequest = null;

    // if the sender is the same as the user, then the user is the sender
    if (senderId === userId) {
      userFriendRelation = UserFriendRelation.SELF;

      // if the sender is the friend of the user
    } else if (friends.some((friend) => friend.equals(senderId))) {
      userFriendRelation = UserFriendRelation.FRIEND;

      // if the sender has sent a friend request to the user
    } else if (
      (friendRequest =
        await friendRequestRepository.getPendingFriendRequestBySenderIdAndReceiverId(
          senderId,
          userId,
          {
            __v: 0,
            updated_at: 0,
            receiver_id: 0,
            sender_id: 0,
          }
        ))
    ) {
      userFriendRelation = UserFriendRelation.INCOMING_REQUEST;

      // if the user has sent a friend request to the sender
    } else if (
      (friendRequest =
        await friendRequestRepository.getPendingFriendRequestBySenderIdAndReceiverId(
          userId,
          senderId
        ))
    ) {
      userFriendRelation = UserFriendRelation.OUTGOING_REQUEST;
    }

    return {
      ...rest,
      friendCount: friends?.length || 0,
      groupCount: groups?.length || 0,
      userFriendRelation,
      friendRequest,
    };
  }

  public async updateUser(_id: string, updateMeRequest: UpdateMeRequestType) {
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
    // check if the sender and receiver are the same
    if (senderId === receiverId) {
      throw new ApiError(ApiErrorCodes.CANNOT_SEND_FRIEND_REQUEST_TO_SELF);
    }
    const user = await userRepository.findById(senderId);

    if (!(await userRepository.checkUserExistsById(receiverId))) {
      throw new ApiError(ApiErrorCodes.USER_NOT_FOUND);
    }

    if (!user) {
      throw new ApiError(ApiErrorCodes.USER_NOT_FOUND);
    }
    // check if the sender and receiver are already friends
    if (user.friends.some((friend) => friend.equals(receiverId))) {
      throw new ApiError(ApiErrorCodes.BOTH_USER_ALREADY_FRIENDS);
    }

    console.log("senderId", senderId);
    console.log("receiverId", receiverId);

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

  public async removeFriend(senderId: string, friendId: string) {
    const friend = await userRepository.findById(friendId, { friends: 1 });
    if (!friend) {
      throw new ApiError(ApiErrorCodes.USER_NOT_FOUND);
    }

    console.log(friend);

    if (!friend.friends.some((friend) => friend.equals(senderId))) {
      throw new ApiError(ApiErrorCodes.BOTH_USERS_NOT_FRIENDS);
    }
    await userRepository.removeFriend(senderId, friendId);
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

    await groupRepository.removeMemberFromGroup(groupId, senderId);
  }

  public async changeUserStatus(
    // user to change status
    userId: string,
    status: UserStatus,
    // role of the user who is changing the status
    senderRole: UserRole
  ) {
    // Only admin can change user status
    if (senderRole !== UserRole.ADMIN) {
      throw new ApiError(ApiErrorCodes.ADMIN_ROLE_REQUIRED);
    }

    const user = await userRepository.findById(userId, { role: 1 });

    if (!user) {
      throw new ApiError(ApiErrorCodes.USER_NOT_FOUND);
    }
    if (user.role === UserRole.ADMIN) {
      throw new ApiError(ApiErrorCodes.CANNOT_CHANGE_ADMIN_STATUS);
    }

    await userRepository.updateUserById(userId, {
      status,
    });
  }
}

export default new UserService();
