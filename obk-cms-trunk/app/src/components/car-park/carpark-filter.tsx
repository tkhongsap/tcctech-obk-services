import { KeyValue } from '@src/types/key-value'

import { useRef } from 'react'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import TextField from '@components/forms/components/text-field'
import DropdownField from '@components/forms/components/dropdown-field'
import DateTimeRangeField from '@components/forms/components/date-time-range-picker-field'
import { FilterParkingAccess, IFilterParkingAccess } from './carpark-interface'

type Props = {
  date?: string[]
  gate?: KeyValue[]
  onFilter(e: IFilterParkingAccess): void
  type?: KeyValue[]
  title?: string
  search?: boolean
  data?: any
}

export const ParkingAccessFilter = (props: Props) => {
  const formRef = useRef<FormControllerRef<IFilterParkingAccess>>(null)
  const defualtValue = new FilterParkingAccess(undefined)
  const { gate, onFilter, type, title, search } = props

  const selectedBuildingTemplate = (option: KeyValue, props: any) => {
    if (option) {
      return (
        <div className='flex align-items-center'>
          <div>{option.name}</div>
        </div>
      )
    }

    return <span>{props.placeholder}</span>
  }

  const onChange = () => {
    const value = formRef.current?.getValues() ?? defualtValue
    onFilter(value)
  }

  return (
    <div className='flex flex-wrap justify-content-between align-items-center w-full mb-5'>
      <h3 className='tw-text-2xl tw-text-[#1B2559] tw-font-bold'>
        {title ?? ''}
      </h3>
      <FormController
        ref={formRef}
        defualtValue={defualtValue}
        onSubmit={() => {}}
      >
        <div className='flex flex-wrap gap-3'>
          {search && (
            <div className='flex w-full md:w-14rem '>
              <TextField
                name='filter'
                placeholder='License No., Name'
                onChange={onChange}
                style={{
                  backgroundColor: '#F4F7FE',
                  borderColor: '#F4F7FE',
                }}
              />
            </div>
          )}
          <div className='flex w-full md:w-14rem'>
            <DateTimeRangeField name='date' onChange={onChange} />
          </div>

          {type && (
            <div className='flex w-full md:w-14rem'>
              <DropdownField
                name='type'
                options={type}
                optionLabel='name'
                optionValue='value'
                placeholder='Type'
                valueTemplate={selectedBuildingTemplate}
                className='w-full md:w-14rem'
                showClear
                onChange={onChange}
              />
            </div>
          )}

          {gate && (
            <div className='flex w-full md:w-14rem ml-2'>
              <DropdownField
                name='gate'
                options={gate}
                optionLabel='name'
                optionValue='value'
                placeholder='Gate'
                valueTemplate={selectedBuildingTemplate}
                className='w-full md:w-14rem'
                showClear
                onChange={onChange}
              />
            </div>
          )}
        </div>
      </FormController>
    </div>
  )
}
