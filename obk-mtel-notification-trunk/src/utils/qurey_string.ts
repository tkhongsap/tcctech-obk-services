import { isNull } from 'lodash';

export function appendQueryParam(url: string | null, param: string, value: string): string | null {
  if (isNull(url)) return null;

  let urlObj = new URL(url);

  urlObj.searchParams.set(param, value);

  return urlObj.toString();
}
