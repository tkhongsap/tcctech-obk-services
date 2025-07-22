import { Request, Response, NextFunction } from 'express';
import { errorHandler, CustomError } from '../../src/middlewares/error_middleware';

describe('errorHandler', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should handle CustomError and send error response', () => {
    const err = new CustomError(400, 'Bad Request');

    errorHandler(err, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Bad Request',
      },
    });
    expect(next).toHaveBeenCalled();
  });

  it('should handle CustomError with specific message and send error response with corresponding error code', () => {
    const err = new CustomError(409, 'Identity already exists');

    errorHandler(err, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'IDENTITY_ALREADY_EXISTS',
        message: 'Identity already exists',
      },
    });
    expect(next).toHaveBeenCalled();
  });

//   it('should handle generic error and send error response with default values', () => {
//     const err = new Error('Internal Server Error');

//     errorHandler(err, req as Request, res as Response, next);

//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.json).toHaveBeenCalledWith({
//       error: {
//         code: 'INTERNAL_SERVER_ERROR',
//         message: 'Internal Server Error',
//       },
//     });
//     expect(next).toHaveBeenCalled();
//   });
});
