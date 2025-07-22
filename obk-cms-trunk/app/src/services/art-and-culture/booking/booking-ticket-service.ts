import { httpClient } from '@src/services/http-client'
import {
  IBookingTicketCheckInResponse,
  IBookingTicketResponse as IBookingTicketDetailResponse,
} from './model'

export interface IBookingTransactionQuery {
  bookerName?: string
  bookerEmail?: string
}

class BookingTicketService {
  async get(id: string) {
    return await httpClient.get<{
      data: IBookingTicketDetailResponse
    }>(`/api/art-culture/cms/booking-tickets/${id}`, {
      headers: { locale: 'en', ['Time-Zone']: 'Asia/Bangkok' },
    })
  }

  async checkIn(id: string) {
    return await httpClient.patch<{
      data: IBookingTicketCheckInResponse
    }>(`/api/art-culture/cms/booking-tickets/${id}/check-in`, null, {
      headers: { locale: 'en', ['Time-Zone']: 'Asia/Bangkok' },
    })
  }

  async resetTicket(id: string) {
    return await httpClient.patch<{
      data: IBookingTicketCheckInResponse
    }>(
      `/api/art-culture/cms/booking-tickets/${id}/reset-ticket`,
      {
        status: 'availiable',
      },
      {
        headers: { locale: 'en', ['Time-Zone']: 'Asia/Bangkok' },
      }
    )
  }
}

export const bookingTicketService = new BookingTicketService()
