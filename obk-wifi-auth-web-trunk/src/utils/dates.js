import {
  addMinutes,
  addSeconds,
  eachDayOfInterval,
  format,
  formatDistance,
  fromUnixTime,
  isDate,
  isSameDay,
  isValid,
  lightFormat,
  parse,
  parseISO,
  subDays,
} from 'date-fns'

const dateFormat = 'dd-MM-yyyy'
const birthDateFormat = 'MM-dd-yyyy'
const birthDateFormat1 = 'yyyy-MM-dd'
const timeFormat = 'HH:mm:ss'
const dateTimeFormat = 'dd-MM-yyyy HH:mm:ss'
const interviewDateTimeFormatDay = 'MMM dd'
const interviewDateTimeFormatTime = 'h:mm a'
const sqlDateFormat = 'yyyy-MM-dd'
const dateTime = 'yyyy-MM-dd HH:mm'
const time = 'HH:mm'
const billingDateFormat = 'MMM dd, yyyy'
const jobDateFormat = 'dd MMM yyyy'
const jobExpireFormat = 'MMM dd yyyy'
const shortJobExpireFormat = 'MMM dd'
const stdDateFormat = 'dd/MM/yyyy'

export function formatStdDateFormat(date) {
  return format(parseDynamicDate(date), stdDateFormat)
}

export function formatDateArrayToSTD(dateArray) {
  const standardDates = dateArray?.map(date => {
    return formatStdDateFormat(date)
  })
  return standardDates
}

export function formatBookingTime(value) {
  return format(isDate(value) ? value : parseISO(value), time)
}

export function formatBillingDate(date) {
  return format(isDate(date) ? date : parseISO(date), billingDateFormat)
}

export function formatJobDate(date) {
  return format(isDate(date) ? date : parseISO(date), jobDateFormat)
}

export function parseDynamicDate(dateString) {
  if (isDate(dateString)) {
    return dateString
  }

  let parsedDate = parseISO(dateString)

  if (!isValid(parsedDate)) {
    parsedDate = parse(dateString, stdDateFormat, new Date())
  }

  if (!isValid(parsedDate)) {
    parsedDate = new Date(dateString)
  }

  return parsedDate
}

export function parseSTD_DATE(dateString) {
  return parse(dateString, stdDateFormat, new Date())
}

export function parseHH_MM_DATE(timeValue) {
  return parse(timeValue, time, new Date())
}

export function getFormattedDayInterval(startDateStr, endDateStr) {
  if (!startDateStr || !endDateStr) {
    return []
  }

  const startDate = isDate(startDateStr)
    ? startDateStr
    : parseDynamicDate(startDateStr)
  const endDate = isDate(endDateStr) ? endDateStr : parseDynamicDate(endDateStr)

  const datesBetween = eachDayOfInterval({ start: startDate, end: endDate })
  const formattedDates = datesBetween.map(date => format(date, stdDateFormat))
  return formattedDates
}

export function formatBirthDate(date, stringFormat) {
  const [, , yyyy] = date.split('-')
  let birthDate
  try {
    birthDate = format(
      yyyy?.length === 4
        ? parse(date, birthDateFormat, new Date())
        : parse(date, birthDateFormat1, new Date()),
      stringFormat
    )
  } catch (e) {
    // console.log(e)
    birthDate = 'N.A'
  }
  return birthDate
}

export function formatCustomDate(date, stringFormat) {
  return date ? format(isDate(date) ? date : parseISO(date), stringFormat) : ''
}

export function formatCustomDistance(date, options) {
  return date
    ? formatDistance(isDate(date) ? date : parseISO(date), new Date(), options)
    : ''
}

export function formatJobExpireDate(date) {
  return date
    ? format(isDate(date) ? date : parseISO(date), jobExpireFormat)
    : ''
}

export function formatShortJobExpireDate(date) {
  return date
    ? format(isDate(date) ? date : parseISO(date), shortJobExpireFormat)
    : ''
}

export function formatEndDate(date) {
  return format(
    subDays(isDate(date) ? date : parseISO(date), 1),
    billingDateFormat
  )
}

export function formatDateRange({ startDate, endDate }) {
  return isSameDay(startDate, endDate)
    ? lightFormat(startDate, dateFormat)
    : `${lightFormat(startDate, dateFormat)} to ${lightFormat(
        endDate,
        dateFormat
      )}`
}

export function formatDate(date) {
  return date
    ? lightFormat(
        isDate(date) ? date : isNaN(date) ? parseISO(date) : fromUnixTime(date),
        dateFormat
      )
    : ''
}

export function formatSqlDate(date) {
  return date
    ? lightFormat(
        isDate(date) ? date : isNaN(date) ? parseISO(date) : fromUnixTime(date),
        sqlDateFormat
      )
    : ''
}

export function formatTime(date) {
  return date
    ? lightFormat(
        isDate(date) ? date : isNaN(date) ? parseISO(date) : fromUnixTime(date),
        timeFormat
      )
    : ''
}

export function formatDateTime(date) {
  return date
    ? lightFormat(
        isDate(date) ? date : isNaN(date) ? parseISO(date) : fromUnixTime(date),
        dateTimeFormat
      )
    : ''
}

export function formatInterviewDateTime(date) {
  return date
    ? `${format(
        isDate(date) ? date : isNaN(date) ? parseISO(date) : fromUnixTime(date),
        interviewDateTimeFormatDay
      )}\n${format(
        isDate(date) ? date : isNaN(date) ? parseISO(date) : fromUnixTime(date),
        interviewDateTimeFormatTime
      )}`
    : ''
}

export function convertDate(str) {
  return parse(str, dateFormat, new Date())
}

export function convertZone(date, time_zone) {
  return format(
    addMinutes(
      addSeconds(parseISO(date), time_zone),
      parseISO(date).getTimezoneOffset()
    ),
    dateTime
  )
}

export function convertZoneTime(date, time_zone) {
  return date
    ? lightFormat(
        isDate(date)
          ? date
          : isNaN(date)
            ? addMinutes(
                addSeconds(parseISO(date), time_zone),
                parseISO(date).getTimezoneOffset()
              )
            : fromUnixTime(date),
        time
      )
    : ''
}

export function formatHH_MM_Time(date) {
  return date ? format(parseHH_MM_Time(date), time) : ''
}

export function parseHH_MM_Time(dateString) {
  if (isDate(dateString)) {
    return dateString
  }

  let parsedDate = parseISO(dateString)

  if (!isValid(parsedDate)) {
    parsedDate = parseHH_MM_DATE(dateString)
  }

  return parsedDate
}
