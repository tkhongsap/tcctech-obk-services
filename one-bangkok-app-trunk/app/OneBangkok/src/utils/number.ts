export const numberFormatter = (value: string, decimal: number) => {
  return parseFloat(parseFloat(value).toFixed(decimal)).toLocaleString(
    'en-US',
    {
      useGrouping: true,
    },
  );
};
