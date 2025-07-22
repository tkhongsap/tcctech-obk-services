import { DatePicker } from 'antd'
import { Dayjs } from 'dayjs'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { useState } from 'react'
import { EnumBookingTimeStatus } from '../utils/constants'

const StatusList = {
  All: 'All',
  Waiting: EnumBookingTimeStatus.waiting,
  ['On going']: EnumBookingTimeStatus.on_going,
  Complete: EnumBookingTimeStatus.completed,
  ['Sold out']: EnumBookingTimeStatus.sold_out,
}

export const defaultShowTimeFilter: IShowTimeFilter = {
  begin: null,
  end: null,
  status: 'All',
}

export interface IShowTimeFilter {
  begin: Date | null
  end: Date | null
  status: EnumBookingTimeStatus | 'All'
}

interface Props {
  onFilterChange: (values: IShowTimeFilter) => any | void
}

export function ShowTimeFilter({ onFilterChange }: Props) {
  const [showTimeFilter, setShowTimeFilter] = useState(defaultShowTimeFilter)

  const setFieldValues = (name: string, value: any) => {
    const values = { ...showTimeFilter, [name]: value }
    setShowTimeFilter(values)
    onFilterChange(values)
  }

  const handleBeginDateChange = (date: Dayjs) => {
    setFieldValues('begin', date)
  }

  const handleEndDateChange = (date: Dayjs) => {
    setFieldValues('end', date)
  }

  const handleStatusChange = (event: DropdownChangeEvent) => {
    setFieldValues('status', event.value)
  }

  return (
    <div className='tw-flex flex-wrap gap-2'>
      <DatePicker
        placeholder='Begin Date'
        onChange={handleBeginDateChange}
        style={{
          padding: '11px',
          height: 'auto',
          width: 'auto',
          borderRadius: '7px',
          borderWidth: '1.1px',
          border: '1px solid #d1d5db',
        }}
        className='w-56 flex h-auto '
        showTime
      />

      <DatePicker
        placeholder='End Date'
        onChange={handleEndDateChange}
        style={{
          padding: '11px',
          height: 'auto',
          width: 'auto',
          borderRadius: '7px',
          borderWidth: '1.1px',
          border: '1px solid #d1d5db',
        }}
        className='w-56 flex h-auto '
        showTime
      />

      <Dropdown
        className='flex h-auto'
        style={{ width: '220px' }}
        options={Object.keys(StatusList).map((key) => ({
          label: key,
          value: StatusList[key as keyof typeof StatusList],
        }))}
        defaultValue={StatusList.All}
        onChange={handleStatusChange}
        value={showTimeFilter.status}
      />
    </div>
  )
}
