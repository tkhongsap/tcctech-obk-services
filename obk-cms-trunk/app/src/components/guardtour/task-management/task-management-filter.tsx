/* eslint-disable */
import { KeyValue } from '@src/types/key-value'
import { useRef, useState } from 'react'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import TextField from '@components/forms/components/text-field'

import DropdownField from '@components/forms/components/dropdown-field'
import {
  FilterTaskManagement,
  IFilterTaskManagement,
} from '@src/services/guardtour/task-management/model'
import DateTimeRangeField from '@components/forms/components/date-time-range-picker-field'
import CalendarField from '@components/forms/components/calendar-field'

type Props = {
  status: KeyValue[]
  members: KeyValue[]
  onFilter(e: IFilterTaskManagement): void
}

export const TaskManagementFilter = (props: Props) => {
  const formRef = useRef<FormControllerRef<IFilterTaskManagement>>(null)
  const defualtValue = new FilterTaskManagement(undefined)
  const { status, onFilter, members } = props

  const onChange = () => {
    const value = formRef.current?.getValues() ?? defualtValue

    if (Array.isArray(value.dateStart) && value.dateStart.length === 2) {
      let start = new Date(value.dateStart[0])
      let end = value.dateStart[1]
        ? new Date(value.dateStart[1])
        : new Date(value.dateStart[0])

      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)

      value.dateStart = start.toLocaleDateString('en-CA') + ' 00:00:00'
      value.dateEnd = end.toLocaleDateString('en-CA') + ' 23:59:59'
    } else {
      value.dateStart = undefined
      value.dateEnd = undefined
    }

    onFilter(value)
  }

  return (
    <FormController
      ref={formRef}
      defualtValue={defualtValue}
      onSubmit={() => {}}
    >
      <div className='flex flex-wrap justify-content-between align-items-center w-full mb-5'>
        <h3 className='tw-text-2xl tw-text-[#1B2559] tw-font-bold m-0 h-auto'>
          Task List
        </h3>
        <div className='flex gap-3'>
          <div className='flex flex-wrap gap-3'>
            <div className='flex w-full md:w-14rem'>
              <TextField
                name='filter'
                placeholder='Search Name'
                className='w-full'
                style={{
                  backgroundColor: '#F4F7FE',
                  borderColor: '#F4F7FE',
                }}
                onChange={onChange}
              />
            </div>
            <div className='flex w-full md:w-17rem'>
              <DropdownField
                name='status'
                options={status}
                optionLabel='name'
                optionValue='value'
                placeholder='Select status'
                className='w-full md:w-17rem'
                showClear
                onChange={onChange}
              />
            </div>
            <div className='flex w-full md:w-17rem'>
              <DropdownField
                name='memberId'
                options={members}
                optionLabel='name'
                optionValue='value'
                placeholder='Assign To'
                className='w-full md:w-17rem'
                showClear
                onChange={onChange}
              />
            </div>
            <div className='flex w-full md:w-17rem'>
              <CalendarField
                name='dateStart'
                placeholder='select start date - end date'
                onChange={onChange}
                showButtonBar
                selectionMode='range'
              />
            </div>
          </div>
        </div>
      </div>
    </FormController>
  )
}
