import { httpClient } from '@src/services/http-client'
import { IBookingTransactionDetail, IBookingTransactionList } from './model'

export interface IBookingTransactionQuery {
  bookerName?: string
  bookerEmail?: string
}

class BookingTrasactionService {
  async getList(
    bookingSlotTimeId: string,
    queries: IBookingTransactionQuery = {}
  ) {
    return await httpClient.get<{
      data: IBookingTransactionList[]
    }>(`/api/art-culture/cms/booking-transactions`, {
      headers: { locale: 'en' },
      params: {
        bookingSlotTimeId,
        ...queries,
      },
    })
  }

  async get(id: string) {
    return await httpClient.get<{
      data: IBookingTransactionDetail
    }>(`/api/art-culture/cms/booking-transactions/${id}`, {
      headers: { locale: 'en' },
    })
  }
}

export const bookingTransactionService = new BookingTrasactionService()
