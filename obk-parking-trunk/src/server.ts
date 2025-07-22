// server.ts

import app from "./app";
import { eventHandlers } from "./handlers/handler_registry";
import { newErrorHandler } from "./middlewares/error";
import { EventConsumer } from "./utils/kafka";
import { EventName } from "./utils/kafka";
import logging from "./utils/logging";

const port = process.env.SERVER_PORT ?? 3000;

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
app.use(newErrorHandler);

if (process.env.ENABLE_OCR_WORKER === 'true') {
  require('./worker');
}

EventConsumer.start(
  [],
  "ob-parking",
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
  }
);
export default server;
