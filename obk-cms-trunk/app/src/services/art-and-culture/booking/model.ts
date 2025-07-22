import { EnumBookingTimeStatus } from '@components/art-and-culture/booking-setting/utils/constants'

export interface IBookingSettingDetail {
  id: string
  programId: number
  program: IProgram
  createdAt?: string
  updatedAt?: string
  conditionTextEn: string
  conditionTextTh: string
  conditionTextCn: string
  ticketPrice: number
  maxTicketsPerTransaction: number
  openBookingTime: string
  closeBookingTime: string
  bookingSlotDates: IBookingSlotDates[]
}

export interface IBookingSettingListItem {
  id: string
  programId: number
  ticketPrice: number
  openBookingTime: string
  closeBookingTime: string
  maxTickets: number
  bookedCount: number
  checkedCount: number
  program: Partial<IProgram>
}

export interface IBookingSlotDates {
  id: string
  programId: number
  bookingSettingId?: string
  createdAt?: string
  updatedAt?: string
  slotDate: string
  bookingSlotTimes: IBookingSlotTime[]
}

export type IBookingSlotTimeStatus = 'available' | 'sold_out'
export interface IBookingSlotTime {
  id: string
  bookingSettingId?: string
  programId: number
  bookingSlotDateId: string
  createdAt?: string
  updatedAt?: string
  beginSlotTime: string
  endSlotTime: string
  maxTicketsPerSlotTime: number
  status: IBookingSlotTimeStatus
  bookedTicketsCount: number
  checkedInTicketsCount: number
}

export interface IProgram {
  periodAt: string
  periodEnd: string | null
  artCTitle: string
  locale: 'en' | 'th' | 'cn'
  locations: string[] // ['Jakarta', 'Bandung', 'Surabaya']
  title: string
  thumbnail: string
  banner: string
}

export interface IBookingTransactionList {
  id: string
  createdAt: string
  updatedAt: string
  userId: string
  programId: number
  orderId: string
  bookingSlotDateId: string
  bookingSlotTimeId: string
  bookerName: string
  bookerEmail: string
  bookerPhoneNumber: string | null
  ticketsCount: number
  showingStatus: string
  slotDate: string
  beginSlotTime: string
  endSlotTime: string
  price: number
}

export interface IBookingTransactionDetail extends IBookingTransactionList {
  program: IProgram
  bookingTickets: IBookingTicketDetail[]
}

export interface IBookingModelPagination {
  page?: number
  limit?: number
}

export interface IBookingStatusQueryParams extends IBookingModelPagination {
  fields?: string
  programTitle?: string
  beginDate?: Date
  endDate?: Date
  status?: EnumBookingTimeStatus | 'All'
}

export interface IBookingSettingListQueryParam extends IBookingModelPagination {
  fields?: string
  programTitle?: string
  beginDate?: Date
  endDate?: Date
  status?: EnumBookingTimeStatus | 'All'
}

export interface IBookingSlotDateQueryParams extends IBookingModelPagination {
  bookingSettingId: string
  beginDate?: string
  endDate?: string
  status?: EnumBookingTimeStatus | 'All'
}

export interface IWithPagination<T> {
  page: number
  limit: number
  sort: string
  totalRecords: number
  totalPages: number
  data: T[]
}

export interface IBookingTicketDetail {
  id: string
  status: string
  checkedInAt: string | null
  ticketNo: string
  qrCodeUrl?: string
}

export interface IBookingTicketResponse extends IBookingTicketDetail {
  bookingTransaction: {
    bookerName: string
    bookerEmail: string
    bookerPhoneNumber: number | null
    slotDate: string
    beginSlotTime: string
    endSlotTime: string
  }
  program: IProgram
}

export interface IBookingTicketCheckInResponse {
  id: string
  bookedTicketsCount: number
  checkedInTicketsCount: number
}
