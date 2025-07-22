/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from 'fs';
import path from 'path';
import { snakeCase, compact } from 'lodash'

export async function loadControllerModules(directory: string) {
  const files = fs.readdirSync(directory);
  const controllerFiles = files.filter(file => file.endsWith('_controller.ts'));

  const controllers = [];
  for (const file of controllerFiles) {
    const module = await import(path.join(directory, file));
    controllers.push(module.default);
  }

  return compact(controllers);
}

export function apiWithPrefix(controllers: any[]): {[key: string]: any} {
  const api: {[key: string]: any} = {};

  controllers.forEach((controller) => {
    const controllerInstance = new controller();
    const methods = Object.getOwnPropertyNames(controllerInstance).filter(
      (method) => method !== 'constructor' && typeof (controllerInstance as any)[method] === 'function'
    );
    methods.forEach((method) => {
      const methodName = `${snakeCase(controller.name)}.${method}`;
      api[methodName] = (controllerInstance as any)[method];
    });
  });

  return api;
}
