import CalendarField from '@components/forms/components/calendar-field'
import CheckBoxField from '@components/forms/components/checkbox-field'
import DropdownField from '@components/forms/components/dropdown-field'
import { useFormController } from '@components/forms/components/form-controller'
import TextField from '@components/forms/components/text-field'
import { KeyValue } from '@src/types/key-value'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { useEffect, useState } from 'react'

type Props = {
  id?: string
  categories: KeyValue[]
  triggerErrorState: () => void
}
const WhatHappeningDetail = (props: Props) => {
  const { setValue, watch } = useFormController()
  const [isAllTime, setIsAllTime] = useState<boolean>(false)
  const [isShowWarningDialog, setIsShowWarningDialog] = useState(false)
  const [warningMessage, setWarningMessage] = useState('')
  const [fieldToClear, setFieldToClear] = useState<string | null>(null)

  const showStartDate = watch('showStartDate')
  const showEndDate = watch('showEndDate')

  const eventStartDate = watch('eventStartDate')
  const eventEndDate = watch('eventEndDate')

  useEffect(() => {
    if (eventStartDate && eventEndDate) {
      setValue('eventStartDate', new Date(eventStartDate))
      setValue('eventEndDate', new Date(eventEndDate))
    }

    if (showStartDate && !isNaN(new Date(showStartDate).getTime())) {
      setValue('showStartDate', new Date(showStartDate))
    }

    if (showEndDate) {
      setValue('showEndDate', new Date(showEndDate))
    } else {
      setIsAllTime(true)
      setValue('alltime', true)
    }

    categories.length > 0 && setValue('categoryId', categories[0].value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const validateDates = (
    type: 'show' | 'event',
    dateField: 'start' | 'end',
    newDate: Date | null
  ) => {
    const showStart = watch('showStartDate')
    const showEnd = watch('showEndDate')
    const eventStart = watch('eventStartDate')
    const eventEnd = watch('eventEndDate')

    if (type === 'show') {
      if (
        dateField === 'end' &&
        showStart &&
        newDate &&
        new Date(newDate) < new Date(showStart)
      ) {
        setWarningMessage('Show End Date cannot be earlier than Start Date.')
        setFieldToClear('showEndDate')
        setIsShowWarningDialog(true)
      } else if (
        dateField === 'start' &&
        showEnd &&
        newDate &&
        new Date(showEnd) < new Date(newDate)
      ) {
        setWarningMessage('Show Start Date cannot be after End Date.')
        setFieldToClear('showStartDate')
        setIsShowWarningDialog(true)
      }
    } else {
      if (
        dateField === 'end' &&
        eventStart &&
        newDate &&
        new Date(newDate) < new Date(eventStart)
      ) {
        setWarningMessage('Event End Date cannot be earlier than Start Date.')
        setFieldToClear('eventEndDate')
        setIsShowWarningDialog(true)
      } else if (
        dateField === 'start' &&
        eventEnd &&
        newDate &&
        new Date(eventEnd) < new Date(newDate)
      ) {
        setWarningMessage('Event Start Date cannot be after End Date.')
        setFieldToClear('eventStartDate')
        setIsShowWarningDialog(true)
      }
    }

    if (type === 'event') {
      const newEventStart = dateField === 'start' ? newDate : eventStart
      const newEventEnd = dateField === 'end' ? newDate : eventEnd

      //eventStart <= eventEnd
      if (
        newEventStart &&
        newEventEnd &&
        new Date(newEventStart) > new Date(newEventEnd)
      ) {
        setWarningMessage(
          'Event Start Date must be earlier than Event End Date.'
        )
        setFieldToClear(
          dateField === 'start' ? 'eventStartDate' : 'eventEndDate'
        )
        setIsShowWarningDialog(true)
        return
      }
      // eventStart >= showStart
      if (
        showStart &&
        newEventStart &&
        new Date(newEventStart) < new Date(showStart)
      ) {
        setWarningMessage(
          'Event Start Date must be on or after Show Start Date.'
        )
        setFieldToClear('eventStartDate')
        setIsShowWarningDialog(true)
        return
      }

      //eventEnd <= showEnd
      if (showEnd && newEventEnd && new Date(newEventEnd) > new Date(showEnd)) {
        setWarningMessage('Event End Date must be on or before Show End Date.')
        setFieldToClear('eventEndDate')
        setIsShowWarningDialog(true)
        return
      }
      //eventStart <= showEnd
      if (
        newEventStart &&
        showEnd &&
        new Date(newEventStart) > new Date(showEnd)
      ) {
        setWarningMessage(
          'Event Start Date must be on or before Show End Date.'
        )
        setFieldToClear('eventStartDate')
        setIsShowWarningDialog(true)
        return
      }
    }
  }

  const { id, categories, triggerErrorState } = props
  return (
    <div className='card mb-5'>
      <div className='p-2'>
        <span className='flex text-xl font-bold text-primary-800 mb-5'>
          What&apos;s Happening details
        </span>
        <div className='formgrid grid'>
          <div className='field col-12 md:col-4'>
            <TextField
              disabled
              label="What's Happepning ID"
              name='id'
              value={id}
            />
          </div>
          <div className='field col-12 md:col-4'>
            <DropdownField
              label='Category'
              name='categoryId'
              options={categories}
              optionLabel='name'
              optionValue='value'
              placeholder='Category'
              className='w-full'
              showClear
              rules={{ required: 'Category is required.' }}
              disabled
            />
          </div>
        </div>
        <div className='formgrid grid'>
          <div className='field col-12 md:col-4'>
            <TextField
              label='Location'
              name='location'
              showRequiredLabel={true}
              rules={{ required: 'Location is required.' }}
              onChange={triggerErrorState}
            />
          </div>
        </div>
        <span className='flex text-xl font-bold text-primary-800 mt-3 mb-3'>
          Show Time
        </span>
        <div className='formgrid grid'>
          <div className='field col-12 md:col-4'>
            <CalendarField
              label='Start date and time'
              name='showStartDate'
              minDate={new Date()}
              rules={{ required: 'Show event start date is required.' }}
              onChange={(e) => {
                validateDates('show', 'start', e.value ?? null)
                triggerErrorState()
              }}
              showButtonBar
              dateFormat='d M yy'
            />
          </div>
        </div>
        <div className='formgrid grid'>
          <div className='field col-12 md:col-4'>
            <CalendarField
              label='End date and time'
              name='showEndDate'
              minDate={new Date()}
              rules={{
                required: isAllTime
                  ? undefined
                  : 'Show event end date is required.',
              }}
              disabled={isAllTime}
              onChange={(e) => {
                validateDates('show', 'end', e.value ?? null)
                triggerErrorState()
              }}
              showButtonBar
              dateFormat='d M yy'
            />
          </div>
          <div className='field col-12 md:col-4 flex'>
            <div
              className='flex gap-1 tw-align-middle'
              style={{ alignItems: 'center', marginTop: '0.35rem' }}
            >
              <CheckBoxField
                name={`alltime`}
                rules={{ required: undefined }}
                onChange={(e: boolean) => {
                  setIsAllTime(e)
                  setValue('alltime', e)
                  if (e) {
                    setValue('showEndDate', undefined)
                  }
                }}
                showRequiredLabel={false}
                disabled={false}
              />
              <span
                className='flex text-base font-bold text-primary-800 p-2 cursor-pointer'
                style={{ userSelect: 'none', marginTop: '0.6rem' }}
                onClick={() => {
                  setIsAllTime((prev) => {
                    const toggle = !prev
                    setValue('alltime', toggle)
                    if (toggle) {
                      setValue('showEndDate', undefined)
                    }
                    return toggle
                  })
                }}
              >
                Not specified
              </span>
            </div>
          </div>
        </div>
        <span className='flex text-xl font-bold text-primary-800 mt-3 mb-3'>
          Event Time
        </span>
        <div className='formgrid grid'>
          <div className='field col-12 md:col-4'>
            <CalendarField
              label='Start Event'
              name='eventStartDate'
              minDate={new Date()}
              rules={{ required: 'Event start date is required.' }}
              onChange={(e) => {
                validateDates('event', 'start', e.value ?? null)
                triggerErrorState()
              }}
              showButtonBar
              dateFormat='d M yy'
            />
          </div>
          <div className='field col-12 md:col-4'>
            <CalendarField
              label='End Event'
              name='eventEndDate'
              minDate={new Date()}
              rules={{ required: 'Event end date is required.' }}
              onChange={(e) => {
                validateDates('event', 'end', e.value ?? null)
                triggerErrorState()
              }}
              showButtonBar
              dateFormat='d M yy'
            />
          </div>
        </div>
      </div>
      <Dialog
        draggable={false}
        blockScroll={true}
        visible={isShowWarningDialog}
        style={{ minWidth: '30vw' }}
        onHide={() => {
          setIsShowWarningDialog(false)
          setFieldToClear(null)
        }}
        modal
        content={({ hide }) => (
          <div className='flex flex-column bg-white p-5 border-round-lg'>
            <span className='font-bold text-red-500'>{warningMessage}</span>
            <div className='flex gap-3 mt-5'>
              <Button
                className='bg-primary-blue'
                label='Got It'
                onClick={(e) => {
                  if (fieldToClear) {
                    setValue(fieldToClear, null)
                  }
                  hide(e)
                  setFieldToClear(null)
                }}
              />
            </div>
          </div>
        )}
      />
    </div>
  )
}

export default WhatHappeningDetail
