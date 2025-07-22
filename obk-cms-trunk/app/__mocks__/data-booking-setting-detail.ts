import { IBookingSettingDetail } from '@src/services/art-and-culture/booking/model'

export const defaultBookingSettingDetailData: IBookingSettingDetail = {
  id: 'e91eb319-bc21-40d6-a464-13d3dbfc2469',
  programId: 24,
  createdAt: '2024-12-01T06:06:48.494411Z',
  updatedAt: '2024-12-01T06:10:05.735193Z',
  conditionTextEn: '',
  conditionTextTh: '',
  conditionTextCn: '',
  ticketPrice: 190,
  maxTicketsPerTransaction: 4,
  openBookingTime: '2024-11-30T17:00:00Z',
  closeBookingTime: '2025-11-29T17:00:00Z',
  program: {
    periodAt: '2024-11-13T06:44:35.076Z',
    periodEnd: null,
    artCTitle: 'One Bangkok Public Art Collection',
    locale: 'en',
    locations: ['abc'],
    title: "It Is, It Isn't",
    thumbnail:
      'https://obk-uat-image.s3.ap-southeast-1.amazonaws.com/1729776288713_9tqsp.jpg',
    banner:
      'https://obk-uat-image.s3.ap-southeast-1.amazonaws.com/1729776293182_i75bxd.jpg',
  },
  bookingSlotDates: [
    {
      id: '7c5cb18a-fc8a-4a3f-ba4a-ad79eece815d',
      programId: 24,
      bookingSettingId: 'e91eb319-bc21-40d6-a464-13d3dbfc2469',
      createdAt: '2024-12-01T06:10:06.030417Z',
      updatedAt: '2024-12-01T06:10:06.030417Z',
      slotDate: '2024-11-30T17:00:00Z',
      bookingSlotTimes: [
        {
          id: '0177c309-d5da-42f8-ac1a-d1e79dc90215',
          bookingSettingId: 'e91eb319-bc21-40d6-a464-13d3dbfc2469',
          programId: 24,
          bookingSlotDateId: '7c5cb18a-fc8a-4a3f-ba4a-ad79eece815d',
          createdAt: '2024-12-01T06:10:06.081394Z',
          updatedAt: '2024-12-01T08:43:05.506562Z',
          beginSlotTime: '2024-12-01T08:40:00Z',
          endSlotTime: '2024-12-01T09:30:00Z',
          maxTicketsPerSlotTime: 10,
          bookedTicketsCount: 10,
          status: 'sold_out',
          checkedInTicketsCount: 0,
        },
      ],
    },
  ],
}
