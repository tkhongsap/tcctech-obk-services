import { trimStart } from 'lodash';

export function getIdentifier(provider: string, identifier: string, countryCode?: string): string {
  if (provider != 'phone') {
    return identifier.toLocaleLowerCase();
  } else {
    return `${countryCode}${trimStart(identifier, '0')}`;
  }
}
