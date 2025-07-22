import { find, get, isEqual, keys } from 'lodash';
import { EventName, EventRegistry } from './event_registry';
import { OBEvent } from './ob_event';
import logging from '../logging';

export function send(event: { name: EventName; payload: any }) {
  const kafka = new OBEvent();
  const payload = find(EventRegistry, { name: event.name });
  logging.info(`start produce: ${event.name}`);
  if (payload) {
    const expectedPayload = get(payload, ['payload']);
    if (verifyPayload(event.payload, expectedPayload)) {
      kafka.send(event.name, event.payload);
    } else {
      logging.info('payload mismatch');
      logging.info(`expectedPayload: ${expectedPayload}`);
      logging.info(`payload: ${payload}`);
    }
  }
  logging.info(`end produce: ${event.name}`);
}

function verifyPayload(eventPayload: any, expectedPayload: any): boolean {
  return isEqual(keys(eventPayload), keys(expectedPayload));
}
