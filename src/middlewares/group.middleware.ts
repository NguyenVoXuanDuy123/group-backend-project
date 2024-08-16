import {
  GroupJoinRequestStatus,
  GroupVisibilityLevel,
} from "@src/enums/group.enum";
import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import { validateNotNull } from "@src/helpers/validation";

import { APIRequest, APIResponse } from "@src/types/api.types";
import {
  ChangeGroupJoinRequestStatusRequestType,
  CreateGroupJoinRequestType,
  GroupMemberRequestType,
} from "@src/types/group.types";
import { NextFunction } from "express";

export const createGroupValidator = (
  req: APIRequest<CreateGroupJoinRequestType>,
  _: APIResponse,
  next: NextFunction
) => {
  const { name, description, visibilityLevel } = req.body;
  validateNotNull({ name, description, visibilityLevel });
  if (!Object.values(GroupVisibilityLevel).includes(visibilityLevel)) {
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

export const changeGroupJoinRequestStatusValidator = (
  req: APIRequest<ChangeGroupJoinRequestStatusRequestType>,
  _: APIResponse,
  next: NextFunction
) => {
  const { status } = req.body;
  validateNotNull({ status });
  if (!Object.values(GroupJoinRequestStatus).includes(status)) {
    throw new ApiError(ApiErrorCodes.INVALID_GROUP_JOIN_REQUEST_STATUS);
  }
  next();
};
