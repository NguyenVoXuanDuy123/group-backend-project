import HttpStatusCodes from "@src/constant/HttpStatusCodes";

import groupService from "@src/services/group.service";
import { APIRequest, APIResponse } from "@src/types/api.types";
import {
  ChangeGroupJoinRequestStatusRequestType,
  ChangeGroupStatusRequestType,
  CreateGroupRequestType,
  GroupMemberRequestType,
  UpdateGroupRequestType,
} from "@src/types/group.types";
import { UserSessionType } from "@src/types/user.types";
import { PaginationQueryType } from "@src/types/util.types";

class GroupController {
  public createGroup = async (
    req: APIRequest<CreateGroupRequestType>,
    res: APIResponse
  ) => {
    const { _id, role } = req.user as UserSessionType;
    const group = await groupService.createGroup(_id, req.body, role);
    res.status(HttpStatusCodes.CREATED).json({
      message: "Group created successfully, waiting for approval",
      result: group,
    });
  };

  public updateGroup = async (
    req: APIRequest<UpdateGroupRequestType>,
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
      result: group,
    });
  };

  public getGroupMembers = async (req: APIRequest, res: APIResponse) => {
    const { groupId } = req.params;
    const { _id, role } = req.user as UserSessionType;
    const groupMembers = await groupService.getGroupMembers(
      _id,
      groupId,
      role,
      req.query as PaginationQueryType
    );
    res.status(HttpStatusCodes.OK).json({
      message: "Group members fetched successfully",
      result: groupMembers,
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
      result: groupRequest,
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
      groupId,
      req.query as PaginationQueryType
    );

    res.status(HttpStatusCodes.OK).json({
      message: "Group join requests fetched successfully",
      result: groupJoinRequests,
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
    await groupService.changeGroupStatus(groupId, role, req.body);
    res.status(HttpStatusCodes.OK).json({
      message: "Group status changed successfully",
    });
  };

  public getGroupPosts = async (req: APIRequest, res: APIResponse) => {
    const { _id, role } = req.user as UserSessionType;
    const { groupId } = req.params;
    const paginationQuery = req.query as PaginationQueryType;
    const posts = await groupService.getGroupPosts(
      groupId,
      _id,
      role,
      paginationQuery
    );

    res.status(HttpStatusCodes.OK).json({
      message: "Group posts fetched successfully",
      result: posts,
    });
  };

  public getPendingGroups = async (req: APIRequest, res: APIResponse) => {
    const { role } = req.user as UserSessionType;
    const groups = await groupService.getPendingGroups(
      role,
      req.query as PaginationQueryType
    );
    res.status(HttpStatusCodes.OK).json({
      message: "Pending groups fetched successfully",
      result: groups,
    });
  };
}

export default new GroupController();
