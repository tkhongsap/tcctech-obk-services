/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';

export interface TypedRequest<ReqBody> extends Request {
  body: ReqBody;
}

export interface TypedResponse<ResBody> extends Response {
  json: (body: ResBody) => any;
}

export type CustomNext = NextFunction;
