import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import { validateNotNull } from "@src/helpers/validation";
import { GroupVisibilityLevel } from "@src/schema/group.schema";
import { APIRequest, APIResponse } from "@src/types/api.types";
import { CreateGroupRequestType } from "@src/types/group.types";
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
