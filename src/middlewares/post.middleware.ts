import { PostVisibilityLevel } from "@src/enums/post.enum";
import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import { validateNotNull } from "@src/helpers/validation";

import { APIRequest, APIResponse } from "@src/types/api.types";
import { CreatePostRequestType } from "@src/types/post.types";
import { NextFunction } from "express";

export const createPostValidator = (
  req: APIRequest<CreatePostRequestType>,
  _: APIResponse,
  next: NextFunction
) => {
  const { content, images, visibilityLevel, groupId } = req.body;
  validateNotNull({ content, visibilityLevel });
  if (groupId && visibilityLevel !== PostVisibilityLevel.GROUP) {
    throw new ApiError(ApiErrorCodes.VISIBILITY_LEVEL_MUST_BE_GROUP);
  }
  if (visibilityLevel === PostVisibilityLevel.GROUP) {
    if (!groupId) {
      throw new ApiError(
        ApiErrorCodes.GROUP_ID_REQUIRED_WHEN_VISIBILITY_LEVEL_IS_GROUP
      );
    }
  }

  if (
    visibilityLevel !== PostVisibilityLevel.PUBLIC &&
    visibilityLevel !== PostVisibilityLevel.FRIENDS &&
    !groupId
  ) {
    throw new ApiError(ApiErrorCodes.INVALID_POST_VISIBILITY_LEVEL);
  }
  next();
};
