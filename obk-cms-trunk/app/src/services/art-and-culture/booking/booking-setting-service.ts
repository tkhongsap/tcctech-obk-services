import { DeepPartial } from '@chakra-ui/react'
import { AxiosResponse } from 'axios'
import { httpClient } from '../../http-client'
import {
  IBookingSettingDetail,
  IBookingSettingListItem,
  IBookingSettingListQueryParam,
  IWithPagination,
} from './model'

class BookingSettingService {
  async getList(
    params: IBookingSettingListQueryParam = { page: 1, limit: 10 }
  ): Promise<AxiosResponse<IWithPagination<IBookingSettingListItem>>> {
    return httpClient.get<IWithPagination<IBookingSettingListItem>>(
      `/api/art-culture/cms/booking-settings`,
      {
        headers: { locale: 'en', ['Time-Zone']: 'Asia/Bangkok' },
        params: { ...params, fields: 'program' },
      }
    )
  }

  async getDetailByProgramId(
    programId: number
  ): Promise<AxiosResponse<{ data: IBookingSettingDetail }>> {
    return httpClient.get<{
      data: IBookingSettingDetail
    }>(
      `/api/art-culture/cms/booking-settings/detail?programId=${programId}&fields=bookingSlotDates,program,bookingSlotTimes`,
      {
        headers: { locale: 'en', ['Time-Zone']: 'Asia/Bangkok' },
        params: { locale: 'en' },
      }
    )
  }

  async create(body: DeepPartial<IBookingSettingDetail>) {
    return await httpClient.post<{
      data: IBookingSettingDetail
    }>(`/api/art-culture/cms/booking-settings`, body, {
      headers: { locale: 'en', ['Time-Zone']: 'Asia/Bangkok' },
    })
  }

  async update(id: string, body: DeepPartial<IBookingSettingDetail>) {
    const response = await httpClient.patch<{
      data: IBookingSettingDetail
    }>(`/api/art-culture/cms/booking-settings/${id}`, body, {
      headers: { locale: 'en', ['Time-Zone']: 'Asia/Bangkok' },
    })
    return response
  }

  async delete(id: string) {
    return await httpClient.delete(
      `/api/art-culture/cms/booking-settings/${id}`,
      {
        headers: { locale: 'en-US' },
      }
    )
  }
}

export const bookingSettingService = new BookingSettingService()
