import { v4 as uuidv4 } from 'uuid';
import logging from '../utils/logging';
import { get } from 'lodash';

export function loggingMiddleware(req: any, res: any, next: any): void {

  const newTraceId = uuidv4();
  // Log the necessary request fields, including query parameters
  const { method, url, headers, body } = req;
  const traceId = get(headers, 'x-trace-id', newTraceId);
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
  const xAccountId = get(headers, 'x-account-id');
  logging.setLoggingContext({ traceId, accountId: xAccountId });

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
