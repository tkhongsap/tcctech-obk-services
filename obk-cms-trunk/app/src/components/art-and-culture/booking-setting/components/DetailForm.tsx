import DateTimeRangeField from '@components/forms/components/date-time-range-picker-field'
import DropdownField from '@components/forms/components/dropdown-field'
import EditorField from '@components/forms/components/editor-field'
import NumberField from '@components/forms/components/number-field'
import dayjs, { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'
import { LocaleTabs, LocaleTabsLabelMapper, TABS_LOCALE } from './LocaleTabs'

interface DetailFormProps {
  onLocaleChange: (locale: TABS_LOCALE) => void
  formLocale: TABS_LOCALE
  periodEnd?: Dayjs
  periodAt?: Dayjs
  defaultOpenBookingTime?: Date
}

export function DetailForm({
  formLocale,
  onLocaleChange,
  periodEnd,
  periodAt,
  defaultOpenBookingTime,
}: DetailFormProps) {
  const [isTickerPriceDisabled, setIsTicketPriceDisabled] = useState(false)

  const handleChangeTickerPriceDisabled = (startDate: Date) => {
    const current = new Date()
    setIsTicketPriceDisabled(current.getTime() >= startDate.getTime())
  }

  const handleChangeDateTimeRange = (props: any) => {
    if (defaultOpenBookingTime !== undefined) {
      handleChangeTickerPriceDisabled(props[0].toDate())
    }
  }

  useEffect(() => {
    if (defaultOpenBookingTime) {
      handleChangeTickerPriceDisabled(defaultOpenBookingTime)
    }
  }, [])

  return (
    <div className='card' data-testid='card-detail-form'>
      <div className='mb-4'>
        <h3 className='tw-text-[#273281] text-2xl font-bold'>
          Booking details:
        </h3>
      </div>

      <div className='flex flex-wrap gap-5'>
        <div className='w-full sm:w-28rem'>
          <DateTimeRangeField
            minDate={periodAt}
            maxDate={periodEnd}
            label='Start - End date and time'
            name='date'
            rules={{ required: 'Start - End date and time is required' }}
            onChange={handleChangeDateTimeRange}
            dateRangeProps={{
              showTime: {
                hideDisabledOptions: true,
                defaultValue: [
                  dayjs('00:00:00', 'HH:mm:ss'),
                  dayjs('23:59:59', 'HH:mm:ss'),
                ],
              },
            }}
          />
        </div>
        <div className='w-full sm:w-28rem'>
          <NumberField
            prefix='฿ '
            name='ticketPrice'
            placeholder='Ticket price'
            required
            label='Ticket price'
            rules={{ required: 'Ticket price is required' }}
            helperText='For a free ticket, please set the ticket price to ฿0'
            disabled={isTickerPriceDisabled}
          />
        </div>
        <div className='w-full sm:w-28rem'>
          <DropdownField
            label='Max tickets per transaction'
            name='maxTicketsPerTransaction'
            placeholder='Search'
            options={[1, 2, 3, 4]}
            rules={{ required: 'Max tickets per transaction is required' }}
          />
        </div>
      </div>
      <div className='mt-5 hidden'>
        <p className='tw-text-[#273281] font-bold'>Specific Condition </p>
        <LocaleTabs onLocaleChange={onLocaleChange} locale={formLocale} />
        <div className='mt-4'>
          {Object.values(TABS_LOCALE).map((key) => {
            if (key === formLocale) {
              return (
                <EditorField
                  key={key}
                  label={`Condition (${LocaleTabsLabelMapper[formLocale]})`}
                  name={`conditionText${formLocale}`}
                  style={{ height: '244px' }}
                />
              )
            }
          })}
        </div>
      </div>
    </div>
  )
}
