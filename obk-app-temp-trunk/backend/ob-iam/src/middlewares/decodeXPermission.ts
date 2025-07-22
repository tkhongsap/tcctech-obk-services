import { Request, Response, NextFunction } from 'express';
import httpContext from 'express-http-context';
import { get } from 'lodash';

export function decodeXPermissionHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const {
    headers: { 'x-permissions': xPermissions },
  } = req;
  const jwtToken = xPermissions ? JSON.parse(atob(xPermissions as string)) : {};
  httpContext.set('permissions', get(jwtToken, 'permission', []));
  next();
}
