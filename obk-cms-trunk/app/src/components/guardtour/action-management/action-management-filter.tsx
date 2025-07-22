/* eslint-disable */
import { KeyValue } from '@src/types/key-value'
import { useRef, useState } from 'react'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import TextField from '@components/forms/components/text-field'
import {
  FilterActionManagement,
  IFilterActionManagement,
} from '@src/services/guardtour/action-management/model'
import DropdownField from '@components/forms/components/dropdown-field'

type Props = {
  actions: KeyValue[]
  onFilter(e: IFilterActionManagement): void
}

export const ActionManagementFilter = (props: Props) => {
  const formRef = useRef<FormControllerRef<IFilterActionManagement>>(null)
  const defualtValue = new FilterActionManagement(undefined)
  const { onFilter, actions } = props

  const onChange = () => {
    const value = formRef.current?.getValues() ?? defualtValue
    onFilter(value)
  }

  return (
    <FormController
      ref={formRef}
      defualtValue={defualtValue}
      onSubmit={() => {}}
    >
      <div className='flex flex-wrap justify-content-between align-items-center w-full mb-5'>
        <h3 className='tw-text-2xl tw-text-[#1B2559] tw-font-bold m-0 h-auto'>
          Action List
        </h3>
        <div className='flex gap-3'>
          <div className='flex flex-wrap gap-3'>
            <div className='flex w-full md:w-14rem'>
              <TextField
                name='filter'
                placeholder='Search Name'
                className='w-full'
                style={{
                  backgroundColor: '#F4F7FE',
                  borderColor: '#F4F7FE',
                }}
                onChange={onChange}
              />
            </div>
            <div className='flex w-full md:w-17rem'>
              <DropdownField
                name='actionTypeId'
                options={actions}
                optionLabel='name'
                optionValue='value'
                placeholder='Select Action..'
                className='w-full md:w-17rem'
                showClear
                onChange={onChange}
              />
            </div>
          </div>
        </div>
      </div>
    </FormController>
  )
}
