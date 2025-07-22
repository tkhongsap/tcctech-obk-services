import express from 'express';
import { join } from 'path';
import { connector } from 'swagger-routes-express';
import YAML from 'yamljs';
import { loadApi } from '../controllers';
import { Express } from 'express-serve-static-core';
import * as OpenApiValidator from 'express-openapi-validator';
import {
  snakeCaseResponseMiddleware,
  loggingMiddleware,
  EventConsumer,
  EventName,
  logging,
} from 'ob-common-lib/dist';
import { errorHandler } from '../middlewares/error_middleware';
import { newErrorHandler } from '../middlewares/error';
import { get } from 'lodash';
import cors from 'cors';
import { decodeXPermissionHandler } from '../middlewares/decodeXPermission';
import httpContext from 'express-http-context';
import { eventHandlers } from '../handlers/handler_registry';

export async function createServer(): Promise<Express> {
  const server = express();

  server.use(cors());
  server.use(express.json());
  server.use(express.text());
  server.use(loggingMiddleware);
  server.use(httpContext.middleware);
  server.use(decodeXPermissionHandler);
  // Routes
  server.get('/', (req, res) => {
    res.sendStatus(200);
  });

  // Generate the router configuration using the OpenAPI YAML file
  const apiDefinition = YAML.load(
    join(__dirname, '../openapi', 'openapi_spec.yaml'),
  ); // load the api as json
  const validatorOptions = {
    // coerceTypes: true,
    apiSpec: apiDefinition,
    validateRequests: true,
    validateResponses: false, // Disable due to a bug with enum validation
  };

  server.use(OpenApiValidator.middleware(validatorOptions));
  server.use(snakeCaseResponseMiddleware);

  // app
  const api = await loadApi();
  const connect = connector(api, apiDefinition, {
    apiSeparator: '.',
    onCreateRoute: (method: string, descriptor: unknown[]) => {
      console.log(
        `${method}: ${descriptor[0]} : ${get(descriptor[1], 'name')}`,
      );
    },
  });

  connect(server);
  try {
    EventConsumer.start(
      ['ob-bms.member.created'],
      'ob-iam',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (event: { name: EventName; payload: any }, raw: any) => {
        const eventName = event.name;
        logging.info(`Consuming event for event: ${eventName}`);
        const handler = eventHandlers[eventName];
        try {
          if (handler) {
            handler(event, raw);
          } else {
            logging.info(`No handler found for event: ${eventName}`);
          }
        } catch (error) {
          logging.error(`${error}`);
        }
      },
    );
  } catch (error) {
    logging.info('cannot connect to kafka');
  }

  server.use(errorHandler);
  server.use(newErrorHandler);

  return server;
}
