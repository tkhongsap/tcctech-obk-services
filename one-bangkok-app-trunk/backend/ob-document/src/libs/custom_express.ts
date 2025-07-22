/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';

export interface TypedRequestBody<ReqBody> extends Request {
  body: ReqBody;
}

export interface TypedRequestQuery<ReqQuery> extends Request {
  ReqQuery: ReqQuery;
}

export interface TypedResponse<ResBody> extends Response {
  json: (body: ResBody) => any;
}

export type CustomNext = NextFunction;
