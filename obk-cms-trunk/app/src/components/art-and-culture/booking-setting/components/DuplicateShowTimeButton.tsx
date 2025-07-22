import { UndefinableDayJs } from '@components/forms/components/date-time-range-picker-field'
import { Col, Row } from 'antd'
import { max } from 'date-fns'
import { every } from 'lodash'
import { useRouter } from 'next/router'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Dialog } from 'primereact/dialog'
import { FormEvent } from 'primereact/ts-helpers'
import { useEffect, useMemo, useState } from 'react'
import {
  BookingSlotDate,
  BookingSlotTimes,
  convertBookingSlotTimeToShowtimeItem,
  convertToRawData,
  createUniqueIdBookingShowTime,
} from '../utils/helper'
import {
  HeaderAssignShowtimes,
  SubHeaderShowtimeModal,
} from './HeaderAssignShowtimes'
import {
  defaultShowtimeItem,
  IShowtimeItem,
  TimeTicketField,
} from './TimeTicketField'

export interface UpdateItemProps {
  id: string
  values: BookingSlotTimes[]
}

interface DuplicateShowtimeButtonProps {
  currentBookingSlotDate: BookingSlotDate
  currentBookingSlotDates?: BookingSlotDate[]
  maxDate: UndefinableDayJs
  minDate: UndefinableDayJs
  onDuplicate: (
    insert: BookingSlotDate[],
    updateItems: UpdateItemProps[]
  ) => void
}

