import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import NotFoundError from "@src/error/NotFoundError";
import groupRepository from "@src/repositories/group.repository";
import { IGroup } from "@src/schema/group.schema";
import { GroupJoinRequestStatus } from "@src/schema/groupJoinRequest.schema";
import groupJoinRequestService from "@src/services/groupJoinRequest.service";
import {
  CreateGroupRequestType,
  UpdateGroupRequestType,
} from "@src/types/group.types";
import { Types } from "mongoose";

class GroupService {
  async createGroup(
    userId: string,
    createGroupRequest: CreateGroupRequestType
  ) {
    const group: IGroup = {
      ...createGroupRequest,
      admin: new Types.ObjectId(userId),
      members: [new Types.ObjectId(userId)],
    };

    return await groupRepository.createGroup(group);
  }

  async updateGroup(
    userId: string,
    groupId: string,
    updateGroupRequest: UpdateGroupRequestType
  ) {
    const group = await groupRepository.getGroupById(groupId);
    if (!group) {
      throw new NotFoundError("group");
    }

    if (group.admin.toHexString() !== userId) {
      throw new ApiError(ApiErrorCodes.FORBIDDEN);
    }
    return await groupRepository.updateGroupById(groupId, updateGroupRequest);
  }

  async getGroupById(groupId: string) {
    const group = await groupRepository.getGroupById(groupId);
    if (!group) {
      throw new NotFoundError("group");
    }
    return group;
  }

  async getGroupMembers(groupId: string) {
    const groupMembers = await groupRepository.getGroupMembers(groupId);
    return groupMembers;
  }

  async sendGroupRequest(userId: string, groupId: string) {
    await groupJoinRequestService.createGroupRequest(userId, groupId);
  }

  async changeGroupRequestStatus(
    userId: string,
    requestId: string,
    status: GroupJoinRequestStatus
  ) {
    await groupJoinRequestService.changeGroupRequestStatus(
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
