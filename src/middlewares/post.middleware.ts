import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import { validateNotNull } from "@src/helpers/validation";
import { PostVisibilityLevel } from "@src/schema/post.schema";
import { APIRequest, APIResponse } from "@src/types/api.types";
import { CreatePostRequestType } from "@src/types/post.types";
import { NextFunction } from "express";

export const createPostValidator = (
  req: APIRequest<CreatePostRequestType>,
  _: APIResponse,
  next: NextFunction
) => {
  const { content, images, visibilityLevel, group } = req.body;
  validateNotNull({ content, visibilityLevel });
  if (group && visibilityLevel !== PostVisibilityLevel.GROUP) {
    throw new ApiError(ApiErrorCodes.VISIBILITY_LEVEL_MUST_BE_GROUP);
  }
  if (
    visibilityLevel !== PostVisibilityLevel.PUBLIC &&
    visibilityLevel !== PostVisibilityLevel.FRIENDS
  ) {
    throw new ApiError(ApiErrorCodes.INVALID_POST_VISIBILITY_LEVEL);
  }
  next();
};
