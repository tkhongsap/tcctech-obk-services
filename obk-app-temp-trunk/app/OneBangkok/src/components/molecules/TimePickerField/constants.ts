import t from '~/utils/text';

function createTimePartArray(length: number) {
  return Array.from({length}, (v, i) => i.toString().padStart(2, '0'));
}

export function createHoursArray(length: number) {
  return Array.from({length}, (v, i) =>
    t('General__Hour_hour', '{{hour}} hours', {hour: i.toString()}),
  );
}

export const MINUTE = createTimePartArray(60);
export const HOUR = createTimePartArray(24);
