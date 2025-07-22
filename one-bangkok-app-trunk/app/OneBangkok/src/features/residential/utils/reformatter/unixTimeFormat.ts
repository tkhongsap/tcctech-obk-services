export function unixToFormattedDate(unixTimestamp: any) {
  const date = new Date(parseInt(unixTimestamp));
  const utc7Offset = 7 * 60 * 60 * 1000;
  const utc7Date = new Date(date.getTime() + utc7Offset);
  const isoString = utc7Date.toISOString();
  return isoString;
}
