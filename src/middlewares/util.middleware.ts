import { UserStatus } from "@src/enums/user.enum";
import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import { validateIsAuthenticated } from "@src/helpers/validation";
import { APIRequest } from "@src/types/api.types";
import { UserSessionType } from "@src/types/user.types";
import { NextFunction, Request, Response } from "express";
/**
 * description: This middleware checks if the user is logged in or not
 * @param req
 * @param res
 * @param next
 */
export const AuthenticationValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateIsAuthenticated(req);
  next();
};

/**
 * description: This middleware checks if the user is active (not banned) or not
 * @param req
 * @param res
 * @param next
 */

export const IsUserActiveValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status } = req.user as UserSessionType;
  if (status === UserStatus.BANNED) {
    next(new ApiError(ApiErrorCodes.USER_BANNED));
  }
  next();
};

export const isGroupApproved = (
  req: APIRequest,
  res: Response,
  next: NextFunction
) => {};
