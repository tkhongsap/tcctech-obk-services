import app from './app';
import { eventHandlers } from './events/handler_registry';
import { newErrorHandler } from './middlewares/error';
import { EventConsumer, EventName } from './utils/kafka';
import logging from './utils/logging';
app.use(newErrorHandler);

const port = process.env.SERVER_PORT ?? 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

EventConsumer.start(
  [
    'ob-iam.external_identity.created',
    'ob-bms.service_request.created',
    'ob-bms.air_condition_request.created',
    'ob-iam.profile.updated',
  ],
  'ob-bms',
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

export default server;
