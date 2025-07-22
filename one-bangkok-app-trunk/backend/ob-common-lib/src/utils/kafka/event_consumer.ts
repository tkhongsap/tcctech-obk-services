import { find, get, isEqual, keys } from 'lodash';
import { EventName, EventRegistry } from './event_registry';
import { OBEvent } from './ob_event';
import logging from '../logging';

export function start(eventName: EventName[], groupId: string, callback: Function) {
  const kafka = new OBEvent();
  logging.info(`start consume: [${eventName}]`);

  kafka.start(eventName, groupId, (event: { name: string; payload: any }, raw: any) => {
    logging.info(`consume topic: ${event.name}`);
    callback(event, raw);
  });
}
