import { UndefinableDayJs } from '@components/forms/components/date-time-range-picker-field'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { useCallback, useMemo, useState } from 'react'
import {
  BookingSlotDate,
  BookingSlotTimes,
  convertRawDataToTreeNode,
  convertToTimeRageFormat,
  formatDate,
} from '../utils/helper'
import { CreateShowtimeButton } from './CreateShowTimeButton'
import {
  defaultShowTimeFilter,
  IShowTimeFilter,
  ShowTimeFilter,
} from './ShowTimeFilter'
import { ShowTimeTable } from './ShowTimeTable'
import { UpdateItemProps } from './DuplicateShowTimeButton'

interface ShowTimeSection {
  values: BookingSlotDate[]
  onValueChange: (values: BookingSlotDate[]) => void
  periodAt: UndefinableDayJs
  periodEnd: UndefinableDayJs
}

export function ShowTimeSection({
  values: bookingSlotDates,
  onValueChange,
  periodAt,
  periodEnd,
}: ShowTimeSection) {
  const [currentFilter, setCurrentFilter] = useState<IShowTimeFilter>(
    defaultShowTimeFilter
  )
  const handleChangeShowTimeFilter = (values: IShowTimeFilter) => {
    setCurrentFilter(values)
  }

  const filterBookingSlotTimes = (
    bookingSlotDates: BookingSlotDate[],
    filter: typeof defaultShowTimeFilter
  ): BookingSlotDate[] => {
    return bookingSlotDates
      .map((bookingSlotDate) => ({
        ...bookingSlotDate,
        bookingSlotTimes: bookingSlotDate.bookingSlotTimes.filter(
          (slotTime) => {
            const isWithinTimeRange =
              (!filter.begin || slotTime.beginSlotTime >= filter.begin) &&
              (!filter.end || slotTime.endSlotTime <= filter.end)

            const isStatusMatch =
              filter.status === 'All' || slotTime.status === filter.status

            return isWithinTimeRange && isStatusMatch
          }
        ),
      }))
      .filter((bookingSlotDate) => bookingSlotDate.bookingSlotTimes.length > 0)
  }

  const showtimeList = useMemo(() => {
    const filtered = filterBookingSlotTimes(bookingSlotDates, currentFilter)
    return convertRawDataToTreeNode(filtered)
  }, [bookingSlotDates, currentFilter])

  const handleDeleteBookingSlotTimes = (value: BookingSlotTimes) => {
    const bookingSlotDateIndex = bookingSlotDates.findIndex(
      (item) => item.id === value.bookingSlotDateId
    )
    const bookingSlotDate = bookingSlotDates[bookingSlotDateIndex]

    confirmDialog({
      message: `Are you sure you want to delete showtimes on  ${formatDate(
        bookingSlotDate.slotDate
      )} ${convertToTimeRageFormat(
        value.beginSlotTime.toString(),
        value.endSlotTime.toString()
      )} ?`,
      closable: false,
      style: { width: '700px' },
      contentClassName: 'flex justify-content-center font-semibold text-lg',
      footer: ({ accept, reject }) => (
        <div className='flex justify-content-start gap-3'>
          <Button
            severity='danger'
            label='Delete'
            className='bg-error'
            onClick={async () => {
              if (bookingSlotDateIndex !== -1) {
                const bookingSlotDate = bookingSlotDates[bookingSlotDateIndex]

                const newBookingSlotTimes =
                  bookingSlotDate.bookingSlotTimes.filter(
                    (item) => item.id !== value.id
                  )

                const updatedBookingSlotDates = [...bookingSlotDates]
                if (newBookingSlotTimes.length === 0) {
                  updatedBookingSlotDates.splice(bookingSlotDateIndex, 1)
                } else {
                  updatedBookingSlotDates[bookingSlotDateIndex] = {
                    ...bookingSlotDate,
                    bookingSlotTimes: newBookingSlotTimes,
                  }
                }

                onValueChange(updatedBookingSlotDates)
              }
              accept()
            }}
          />
          <Button
            className='text-primary-blue'
            label='Cancel'
            outlined
            onClick={reject}
          />
        </div>
      ),
    })
  }

  const handleUpdateBookingSlotTimes = (
    id: string,
    values: BookingSlotTimes[]
  ) => {
    const index = bookingSlotDates.findIndex((slot) => slot.id === id)
    if (index === -1) return

    const updatedBookingSlotDates = [...bookingSlotDates]

    if (values.length === 0) {
      updatedBookingSlotDates.splice(index, 1)
    } else {
      updatedBookingSlotDates[index] = {
        ...updatedBookingSlotDates[index],
        bookingSlotTimes: values,
      }
    }

    onValueChange(updatedBookingSlotDates)
  }

  const handleValuesChange = useCallback(
    (values: BookingSlotDate[]) => {
      const newValues = [...values, ...bookingSlotDates]
      onValueChange(newValues)
    },
    [bookingSlotDates, onValueChange]
  )

  const handleDuplicateBookingSlotDates = (
    insert: BookingSlotDate[],
    updateItems: UpdateItemProps[]
  ) => {
    const updatedBookingSlotDates = [...bookingSlotDates]

    // Insert new items
    insert.forEach((item) => {
      if (!updatedBookingSlotDates.some((slot) => slot.id === item.id)) {
        updatedBookingSlotDates.push(item)
      }
    })

    // Update existing items
    updateItems.forEach(({ id, values }) => {
      const index = updatedBookingSlotDates.findIndex((slot) => slot.id === id)
      if (index !== -1) {
        updatedBookingSlotDates[index] = {
          ...updatedBookingSlotDates[index],
          bookingSlotTimes: values,
        }
      }
    })

    onValueChange(updatedBookingSlotDates)
  }

  return (
    <div className='card' data-testid='card-showtime-section'>
      <div className='tw-flex justify-content-between align-items-center flex-wrap gap-6 mb-4'>
        <h3 className='tw-text-[#273281] text-2xl font-bold mb-0'>Showtime</h3>
        <div className='flex' style={{ width: 'auto' }}>
          <ShowTimeFilter onFilterChange={handleChangeShowTimeFilter} />
          <div
            className='ml-4'
            style={{ width: '1px', background: '#A3AED0' }}
          />
          <div className='flex ml-4'>
            <CreateShowtimeButton
              selectedDate={bookingSlotDates.map((item) => item.slotDate)}
              onCreate={handleValuesChange}
              minDate={periodAt}
              maxDate={periodEnd}
            />
          </div>
        </div>
      </div>
      <ShowTimeTable
        onDeleteBookingSlotTimes={handleDeleteBookingSlotTimes}
        data={showtimeList}
        onEditShowtime={handleUpdateBookingSlotTimes}
        currentBookingSlotDates={bookingSlotDates}
        onDuplicateShowtime={handleDuplicateBookingSlotDates}
        minDate={periodAt}
        maxDate={periodEnd}
      />
    </div>
  )
}
