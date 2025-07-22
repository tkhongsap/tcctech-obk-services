import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import Loading from '@components/loading'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { defaultToastMessage } from '@src/utils/default-toast'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { useRouter } from 'next/router'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { DetailForm } from './components/DetailForm'
import { TABS_LOCALE } from './components/LocaleTabs'
import { ShowTimeSection } from './components/ShowTimeSection'
import { CreateBookingContentProps } from './create-booking'
import { bookingSettingService } from '@src/services/art-and-culture/booking/booking-setting-service'
import { IBookingSettingDetail } from '@src/services/art-and-culture/booking/model'
import {
  apiFormatDate,
  BookingSlotDate,
  convertBookingResponseToClientData,
  convertBookingSlotDateToBookingSlotParams,
} from './utils/helper'

export interface EditBookingContentProps extends CreateBookingContentProps {
  fetchedData: IBookingSettingDetail
}
export default function EditBookingContent({
  fetchedData,
  programId,
  programName,
  program,
}: EditBookingContentProps) {
  const { setMenuAction, setMenuName } = useLayoutContext()
  const router = useRouter()
  const formRef = useRef<FormControllerRef<any>>(null)

  const [formLocale, setFormLocale] = useState<TABS_LOCALE>(TABS_LOCALE.En)
  const [bookingSlotDates, setBookingSlotDates] = useState<BookingSlotDate[]>(
    []
  )
  const [isInitial, setIsInitial] = useState(false)

  const onBack = useCallback(
    () => router.push(`/art-and-culture/programs/edit/${programId}`),
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
        message: `Are you sure you want to edit booking of ${programName} ?`,
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
                  await bookingSettingService.update(fetchedData.id, {
                    programId: fetchedData.programId,
                    conditionTextCn: data.conditionTextCn,
                    conditionTextTh: data.conditionTextTh,
                    conditionTextEn: data.conditionTextEn,
                    openBookingTime: apiFormatDate(data.date[0]),
                    closeBookingTime: apiFormatDate(data.date[1]),
                    ticketPrice: data.ticketPrice,
                    maxTicketsPerTransaction: data.maxTicketsPerTransaction,
                    bookingSlotDates:
                      convertBookingSlotDateToBookingSlotParams(
                        bookingSlotDates
                      ),
                    id: fetchedData.id,
                  })

                  onBack()
                  toast.success('Save Booking Setting Success')
                } catch (error) {
                  const message = get(
                    error,
                    'response.data.message',
                    defaultToastMessage.error
                  )
                  toast.error(message)
                }

                accept()
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
    [
      bookingSlotDates,
      fetchedData.id,
      fetchedData.programId,
      onBack,
      programName,
    ]
  )

  const handleDeleteBookingSetting = useCallback(() => {
    confirmDialog({
      header: (
        <p className='text-primary-700 tw-text-xl'>
          Are you sure you want to delete booking of {programName} ?
        </p>
      ),
      message: <p className='text-danger'>THIS ACTION CANNOT BE UNDONE.</p>,
      closable: false,
      style: { width: '640px', height: '300px' },
      footer: ({ accept, reject }) => (
        <div className='flex justify-content-start gap-3'>
          <Button
            severity='danger'
            type='button'
            label='Delete this booking'
            style={{ backgroundColor: '#CD1A1A' }}
            onClick={async () => {
              try {
                await bookingSettingService.delete(fetchedData.id)
                toast.success('Delete Booking Setting Success')
                onBack()
              } catch (error) {
                const message = get(
                  error,
                  'response.data.message',
                  defaultToastMessage.error
                )
                toast.error(message)
              }

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
  }, [fetchedData.id, onBack, programName])

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
          label='Save changes'
          onClick={formRef.current?.handleSubmit(onSubmit)}
          disabled={bookingSlotDates.length === 0}
        />
        <Button
          type='button'
          severity='danger'
          className='px-5'
          label='Delete booking'
          onClick={handleDeleteBookingSetting}
          outlined
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
  }, [
    bookingSlotDates.length,
    handleClickCancelChange,
    handleDeleteBookingSetting,
    onSubmit,
  ])

  const defaultValue = useMemo(() => {
    if (fetchedData) {
      return {
        date: [
          dayjs(fetchedData?.openBookingTime),
          dayjs(fetchedData?.closeBookingTime),
        ],
        ticketPrice: fetchedData?.ticketPrice,
        maxTicketsPerTransaction: fetchedData?.maxTicketsPerTransaction,
        [`conditionText${TABS_LOCALE.En}`]: fetchedData?.conditionTextEn,
        [`conditionText${TABS_LOCALE.Th}`]: fetchedData?.conditionTextTh,
        [`conditionText${TABS_LOCALE.Cn}`]: fetchedData?.conditionTextCn,
      }
    }
  }, [fetchedData])

  const periodEnd = useMemo(
    () => (program.periodEnd ? dayjs(program.periodEnd) : undefined),
    [program.periodEnd]
  )

  const periodAt = useMemo(
    () => (program.periodAt ? dayjs(program.periodAt) : undefined),
    [program.periodAt]
  )

  useEffect(() => {
    setMenuAction(buttonActionTemplate)
    setMenuName(`Edit Booking: ${programName}`)
  }, [buttonActionTemplate, programName, setMenuAction, setMenuName])

  useEffect(() => {
    if (!isInitial) {
      setBookingSlotDates(
        convertBookingResponseToClientData(
          fetchedData.bookingSlotDates,
          fetchedData.openBookingTime
        )
      )
      setIsInitial(true)
    }
  }, [bookingSlotDates.length, fetchedData])

  if (!defaultValue) return <Loading.LoadingScreen />

  return (
    <FormController
      ref={formRef}
      defualtValue={defaultValue}
      onSubmit={onSubmit}
    >
      <DetailForm
        formLocale={formLocale}
        onLocaleChange={handleFormLocaleChange}
        periodEnd={periodEnd}
        periodAt={periodAt}
        defaultOpenBookingTime={new Date(fetchedData.openBookingTime)}
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
