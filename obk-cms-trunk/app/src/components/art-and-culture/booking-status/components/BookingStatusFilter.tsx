import { EnumBookingTimeStatus } from '@components/art-and-culture/booking-setting/utils/constants'
import {
  apiFormatDate,
  dayjsTz,
} from '@components/art-and-culture/booking-setting/utils/helper'
import DropdownField from '@components/forms/components/dropdown-field'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import TextField from '@components/forms/components/text-field'
import Heading from '@components/typography/heading'
import { IBookingStatusQueryParams } from '@src/services/art-and-culture/booking/model'
import { DatePicker } from 'antd'
import { Dayjs } from 'dayjs'

import { isEmpty } from 'lodash'

import { useRouter } from 'next/router'
import { useMemo, useRef } from 'react'

const defaultValue = {
  status: undefined,
  beginDate: undefined,
  endDate: undefined,
  programTitle: undefined,
}

const StatusList = {
  All: 'All',
  Waiting: EnumBookingTimeStatus.waiting,
  ['On going']: EnumBookingTimeStatus.on_going,
  Complete: EnumBookingTimeStatus.completed,
  ['Sold out']: EnumBookingTimeStatus.sold_out,
}

export const BookingStatusFilter = () => {
  const router = useRouter()
  const formRef =
    useRef<FormControllerRef<Partial<IBookingStatusQueryParams>>>(null)
  const currentQuery = router.query

  const handleChangeValues = () => {
    const values: Partial<IBookingStatusQueryParams> =
      formRef.current?.getValues() ?? defaultValue
    const currentPath = router.pathname
    const newQueryParams = { ...currentQuery }

    const updateQueryParam = (
      key: keyof IBookingStatusQueryParams,
      value?: string
    ) => {
      if (typeof value === 'string' && !isEmpty(value)) {
        newQueryParams[key] = value.replace(/\s+/g, '')
      } else {
        delete newQueryParams[key]
      }
    }

    updateQueryParam(
      'status',
      values.status === 'All' ? undefined : values.status
    )
    updateQueryParam(
      'beginDate',
      values.beginDate ? apiFormatDate(new Date(values.beginDate)) : undefined
    )
    updateQueryParam(
      'endDate',
      values.endDate ? apiFormatDate(new Date(values.endDate)) : undefined
    )
    updateQueryParam('programTitle', values.programTitle)

    router.push({
      pathname: currentPath,
      query: newQueryParams,
    })
  }

  const handleDateChange = (field: keyof typeof defaultValue, date: Dayjs) => {
    formRef.current?.setValue(field, date?.toDate())
    handleChangeValues()
  }

  const beginDateValue = useMemo(() => {
    const begin = currentQuery['beginDate'] as string
    if (begin === undefined) return
    return dayjsTz(begin)
  }, [currentQuery])

  const endDateValue = useMemo(() => {
    const end = currentQuery['endDate'] as string
    if (end === undefined) return
    return dayjsTz(end)
  }, [currentQuery])

  return (
    <FormController
      ref={formRef}
      defualtValue={{
        status: (currentQuery['status'] as EnumBookingTimeStatus) || 'All',
        beginDate: currentQuery['beginDate']
          ? new Date(currentQuery['beginDate'] as string)
          : undefined,
        endDate: currentQuery['endDate']
          ? new Date(currentQuery['endDate'] as string)
          : undefined,
        programTitle: currentQuery['programTitle'] as string,
      }}
      onSubmit={() => {}}
    >
      <div className='tw-flex justify-content-between align-items-center flex-wrap gap-6'>
        <Heading
          data-testid={BookingStatusFilterDataTestId.title}
          as='h3'
          color='#1B2559'
        >
          List
        </Heading>
        <div className='tw-flex gap-4 flex-wrap mb-5'>
          <div style={{ width: '450px' }}>
            <TextField
              className='m-0'
              name='programTitle'
              placeholder='Program name'
              onChange={handleChangeValues}
            />
          </div>
          <DatePicker
            placeholder='Begin Date'
            onChange={(date: Dayjs) => handleDateChange('beginDate', date)}
            name='beginDate'
            style={{
              padding: '11px',
              height: 'auto',
              width: 'auto',
              borderRadius: '7px',
              borderWidth: '1.1px',
              border: '1px solid #d1d5db',
              marginTop: '8px',
            }}
            value={beginDateValue}
            showTime
          />

          <DatePicker
            placeholder='End Date'
            onChange={(e) => handleDateChange('endDate', e)}
            name='endDate'
            style={{
              padding: '11px',
              height: 'auto',
              width: 'auto',
              borderRadius: '7px',
              borderWidth: '1.1px',
              border: '1px solid #d1d5db',
              marginTop: '8px',
            }}
            value={endDateValue}
            showTime
          />

          <div style={{ width: '220px' }}>
            <DropdownField
              className='flex h-auto'
              name='status'
              options={Object.keys(StatusList).map((key) => ({
                label: key,
                value: StatusList[key as keyof typeof StatusList],
              }))}
              optionValue='value'
              optionLabel='label'
              onChange={handleChangeValues}
            />
          </div>
        </div>
      </div>
    </FormController>
  )
}

export const BookingStatusFilterDataTestId = {
  title: 'BookingStatusFilterData-title',
}
