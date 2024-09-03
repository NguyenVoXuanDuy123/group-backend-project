import { UserStatus } from "@src/enums/user.enums";
import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import { APIRequest, APIResponse } from "@src/types/api.types";
import { UserSessionType } from "@src/types/user.types";
import { NextFunction } from "express";

/**
 * description: This middleware checks if the user is logged in or not
 * @param req
 * @param res
 * @param next
 */
export const AuthenticationValidator = (
  req: APIRequest,
  res: APIResponse,
  next: NextFunction
) => {
  if (!req.isAuthenticated()) {
    throw new ApiError(ApiErrorCodes.USER_NOT_AUTHENTICATED);
  }
  next();
};

/**
 * description: This middleware checks if the user is active (not banned) or not
 * @param req
 * @param res
 * @param next
 */

export const IsUserActiveValidator = (
  req: APIRequest,
  res: APIResponse,
  next: NextFunction
) => {
  const { status } = req.user as UserSessionType;
  if (status === UserStatus.BANNED) {
    next(new ApiError(ApiErrorCodes.USER_BANNED));
  }
  next();
};

// export const isParameterIdValidValidator = (
//   req: APIRequest,
//   res: APIResponse,
//   next: NextFunction
// ) => {
//   const invalidIds = [];
//   for (const key in req.params) {
//     if (!Types.ObjectId.isValid(req.params[key])) {
//       invalidIds.push(key);
//     }
//   }
//   if (invalidIds.length > 0) {
//     throw new InvalidIdError(invalidIds);
//   }
//   next();
// };
