import express, { Express } from 'express';
import { join } from 'path';
import { connector } from 'swagger-routes-express';
import YAML from 'yamljs';
import { loadApi } from '../controllers';
import * as OpenApiValidator from 'express-openapi-validator';
import { loggingMiddleware } from '../middlewares/logging_middleware';
import snakeCaseResponseMiddleware from '../middlewares/snake_case_middleware';
import { errorHandler } from '../middlewares/error_middleware';
import { get } from 'lodash';
import cors from 'cors';
import http from 'http';

export async function createServer(): Promise<{ app: Express, server: http.Server }> {
  const app = initializeApp();
  const server = http.createServer(app);

  setupMiddlewares(app);
  setupRoutes(app);
  await setupOpenApi(app);

  return { app, server };
}

function initializeApp(): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.text());
  return app;
}

function setupMiddlewares(app: Express): void {
  app.use(loggingMiddleware);
  app.use(snakeCaseResponseMiddleware);
}

function setupRoutes(app: Express): void {
  app.get('/', (req, res) => {
    res.sendStatus(200);
  });
}

async function setupOpenApi(app: Express): Promise<void> {
  const apiDefinition = loadApiDefinition();
  const validatorOptions = {
    apiSpec: apiDefinition,
    validateRequests: true,
    validateResponses: true,
  };

  app.use(OpenApiValidator.middleware(validatorOptions));

  const api = await loadApi();
  const connect = connector(api, apiDefinition, {
    apiSeparator: '.',
    onCreateRoute: (method: string, descriptor: unknown[]) => {
      console.log(
          `${method}: ${descriptor[0]} : ${get(descriptor[1], 'name')}`,
      );
    },
  });

  connect(app);
  app.use(errorHandler);
}

function loadApiDefinition() {
  return YAML.load(
      join(__dirname, '../openapi', 'openapi_spec.yaml')
  );
}
