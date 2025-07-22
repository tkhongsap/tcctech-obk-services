import { DeepPartial } from '@chakra-ui/react'
import { uniqueId } from 'lodash'
import { TreeNode } from 'primereact/treenode'
import { IShowtimeItem } from '../components/TimeTicketField'

import {
  IBookingSlotDates,
  IBookingSlotTime,
  IBookingSlotTimeStatus,
} from '@src/services/art-and-culture/booking/model'
import dayjs, { Dayjs } from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { EnumBookingTimeStatus } from './constants'

dayjs.extend(utc)
dayjs.extend(timezone)

export function dayjsTz(
  date: Date | string = new Date(),
  timezone: string = 'Asia/Bangkok'
) {
  return dayjs(date).tz(timezone)
}

export function formatDate(date: Date | string): string {
  return dayjsTz(date).format('ddd, DD MMM YYYY')
}

export function formatDateTime(date: Date | string): string {
  return dayjsTz(date).format('ddd, DD MMM YYYY, HH:mm')
}

export function apiFormatDate(date: Date) {
  return dayjsTz(date).format('YYYY-MM-DDTHH:mm:ssZ')
}

export function createUniqueIdBookingShowTime() {
  return uniqueId('Create')
}
export interface BookingSlotDate {
  id: string
  slotDate: Date
  bookingSlotTimes: BookingSlotTimes[]
}

export interface BookingSlotTimes {
  id: string
  bookingSlotDateId: string
  beginSlotTime: Date
  endSlotTime: Date
  maxTicketsPerSlotTime: number
  status: EnumBookingTimeStatus
  booked: number
}

const convertShowtimeItemToDate = (date: Date, HH: string, mm: string) => {
  const newDate = new Date(date)
  newDate.setHours(Number(HH))
  newDate.setMinutes(Number(mm))
  newDate.setSeconds(0, 0)
  return newDate
}

export const convertCreateShowtimeItemsToBookingSlotTimes = (
  programId: string,
  bookingSlotDateId: string,
  date: Date,
  showtimeItems: IShowtimeItem[]
): BookingSlotTimes[] => {
  const converted: BookingSlotTimes[] = showtimeItems.map((item) => {
    if (!(item.startHH && item.startMM && item.endHH && item.endMM))
      throw Error('')

    const begin = convertShowtimeItemToDate(date, item.startHH, item.startMM)
    const end = convertShowtimeItemToDate(date, item.endHH, item.endMM)
    return {
      id: item.id || createUniqueIdBookingShowTime(),
      beginSlotTime: begin,
      endSlotTime: end,
      maxTicketsPerSlotTime: Number(item.maxTicket) || 0,
      bookingSlotDateId,
      programId,
      status: EnumBookingTimeStatus.waiting,
      booked: 0,
    }
  })
  return converted
}

export const convertBookingSlotTimeToShowtimeItem = (
  bookingShowtimeItems: BookingSlotTimes[]
) => {
  const showtimeItem: IShowtimeItem[] = bookingShowtimeItems.map((item) => ({
    id: item.id,
    startHH: item.beginSlotTime.getHours().toString().padStart(2, '0'),
    startMM: item.beginSlotTime.getMinutes().toString().padStart(2, '0'),
    endHH: item.endSlotTime.getHours().toString().padStart(2, '0'),
    endMM: item.endSlotTime.getMinutes().toString().padStart(2, '0'),
    maxTicket: item.maxTicketsPerSlotTime.toString(),
    status: item.status,
    booked: item.booked > 0 || item.status === EnumBookingTimeStatus.sold_out,
  }))
  return showtimeItem
}

export const convertToRawData = (
  programId: string,
  dates: Date[],
  showtimeItems: IShowtimeItem[]
): BookingSlotDate[] => {
  const converted: BookingSlotDate[] = dates.map((date) => {
    const bookingSlotDateId = createUniqueIdBookingShowTime()
    const data: BookingSlotDate = {
      id: bookingSlotDateId,
      slotDate: date,
      bookingSlotTimes: convertCreateShowtimeItemsToBookingSlotTimes(
        programId,
        bookingSlotDateId,
        date,
        showtimeItems
      ),
    }
    return data
  })
  return converted
}

export const convertToTimeFormat = (date: Dayjs) => {
  return `${date.get('hour').toString().padStart(2, '0')}:${date
    .get('minute')
    .toString()
    .padStart(2, '0')}`
}

export const convertToTimeRageFormat = (start: string, end: string) => {
  const startDayjs = dayjsTz(start)
  const endDayjs = dayjsTz(end)
  const startFormatted = convertToTimeFormat(startDayjs)
  const endFormatted = convertToTimeFormat(endDayjs)
  return `${startFormatted} - ${endFormatted}`
}

