import path from 'path';
import { loadControllerModules, apiWithPrefix } from '../libs/route_helper';

export async function loadApi() {
  const controllers = await loadControllerModules(path.join(__dirname));
  return apiWithPrefix(controllers);
}
