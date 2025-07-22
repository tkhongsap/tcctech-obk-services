import app from './app';
import { eventHandlers } from './handlers/handler_registry';
import { newErrorHandler } from './midlewares/error';
import { errorHandler } from './midlewares/error_middleware';
import { EventConsumer, EventName } from './utils/kafka';
import logging from './utils/logging';

const port = process.env.SERVER_PORT ?? 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  // console.log('trigger deploy');
});

app.use(errorHandler);
app.use(newErrorHandler);

EventConsumer.start(
  ['ob-bms.member.created', 'ob-bms.member_resident.created', 'ob-iam.member.deleted'],
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

export default server;
