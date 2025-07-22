import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { useCallback, useEffect, useState } from 'react'
import { bookingTransactionService } from '@src/services/art-and-culture/booking/booking-transaction-service'
import { IBookingTransactionList } from '@src/services/art-and-culture/booking/model'
import { ViewBookingHistoryButton } from './ViewBookingHistoryButton'

export const BookingHistoryTable = () => {
  const router = useRouter()

  const [bookingHistory, setBookingHistory] = useState<
    IBookingTransactionList[]
  >([])

  const fetchBookingHistory = useCallback(async () => {
    // eslint-disable-next-line unused-imports/no-unused-vars-ts
    const { programId, ...filters } = router.query

    try {
      const response = await bookingTransactionService.getList(
        programId as string,
        {
          ...filters,
        }
      )
      setBookingHistory(response.data.data || [])
    } catch (error) {
      console.error('Error fetching booking history:', error)
      setBookingHistory([])
    }
  }, [router.query])

  useEffect(() => {
    fetchBookingHistory()
  }, [fetchBookingHistory])

  return (
    <DataTable value={bookingHistory} style={{ minWidth: '1490px' }}>
      <Column
        field='bookerName'
        header='Name'
        headerStyle={{ border: 'none', minWidth: '415px', background: 'none' }}
        bodyStyle={{
          border: 'none',
          minWidth: '415px',
          color: '#273281',
          fontWeight: 700,
        }}
      ></Column>
      <Column
        field='bookerEmail'
        header='email'
        headerStyle={{
          border: 'none',
          minWidth: '415px',
          background: 'none',
          color: '#676B9B',
          fontWeight: 500,
        }}
        bodyStyle={{
          border: 'none',
          minWidth: '415px',
          color: '#676B9B',
          fontWeight: 500,
        }}
      ></Column>
      <Column
        field='ticketsCount'
        header='Ticket(s)'
        headerStyle={{
          border: 'none',
          minWidth: '160px',
          background: 'none',
          color: '#676B9B',
          fontWeight: 500,
        }}
        bodyStyle={{
          border: 'none',
          minWidth: '160px',
          color: '#676B9B',
          fontWeight: 500,
        }}
      ></Column>
      <Column
        field='updatedAt'
        header='Last update'
        headerStyle={{
          border: 'none',
          minWidth: '415px',
          background: 'none',
          color: '#676B9B',
          fontWeight: 500,
        }}
        bodyStyle={{
          border: 'none',
          minWidth: '415px',
          color: '#676B9B',
          fontWeight: 500,
        }}
        body={(props) => (
          <p>{dayjs(props.updatedAt).format('DD MMM YYYY, HH:mm')}</p>
        )}
      ></Column>
      <Column
        header='Action'
        body={(props) => {
          const dataTestId = `${BookingHistoryTableDataTestId.ViewBookingHistoryButton}_${props.id}`
          return (
            <ViewBookingHistoryButton
              dataTestId={dataTestId}
              key={props.id}
              id={props.id}
            />
          )
        }}
        bodyStyle={{
          border: 'none',
          display: 'flex',
          justifyContent: 'center',
          padding: 0,
        }}
        headerStyle={{
          border: 'none',
          background: 'none',
          width: '85px',
          textAlign: 'center',
        }}
      ></Column>
    </DataTable>
  )
}

export const BookingHistoryTableDataTestId = {
  ViewBookingHistoryButton: 'BookingHistoryTable-ViewBookingHistoryButton',
}
