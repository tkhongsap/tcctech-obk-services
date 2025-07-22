// snakeCaseResponseMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { snakeCase, Dictionary } from 'lodash';

function snakeCaseResponseMiddleware(req: Request, res: Response, next: NextFunction) {
  const originalJson = res.json.bind(res);
  res.json = function (data: any) {
    const transformedData = recursiveSnakeCaseKeys(data);
    return originalJson(transformedData);
  };
  next();
}

function recursiveSnakeCaseKeys(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => recursiveSnakeCaseKeys(item));
    } else if (typeof data === 'object' && data !== null) {
        const snakeCaseObject: Dictionary<any> = {};
        for (const key in data) {
        const snakeCaseKey = snakeCase(key);
        snakeCaseObject[snakeCaseKey] = recursiveSnakeCaseKeys(data[key]);
      }
      return snakeCaseObject;
    }
    return data;
  }

export default snakeCaseResponseMiddleware;
