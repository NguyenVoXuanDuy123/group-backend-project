import HttpStatusCodes from "@src/constant/HttpStatusCodes";
import {
  camelCaseifyWithDateConversion,
  TransformKeysToCamelCaseType,
} from "@src/helpers/camelCaseifyWithDateConversion";
import groupService from "@src/services/group.service";
import { APIRequest, APIResponse } from "@src/types/api.types";
import {
  ChangeGroupJoinRequestStatusRequestType,
  ChangeGroupStatusRequestType,
  CreateGroupJoinRequestType,
  GroupMemberRequestType,
  UpdateGroupJoinRequestType,
} from "@src/types/group.types";
import { UserSessionType } from "@src/types/user.types";

class GroupController {
  public createGroup = async (
    req: APIRequest<CreateGroupJoinRequestType>,
    res: APIResponse
  ) => {
    const { _id } = req.user as UserSessionType;
    const group = await groupService.createGroup(_id, req.body);
    res.status(HttpStatusCodes.CREATED).json({
      message: "Group created successfully, waiting for approval",
      result: camelCaseifyWithDateConversion(
        group as unknown as TransformKeysToCamelCaseType
      ),
    });
  };

  public updateGroup = async (
    req: APIRequest<UpdateGroupJoinRequestType>,
    res: APIResponse
  ) => {
    const { _id } = req.user as UserSessionType;
    const { groupId } = req.params;
    await groupService.updateGroup(_id, groupId, req.body);
    res.status(HttpStatusCodes.OK).json({
      message: "Group updated successfully",
    });
  };

  public getGroupById = async (req: APIRequest, res: APIResponse) => {
    const { groupId } = req.params;
    const { _id } = req.user as UserSessionType;

    const group = await groupService.getGroupById(groupId, _id);

    res.status(HttpStatusCodes.OK).json({
      message: "Group fetched successfully",
      result: camelCaseifyWithDateConversion(group),
    });
  };

  // public removeGroup = async (req: APIRequest, res: APIResponse) => {
  //   const { _id } = req.user as UserSessionType;
  //   const { groupId } = req.params;
  //   await groupService.removeGroup(_id, groupId);
  //   res.status(HttpStatusCodes.OK).json({
  //     message: "Group removed successfully",
  //   });
  // };

  public getGroupMembers = async (req: APIRequest, res: APIResponse) => {
    const { groupId } = req.params;
    const { _id } = req.user as UserSessionType;
    const groupMembers = await groupService.getGroupMembers(_id, groupId);
    res.status(HttpStatusCodes.OK).json({
      message: "Group members fetched successfully",
      result: groupMembers.map(camelCaseifyWithDateConversion),
    });
  };

  public sendGroupJoinRequest = async (
    req: APIRequest<GroupMemberRequestType>,
    res: APIResponse
  ) => {
    const { _id } = req.user as UserSessionType;
    const { groupId } = req.params;
    const groupRequest = await groupService.sendGroupJoinRequest(_id, groupId);

    res.status(HttpStatusCodes.OK).json({
      message: "Group request sent successfully",
      result: camelCaseifyWithDateConversion(groupRequest),
    });
  };

  public getPendingGroupJoinRequests = async (
    req: APIRequest,
    res: APIResponse
  ) => {
    const { _id } = req.user as UserSessionType;
    const { groupId } = req.params;
    const groupJoinRequests = await groupService.getPendingGroupJoinRequests(
      _id,
      groupId
    );

    res.status(HttpStatusCodes.OK).json({
      message: "Group join requests fetched successfully",
      result: groupJoinRequests.map(camelCaseifyWithDateConversion),
    });
  };

  public changeGroupJoinRequestStatus = async (
    req: APIRequest<ChangeGroupJoinRequestStatusRequestType>,
    res: APIResponse
  ) => {
    const { _id } = req.user as UserSessionType;
    const { requestId } = req.params;
    const { status } = req.body;
    await groupService.changeGroupJoinRequestStatus(_id, requestId, status);
    res
      .status(HttpStatusCodes.OK)
      .json({ message: "Group request status changed successfully" });
  };

  public removeMemberFromGroup = async (req: APIRequest, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;
    const { groupId, memberId } = req.params;
    await groupService.removeMemberFromGroup(_id, groupId, memberId);
    res
      .status(HttpStatusCodes.OK)
      .json({ message: "Removed member from group successfully" });
  };

  // only site-admin can change group status
  public changeGroupStatus = async (
    req: APIRequest<ChangeGroupStatusRequestType>,
    res: APIResponse
  ) => {
    const { role } = req.user as UserSessionType;
    const { groupId } = req.params;
    const { status } = req.body;
    await groupService.changeGroupStatus(groupId, status, role);
    res.status(HttpStatusCodes.OK).json({
      message: "Group status changed successfully",
    });
  };
}

export default new GroupController();
