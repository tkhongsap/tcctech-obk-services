import express from 'express';
import { join } from 'path';
import { connector } from 'swagger-routes-express';
import YAML from 'yamljs';
import { loadApi } from '../controllers';
import { Express } from 'express-serve-static-core';
import * as OpenApiValidator from 'express-openapi-validator';
import {
  loggingMiddleware,
  snakeCaseResponseMiddleware,
} from 'ob-common-lib/dist';
import { errorHandler } from '../middlewares/error_middleware';
import { get } from 'lodash';
import cors from 'cors';

export async function createServer(): Promise<Express> {
  const server = express();
  server.use(cors())
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
    validateResponses: true,
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

  server.use(errorHandler);

  return server;
}
