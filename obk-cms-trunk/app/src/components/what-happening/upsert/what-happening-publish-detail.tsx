import CalendarField from '@components/forms/components/calendar-field'
import { validateDateNotPass } from '@src/utils/validation'
import { Message } from 'primereact/message'
import React from 'react'

type Props = {
  errorState: number
  triggerErrorState: () => void
}

const WhatHappeningPublishDetail = (props: Props) => {
  const { errorState, triggerErrorState } = props

  return (
    <div className='card mb-5'>
      <div className='p-2'>
        <span className='flex text-xl font-bold text-primary-800 mb-5'>
          Publish details
        </span>
        {errorState > 0 && (
          <Message
            className='mb-3'
            severity='error'
            content={
              <>
                <span className='font-bold'>Missing Fields: </span>
                &nbsp; Required fields are empty or contain invalid data. Please
                check your input.
              </>
            }
          />
        )}
        <div className='field col-12 md:col-4'>
          <CalendarField
            label='Publish Date'
            name='publishDate'
            minDate={new Date()}
            rules={{
              required: 'Schedule date and time is required.',
              validate: validateDateNotPass,
            }}
            onChange={triggerErrorState}
            showButtonBar
            showTime
          />
        </div>
      </div>
    </div>
  )
}

export default WhatHappeningPublishDetail
