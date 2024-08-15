import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import NotFoundError from "@src/error/NotFoundError";
import { removeNullValues } from "@src/helpers/removeNullValue";
import { FriendRequestStatus } from "@src/schema/friendRequest.schema";
import userRepository from "@src/repositories/user.repository";
import friendRequestService from "@src/services/friendRequest.service";
import { UpdateMeRequestType } from "@src/types/user.types";
import groupJoinRequestService from "@src/services/groupJoinRequest.service";
import friendRequestRepository from "@src/repositories/friendRequest.repository";
import { UserRelation } from "@src/enums/user.enum";
import groupRepository from "@src/repositories/group.repository";
import { GroupStatus } from "@src/enums/group.enum";

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
      throw new NotFoundError("user");
    }
    const { friends, groups, ...rest } = user;
    console.log(userId, senderId);
    let userRelationship: UserRelation | null = null;

    userRelationship = UserRelation.NOT_FRIEND;

    let friendRequest = null;

    if (senderId === userId) {
      userRelationship = UserRelation.SELF;
    } else if (friends?.some((friend) => friend.toString() === senderId)) {
      userRelationship = UserRelation.FRIEND;
    } else if (
      (friendRequest =
        await friendRequestRepository.getPendingFriendRequestBySenderIdAndReceiverId(
          senderId,
          userId
        ))
    ) {
      userRelationship = UserRelation.INCOMING_REQUEST;
    } else if (
      (friendRequest =
        await friendRequestRepository.getPendingFriendRequestBySenderIdAndReceiverId(
          userId,
          senderId
        ))
    ) {
      userRelationship = UserRelation.OUTGOING_REQUEST;
    }

    return {
      ...rest,
      friendCount: friends?.length || 0,
      groupCount: groups?.length || 0,
      userRelationship: userRelationship,
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
        avatar: updateMeRequest.avatar,
        bio: updateMeRequest.bio,
      })
    );
    const user = this.getUser(_id, senderId);
    return user;
  }

  public async sendFriendRequest(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      throw new ApiError(ApiErrorCodes.CANNOT_SEND_FRIEND_REQUEST_TO_SELF);
    }
    const user = await userRepository.findById(senderId);

    if (!user) {
      throw new NotFoundError("user");
    }

    if (user.friends?.some((friend) => friend.toString() === receiverId)) {
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

  public async leaveGroup(userId: string, groupId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("user");
    }

    const group = await groupRepository.getGroupById(groupId);
    if (!group) {
      throw new NotFoundError("group");
    }

    if (!user.groups?.some((group) => group.toString() === groupId)) {
      throw new ApiError(ApiErrorCodes.USER_NOT_IN_GROUP);
    }

    if (group.admin.toHexString() === userId) {
      throw new ApiError(ApiErrorCodes.CANNOT_REMOVE_GROUP_ADMIN);
    }

    await userRepository.leaveGroup(userId, groupId);
  }
}

export default new UserService();
