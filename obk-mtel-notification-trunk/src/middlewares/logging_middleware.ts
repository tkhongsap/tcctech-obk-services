import { v4 as uuidv4 } from 'uuid';
import logging from '../utils/logging';

export function loggingMiddleware(req: any, res: any, next: any): void {
  const traceId = uuidv4();
  logging.setLoggingContext({ traceId });

  // Log the necessary request fields, including query parameters
  const { method, url, headers, body } = req;
  let requestBody;

  try {
    requestBody = JSON.stringify(body);
  } catch (error) {
    requestBody = body;
  }

  const requestLogData = {
    method,
    url,
    query: req.query,
    headers,
    body: requestBody,
  };
  if (requestLogData.url !== '/') {
    logging.info(requestLogData);
  }

  const originalJson = res.json;
  res.json = function (data: any) {
    logging.response(data);
    originalJson.call(this, data);
  };

  next();
}
