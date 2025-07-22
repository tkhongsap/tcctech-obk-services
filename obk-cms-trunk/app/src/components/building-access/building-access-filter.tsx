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
  FilterBuildingAccess,
  IFilterBuildingAccess,
} from './building-access-interface'

const statusVistor: KeyValue[] = [
  { name: 'Leave', value: '1' },
  { name: 'Access', value: '0' },
]
const statusMember: KeyValue[] = [
  { name: 'Left', value: '1' },
  { name: 'On site', value: '0' },
]
type Props = {
  date?: any
  building: KeyValue[]
  onFilter(e: IFilterBuildingAccess): void
  title?: string
  statusPass?: boolean
  statusTenant?: boolean
  search?: boolean
}

export const BuildingAccessFilter = (props: Props) => {
  const formRef = useRef<FormControllerRef<IFilterBuildingAccess>>(null)
  const defualtValue = new FilterBuildingAccess(undefined)
  const { building, onFilter, title, statusPass, statusTenant, search } = props

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
                placeholder='Search'
                className='w-full'
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

          {statusPass && (
            <div className='flex w-full md:w-14rem'>
              <DropdownField
                name='statusPass'
                options={statusVistor}
                optionLabel='name'
                optionValue='value'
                placeholder='Activity type'
                valueTemplate={selectedBuildingTemplate}
                className='w-full md:w-14rem'
                showClear
                onChange={onChange}
              />
            </div>
          )}
          {statusTenant && (
            <div className='flex w-full md:w-14rem'>
              <DropdownField
                name='statusMember'
                options={statusMember}
                optionLabel='name'
                optionValue='value'
                placeholder='Activity type'
                valueTemplate={selectedBuildingTemplate}
                className='w-full md:w-14rem'
                showClear
                onChange={onChange}
              />
            </div>
          )}
          <div className='flex w-full md:w-14rem ml-2'>
            <DropdownField
              name='building'
              options={building}
              optionLabel='name'
              optionValue='value'
              placeholder='Building'
              valueTemplate={selectedBuildingTemplate}
              className='w-full md:w-14rem'
              showClear
              onChange={onChange}
            />
          </div>
        </div>
      </FormController>
    </div>
  )
}
