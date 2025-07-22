/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import logging from '../logging';
import { EventName } from './event_registry';
import { OBEvent } from './ob_event';
// import logging from '../logging';

export function start(eventName: EventName[], groupId: string, callback: Function) {
  const kafka = new OBEvent();
  // logging.info(`start consume: [${eventName}]`);
  logging.info(`start consume: [${eventName}]`);

  kafka.start(eventName, groupId, (event: { name: string; payload: any }, raw: any) => {
    // logging.info(`consume topic: ${event.name}`);
    logging.info(`consume topic: ${event.name}`);
    callback(event, raw);
  });
}
