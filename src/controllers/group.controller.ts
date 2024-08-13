import { camelCaseifyWithDateConversion } from "@src/helpers/camelCaseifyWithDateConversion";
import groupService from "@src/services/group.service";
import { APIRequest, APIResponse } from "@src/types/api.types";
import {
  CreateGroupRequestType,
  GroupMemberRequestType,
  UpdateGroupRequestType,
} from "@src/types/group.types";
import { UserSessionType } from "@src/types/user.types";

class GroupController {
  async createGroup(req: APIRequest<CreateGroupRequestType>, res: APIResponse) {
    const { _id } = req.user as UserSessionType;
    await groupService.createGroup(_id, req.body);
    return res.status(201).json({ message: "Group created successfully" });
  }

  async updateGroup(req: APIRequest<UpdateGroupRequestType>, res: APIResponse) {
    const { groupId } = req.params;
    await groupService.updateGroup(groupId, req.body);
    return res.status(200).json({ message: "Group updated successfully" });
  }

  async getGroupById(req: APIRequest, res: APIResponse) {
    const { groupId } = req.params;
    const group = await groupService.getGroupById(groupId);
    return res.status(200).json({
      message: "Group fetched successfully",
      result: camelCaseifyWithDateConversion(group),
    });
  }

  async getGroupMembers(req: APIRequest, res: APIResponse) {
    const { groupId } = req.params;
    const groupMembers = await groupService.getGroupMembers(groupId);
    return res.status(200).json({
      message: "Group members fetched successfully",
      result: groupMembers.map(camelCaseifyWithDateConversion),
    });
  }

  async sendGroupRequest(
    req: APIRequest<GroupMemberRequestType>,
    res: APIResponse
  ) {
    const { _id } = req.user as UserSessionType;
    const { groupId } = req.body;
    await groupService.sendGroupRequest(_id, groupId);
    return res.status(200).json({ message: "Group request sent successfully" });
  }
}

export default new GroupController();
