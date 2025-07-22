export function convertToCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return ''
  }

  if (isNaN(value)) {
    throw new Error('The value must be a number')
  }

  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
