/* eslint-disable @typescript-eslint/no-unused-vars */
import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import { validateNotEmpty, validateNotNull } from "@src/helpers/validation";
import { FriendRequestStatus, UserStatus } from "@src/enums/user.enum";
import { APIRequest } from "@src/types/api.types";
import { RemoveGroupMemberRequestType } from "@src/types/group.types";
import {
  ChangeFriendRequestStatusType,
  ChangeUserStatusRequestType,
  SendFriendRequestType,
} from "@src/types/user.types";
import { NextFunction, Request, RequestHandler, Response } from "express";

export const getMeValidator: RequestHandler = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  next();
};

export const removeFriendRequestValidator: RequestHandler = (
  req: APIRequest<Record<string, never>>,
  _: Response,
  next: NextFunction
) => {
  const { friendId } = req.params;
  validateNotNull({ friendId });
  validateNotEmpty({ friendId });
  next();
};

export const changeFriendRequestStatusValidator: RequestHandler = (
  req: APIRequest<ChangeFriendRequestStatusType>,
  _: Response,
  next: NextFunction
) => {
  const { status } = req.body;
  validateNotNull({ status });
  validateNotEmpty({ status });
  if (!Object.values(FriendRequestStatus).includes(status)) {
    throw new ApiError(ApiErrorCodes.INVALID_FRIEND_REQUEST_STATUS);
  }
  next();
};

export const removeGroupMemberValidator: RequestHandler = (
  req: APIRequest<RemoveGroupMemberRequestType>,
  _: Response,
  next: NextFunction
) => {
  const { memberId } = req.body;
  validateNotNull({ memberId });
  validateNotEmpty({ memberId });
  next();
};

export const changeUserStatusValidator: RequestHandler = (
  req: APIRequest<ChangeUserStatusRequestType>,
  _: Response,
  next: NextFunction
) => {
  const { status } = req.body;
  validateNotNull({ status });
  if (!Object.values(UserStatus).includes(status)) {
    throw new ApiError(ApiErrorCodes.INVALID_USER_STATUS);
  }
  next();
};
