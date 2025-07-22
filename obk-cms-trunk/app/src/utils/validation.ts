export const validateDateNotPass = (date: Date, errMessage?: string) => {
  if (date < new Date()) {
    return errMessage ?? 'Please select a future date and time'
  }
  return undefined
}
