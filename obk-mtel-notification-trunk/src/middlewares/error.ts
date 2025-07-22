import { Request, Response, NextFunction } from 'express';
import logging from '../libs/logging';
import { OBError, errorObject } from '../libs/error_spec';
import { get } from 'lodash';
import { getErrorCodeOpenAPI, isOpenAPIError } from '../utils/error';

class CustomError extends Error {
  serviceError: errorObject;
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  constructor(serviceError: errorObject, message = '', status = 500) {
    super(message);
    this.status = status;
    this.serviceError = serviceError;
  }
}

const newErrorHandler = (
  // TODO: considered to move to common in  the future
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!err.serviceError && err?.errors?.length > 0) {
    const errorCode = err.errors[0].errorCode;
    if (isOpenAPIError(errorCode)) {
      err.serviceError = getErrorCodeOpenAPI(errorCode, err.status);
    } else {
      err.serviceError = OBError.OB_001;
    }
  }
  const status = err.serviceError?.status ?? OBError.OB_001.status;
  const message = err.serviceError?.message.replace('%s', get(err, 'message', '')) ?? OBError.OB_001.message;

  // Log the error
  logging.error({ error: { status: err.status, message: err.message } });
  logging.error({ error: { err } });

  // Send the error response
  res.status(status).json({
    error: {
      code: err?.serviceError?.errorCode ?? OBError.OB_001.errorCode,
      message: message,
    },
  });

  next();
};

export { CustomError, newErrorHandler };
