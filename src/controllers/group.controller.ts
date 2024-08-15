import HttpStatusCodes from "@src/constant/HttpStatusCodes";
import { camelCaseifyWithDateConversion } from "@src/helpers/camelCaseifyWithDateConversion";
import groupService from "@src/services/group.service";
import { APIRequest, APIResponse } from "@src/types/api.types";
import {
  ChangeGroupJoinRequestStatusRequestType,
  CreateGroupJoinRequestType,
  GroupMemberRequestType,
  RemoveGroupMemberRequestType,
  UpdateGroupJoinRequestType,
} from "@src/types/group.types";
import { UserSessionType } from "@src/types/user.types";
import { Types } from "mongoose";

class GroupController {
  async createGroup(
    req: APIRequest<CreateGroupJoinRequestType>,
    res: APIResponse
  ) {
    const { _id } = req.user as UserSessionType;
    await groupService.createGroup(_id, req.body);
    return res
      .status(HttpStatusCodes.CREATED)
      .json({ message: "Group created successfully" });
  }

  async updateGroup(
    req: APIRequest<UpdateGroupJoinRequestType>,
    res: APIResponse
  ) {
    const { _id } = req.user as UserSessionType;
    const { groupId } = req.params;
    const group = await groupService.updateGroup(_id, groupId, req.body);
    return res.status(HttpStatusCodes.OK).json({
      message: "Group updated successfully",
      result: camelCaseifyWithDateConversion(group),
    });
  }

  async getGroupById(req: APIRequest, res: APIResponse) {
    const { groupId } = req.params;
    const { _id } = req.user as UserSessionType;

    const group = await groupService.getGroupById(groupId, _id);

    return res.status(HttpStatusCodes.OK).json({
      message: "Group fetched successfully",
      result: camelCaseifyWithDateConversion(group),
    });
  }

  async getGroupMembers(req: APIRequest, res: APIResponse) {
    const { groupId } = req.params;
    const groupMembers = await groupService.getGroupMembers(groupId);
    return res.status(HttpStatusCodes.OK).json({
      message: "Group members fetched successfully",
      result: groupMembers.map(camelCaseifyWithDateConversion),
    });
  }

  async sendGroupJoinRequest(
    req: APIRequest<GroupMemberRequestType>,
    res: APIResponse
  ) {
    const { _id } = req.user as UserSessionType;
    const { groupId } = req.body;
    const groupRequest = await groupService.sendGroupJoinRequest(_id, groupId);
    return res.status(HttpStatusCodes.OK).json({
      message: "Group request sent successfully",
      result: camelCaseifyWithDateConversion(groupRequest),
    });
  }

  async getPendingGroupJoinRequests(req: APIRequest, res: APIResponse) {
    const { _id } = req.user as UserSessionType;
    const { groupId } = req.params;
    const groupJoinRequests = await groupService.getPendingGroupJoinRequests(
      _id,
      groupId
    );

    return res.status(HttpStatusCodes.OK).json({
      message: "Group join requests fetched successfully",
      result: groupJoinRequests.map(camelCaseifyWithDateConversion),
    });
  }

  async changeGroupJoinRequestStatus(
    req: APIRequest<ChangeGroupJoinRequestStatusRequestType>,
    res: APIResponse
  ) {
    const { _id } = req.user as UserSessionType;
    const { requestId } = req.params;
    const { status } = req.body;
    await groupService.changeGroupJoinRequestStatus(_id, requestId, status);
    return res
      .status(HttpStatusCodes.OK)
      .json({ message: "Group request status changed successfully" });
  }

  async removeMemberFromGroup(req: APIRequest, res: APIResponse) {
    const { _id } = req.user as UserSessionType;
    const { groupId, memberId } = req.params;
    await groupService.removeMemberFromGroup(_id, groupId, memberId);
    return res
      .status(HttpStatusCodes.OK)
      .json({ message: "Removed from group successfully" });
  }
}

export default new GroupController();
