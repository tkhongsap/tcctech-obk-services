import { pickBy, isFunction } from 'lodash';

export const registerEventHandlers = (
  handlerInstances: any[],
  eventMapping: Record<string, (event: any, raw: any) => void>,
) => {
  const filteredHandlers = pickBy(eventMapping, isFunction);

  // Create a mapping of event names to their corresponding handlers
  const eventNameToHandlerMap: Record<string, (event: any, raw: any) => void> =
    {};

  for (const eventName in filteredHandlers) {
    for (const handlerInstance of handlerInstances) {
      eventNameToHandlerMap[eventName] =
        filteredHandlers[eventName].bind(handlerInstance);
    }
  }

  return eventNameToHandlerMap;
};
