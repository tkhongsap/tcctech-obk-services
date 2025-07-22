import { httpClient } from '../../http-client'
import { IBookingSettingDetail, IBookingSlotTimeStatus } from './model'

class BookingSlotTimeService {
  async updateBookingTimeStatus(id: string, status: IBookingSlotTimeStatus) {
    const response = await httpClient.patch<{
      data: IBookingSettingDetail
    }>(
      `/api/art-culture/cms/booking-slot-times/${id}`,
      {
        status,
      },
      {
        headers: { locale: 'en-Us' },
      }
    )
    return response
  }
}

export const bookingSlotTimeService = new BookingSlotTimeService()
