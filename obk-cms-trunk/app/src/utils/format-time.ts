export function formatTimeOnly(isoString: string): string {
  return (
    new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }) + ':00'
  )
}

export function formatLocalISO(date: Date | string) {
  const validDate = typeof date === 'string' ? new Date(date) : date
  if (isNaN(validDate.getTime())) {
    throw new Error('Invalid date value')
  }

  const year = validDate.getFullYear()
  const month = String(validDate.getMonth() + 1).padStart(2, '0') // Months are zero-indexed
  const day = String(validDate.getDate()).padStart(2, '0')
  const hours = String(validDate.getHours()).padStart(2, '0')
  const minutes = String(validDate.getMinutes()).padStart(2, '0')
  const seconds = String(validDate.getSeconds()).padStart(2, '0')
  const milliseconds = String(validDate.getMilliseconds()).padStart(3, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`
}
