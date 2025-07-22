/* eslint-disable @typescript-eslint/no-explicit-any */

import logging from '../utils/logging';

function tryCatchWrapper(target: any): void {
  for (const propName of Object.getOwnPropertyNames(Object.getPrototypeOf(target))) {
    const propValue = (target as any)[propName];
    // Check if it's a function and not the constructor
    if (typeof propValue === 'function' && propName !== 'constructor') {
      // Override the method
      (target as any)[propName] = {
        [propName]: async (...args: any[]) => {
          try {
            // Call the original method
            const result = await propValue.apply(target, args);
            // Return the result
            return result;
          } catch (error) {
            logging.error(`${error}`);
          }
        },
      }[propName];
    }
  }
}

export default class BaseHandler {
  constructor() {
    tryCatchWrapper(this);
  }
}
