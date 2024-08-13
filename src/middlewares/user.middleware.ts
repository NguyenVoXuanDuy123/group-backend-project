/* eslint-disable @typescript-eslint/no-unused-vars */
import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import { validateNotEmpty, validateNotNull } from "@src/helpers/validation";
import { FriendRequestStatus } from "@src/schema/friendRequest.schema";
import { APIRequest } from "@src/types/api.types";
import {
  ChangeFriendRequestStatusType,
  SendFriendRequestType,
  UpdateMeRequestType,
  UserSessionType,
} from "@src/types/user.types";
import { NextFunction, Request, RequestHandler, Response } from "express";

export const getMeValidator: RequestHandler = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  next();
};

export const sendFriendRequestValidator: RequestHandler = (
  req: APIRequest<SendFriendRequestType>,
  _: Response,
  next: NextFunction
) => {
  const { receiverId } = req.body;
  validateNotNull({ receiverId });
  validateNotEmpty({ receiverId });
  next();
};

export const removeFriendRequestValidator: RequestHandler = (
  req: APIRequest<Record<string, never>>,
  _: Response,
  next: NextFunction
) => {
  const { friendId } = req.params;
  validateNotNull({ friendId });
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
  if (
    status !== FriendRequestStatus.ACCEPTED &&
    status !== FriendRequestStatus.REJECTED &&
    status !== FriendRequestStatus.CANCELLED
  ) {
    throw new ApiError(ApiErrorCodes.INVALID_FRIEND_REQUEST_STATUS);
  }
  next();
};
