/* eslint-disable @typescript-eslint/no-unused-vars */
import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import {
  validateNotEmpty,
  validateNotNull,
  validateUsername,
} from "@src/helpers/validation";
import { APIRequest } from "@src/types/api.types";
import { LoginRequestType, RegisterRequestType } from "@src/types/auth.types";

import { NextFunction, Request, RequestHandler, Response } from "express";

export const registerValidator: RequestHandler = (
  req: APIRequest<RegisterRequestType>,
  _: Response,
  next: NextFunction
) => {
  const { firstName, lastName, username, password, confirmPassword } = req.body;

  validateNotNull({
    firstName,
    lastName,
    username,
    password,
    confirmPassword,
  });

  validateNotEmpty({
    firstName,
    lastName,
    username,
    password,
    confirmPassword,
  });

  if (password.length < 6) {
    throw new ApiError(ApiErrorCodes.INVALID_PASSWORD_LENGTH);
  }

  if (username.length < 6 || username.length > 20) {
    throw new ApiError(ApiErrorCodes.INVALID_USERNAME_LENGTH);
  }

  validateUsername(username);

  if (password !== confirmPassword) {
    throw new ApiError(ApiErrorCodes.PASSWORD_CONFIRM_PASSWORD_MISMATCH);
  }

  next();
};

export const loginValidator: RequestHandler = (
  req: APIRequest<LoginRequestType>,
  _: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;
  validateNotNull({ username, password });
  next();
};
