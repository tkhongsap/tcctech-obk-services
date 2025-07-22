import { IBookingSettingDetail } from '@src/services/art-and-culture/booking/model'
import { http, HttpHandler, HttpResponse } from 'msw'
import deepmerge from 'deepmerge'
import { generateArtCultureCmsApiURL } from '../__tests__/test-helper'
import { defaultBookingSettingDetailData } from './data-booking-setting-detail'
import {
  defaultBookingTransactionData,
  defaultBookingTransactionListData,
} from './data-booking-transaction'

export const NO_BOOKING_SETTING_PROGRAM_ID = '999'
export const NO_BOOKING_SLOT_TIME_ID = '999'

const mockGetBookingSettingDetailApiHandler = (
  data?: TestDeepPartial<IBookingSettingDetail>
) =>
  http.get(generateArtCultureCmsApiURL('/booking-settings/detail'), (ctx) => {
    const url = new URL(ctx.request.url)
    const programId = url.searchParams.get('programId') ?? ''
    if (programId === NO_BOOKING_SETTING_PROGRAM_ID) {
      return HttpResponse.json(
        {
          message: 'booking setting not found',
        },
        { status: 404 }
      )
    }
    return HttpResponse.json({
      data: deepmerge(
        { ...defaultBookingSettingDetailData, programId: Number(programId) },
        { ...data }
      ),
    })
  })

const mockGetBookingHistoryListApiHandler = () =>
  http.get(generateArtCultureCmsApiURL('/booking-transactions'), (ctx) => {
    const url = new URL(ctx.request.url)
    const bookingSlotTimeId = url.searchParams.get('bookingSlotTimeId') ?? ''
    if (bookingSlotTimeId === NO_BOOKING_SLOT_TIME_ID) {
      return HttpResponse.json(
        {
          message: 'bookingSlotTimeId not found',
        },
        { status: 404 }
      )
    }

    return HttpResponse.json({
      data: defaultBookingTransactionListData,
    })
  })

const mockGetBookingHistoryApiHandler = () =>
  http.get(generateArtCultureCmsApiURL('/booking-transactions/:id'), (ctx) => {
    const { id } = ctx.params
    if (id === NO_BOOKING_SLOT_TIME_ID) {
      return HttpResponse.json(
        {
          message: 'booking slot time id not found',
        },
        { status: 404 }
      )
    }

    return HttpResponse.json({
      data: defaultBookingTransactionData,
    })
  })

export const artCBookingSettingServiceHandlers: HttpHandler[] = [
  mockGetBookingSettingDetailApiHandler(),
  mockGetBookingHistoryListApiHandler(),
  mockGetBookingHistoryApiHandler(),
]
