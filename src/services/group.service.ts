import {
  GroupJoinRequestStatus,
  GroupStatus,
  GroupVisibilityLevel,
  UserGroupRelation,
} from "@src/enums/group.enums";
import { NotificationType } from "@src/enums/notification.enums";
import { PostVisibilityLevel } from "@src/enums/post.enum";
import { UserRole } from "@src/enums/user.enums";
import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";

import { removeNullValues } from "@src/helpers/removeNullValue";
import groupRepository from "@src/repositories/group.repository";
import groupJoinRequestRepository from "@src/repositories/groupJoinRequest.repository";
import postRepository from "@src/repositories/post.repository";
import userRepository from "@src/repositories/user.repository";
import { IGroup } from "@src/schema/group.schema";

import groupJoinRequestService from "@src/services/groupJoinRequest.service";
import notificationService from "@src/services/notification.service";
import postService from "@src/services/post.service";
import userService from "@src/services/user.service";
import {
  CreateGroupRequestType,
  UpdateGroupRequestType,
} from "@src/types/group.types";
import { PaginationQueryType } from "@src/types/util.types";
import { Types } from "mongoose";

class GroupService {
  public async createGroup(
    userId: string,
    createGroupJoinRequest: CreateGroupRequestType
  ) {
    const group: Partial<IGroup> = {
      description: createGroupJoinRequest.description,
      name: createGroupJoinRequest.name,
      visibilityLevel: createGroupJoinRequest.visibilityLevel,
      admin: new Types.ObjectId(userId),
      members: [new Types.ObjectId(userId)],
    };

    const groupObject = await groupRepository.createGroup(group);
    return this.getGroupById(groupObject._id, userId);
  }

  public async updateGroup(
    senderId: string,
    groupId: string,
    updateGroupJoinRequest: UpdateGroupRequestType
  ) {
    const group = await groupRepository.findGroupById(groupId);
    if (!group) {
      throw new ApiError(ApiErrorCodes.GROUP_NOT_FOUND);
    }

    if (!group.admin.equals(senderId)) {
      // if the sender is not the admin of the group, they cannot update the group
      throw new ApiError(ApiErrorCodes.UPDATE_GROUP_FORBIDDEN);
    }

    const updatedGroup: Partial<IGroup> = {
      description: updateGroupJoinRequest.description,
      name: updateGroupJoinRequest.name,
      visibilityLevel: updateGroupJoinRequest.visibilityLevel,
    };

    await groupRepository.updateGroupById(
      groupId,
      removeNullValues(updatedGroup)
    );
  }

  public async getGroupById(
    groupId: string | Types.ObjectId,
    senderId: string
  ) {
    const group = await groupRepository.findGroupById(groupId, {
      __v: 0,
    });

    if (!group) {
      throw new ApiError(ApiErrorCodes.GROUP_NOT_FOUND);
    }

    const { admin, members, ...rest } = group;
    let userGroupRelation = UserGroupRelation.NOT_MEMBER;
    let groupJoinRequest = null;
    if (admin.equals(senderId)) {
      userGroupRelation = UserGroupRelation.ADMIN;
    } else if (members.some((member) => member.equals(senderId))) {
      userGroupRelation = UserGroupRelation.MEMBER;
    } else if (
      // for some reason, eslint thinks groupJoinRequest is unused
      // but it is used in when return so I have to disable the rule
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (groupJoinRequest =
        await groupJoinRequestRepository.getPendingGroupJoinRequestBySenderIdAndGroupId(
          senderId,
          groupId,
          {
            _id: 1,
            createdAt: 1,
          }
        ))
    ) {
      userGroupRelation = UserGroupRelation.OUTGOING_REQUEST;
    }

    const adminObject = await userRepository.getUserById(admin, {
      _id: 1,
      lastName: 1,
      firstName: 1,
      username: 1,
      avatar: 1,
      friends: 1,
    });

    const sender = await userRepository.getUserById(senderId, { friends: 1 });
    const mutualFriendCount = await userService.countMutualFriends(
      adminObject?.friends,
      sender?.friends
    );

    return {
      ...rest,
      admin: {
        _id: adminObject?._id,
        lastName: adminObject?.lastName,
        firstName: adminObject?.firstName,
        username: adminObject?.username,
        avatar: adminObject?.avatar,
        mutualFriendCount,
      },
      memberCount: members.length,
      userGroupRelation,
      groupJoinRequest: groupJoinRequest,
    };
  }

  // public async removeGroup(senderId: string, groupId: string) {
  //   const group = await groupRepository.findGroupById(groupId);
  //   if (!group) {
  //     throw new ApiError(ApiErrorCodes.GROUP_NOT_FOUND);
  //   }
  //   if (group.admin.toHexString() !== senderId) {
  //     throw new ApiError(ApiErrorCodes.FORBIDDEN);
  //   }
  //   await groupRepository.removeGroupById(groupId);
  // }

