import { Request, Response, NextFunction } from 'express';
import logging from '../utils/logging';

class CustomError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  if (!err.statusCode) {
    return next(err);
  }
  const { statusCode = 500, message = 'Internal Server Error' } = err;

  // Determine the error code based on the error type
  let errorCode = 'INTERNAL_SERVER_ERROR';
  switch (statusCode) {
    case 401:
      errorCode = 'UNAUTHORIZED';
      break;
    case 403:
      errorCode = 'FORBIDDEN';
      break;
    case 404:
      errorCode = 'NOT_FOUND';
      break;
    case 408:
      errorCode = 'REQUEST_TIMEOUT';
      break;
    default:
      break;
  }
  if (message === 'Identity already exists') {
    errorCode = 'IDENTITY_ALREADY_EXISTS';
  }
  // Log the error
  logging.error(err.message, err.statusCode);

  // Send the error response
  res.status(statusCode).json({
    error: {
      code: errorCode,
      message: message,
    },
  });

  next();
};

export { CustomError, errorHandler };
