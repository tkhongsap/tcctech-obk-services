import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import LoadingScreen from '@components/loading/loadingScreen'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { bookingSettingService } from '@src/services/art-and-culture/booking/booking-setting-service'
import { IProgram } from '@src/services/art-and-culture/model'
import { defaultToastMessage } from '@src/utils/default-toast'
import dayjs from 'dayjs'
import { get, isEmpty } from 'lodash'
import { useRouter } from 'next/router'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { DetailForm } from './components/DetailForm'
import { TABS_LOCALE } from './components/LocaleTabs'
import { ShowTimeSection } from './components/ShowTimeSection'
import {
  apiFormatDate,
  BookingSlotDate,
  convertBookingSlotDateToBookingSlotParams,
} from './utils/helper'

const defaultValue = {
  date: null,
  ticketPrice: 0,
  maxTicketsPerTransaction: null,
  [`conditionText${TABS_LOCALE.En}`]: null,
  [`conditionText${TABS_LOCALE.Th}`]: null,
  [`conditionText${TABS_LOCALE.Cn}`]: null,
}

export interface CreateBookingContentProps {
  programName: string
  programId: string
  program: IProgram
}

export default function CreateBookingContent({
  programId,
  programName,
  program,
}: CreateBookingContentProps) {
  const { setMenuAction, setMenuName } = useLayoutContext()
  const router = useRouter()
  const formRef = useRef<FormControllerRef<any>>(null)

  const [formLocale, setFormLocale] = useState<TABS_LOCALE>(TABS_LOCALE.En)
  const [bookingSlotDates, setBookingSlotDates] = useState<BookingSlotDate[]>(
    []
  )
  const onBack = useCallback(
    () => router.replace(`/art-and-culture/programs/edit/${programId}`),
    [programId, router]
  )

  const handleFormLocaleChange = (locale: TABS_LOCALE) => {
    setFormLocale(locale)
  }

  const handleChangeBookingSlotDates = (values: BookingSlotDate[]) => {
    setBookingSlotDates(values)
  }

  const onSubmit = useCallback(
    (data: any) => {
      confirmDialog({
        message: `Are you sure you want to create booking of ${programName} ?`,
        closable: false,
        style: { width: '500px' },
        contentClassName: 'flex justify-content-center font-semibold text-lg',
        footer: ({ accept, reject }) => (
          <div className='flex justify-content-start gap-3'>
            <Button
              type='submit'
              label='Confirm'
              className='bg-primary-blue'
              onClick={async () => {
                try {
                  await bookingSettingService.create({
                    programId: Number(programId),
                    conditionTextEn: data.conditionTextEn || '',
                    conditionTextTh: data.conditionTextTh || '',
                    conditionTextCn: data.conditionTextCn || '',
                    bookingSlotDates:
                      convertBookingSlotDateToBookingSlotParams(
                        bookingSlotDates
                      ),
                    openBookingTime: apiFormatDate(data.date[0]),
                    closeBookingTime: apiFormatDate(data.date[1]),
                    ticketPrice: data.ticketPrice,
                    maxTicketsPerTransaction: data.maxTicketsPerTransaction,
                  })
                  accept()
                  toast.success('Booking Setting Success')
                  router.push(`/art-and-culture/programs/edit/${programId}`)
                } catch (error) {
                  const message = get(
                    error,
                    'response.data.message',
                    defaultToastMessage.error
                  )
                  toast.error(message)
                }
              }}
            />
            <Button
              className='text-primary-blue'
              label='Cancel'
              text
              onClick={reject}
            />
          </div>
        ),
      })
    },
    [bookingSlotDates, programId, programName, router]
  )

  const onInvalidSubmit = (err: any) => {
    toast.error(err)
  }

  const handleClickCancelChange = useCallback(() => {
    confirmDialog({
      header: (
        <p className='text-primary-700 tw-text-xl'>
          Are you sure you want to discard change for booking of {programName} ?
        </p>
      ),
      message: <p className='text-warning'>Any unsaved data will be lost.</p>,
      closable: false,
      style: { width: '640px', height: '266px' },
      footer: ({ accept, reject }) => (
        <div className='flex justify-content-start gap-3'>
          <Button
            severity='danger'
            type='button'
            label='Go back without saving data'
            style={{ backgroundColor: '#CD1A1A' }}
            onClick={async () => {
              onBack()
              accept()
            }}
          />
          <Button
            className='text-primary-blue'
            style={{ width: '120px' }}
            label='Cancel'
            outlined
            onClick={reject}
          />
        </div>
      ),
    })
  }, [onBack, programName])

  const buttonActionTemplate = useMemo(() => {
    return (
      <div className='flex gap-3 justify-content-center md:justify-content-start'>
        <Button
          className='px-5 bg-primary-blue'
          label='Create booking'
          onClick={formRef.current?.handleSubmit(onSubmit, onInvalidSubmit)}
          disabled={bookingSlotDates.length === 0}
        />

        <Button
          type='button'
          className='px-5 text-primary-blue'
          onClick={handleClickCancelChange}
          outlined
        >
          Cancel changes
        </Button>
      </div>
    )
  }, [bookingSlotDates.length, handleClickCancelChange, onSubmit])

  const periodEnd = useMemo(
    () => (program.periodEnd ? dayjs(program.periodEnd) : undefined),
    []
  )

  const periodAt = useMemo(
    () => (program.periodAt ? dayjs(program.periodAt) : undefined),
    []
  )

  useEffect(() => {
    setMenuAction(buttonActionTemplate)
    setMenuName(`Create Booking: ${programName}`)
  }, [buttonActionTemplate, programName, setMenuAction, setMenuName])

  if (isEmpty(programName) || isEmpty(programId)) return <LoadingScreen />

  return (
    <FormController
      ref={formRef}
      defualtValue={defaultValue}
      onSubmit={onSubmit}
      onInvalid={onInvalidSubmit}
    >
      <DetailForm
        formLocale={formLocale}
        onLocaleChange={handleFormLocaleChange}
        periodAt={periodAt}
        periodEnd={periodEnd}
      />
      <ShowTimeSection
        values={bookingSlotDates}
        onValueChange={handleChangeBookingSlotDates}
        periodAt={periodAt}
        periodEnd={periodEnd}
      />

      <div className='mt-4'>{buttonActionTemplate}</div>
    </FormController>
  )
}
