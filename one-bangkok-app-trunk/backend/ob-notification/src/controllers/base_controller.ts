/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction } from 'express';

function tryCatchWrapper(target: any): void {
  for (const propName of Object.getOwnPropertyNames(
    Object.getPrototypeOf(target),
  )) {
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
            // If the method throws an error, call the next function
            const next: NextFunction = args[args.length - 1];
            next(error);
          }
        },
      }[propName];
    }
  }
}

export default class BaseController {
  constructor() {
    tryCatchWrapper(this);
  }
}
