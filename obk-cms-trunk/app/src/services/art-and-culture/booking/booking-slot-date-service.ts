import { httpClient } from '../../http-client'
import {
  IBookingSlotDateQueryParams,
  IBookingSlotDates,
  IWithPagination,
} from './model'

class BookingSlotDateService {
  async getBookingSlotDates(params: IBookingSlotDateQueryParams) {
    const response = await httpClient.get<IWithPagination<IBookingSlotDates>>(
      `/api/art-culture/cms/booking-slot-dates`,
      {
        headers: { locale: 'en', ['Time-Zone']: 'Asia/Bangkok' },
        params: { ...params, fields: 'program' },
      }
    )
    return response
  }
}

export const bookingSlotDateService = new BookingSlotDateService()
