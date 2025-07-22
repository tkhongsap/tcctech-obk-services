import { Request, Response, NextFunction } from 'express';
import { logging } from 'ob-common-lib/dist';

class CustomError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { statusCode = 500, message = 'Internal Server Error' } = err;

  // Log the error
  logging.error(err.message, err.statusCode);

  // Determine the error code based on the error type
  let errorCode = 'INTERNAL_SERVER_ERROR';
  if (message === 'Identity already exists') {
    errorCode = 'IDENTITY_ALREADY_EXISTS';
  }

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