export const convertRawDataToTreeNode = (rawData: BookingSlotDate[]) => {
  const converted: TreeNode[] = []

  rawData
    .sort(
      (a, b) =>
        dayjsTz(b.slotDate).toDate().getTime() -
        dayjsTz(a.slotDate).toDate().getTime()
    )
    .forEach((bookingSlotDate, index) => {
      const children: TreeNode[] = []
      let sumTickets = 0
      let sumBooked = 0
      bookingSlotDate.bookingSlotTimes.forEach(
        (bookingSlotTime, innerIndex) => {
          sumTickets += bookingSlotTime.maxTicketsPerSlotTime
          sumBooked += bookingSlotTime.booked
          children.push({
            key: `${index}-${innerIndex}`,
            data: {
              id: bookingSlotTime.id,
              date: '',
              showtimes: convertToTimeRageFormat(
                bookingSlotTime.beginSlotTime.toString(),
                bookingSlotTime.endSlotTime.toString()
              ),
              booked: bookingSlotTime.booked,
              maxTickets: bookingSlotTime.maxTicketsPerSlotTime,
              status: bookingSlotTime.status,
              raw: bookingSlotTime,
            },
          })
        }
      )

      const isPast =
        dayjsTz(bookingSlotDate.slotDate)
          .set('hour', 23)
          .set('minute', 59)
          .set('second', 59)
          .toDate()
          .getTime() <= dayjsTz().toDate().getTime()

      const data: TreeNode = {
        key: index.toString(),
        data: {
          id: bookingSlotDate.id,
          date: formatDate(bookingSlotDate.slotDate),
          showtimes: '',
          booked: sumBooked,
          maxTickets: sumTickets,
          status: isPast ? EnumBookingTimeStatus.completed : '',
          raw: bookingSlotDate,
        },
        children,
      }
      converted.push(data)
    })

  return converted
}

export const convertBookingResponseToClientData = (
  response: IBookingSlotDates[],
  openBookingTime: string
) => {
  const bookingSlotDates: BookingSlotDate[] = response.map(
    (bookingSlotDate) => {
      return {
        id: bookingSlotDate.id.toString(),
        slotDate: new Date(bookingSlotDate.slotDate),
        bookingSlotTimes: bookingSlotDate.bookingSlotTimes
          .sort(
            (a, b) =>
              new Date(a.beginSlotTime).getTime() -
              new Date(b.beginSlotTime).getTime()
          )
          .map(
            ({
              id,
              status,
              maxTicketsPerSlotTime,
              beginSlotTime,
              endSlotTime,
              bookingSlotDateId,
              bookedTicketsCount,
            }) => {
              const bookingSlotTime: BookingSlotTimes = {
                beginSlotTime: new Date(beginSlotTime),
                endSlotTime: new Date(endSlotTime),
                bookingSlotDateId: bookingSlotDateId.toString(),
                id: id.toString(),
                maxTicketsPerSlotTime,
                status: convertBookingSlotTimeStatus(
                  status,
                  endSlotTime,
                  openBookingTime
                ),
                booked: bookedTicketsCount,
              }
              return bookingSlotTime
            }
          ),
      }
    }
  )
  return bookingSlotDates
}

export const convertBookingSlotTimeToIBookingSlotTimeParams = (
  bookingSlotTimes: BookingSlotTimes[]
): Partial<IBookingSlotTime>[] => {
  return bookingSlotTimes.map((bookingSlotTime) => ({
    beginSlotTime: apiFormatDate(bookingSlotTime.beginSlotTime),
    endSlotTime: apiFormatDate(bookingSlotTime.endSlotTime),
    maxTicketsPerSlotTime: bookingSlotTime.maxTicketsPerSlotTime,
    id: bookingSlotTime.id?.startsWith('Create')
      ? undefined
      : bookingSlotTime.id,
    bookedTicketsCount: bookingSlotTime.booked,
  }))
}

export const convertBookingSlotDateToBookingSlotParams = (
  data: BookingSlotDate[]
): DeepPartial<IBookingSlotDates>[] => {
  return data.map((item) => ({
    bookingSlotTimes: convertBookingSlotTimeToIBookingSlotTimeParams(
      item.bookingSlotTimes
    ),
    slotDate: apiFormatDate(item.slotDate),
    id: item.id?.startsWith('Create') ? undefined : item.id,
  }))
}

export const convertBookingSlotTimeStatus = (
  status: IBookingSlotTimeStatus,
  endSlotTime: string,
  openBookingTimeStr: string
) => {
  const today = dayjsTz().toDate().getTime()
  const begin = dayjsTz(endSlotTime).toDate().getTime()

  if (today >= begin) return EnumBookingTimeStatus.completed

  if (status === 'sold_out') return EnumBookingTimeStatus.sold_out

  const openBookingTime = dayjsTz(openBookingTimeStr).toDate().getTime()
  if (status === 'available' && today >= openBookingTime)
    return EnumBookingTimeStatus.on_going

  return EnumBookingTimeStatus.waiting
}
