import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { useEffect } from 'react'
import { BookingHistoryTable } from './components/BookingHistoryTable'
import { FilterBookingHistory } from './components/FilterBookingHistory'

export interface BookingHistoryContentProps {
  programName: string
  showDate: string
  timeRange: string
}

export default function BookingHistoryContent({
  programName,
  showDate,
  timeRange,
}: BookingHistoryContentProps) {
  const { setMenuName, setMenuAction } = useLayoutContext()

  useEffect(() => {
    setMenuName(`Booking History: ${programName} on ${showDate}, ${timeRange}`)
  }, [programName, setMenuAction, setMenuName, showDate, timeRange])

  return (
    <div className='card' style={{ overflowY: 'auto', minWidth: '320px' }}>
      <FilterBookingHistory />
      <BookingHistoryTable />
    </div>
  )
}
