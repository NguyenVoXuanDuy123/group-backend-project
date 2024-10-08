import { Request } from "express";
import userService from "@src/services/user.service";
import {
  ChangeFriendRequestStatusType,
  ChangeUserStatusRequestType,
  UpdateMeRequestType,
  UserSessionType,
} from "@src/types/user.types";
import { APIRequest, APIResponse } from "@src/types/api.types";
import HttpStatusCodes from "@src/constant/HttpStatusCodes";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import ApiError from "@src/error/ApiError";
import { GroupsQueryType, PaginationQueryType } from "@src/types/util.types";
import { generateImageUrl } from "@src/helpers/generateImageUrl";

class UserController {
  public getMe = async (req: Request, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;
    //getUser requires 2 parameters, userId and senderId
    //userId and senderId are the same in this case
    const user = await userService.getUserByIdOrUsername(_id, _id);
    res.status(HttpStatusCodes.OK).json({
      message: "Get me successfully",
      result: user,
    });
  };

  public getUser = async (req: APIRequest, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;
    const user = await userService.getUserByIdOrUsername(
      req.params.userId,
      _id
    );
    res.status(HttpStatusCodes.OK).json({
      message: "Get user successfully",
      result: user,
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
    const imageUrl = generateImageUrl(fileName);
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
      result: friendRequest,
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

    // getFriendsByUserId requires 3 parameters, userId, senderId, and query
    // userId and senderId are the same in this case
    const friends = await userService.getFriendsByUserId(
      _id,
      _id,
      req.query as PaginationQueryType
    );

    res.status(HttpStatusCodes.OK).json({
      message: "Get friends successfully",
      result: friends,
    });
  };

  public getFriends = async (req: APIRequest, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;

    const friends = await userService.getFriendsByUserId(
      _id,
      req.params.userId,
      req.query as PaginationQueryType
    );
    res.status(HttpStatusCodes.OK).json({
      message: "Get friends successfully",
      result: friends,
    });
  };

  public getMyPendingReceivedFriendRequests = async (
    req: Request,
    res: APIResponse
  ) => {
    const { _id } = req.user as UserSessionType;
    const friendRequests = await userService.getMyPendingReceivedFriendRequests(
      _id,
      req.query as PaginationQueryType
    );

    res.status(HttpStatusCodes.OK).json({
      message: "Get friend requests successfully",
      result: friendRequests,
    });
  };

  public getMyGroups = async (req: APIRequest, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;

    //getGroupsByUserId requires 3 parameters, userId, senderId, and query
    //userId and senderId are the same in this case
    const groups = await userService.getGroupsByUserId(
      _id,
      _id,
      req.query as PaginationQueryType
    );

    res.status(HttpStatusCodes.OK).json({
      message: "Get groups successfully",
      result: groups,
    });
  };

  public getUserGroups = async (req: APIRequest, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;
    const groups = await userService.getGroupsByUserId(
      _id,
      req.params.userId,
      req.query as PaginationQueryType & GroupsQueryType
    );

    res.status(HttpStatusCodes.OK).json({
      message: "Get groups successfully",
      result: groups,
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

  public getUserPosts = async (req: APIRequest, res: APIResponse) => {
    const { _id, role } = req.user as UserSessionType;
    const posts = await userService.getPostsByUserId(
      req.params.userId,
      _id,
      role,
      req.query as PaginationQueryType
    );

    res.status(HttpStatusCodes.OK).json({
      message: "Get user posts successfully",
      result: posts,
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
      result: feeds,
    });
  };

  public getUserByUsername = async (req: APIRequest, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;

    //getUserByIdOrUsername requires 3 parameters, userId, _id, and username
    //userId in this case is an empty string
    //because we only need to get user by username
    //username is the username in the request parameter

    const { username } = req.params;

    const user = await userService.getUserByIdOrUsername("", _id, username);
    res.status(HttpStatusCodes.OK).json({
      message: "Get user by username successfully",
      result: user,
    });
  };

  public getMyNotifications = async (req: Request, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;

    const notifications = await userService.getUserNotifications(
      _id,
      req.query as PaginationQueryType
    );

    res.status(HttpStatusCodes.OK).json({
      message: "Get notifications successfully",
      result: notifications,
    });
  };

  public getMyUnreadNotificationsCount = async (
    req: APIRequest,
    res: APIResponse
  ) => {
    const { _id } = req.user as UserSessionType;
    const unreadNotificationCount =
      await userService.getUnreadNotificationCount(_id);

    res.status(HttpStatusCodes.OK).json({
      message: "Get unread notification count successfully",
      result: unreadNotificationCount,
    });
  };

  public getMyUnreadNotifications = async (
    req: APIRequest,
    res: APIResponse
  ) => {
    const { _id } = req.user as UserSessionType;
    const unreadNotifications = await userService.getUnreadNotifications(_id);

    res.status(HttpStatusCodes.OK).json({
      message: "Get unread notifications successfully",
      result: unreadNotifications,
    });
  };
}

export default new UserController();
