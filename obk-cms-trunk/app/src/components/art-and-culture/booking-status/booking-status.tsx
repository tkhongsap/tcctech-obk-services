import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { useEffect } from 'react'
import { BookingStatusFilter } from './components/BookingStatusFilter'
import { BookingStatusTable } from './components/BookingStatusTable'

export function BookingStatusContent() {
  const { setMenuName } = useLayoutContext()
  useEffect(() => {
    setMenuName('Booking Status')
  }, [setMenuName])

  return (
    <div
      className='card'
      style={{
        minWidth: '320px',
      }}
    >
      <BookingStatusFilter />
      <BookingStatusTable />
    </div>
  )
}