  public async getGroupMembers(
    senderId: string,
    groupId: string,
    role: UserRole,
    paginationQuery: PaginationQueryType
  ) {
    const group = await groupRepository.findGroupById(groupId, {
      members: 1,
      visibilityLevel: 1,
      status: 1,
    });

    if (!group) {
      throw new ApiError(ApiErrorCodes.GROUP_NOT_FOUND);
    }

    // if the group is not approved, the members cannot be viewed
    if (group.status !== GroupStatus.APPROVED) {
      throw new ApiError(ApiErrorCodes.GROUP_NOT_APPROVED);
    }

    /*
     * user can view the members of the group if
     * 1. the group is public
     * 2. the group is private but the user is a member of the group (admin is also a member)
     * 3. The user is the site admin
     */

    const canViewMembers =
      group.visibilityLevel === GroupVisibilityLevel.PUBLIC ||
      group.members.some((member) => member.equals(senderId)) ||
      role === UserRole.ADMIN;

    if (!canViewMembers) {
      throw new ApiError(ApiErrorCodes.GROUP_MEMBERS_NOT_VISIBLE);
    }
    const groupMembers = await groupRepository.getGroupMembers(
      groupId,
      Number(paginationQuery.limit),
      paginationQuery.afterId
    );
    const sender = await userRepository.getUserById(senderId, { friends: 1 });
    return await Promise.all(
      groupMembers.map(async (member) => {
        const { friends, ...rest } = member;
        const mutualFriendCount = await userService.countMutualFriends(
          sender?.friends,
          friends
        );
        return {
          ...rest,
          mutualFriendCount,
        };
      })
    );
  }

  public async sendGroupJoinRequest(senderId: string, groupId: string) {
    return await groupJoinRequestService.createGroupJoinRequest(
      senderId,
      groupId
    );
  }
  public async getPendingGroupJoinRequests(senderId: string, groupId: string) {
    const group = await groupRepository.findGroupById(groupId, {
      status: 1,
      admin: 1,
    });

    if (!group) {
      throw new ApiError(ApiErrorCodes.GROUP_NOT_FOUND);
    }

    if (group.status !== GroupStatus.APPROVED) {
      throw new ApiError(ApiErrorCodes.GROUP_NOT_APPROVED);
    }

    if (!group.admin.equals(senderId)) {
      throw new ApiError(ApiErrorCodes.GROUP_JOIN_REQUEST_NOT_VISIBLE);
    }
    return await groupJoinRequestService.getPendingGroupJoinRequests(groupId);
  }

  public async changeGroupJoinRequestStatus(
    userId: string,
    requestId: string,
    status: GroupJoinRequestStatus
  ) {
    await groupJoinRequestService.changeGroupJoinRequestStatus(
      userId,
      requestId,
      status
    );
  }

  public async addMemberToGroup(
    groupId: string | Types.ObjectId,
    userId: string | Types.ObjectId
  ) {
    return await groupRepository.addMemberToGroup(groupId, userId);
  }

  public async removeMemberFromGroup(
    senderId: string,
    groupId: string,
    memberId: string
  ) {
    const group = await groupRepository.findGroupById(groupId);
    if (!group) {
      throw new ApiError(ApiErrorCodes.GROUP_NOT_FOUND);
    }

    // check if the sender is the admin of the group
    if (!group.admin.equals(senderId)) {
      throw new ApiError(ApiErrorCodes.REMOVE_MEMBER_FORBIDDEN);
    }

    // check if the member is the admin of the group
    if (group.admin.equals(memberId)) {
      throw new ApiError(ApiErrorCodes.CANNOT_REMOVE_GROUP_ADMIN);
    }

    // check if the member is in the group
    if (!group.members.some((member) => member.equals(memberId))) {
      throw new ApiError(ApiErrorCodes.USER_NOT_IN_GROUP);
    }

    return await groupRepository.removeMemberFromGroup(groupId, memberId);
  }

  public async changeGroupStatus(
    groupId: string,
    status: GroupStatus,
    senderRole: UserRole
  ) {
    const group = await groupRepository.findGroupById(groupId, {
      status: 1,
      admin: 1,
    });
    if (!group) {
      throw new ApiError(ApiErrorCodes.GROUP_NOT_FOUND);
    }

    if (senderRole !== UserRole.ADMIN) {
      throw new ApiError(ApiErrorCodes.ADMIN_ROLE_REQUIRED);
    }

    if (group.status !== GroupStatus.PENDING) {
      throw new ApiError(ApiErrorCodes.CANNOT_CHANGE_GROUP_STATUS);
    }

    // notify the admin of the group when the group is approved
    await notificationService.pushNotification({
      receiver: group.admin,
      relatedEntity: new Types.ObjectId(groupId),
      type: NotificationType.GROUP_JOIN_REQUEST,
    });

    await groupRepository.updateGroupById(groupId, { status });
  }

  public async getGroupPosts(
    groupId: string,
    senderId: string,
    senderRole: UserRole,
    paginationQuery: PaginationQueryType
  ) {
    const group = await groupRepository.findGroupById(groupId, {
      status: 1,
      visibilityLevel: 1,
      members: 1,
    });

    if (!group) {
      throw new ApiError(ApiErrorCodes.GROUP_NOT_FOUND);
    }

    if (group.status !== GroupStatus.APPROVED) {
      throw new ApiError(ApiErrorCodes.GROUP_NOT_APPROVED);
    }

    const canViewPosts =
      senderRole === UserRole.ADMIN ||
      group.visibilityLevel === GroupVisibilityLevel.PUBLIC ||
      group.members.some((member) => member.equals(senderId));

    if (!canViewPosts) {
      throw new ApiError(ApiErrorCodes.GROUP_POSTS_NOT_VISIBLE);
    }

    const { beforeDate, limit } = paginationQuery;

    const posts = await postRepository.getPostsByUserIdOrGroupId(
      // this method require user id, so we pass undefined meaning we are not filtering by user
      undefined,
      groupId,
      [PostVisibilityLevel.GROUP],
      beforeDate,
      Number(limit)
    );
    return await Promise.all(
      posts.map(async (post) => {
        const { reactionCount, reactionSummary, userReaction, commentCount } =
          await postService.getPostOrCommentInfo(post._id, senderId);

        return {
          ...post,
          reactionCount,
          reactionSummary,
          commentCount,
          userReaction,
        };
      })
    );
  }
}

export default new GroupService();
