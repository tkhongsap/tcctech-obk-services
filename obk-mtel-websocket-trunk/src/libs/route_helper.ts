/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from 'fs';
import path from 'path';
import { snakeCase, compact } from 'lodash'

/**
 * @param {string}directory path to directory which contains controllers
 * @description
 * - return a compact array of contollers import from directory
 * - files under the directory with ending naming '_controller.ts' will be consumed as a target controller file 
 */
export async function loadControllerModules(directory: string) {
  const files = fs.readdirSync(directory);
  const controllerFiles = files.filter(file => file.endsWith('_controller.ts') || file.endsWith('_controller.js'));

  const controllers = [];
  for (const file of controllerFiles) {
    const module = await import(path.join(directory, file));
    controllers.push(module.default);
  }

  return compact(controllers);
}

/**
 * @param controllers - array of imported controllers
 * return array which contains api functions from each controller instances  
 */
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
