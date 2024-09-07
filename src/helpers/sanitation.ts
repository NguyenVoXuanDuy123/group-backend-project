import { Request, Response, NextFunction } from "express";
type PlainObject = { [key: string]: unknown };

const trimRequestBody = (req: Request, res: Response, next: NextFunction) => {
  const trimStrings = (obj: PlainObject | string): PlainObject | string => {
    if (typeof obj === "string") {
      return obj.trim();
    } else if (obj !== null && typeof obj === "object") {
      Object.keys(obj).forEach((key) => {
        obj[key] = trimStrings(obj[key] as PlainObject | string);
      });
    }
    return obj;
  };

  req.body = trimStrings(req.body as PlainObject | string);
  next();
};

export default trimRequestBody;
