import {
  GroupJoinRequestStatus,
  GroupStatus,
  GroupVisibilityLevel,
  UserGroupRelation,
} from "@src/enums/group.enum";
import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";

import { removeNullValues } from "@src/helpers/removeNullValue";
import groupRepository from "@src/repositories/group.repository";
import groupJoinRequestRepository from "@src/repositories/groupJoinRequest.repository";
import userRepository from "@src/repositories/user.repository";
import { IGroup } from "@src/schema/group.schema";

import groupJoinRequestService from "@src/services/groupJoinRequest.service";
import {
  CreateGroupJoinRequestType,
  UpdateGroupJoinRequestType,
} from "@src/types/group.types";
import { Types } from "mongoose";

class GroupService {
  public async createGroup(
    userId: string,
    createGroupJoinRequest: CreateGroupJoinRequestType
  ) {
    const group: Partial<IGroup> = {
      description: createGroupJoinRequest.description,
      name: createGroupJoinRequest.name,
      visibility_level: createGroupJoinRequest.visibilityLevel,
      admin: new Types.ObjectId(userId),
      members: [new Types.ObjectId(userId)],
    };

    const groupObject = await groupRepository.createGroup(group);
    return this.getGroupById(groupObject._id, userId);
  }

  public async updateGroup(
    senderId: string,
    groupId: string,
    updateGroupJoinRequest: UpdateGroupJoinRequestType
  ) {
    const group = await groupRepository.findGroupById(groupId);
    if (!group) {
      throw new ApiError(ApiErrorCodes.GROUP_NOT_FOUND);
    }
    // if the sender is not the admin of the group, they cannot update the group
    if (!group.admin.equals(senderId)) {
      throw new ApiError(ApiErrorCodes.UPDATE_GROUP_FORBIDDEN);
    }
    await groupRepository.updateGroupById(
      groupId,
      removeNullValues(updateGroupJoinRequest)
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
          groupId
        ))
    ) {
      userGroupRelation = UserGroupRelation.INCOMING_REQUEST;
    }

    const adminObject = await userRepository.findById(admin, {
      _id: 1,
      last_name: 1,
      first_name: 1,
      username: 1,
      avatar: 1,
    });

    return {
      ...rest,
      admin: adminObject,
      memberCount: members.length,
      userGroupRelation,
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

  public async getGroupMembers(senderId: string, groupId: string) {
    const group = await groupRepository.findGroupById(groupId, {
      members: 1,
      visibility_level: 1,
      status: 1,
    });

    if (!group) {
      throw new ApiError(ApiErrorCodes.GROUP_NOT_FOUND);
    }

    // if the group is not approved, the members cannot be viewed
    if (group.status === GroupStatus.PENDING) {
      throw new ApiError(ApiErrorCodes.GROUP_NOT_APPROVED);
    }

    /*
     * user can view the members of the group if
     * 1. the group is public
     * 2. the group is private but the user is a member of the group (admin is also a member)
     */

    const canViewMembers =
      group.visibility_level === GroupVisibilityLevel.PUBLIC ||
      group.members.some((member) => member.equals(senderId));

    if (!canViewMembers) {
      throw new ApiError(ApiErrorCodes.GROUP_MEMBERS_NOT_VISIBLE);
    }
    const groupMembers = await groupRepository.getGroupMembers(groupId);
    return groupMembers;
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

    if (group.status === GroupStatus.PENDING) {
      throw new ApiError(ApiErrorCodes.GROUP_NOT_APPROVED);
    }

    if (group.admin.equals(senderId)) {
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
}

export default new GroupService();
