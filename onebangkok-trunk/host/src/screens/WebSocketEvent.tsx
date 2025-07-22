const screenName = 'WebSocket';
const events = [
  'LIFTCALLED',
  'PARKING_AVAILABILITY_UPDATED',
  'SHUTTLE_BUS_POSITION_UPDATED',
] as const;

export type WebSocketEventTypes = (typeof events)[number];

export const WebSocketEventNames: Record<WebSocketEventTypes, string> =
  Object.fromEntries(
    events.map(event => [event, `${screenName}.${event}`]),
  ) as Record<WebSocketEventTypes, string>;
