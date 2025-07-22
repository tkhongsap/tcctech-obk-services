import {useCallback, useEffect, useState} from 'react';

/**
 * A simplify version of https://github.com/primus/eventemitter3
 */
const listenersMap: {[id: string]: Array<(...params: any[]) => void>} = {};

function addListener(eventName: string, listener: (...params: any[]) => void) {
  listenersMap[eventName] = listenersMap[eventName] || [];
  listenersMap[eventName].push(listener);
}

function removeListener(
  eventName: string,
  listener: (...params: any[]) => void,
) {
  let lis = listenersMap[eventName];
  if (!lis) return;

  for (let i = lis.length - 1; i >= 0; i--) {
    if (lis[i] === listener) {
      lis.splice(i, 1);
      break;
    }
  }
}

function removeAllListeners(eventName: string) {
  listenersMap[eventName] = [];
}

function notify<T = any>(eventName: string, ...params: T[]) {
  let listeners = listenersMap[eventName];
  if (!listeners) return false;
  listeners.forEach(fnc => {
    fnc(...params);
  });
  return true;
}

export type ScreenHookEventType = {
  timestamp: number;
  from: any;
  name: any;
  data?: any;
};

export function useScreenHook(
  screenName: string,
  handler: (
    latestEvent: ScreenHookEventType,
    prevEvent: ScreenHookEventType,
    events: ScreenHookEventType[],
  ) => void,
): void {
  const MAX_EVENTS = 3;
  const [events, setEvents] = useState<ScreenHookEventType[]>([]);

  function pushEvent(event: ScreenHookEventType) {
    setEvents(_events => [..._events, event].slice(-MAX_EVENTS));
  }

  useEffect(() => {
    console.debug(`[useScreenHook] ${screenName} - registered`);
    addListener(screenName, pushEvent);

    return () => {
      console.debug(`[useScreenHook] ${screenName} - deregistered`);
      removeAllListeners(screenName);
    };
  }, [screenName]);

  useEffect(() => {
    const eventCount = events.length;
    const event = events[eventCount - 1];

    if (!event) {
      return;
    }

    const prveEvent = events[eventCount - 2];

    console.debug(
      `[useScreenHook] ${screenName} - event received`,
      JSON.stringify(event, null, '\t'),
    );

    event && handler(event, prveEvent, events);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);
}

export function createNotifyScreenHook<EventTypes>(route: any) {
  return () =>
    useCallback(function notifyScreenHook(
      screenHook: string,
      eventName: EventTypes,
      data?: any,
    ): void {
      notify(screenHook, {
        timestamp: Date.now(),
        from: route,
        name: `${route.name}.${eventName}`,
        data,
      });
    },
    []);
}

export default {
  addListener,
  removeListener,
  removeAllListeners,
  notify,
};
