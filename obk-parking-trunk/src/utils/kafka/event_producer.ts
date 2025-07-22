/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { find, get, isEqual, keys } from 'lodash';
import { EventName, EventRegistry } from './event_registry';
import { OBEvent } from './ob_event';
// import logging from '../logging';

export function send(event: { name: EventName; payload: any }) {
  const kafka = new OBEvent();
  const payload = find(EventRegistry, { name: event.name });

  console.log(`start produce: ${event.name}`);
  if (payload) {
    const expectedPayload = get(payload, ['payload']);
    if (verifyPayload(event.payload, expectedPayload)) {
      kafka.send(event.name, event.payload);
    } else {
      console.log('payload mismatch');
      console.log(`expectedPayload: ${expectedPayload}`);
      console.log(`payload: ${payload}`);
    }
  }
  console.log(`end produce: ${event.name}`);
}

function verifyPayload(eventPayload: any, expectedPayload: any): boolean {
  return isEqual(keys(eventPayload), keys(expectedPayload));
}
