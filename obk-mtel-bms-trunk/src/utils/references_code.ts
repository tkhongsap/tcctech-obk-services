import dayjs from 'dayjs';

export const formatReference = (
  date: string,
  reference: string,
  length: number,
  prefix?: string,
  formatDate?: string,
) => {
  const dateFormat = formatDate ? dayjs(date).format(formatDate) : dayjs(date).format('YYMMDD');

  return prefix
    ? `${prefix}-${dateFormat}-${reference.padStart(length, '0')}`
    : `${dateFormat}${reference.padStart(length, '0')}`;
};