export function DuplicateShowTimeButton({
  currentBookingSlotDate,
  currentBookingSlotDates = [],
  minDate,
  maxDate,
  onDuplicate,
}: DuplicateShowtimeButtonProps) {
  const router = useRouter()
  const { query } = router
  const { programId } = query
  const [editShowtimeVisible, setEditShowtimeVisible] = useState(false)

  const [dates, setDates] = useState<Date[]>([])
  const [showtimeItems, setShowtimeItems] = useState<IShowtimeItem[]>([])
  const [showtimesIsValid, setShowTimeIsValid] = useState<boolean>(false)

  const [fieldsInvalid, setFieldsInvalid] = useState<{
    [key: string]: boolean
  }>({})
  const [hasFieldInvalid, setHasFieldInvalid] = useState(false)

  const [isValid, setIsValid] = useState(false)

  const handleClickEditShowtime = () => {
    const converted = convertBookingSlotTimeToShowtimeItem(
      currentBookingSlotDate.bookingSlotTimes
    )
    setShowtimeItems(converted)

    setEditShowtimeVisible(true)
  }

  const resetField = () => {
    setShowtimeItems([])
    setDates([])
    setFieldsInvalid({})
    setIsValid(false)
  }

  const handleChangeDate = (event: FormEvent<Date[]>) => {
    if (event.target.value) {
      if (event.target.value.length === 0) {
        setFieldsInvalid({})
        setIsValid(false)
        setShowtimeItems([])
      }
      const updatedDates = event.target.value.map((date) => {
        const updatedDate = new Date(date)
        updatedDate.setHours(0, 0, 0, 0)
        return updatedDate
      })

      setDates(updatedDates)
    }
  }

  const handleClickAddShowTime = () => {
    const added: IShowtimeItem[] = [
      ...showtimeItems,
      { ...defaultShowtimeItem, id: createUniqueIdBookingShowTime() },
    ]
    setShowtimeItems(added)
  }

  const changeShowTimeIsValid = (showTimeItems: IShowtimeItem[]) => {
    const allShowtimesValid =
      showTimeItems.length > 0 &&
      every(showTimeItems, (obj) =>
        every(obj, (value) => value !== null && value !== '')
      )
    setShowTimeIsValid(allShowtimesValid)
  }

  const handleClickRemoveItem = (id: string | null) => {
    if (id) {
      const removed = showtimeItems.filter((item) => item.id !== id)
      setShowtimeItems(removed)
      const temp = fieldsInvalid
      delete temp[id]

      setFieldsInvalid(temp)
      changeShowTimeIsValid(removed)
    }
  }

  const handleValuesChange = (values: IShowtimeItem, index: number) => {
    const temp = showtimeItems
    temp[index] = values

    setShowtimeItems(temp)
    changeShowTimeIsValid(temp)
  }

  const handleConfirmEditShowtime = () => {
    if (programId && typeof programId === 'string') {
      const insertDate: Date[] = []
      const update: UpdateItemProps[] = []
      for (const date of dates) {
        insertDate.push(date)
      }
      onDuplicate(
        convertToRawData(programId, insertDate, showtimeItems),
        update
      )
      setEditShowtimeVisible(false)
      resetField()
    }
  }

  const handleCloseModal = () => {
    if (!editShowtimeVisible) return
    setEditShowtimeVisible(false)
    resetField()
  }

  const handleChangeInvalid = (
    dates: Date[],
    hasFieldInvalid: boolean,
    showtimesIsValid: boolean
  ) => {
    const hasAtLeastOneDates = dates.length > 0
    setIsValid(hasAtLeastOneDates && showtimesIsValid && hasFieldInvalid)
  }

  const changeFieldsInvalid = (invalidFields: { [key: string]: boolean }) => {
    setHasFieldInvalid(Object.values(invalidFields).length === 0)
  }

  const handleFieldInvalidChange = (id: string, isValid: boolean) => {
    if (isValid) {
      const temp = fieldsInvalid
      delete temp[id]

      setFieldsInvalid(temp)
      changeFieldsInvalid(temp)
    } else {
      if (!(id in fieldsInvalid)) {
        const temp = { ...fieldsInvalid, [id]: isValid }
        setFieldsInvalid(temp)
        changeFieldsInvalid(temp)
      }
    }
  }

  useEffect(() => {
    handleChangeInvalid(dates, hasFieldInvalid, showtimesIsValid)
  }, [dates, hasFieldInvalid, showtimesIsValid])

  const footerContent = (
    <>
      <Button
        className='bg-primary-blue'
        onClick={handleConfirmEditShowtime}
        disabled={!isValid}
      >
        Save changes
      </Button>
      <Button className='text-primary-blue' onClick={handleCloseModal} outlined>
        Close without saving
      </Button>
    </>
  )

  const selectableStartDate = useMemo(() => {
    if (minDate) return max([minDate.toDate(), new Date()])
    return new Date()
  }, [minDate])

  return (
    <>
      <Dialog
        header={
          <h4 className='tw-text-[#273281] text-1xl mb-0'>
            Duplicate showtimes
          </h4>
        }
        closable={false}
        visible={editShowtimeVisible}
        style={{ width: '1120px', height: '888px' }}
        onHide={handleCloseModal}
        footer={footerContent}
      >
        <Row gutter={32}>
          <Col span={10}>
            <SubHeaderShowtimeModal seq={1} label='Select the date(s)' />
            <div
              className='flex tw-justify-between tw-items-center mb-5'
              style={{ height: '46px' }}
            >
              <p className='tw-text-lg tw-text-[#273281] m-0'>
                {dates.length} date(s) selected
              </p>
            </div>
            <Calendar
              inputStyle={{ overflowX: 'hidden' }}
              style={{
                width: '405px',
                overflow: 'hidden',
                caretColor: 'transparent',
              }}
              minDate={selectableStartDate}
              maxDate={maxDate?.toDate()}
              value={dates}
              name='dates'
              selectionMode='multiple'
              onChange={handleChangeDate}
              disabledDates={currentBookingSlotDates.map(
                ({ slotDate }) => slotDate
              )}
              inline
            />
          </Col>
          <Col span={14}>
            <HeaderAssignShowtimes
              onClickAddShowTime={handleClickAddShowTime}
              showtimeLength={showtimeItems.length}
              disableAddShowTime={dates.length === 0}
            />

            <div style={{ height: '46vh', overflow: 'auto' }}>
              {showtimeItems.map((item, index) => (
                <div key={item.id} className='flex mb-3'>
                  <TimeTicketField
                    onInvalid={(isValid) => {
                      if (item.id) handleFieldInvalidChange(item.id, isValid)
                    }}
                    onChange={(values) => handleValuesChange(values, index)}
                    showtimeItem={showtimeItems[index]}
                    upperShowtimeItem={showtimeItems[index - 1]}
                  />
                  <div
                    className='ml-4'
                    style={{
                      width: '1px',
                      backgroundColor: '#D9D9D9',
                    }}
                  ></div>
                  <Button
                    style={{ color: '#CD1A1A' }}
                    onClick={() => handleClickRemoveItem(item.id)}
                    text
                  >
                    X
                  </Button>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Dialog>

      <Button
        style={{ color: '#4318FF' }}
        type='button'
        onClick={handleClickEditShowtime}
        text
      >
        Duplicate
      </Button>
    </>
  )
}
