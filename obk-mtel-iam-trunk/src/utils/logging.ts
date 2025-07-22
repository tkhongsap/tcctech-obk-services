import winston, { format, transports } from 'winston';
import { LoggingContext } from '../context/logging_context';
interface LogObject {
  title?: string;
  body?: string;
  [key: string]: any;
}

const logger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: 'ob-iam' },
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
    new winston.transports.Http({
      host: process.env.LOG_URL,
      port: process.env.LOG_PORT ? parseInt(process.env.LOG_PORT) : 5170,
      path: process.env.LOG_PATH,
    }),
  ],
});

let loggingContext: LoggingContext = {}; // Initialize the logging context

function setLoggingContext(context: LoggingContext): void {
  loggingContext = context;
}

function clearLoggingContext(): void {
  loggingContext = {};
}

function getLogContext(): LoggingContext {
  return loggingContext;
}

function info(arg1: string | LogObject, attributes?: any): void {
  const traceId = loggingContext.traceId || 'N/A';

  let message = '';
  let logEntry: any = {
    level: 'info',
    traceId,
    ...attributes,
    timestamp: new Date().toISOString(), // Add the timestamp field
  };

  if (typeof arg1 === 'string') {
    message = arg1;
  } else if (typeof arg1 === 'object') {
    const { title, body, ...rest } = arg1 as LogObject;
    message = JSON.stringify(rest);
    logEntry = {
      ...logEntry,
      title,
      body,
    };
  }

  logEntry.message = message;

  logger.info(logEntry);
}

function error(arg1: string | LogObject, attributes?: any): void {
  const traceId = loggingContext.traceId || 'N/A';

  let message = '';
  let logEntry: any = {
    level: 'error',
    traceId,
    ...attributes,
    timestamp: new Date().toISOString(), // Add the timestamp field
  };

  if (typeof arg1 === 'string') {
    message = arg1;
  } else if (typeof arg1 === 'object') {
    const { title, body, ...rest } = arg1 as LogObject;
    message = JSON.stringify(rest);
    logEntry = {
      ...logEntry,
      title,
      body,
    };
  }

  logEntry.message = `${message}`; // Include traceId in the message

  logger.error(logEntry);
}

function response(data: any): void {
  const traceId = loggingContext.traceId || 'N/A';

  const logEntry: any = {
    level: 'info',
    traceId,
    message: JSON.stringify(data),
    timestamp: new Date().toISOString(),
  };

  logger.info(logEntry);
}

const logging = {
  info,
  error,
  response,
  setLoggingContext,
  clearLoggingContext,
  getLogContext,
};

export default logging;
