import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import TextField from '@components/forms/components/text-field'
import { IBookingTransactionQuery } from '@src/services/art-and-culture/booking/booking-transaction-service'
import { useRouter } from 'next/router'
import { useRef } from 'react'

export const FilterBookingHistory = () => {
  const router = useRouter()
  const formRef = useRef<FormControllerRef<IBookingTransactionQuery>>(null)
  const currentQuery = router.query

  const handleChangeValues = () => {
    const values: IBookingTransactionQuery = formRef.current?.getValues() ?? {
      bookerName: '',
      bookerEmail: '',
    }

    const currentPath = router.pathname
    const newQueryParams = { ...currentQuery }

    const updateQueryParam = (
      key: keyof IBookingTransactionQuery,
      value?: string
    ) => {
      if (value && value.trim()) {
        newQueryParams[key] = value.replace(/\s+/g, '')
      } else {
        delete newQueryParams[key]
      }
    }

    updateQueryParam('bookerName', values.bookerName)
    updateQueryParam('bookerEmail', values.bookerEmail)

    router.push({
      pathname: currentPath,
      query: newQueryParams,
    })
  }

  return (
    <FormController
      ref={formRef}
      defualtValue={{
        bookerEmail: currentQuery['bookerEmail'] as string,
        bookerName: currentQuery['bookerName'] as string,
      }}
      onSubmit={() => {}}
    >
      <div className='tw-flex justify-content-end gap-4 flex-wrap mb-5'>
        <TextField
          data-testid={FilterBookingHistoryDataTestId.bookerName}
          className='sm:w-14rem'
          style={{ minWidth: '220px' }}
          name='bookerName'
          placeholder='Booker name'
          onChange={handleChangeValues}
        />
        <TextField
          data-testid={FilterBookingHistoryDataTestId.bookerEmail}
          className='sm:w-14rem'
          style={{ minWidth: '220px' }}
          name='bookerEmail'
          placeholder='Booker email'
          onChange={handleChangeValues}
        />
      </div>
    </FormController>
  )
}

export const FilterBookingHistoryDataTestId = {
  bookerName: 'FilterBookingHistory-bookerName',
  bookerEmail: 'FilterBookingHistory-bookerEmail',
}
