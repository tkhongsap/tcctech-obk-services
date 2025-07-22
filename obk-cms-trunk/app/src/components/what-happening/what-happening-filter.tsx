/* eslint-disable */
import { KeyValue } from '@src/types/key-value'

import { useRef, useState } from 'react'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import {
  FilterWhatHappening,
  IFilterWhatHappening,
} from '@src/services/what-happening/model'
import TextField from '@components/forms/components/text-field'
import CalendarField from '@components/forms/components/calendar-field'

type Props = {
  onFilter(e: IFilterWhatHappening): void
  search?: boolean
}

export const WhatHappeningFilter = (props: Props) => {
  const formRef = useRef<FormControllerRef<IFilterWhatHappening>>(null)
  const defualtValue = new FilterWhatHappening(undefined)
  const { onFilter } = props

  const onChange = () => {
    const value = formRef.current?.getValues() ?? defualtValue
    onFilter(value)
  }

  return (
    <div className='flex flex-wrap justify-content-between align-items-center w-full mb-5'>
      <h3 className='tw-text-2xl tw-text-[#1B2559] tw-font-bold m-0 h-auto'>
        List
      </h3>

      <div className='flex'>
        <FormController
          ref={formRef}
          defualtValue={defualtValue}
          onSubmit={() => {}}
        >
          <div className='flex flex-wrap gap-3'>
            <div className='flex w-full md:w-14rem'>
              <TextField
                name='filter'
                placeholder='Search'
                className='w-full'
                style={{
                  backgroundColor: '#F4F7FE',
                  borderColor: '#F4F7FE',
                }}
                onChange={onChange}
              />
            </div>
            <div className='flex w-full md:w-14rem'>
              <CalendarField
                name='date'
                placeholder='Event start date - end date'
                onChange={onChange}
                showButtonBar
                selectionMode='range'
              />
            </div>
          </div>
        </FormController>
      </div>
    </div>
  )
}
