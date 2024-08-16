import { Request } from "express";
import userService from "@src/services/user.service";
import {
  ChangeFriendRequestStatusType,
  SendFriendRequestType,
  UpdateMeRequestType,
  UserSessionType,
} from "@src/types/user.types";
import { APIRequest, APIResponse } from "@src/types/api.types";
import { camelCaseifyWithDateConversion } from "@src/helpers/camelCaseifyWithDateConversion";
import HttpStatusCodes from "@src/constant/HttpStatusCodes";

class UserController {
  public getMe = async (req: Request, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;
    //getUser requires 2 parameters, userId and senderId
    //userId and senderId are the same in this case
    const user = await userService.getUser(_id, _id);
    res.status(HttpStatusCodes.OK).json({
      message: "Get me successful",
      result: camelCaseifyWithDateConversion(user),
    });
  };

  public getUser = async (req: APIRequest, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;
    const user = await userService.getUser(req.params.userId, _id);
    res.status(HttpStatusCodes.OK).json({
      message: "Get user successful",
      result: camelCaseifyWithDateConversion(user),
    });
  };

  public updateMe = async (
    req: APIRequest<UpdateMeRequestType>,
    res: APIResponse
  ) => {
    const { _id } = req.user as UserSessionType;

    //updateUser requires 3 parameters, userId, senderId, and updateMeRequest
    //userId and senderId are the same in this case
    await userService.updateUser(_id, _id, req.body);
    res.status(HttpStatusCodes.OK).json({
      message: "Update me successful",
    });
  };

  public sendFriendRequest = async (
    req: APIRequest<SendFriendRequestType>,
    res: APIResponse
  ) => {
    const { _id } = req.user as UserSessionType;
    const friendRequest = await userService.sendFriendRequest(
      _id,
      req.body.receiverId
    );

    res.status(HttpStatusCodes.OK).json({
      message: "Send friend request successful",
      result: camelCaseifyWithDateConversion(friendRequest),
    });
  };

  public changeFriendRequestStatus = async (
    req: APIRequest<ChangeFriendRequestStatusType>,
    res: APIResponse
  ) => {
    const { _id } = req.user as UserSessionType;
    await userService.changeFriendRequestStatus(
      _id,
      req.params.friendRequestId,
      req.body.status
    );

    res.status(HttpStatusCodes.OK).json({
      message: "Change friend request status successful",
    });
  };

  public removeFriend = async (req: APIRequest, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;

    await userService.removeFriend(_id, req.params.friendId);

    res.status(HttpStatusCodes.OK).json({
      message: "Remove friend successful",
    });
  };

  public getMyFriends = async (req: Request, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;
    const friends = await userService.getFriendsByUserId(_id);

    res.status(HttpStatusCodes.OK).json({
      message: "Get friends successful",
      result: friends.map(camelCaseifyWithDateConversion),
    });
  };

  public getFriends = async (req: APIRequest, res: APIResponse) => {
    const friends = await userService.getFriendsByUserId(req.params.userId);
    res.status(HttpStatusCodes.OK).json({
      message: "Get friends successful",
      result: friends.map(camelCaseifyWithDateConversion),
    });
  };

  public getMyPendingReceivedFriendRequests = async (
    req: Request,
    res: APIResponse
  ) => {
    const { _id } = req.user as UserSessionType;
    const friendRequests = await userService.getMyPendingReceivedFriendRequests(
      _id
    );

    res.status(HttpStatusCodes.OK).json({
      message: "Get friend requests successful",
      result: friendRequests.map(camelCaseifyWithDateConversion),
    });
  };

  public getMyGroups = async (req: APIRequest, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;
    const groups = await userService.getGroupsByUserId(_id);

    res.status(HttpStatusCodes.OK).json({
      message: "Get groups successful",
      result: groups.map(camelCaseifyWithDateConversion),
    });
  };

  public getUserGroups = async (req: APIRequest, res: APIResponse) => {
    const groups = await userService.getGroupsByUserId(req.params.userId);
    res.status(HttpStatusCodes.OK).json({
      message: "Get groups successful",
      result: groups.map(camelCaseifyWithDateConversion),
    });
  };

  public leaveGroup = async (req: APIRequest, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;
    const { groupId } = req.params;
    await userService.leaveGroup(_id, groupId);
    res.status(HttpStatusCodes.OK).json({
      message: "Leave group successful",
    });
  };
}

export default new UserController();
