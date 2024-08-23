import { Request } from "express";
import userService from "@src/services/user.service";
import {
  ChangeFriendRequestStatusType,
  ChangeUserStatusRequestType,
  UpdateMeRequestType,
  UserSessionType,
} from "@src/types/user.types";
import { APIRequest, APIResponse } from "@src/types/api.types";
import { camelCaseifyWithDateConversion } from "@src/helpers/camelCaseifyWithDateConversion";
import HttpStatusCodes from "@src/constant/HttpStatusCodes";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import ApiError from "@src/error/ApiError";
import EnvVars from "@src/constant/EnvVars";
import { PaginationQueryType } from "@src/types/util.types";

class UserController {
  public getMe = async (req: Request, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;
    //getUser requires 2 parameters, userId and senderId
    //userId and senderId are the same in this case
    const user = await userService.getUser(_id, _id);
    res.status(HttpStatusCodes.OK).json({
      message: "Get me successfully",
      result: camelCaseifyWithDateConversion(user),
    });
  };

  public getUser = async (req: APIRequest, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;
    const user = await userService.getUser(req.params.userId, _id);
    res.status(HttpStatusCodes.OK).json({
      message: "Get user successfully",
      result: camelCaseifyWithDateConversion(user),
    });
  };

  public updateMe = async (
    req: APIRequest<UpdateMeRequestType>,
    res: APIResponse
  ) => {
    const { _id } = req.user as UserSessionType;

    await userService.updateUser(_id, req.body);
    res.status(HttpStatusCodes.OK).json({
      message: "Update me successfully",
    });
  };

  public updateAvatar = async (req: APIRequest, res: APIResponse) => {
    if (!req.file) {
      throw new ApiError(ApiErrorCodes.NO_IMAGE_ATTACHED);
    }
    const fileName = req.file.filename;
    const imageUrl = `localhost:` + EnvVars.Port + `/images/${fileName}`;
    const { _id } = req.user as UserSessionType;
    await userService.updateAvatar(_id, imageUrl);
    res.status(HttpStatusCodes.OK).json({
      message: "Update avatar successfully",
      result: {
        url: imageUrl,
        size: req.file.size + " bytes",
        mimetype: req.file.mimetype,
      },
    });
  };

  public removeAvatar = async (req: APIRequest, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;
    await userService.updateAvatar(_id, "");
    res.status(HttpStatusCodes.OK).json({
      message: "Remove avatar successfully",
    });
  };

  public sendFriendRequest = async (req: APIRequest, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;
    const friendRequest = await userService.sendFriendRequest(
      _id,
      req.params.userId
    );

    res.status(HttpStatusCodes.OK).json({
      message: "Send friend request successfully",
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
      message: "Change friend request status successfully",
    });
  };

  public removeFriend = async (req: APIRequest, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;

    await userService.removeFriend(_id, req.params.friendId);

    res.status(HttpStatusCodes.OK).json({
      message: "Unfriend successfully",
    });
  };

  public getMyFriends = async (req: Request, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;
    const friends = await userService.getFriendsByUserId(_id);

    res.status(HttpStatusCodes.OK).json({
      message: "Get friends successfully",
      result: friends.map(camelCaseifyWithDateConversion),
    });
  };

  public getFriends = async (req: APIRequest, res: APIResponse) => {
    const friends = await userService.getFriendsByUserId(req.params.userId);
    res.status(HttpStatusCodes.OK).json({
      message: "Get friends successfully",
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
      message: "Get friend requests successfully",
      result: friendRequests.map(camelCaseifyWithDateConversion),
    });
  };

  public getMyGroups = async (req: APIRequest, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;
    const groups = await userService.getGroupsByUserId(_id);

    res.status(HttpStatusCodes.OK).json({
      message: "Get groups successfully",
      result: groups.map(camelCaseifyWithDateConversion),
    });
  };

  public getUserGroups = async (req: APIRequest, res: APIResponse) => {
    const groups = await userService.getGroupsByUserId(req.params.userId);
    res.status(HttpStatusCodes.OK).json({
      message: "Get groups successfully",
      result: groups.map(camelCaseifyWithDateConversion),
    });
  };

  public leaveGroup = async (req: APIRequest, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;
    const { groupId } = req.params;
    await userService.leaveGroup(_id, groupId);
    res.status(HttpStatusCodes.OK).json({
      message: "Leave group successfully",
    });
  };

  //Only admin can change user status
  public changeUserStatus = async (
    req: APIRequest<ChangeUserStatusRequestType>,
    res: APIResponse
  ) => {
    const { role } = req.user as UserSessionType;
    const { userId } = req.params;
    await userService.changeUserStatus(userId, req.body.status, role);
    res.status(HttpStatusCodes.OK).json({
      message: "Change user status successfully",
    });
  };

  public getFeeds = async (req: APIRequest, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;

    const feeds = await userService.getFeeds(
      _id,
      req.query as PaginationQueryType
    );
    res.status(HttpStatusCodes.OK).json({
      message: "Get feeds successfully",
      result: feeds.map(camelCaseifyWithDateConversion),
    });
  };
}

export default new UserController();
