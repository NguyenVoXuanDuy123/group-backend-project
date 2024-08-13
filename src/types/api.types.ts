import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
type APIResponseType = {
  message: string;
  result?: unknown;
};

export type APIResponse = Response<APIResponseType>;

export type APIRequest<
  BodyType extends object = object,
  QueryType = unknown,
  ParametersType = ParamsDictionary
> = Request<ParametersType, unknown, BodyType, QueryType>;
