import express, { Request, Response, json, urlencoded } from 'express';
import { RegisterRoutes } from '../build/routes';
import cors from 'cors';
import httpContext from 'express-http-context';

import swaggerUi from 'swagger-ui-express';
import { decodeXPermissionHandler } from './midlewares/decodeXPermission';
import { loggingMiddleware } from './midlewares/logging_middleware';

const app = express();

app.use(cors());

app.use(
  urlencoded({
    extended: true,
  }),
);
app.use(json());

app.use(loggingMiddleware);

app.use(httpContext.middleware);
app.use(decodeXPermissionHandler);

app.get('/', (_req: Request, res: Response) => {
  return res.sendStatus(200);
});

app.use('/docs', swaggerUi.serve, async (_req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(await import('../build/swagger.json')));
});

RegisterRoutes(app);

export default app;
