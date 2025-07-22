import express from 'express';

import { join } from 'path';
import { connector } from 'swagger-routes-express';
import YAML from 'yamljs';
import { Express } from 'express-serve-static-core';
import * as OpenApiValidator from 'express-openapi-validator';
import {
  EventConsumer,
  EventName,
  logging,
  loggingMiddleware,
} from 'ob-common-lib/dist';
import { errorHandler } from '../middlewares/error_middleware';
import { get } from 'lodash';
import { loadApi } from '../controllers';
import { eventHandlers } from '../handlers/handler_registry';

// import cors from 'cors';

export async function createServer(): Promise<Express> {
  const server = express();

  // server.use(cors());
  server.use(express.json());
  server.use(express.text());
  server.use(loggingMiddleware);

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
    validateResponses: false,
  };

  server.use(OpenApiValidator.middleware(validatorOptions));
  // server.use(snakeCaseResponseMiddleware);

  // app
  const api = await loadApi();
  const connect = connector(api, apiDefinition, {
    onCreateRoute: (method: string, descriptor: unknown[]) => {
      console.log(
        `${method}: ${descriptor[0]} : ${get(descriptor[1], 'name')}`,
      );
    },
  });

  connect(server);

  EventConsumer.start(
    [
      'ob-iam.account.created',
      'ob-iam.account.deleted',
      'ob-iam.account.password_reset',
      'ob-iam.account.password_set',
      'ob-iam.account.reactivated',
      'ob-iam.profile.updated',
      'ob-iam.device.added',
      'ob-iam.identity.email_added',
      'ob-iam.identity.email_default_set',
      'ob-iam.identity.phone_added',
      'ob-iam.identity.phone_default_set',
      'ob-iam.setting.2fa_activated',
      'ob-iam.setting.2fa_deactivated',
      'ob-bms.visitor.visited',
    ],
    'ob-notification',
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

  server.use(errorHandler);

  return server;
}
