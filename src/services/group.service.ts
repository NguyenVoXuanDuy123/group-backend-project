import {
  GroupJoinRequestStatus,
  UserGroupRelation,
} from "@src/enums/group.enum";
import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import NotFoundError from "@src/error/NotFoundError";
import { removeNullValues } from "@src/helpers/removeNullValue";
import groupRepository from "@src/repositories/group.repository";
import groupJoinRequestRepository from "@src/repositories/groupJoinRequest.repository";
import { IGroup } from "@src/schema/group.schema";

import groupJoinRequestService from "@src/services/groupJoinRequest.service";
import {
  CreateGroupJoinRequestType,
  UpdateGroupJoinRequestType,
} from "@src/types/group.types";
import { Types } from "mongoose";

class GroupService {
  async createGroup(
    userId: string,
    createGroupJoinRequest: CreateGroupJoinRequestType
  ) {
    const group: IGroup = {
      ...createGroupJoinRequest,
      admin: new Types.ObjectId(userId),
      members: [new Types.ObjectId(userId)],
    };

    return await groupRepository.createGroup(group);
  }

  async updateGroup(
    userId: string,
    groupId: string,
    updateGroupJoinRequest: UpdateGroupJoinRequestType
  ) {
    const group = await groupRepository.getGroupById(groupId);
    if (!group) {
      throw new NotFoundError("group");
    }

    if (group.admin.toHexString() !== userId) {
      throw new ApiError(ApiErrorCodes.FORBIDDEN);
    }
    await groupRepository.updateGroupById(
      groupId,
      removeNullValues(updateGroupJoinRequest)
    );
    return await this.getGroupById(groupId, userId);
  }

  async getGroupById(groupId: string, senderId: string) {
    const group = await groupRepository.getGroupById(groupId, {
      __v: 0,
      updated_at: 0,
    });
    if (!group) {
      throw new NotFoundError("group");
    }
    const { admin, members, ...rest } = group;

    let userGroupRelation = UserGroupRelation.NOT_MEMBER;
    let groupJoinRequest = null;
    if (admin.toHexString() === senderId) {
      userGroupRelation = UserGroupRelation.ADMIN;
    } else if (members.some((member) => member.toString() === senderId)) {
      userGroupRelation = UserGroupRelation.MEMBER;
    } else if (
      (groupJoinRequest =
        await groupJoinRequestRepository.getPendingGroupJoinRequestBySenderIdAndGroupId(
          senderId,
          groupId
        ))
    ) {
      userGroupRelation = UserGroupRelation.INCOMING_REQUEST;
    }

    return {
      ...rest,
      admin: admin.toHexString(),
      memberCount: members.length,
      userGroupRelation,
    };
  }

  async getGroupMembers(groupId: string) {
    const groupMembers = await groupRepository.getGroupMembers(groupId);
    return groupMembers;
  }

  async sendGroupJoinRequest(senderId: string, groupId: string) {
    return await groupJoinRequestService.createGroupJoinRequest(
      senderId,
      groupId
    );
  }
  async getPendingGroupJoinRequests(senderId: string, groupId: string) {
    const group = await groupRepository.getGroupById(groupId);
    if (!group) {
      throw new NotFoundError("group");
    }
    if (group.admin.toHexString() !== senderId) {
      throw new ApiError(ApiErrorCodes.FORBIDDEN);
    }
    return await groupJoinRequestService.getPendingGroupJoinRequests(groupId);
  }

  async changeGroupJoinRequestStatus(
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

  async addMemberToGroup(groupId: string, userId: string) {
    return await groupRepository.addMemberToGroup(groupId, userId);
  }

  async removeMemberFromGroup(
    senderId: string,
    groupId: string,
    memberId: string
  ) {
    const group = await groupRepository.getGroupById(groupId);
    if (!group) {
      throw new NotFoundError("group");
    }

    // check if the sender is the admin of the group
    if (senderId !== group.admin.toHexString()) {
      throw new ApiError(ApiErrorCodes.FORBIDDEN);
    }

    // check if the member is the admin of the group
    if (memberId === group.admin.toHexString()) {
      throw new ApiError(ApiErrorCodes.CANNOT_REMOVE_GROUP_ADMIN);
    }

    // check if the member is in the group
    if (!group.members.some((id) => id.toString() === memberId)) {
      throw new ApiError(ApiErrorCodes.USER_NOT_IN_GROUP);
    }

    return await groupRepository.removeMemberFromGroup(groupId, memberId);
  }
}

export default new GroupService();
