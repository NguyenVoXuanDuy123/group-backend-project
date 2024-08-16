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
    return this.findGroupById(groupObject._id, userId);
  }

  public async updateGroup(
    senderId: string,
    groupId: string,
    updateGroupJoinRequest: UpdateGroupJoinRequestType
  ) {
    const group = await groupRepository.findGroupById(groupId);
    if (!group) {
      throw new NotFoundError("group");
    }
    // if the sender is not the admin of the group, they cannot update the group
    if (group.admin.toHexString() !== senderId) {
      throw new ApiError(ApiErrorCodes.FORBIDDEN);
    }
    await groupRepository.updateGroupById(
      groupId,
      removeNullValues(updateGroupJoinRequest)
    );
  }

  public async findGroupById(
    groupId: string | Types.ObjectId,
    senderId: string
  ) {
    const group = await groupRepository.findGroupById(groupId, {
      __v: 0,
    });
    if (!group) {
      throw new NotFoundError("group");
    }
    const { admin, members, ...rest } = group;
    let userGroupRelation = UserGroupRelation.NOT_MEMBER;
    let groupJoinRequest = null;
    if (admin.toHexString() === senderId) {
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
    });

    return {
      ...rest,
      admin: adminObject,
      memberCount: members.length,
      userGroupRelation,
    };
  }

  public async getGroupMembers(groupId: string) {
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
    const group = await groupRepository.findGroupById(groupId);
    if (!group) {
      throw new NotFoundError("group");
    }
    if (group.admin.toHexString() !== senderId) {
      throw new ApiError(ApiErrorCodes.FORBIDDEN);
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

  public async addMemberToGroup(groupId: string, userId: string) {
    return await groupRepository.addMemberToGroup(groupId, userId);
  }

  public async removeMemberFromGroup(
    senderId: string,
    groupId: string,
    memberId: string
  ) {
    const group = await groupRepository.findGroupById(groupId);
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
    if (!group.members.some((member) => member.equals(memberId))) {
      throw new ApiError(ApiErrorCodes.USER_NOT_IN_GROUP);
    }

    return await groupRepository.removeMemberFromGroup(groupId, memberId);
  }
}

export default new GroupService();
