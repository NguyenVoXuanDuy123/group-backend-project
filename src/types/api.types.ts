import { Request, Response } from "express";

type APIResponseType = {
  message: string;
  result?: unknown;
};

export type APIResponse = Response<APIResponseType>;

export type APIRequest<
  BodyType extends object = object,
  ParametersType = unknown,
  QueryType = unknown
> = Request<ParametersType, unknown, BodyType, QueryType>;
