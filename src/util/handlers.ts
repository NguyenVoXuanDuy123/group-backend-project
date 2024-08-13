import { Request, Response, NextFunction, RequestHandler } from "express";

export const wrapRequestHandler = (func: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.resolve(func(req, res, next));
    } catch (error) {
      next(error);
    }
  };
};
