import express, { Request, Response, json, urlencoded } from 'express';
import { RegisterRoutes } from '../build/routes';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { loggingMiddleware } from './middlewares/logging_middleware';

const app = express();

app.use(cors());

// Set limit for URL-encoded data
app.use(urlencoded({
  extended: true,
  limit: '10mb'  // Increases limit to 10MB
}));

// Set limit for JSON payload
app.use(json({
  limit: '10mb'  // Increases limit to 10MB
}));

app.use(loggingMiddleware);

app.get('/', (_req: Request, res: Response) => {
  return res.sendStatus(200);
});

app.use('/docs', swaggerUi.serve, async (_req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(await import('../build/swagger.json')));
});

RegisterRoutes(app);

export default app;
