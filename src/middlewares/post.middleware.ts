import { PostVisibilityLevel, ReactionType } from "@src/enums/post.enum";
import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import { validateNotNull } from "@src/helpers/validation";

import { APIRequest, APIResponse } from "@src/types/api.types";
import { CreateCommentRequestType } from "@src/types/comment.types";
import {
  CreatePostRequestType,
  ReactToRequestType,
} from "@src/types/post.types";
import { NextFunction } from "express";

export const createPostValidator = (
  req: APIRequest<CreatePostRequestType>,
  _: APIResponse,
  next: NextFunction
) => {
  const { content, visibilityLevel, groupId } = req.body;

  validateNotNull({ content, visibilityLevel });

  // when group id is provided, visibility level must be group
  if (groupId) {
    if (visibilityLevel !== PostVisibilityLevel.GROUP)
      throw new ApiError(ApiErrorCodes.VISIBILITY_LEVEL_MUST_BE_GROUP);
  }

  // when visibility level is group, group id must be provided
  if (visibilityLevel === PostVisibilityLevel.GROUP) {
    if (!groupId) {
      throw new ApiError(
        ApiErrorCodes.GROUP_REQUIRED_WHEN_VISIBILITY_LEVEL_IS_GROUP
      );
    }
  }

  // visibility level must be public or friends for post in personal timeline
  if (!Object.values(PostVisibilityLevel).includes(visibilityLevel)) {
    throw new ApiError(ApiErrorCodes.INVALID_POST_VISIBILITY_LEVEL);
  }
  next();
};

export const reactToValidator = (
  req: APIRequest<ReactToRequestType>,
  _: APIResponse,
  next: NextFunction
) => {
  const { type } = req.body;
  validateNotNull({ type });
  if (!Object.values(ReactionType).includes(type)) {
    throw new ApiError(ApiErrorCodes.INVALID_REACTION_TYPE);
  }
  next();
};

export const addCommentValidator = (
  req: APIRequest<CreateCommentRequestType>,
  _: APIResponse,
  next: NextFunction
) => {
  const { content } = req.body;
  validateNotNull({ content });
  next();
};
