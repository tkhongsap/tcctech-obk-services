export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (emailRegex.test(email)) {
    return true
  }
  return false
}

export function convertSecondsToTimeFormat(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const formattedTime = `${minutes
    .toString()
    .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  return formattedTime
}

export function generateUniqueKey() {
  let counter = 0
  const timestamp = Date.now() // Get current timestamp
  counter += 1 // Increment the counter
  return `${timestamp}-${counter}`
}

export function serialize(obj) {
  return Object.keys(obj)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
    .join('&')
}

export function calculateMinutesDifference(countExpire) {
  const current = new Date()
  const timeDifference = current.getTime() - countExpire.getTime()
  const minutes = Math.floor(timeDifference / 60000)
  return minutes
}
