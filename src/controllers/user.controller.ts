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
    const user = await userService.getUser(_id);
    res.status(HttpStatusCodes.OK).json({
      message: "Get me successful",
      result: camelCaseifyWithDateConversion(user),
    });
  };

  public getUser = async (req: APIRequest, res: APIResponse) => {
    const user = await userService.getUser(req.params.userId);
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
    const user = await userService.updateUser(_id, req.body);
    res.status(HttpStatusCodes.OK).json({
      message: "Update me successful",
      result: camelCaseifyWithDateConversion(user),
    });
  };

  public sendFriendRequest = async (
    req: APIRequest<SendFriendRequestType>,
    res: APIResponse
  ) => {
    const { _id } = req.user as UserSessionType;
    await userService.sendFriendRequest(_id, req.body.receiverId);

    res.status(HttpStatusCodes.OK).json({
      message: "Send friend request successful",
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
    const friends = await userService.getFriends(_id);

    res.status(HttpStatusCodes.OK).json({
      message: "Get friends successful",
      result: friends.map((friend) => camelCaseifyWithDateConversion(friend)),
    });
  };

  public getFriends = async (req: APIRequest, res: APIResponse) => {
    const friends = await userService.getFriends(req.params.userId);
    res.status(HttpStatusCodes.OK).json({
      message: "Get friends successful",
      result: friends.map((friend) => camelCaseifyWithDateConversion(friend)),
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
      result: friendRequests.map((friendRequest) =>
        camelCaseifyWithDateConversion(friendRequest)
      ),
    });
  };
}

export default new UserController();
