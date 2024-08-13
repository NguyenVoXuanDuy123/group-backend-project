import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import { validateNotNull } from "@src/helpers/validation";
import { GroupVisibilityLevel } from "@src/schema/group.schema";
import { GroupJoinRequestStatus } from "@src/schema/groupJoinRequest.schema";
import { APIRequest, APIResponse } from "@src/types/api.types";
import {
  ChangeGroupJoinRequestStatusRequestType,
  CreateGroupRequestType,
  GroupMemberRequestType,
} from "@src/types/group.types";
import { NextFunction } from "express";

export const createGroupValidator = (
  req: APIRequest<CreateGroupRequestType>,
  _: APIResponse,
  next: NextFunction
) => {
  const { name, description, visibilityLevel } = req.body;
  validateNotNull({ name, description, visibilityLevel });
  if (
    visibilityLevel !== GroupVisibilityLevel.PUBLIC &&
    visibilityLevel !== GroupVisibilityLevel.PRIVATE
  ) {
    throw new ApiError(ApiErrorCodes.INVALID_GROUP_VISIBILITY_LEVEL);
  }
  next();
};

export const sendGroupJoinRequestValidator = (
  req: APIRequest<GroupMemberRequestType>,
  _: APIResponse,
  next: NextFunction
) => {
  const { groupId } = req.body;
  validateNotNull({ groupId });
  next();
};

export const changeGroupRequestStatusValidator = (
  req: APIRequest<ChangeGroupJoinRequestStatusRequestType>,
  _: APIResponse,
  next: NextFunction
) => {
  const { status } = req.body;
  validateNotNull({ status });
  if (
    status !== GroupJoinRequestStatus.ACCEPTED &&
    status !== GroupJoinRequestStatus.REJECTED &&
    status !== GroupJoinRequestStatus.CANCELED
  ) {
    throw new ApiError(ApiErrorCodes.INVALID_GROUP_JOIN_REQUEST_STATUS);
  }
  next();
};
