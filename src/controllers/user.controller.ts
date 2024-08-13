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
import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { ParamsDictionary } from "express-serve-static-core";
class UserController {
  public getMe = async (req: Request, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;
    const user = await userService.getUser(_id);
    res.status(HttpStatusCodes.OK).json({
      message: "Get me successful",
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
    req: APIRequest<ChangeFriendRequestStatusType, ParamsDictionary>,
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

  public removeFriend = async (
    req: APIRequest<Record<string, never>, ParamsDictionary>,
    res: APIResponse
  ) => {
    const { _id } = req.user as UserSessionType;

    await userService.removeFriend(_id, req.params.friendId);

    res.status(HttpStatusCodes.OK).json({
      message: "Remove friend successful",
    });
  };

  public getFriends = async (req: Request, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;
    const friends = await userService.getFriends(_id);

    res.status(HttpStatusCodes.OK).json({
      message: "Get friends successful",
      result: friends.map((friend) => camelCaseifyWithDateConversion(friend)),
    });
  };
}

export default new UserController();
