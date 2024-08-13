import { validateIsAuthenticated } from "@src/helpers/validation";
import { NextFunction, Request, Response } from "express";

export const AuthenticationValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateIsAuthenticated(req);
  next();
};
