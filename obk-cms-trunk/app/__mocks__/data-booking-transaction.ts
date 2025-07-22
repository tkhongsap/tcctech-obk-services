import {
  IBookingTransactionDetail,
  IBookingTransactionList,
} from '@src/services/art-and-culture/booking/model'

export const defaultBookingTransactionListData: IBookingTransactionList[] = [
  {
    id: '7c2bb488-2599-415a-bfb7-de119f9e6d2c',
    createdAt: '2025-01-21T14:31:32.095559Z',
    updatedAt: '2025-01-21T14:31:32.095559Z',
    userId: 'bb92cb29-700b-4fc5-9faa-1389382ba5c5',
    programId: 34,
    orderId: '76SQKP',
    bookingSlotDateId: '4b6c030e-482e-4eb7-8941-22e69a78fec3',
    bookingSlotTimeId: 'b06105b9-0b42-4da6-be77-886a167b300d',
    bookerName: 'Uat Seven',
    bookerEmail: 'uat7@mtel.co.th',
    bookerPhoneNumber: null,
    ticketsCount: 1,
    showingStatus: 'past',
    slotDate: '2025-01-30T17:00:00Z',
    beginSlotTime: '2025-01-31T03:00:00Z',
    endSlotTime: '2025-01-31T11:00:00Z',
    price: 0,
  },
]

export const defaultBookingTransactionData: IBookingTransactionDetail = {
  id: '7c2bb488-2599-415a-bfb7-de119f9e6d2c',
  createdAt: '2025-01-21T14:31:32.095559Z',
  updatedAt: '2025-01-21T14:31:32.095559Z',
  userId: 'bb92cb29-700b-4fc5-9faa-1389382ba5c5',
  programId: 34,
  bookingSlotDateId: '4b6c030e-482e-4eb7-8941-22e69a78fec3',
  bookingSlotTimeId: 'b06105b9-0b42-4da6-be77-886a167b300d',
  orderId: '76SQKP',
  bookerName: 'Uat Seven',
  bookerEmail: 'uat7@mtel.co.th',
  bookerPhoneNumber: null,
  ticketsCount: 1,
  showingStatus: 'past',
  slotDate: '2025-01-30T17:00:00Z',
  beginSlotTime: '2025-01-31T03:00:00Z',
  endSlotTime: '2025-01-31T11:00:00Z',
  price: 0,
  program: {
    periodAt: '2024-12-16T06:13:58.407Z',
    periodEnd: '2025-03-01T13:22:54.653Z',
    artCTitle: 'One Bangkok Public Art Collection',
    locale: 'en',
    locations: ['One Bangkok Tower 4'],
    title: 'Latent Liquid',
    thumbnail:
      'https://obk-uat-image.s3.ap-southeast-1.amazonaws.com/1729786752543_zi42ta.jpg',
    banner:
      'https://obk-uat-image.s3.ap-southeast-1.amazonaws.com/1729786760501_dyj29m.jpg',
  },
  bookingTickets: [
    {
      id: '02d6f961-639a-42e2-a06e-497b816437a2',
      ticketNo: '26HZ8B',
      status: 'booked',
      checkedInAt: null,
    },
  ],
}
