import { KeyValue } from '@src/types/key-value'
import { useRef } from 'react'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import TextField from '@components/forms/components/text-field'
import DropdownField from '@components/forms/components/dropdown-field'
import DateTimeRangeField from '@components/forms/components/date-time-range-picker-field'
import {
  FilterSelfRedemption,
  IFilterSelfRedemption,
} from './self-redemption-interface'

type Props = {
  onFilter(e: IFilterSelfRedemption): void
  status?: KeyValue[]
  date?: string[]
}

export const SelfRedemptionFilter = (props: Props) => {
  const formRef = useRef<FormControllerRef<IFilterSelfRedemption>>(null)
  const defaultValue = new FilterSelfRedemption(undefined)
  const { onFilter, status } = props
  const onChange = () => {
    const value = formRef.current?.getValues() ?? defaultValue
    onFilter(value)
  }
  return (
    <div className='tw-flex tw-justify-between tw-items-center tw-flex-wrap tw-mb-10 tw-p-0'>
      <h3 className='lg:mb-0 tw-text-[#1B2559]'>Record list</h3>
      <FormController
        ref={formRef}
        onSubmit={() => {}}
        defualtValue={defaultValue}
      >
        <div className='flex gap-3 tw-flex-wrap'>
          <div className='flex w-full md:w-18rem'>
            <TextField
              lableClassName='w-full'
              name='filter'
              placeholder='Ticket ID, User ID, Name'
              onChange={onChange}
              style={{
                backgroundColor: '#F4F7FE',
                borderColor: '#F4F7FE',
              }}
            />
          </div>
          <div className='flex w-full md:w-14rem'>
            <DropdownField
              name='status'
              optionLabel='name'
              optionValue='value'
              options={status}
              placeholder='Status'
              className='w-full md:w-14rem'
              onChange={onChange}
            />
          </div>
          <div className='flex w-full md:w-22rem'>
            <DateTimeRangeField name='date' onChange={onChange} />
          </div>
        </div>
      </FormController>
    </div>
  )
}
