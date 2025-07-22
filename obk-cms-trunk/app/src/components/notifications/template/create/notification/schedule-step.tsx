import CalendarField from '@components/forms/components/calendar-field'
import DropdownField from '@components/forms/components/dropdown-field'
import TextField from '@components/forms/components/text-field'
import { KeyValue } from '@src/types/key-value'
import { Button } from 'primereact/button'
import { MouseEventHandler } from 'react'

type Props = {
  categories: KeyValue[]
  isAnnouncement?: boolean
  onBackClick?: MouseEventHandler<HTMLButtonElement>
}

const isNotFutureDate = (date: Date) => {
  if (date < new Date()) {
    return 'Please select a future date and time'
  }
  return undefined
}

export default function ScheduleStep(props: Props) {
  const { categories, isAnnouncement = false, onBackClick } = props
  return (
    <div className='mb-5'>
      <span className='flex text-xl font-bold pl-5 lg:pl-2 pt-5 text-primary-800 mb-4'>
        Scheduling
      </span>
      <div className='flex w-full mt-2 p-5 lg:p-2'>
        <div className='flex flex-column gap-4 w-full lg:w-24rem'>
          <div className='flex flex-column gap-1 w-full'>
            <TextField name='id' disabled label='Notification ID' />
          </div>
          <div className='flex flex-column gap-1 w-full'>
            <DropdownField
              name='message_category_id'
              label='Notification Category'
              options={categories}
              optionLabel='name'
              optionValue='value'
              placeholder='Choose category'
              rules={{ required: 'Please select category' }}
              disabled={isAnnouncement}
            />
          </div>
          <div className='flex flex-column gap-1 w-full'>
            <CalendarField
              label='Schedule date and time'
              name='scheduled_at'
              minDate={new Date()}
              showTime
              rules={{
                required: 'Schedule date and time is required.',
                validate: isNotFutureDate,
              }}
            />
          </div>
        </div>
      </div>
      <div className='flex justify-content-end w-full gap-3 px-5 mt-5'>
        <Button
          type='button'
          className='px-5'
          label='Back'
          outlined
          onClick={(e) => {
            onBackClick && onBackClick(e)
          }}
        />
        <Button
          type='submit'
          className='px-5 bg-primary-blue'
          label='Approve this notification'
        />
      </div>
    </div>
  )
}
