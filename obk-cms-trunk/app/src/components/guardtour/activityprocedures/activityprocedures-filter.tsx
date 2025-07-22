/* eslint-disable */
import { KeyValue } from '@src/types/key-value'
import { useRef, useState } from 'react'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import { useRouter } from 'next/router'
import TextField from '@components/forms/components/text-field'
import {
  FilterActivityProcedures,
  IFilterActivityProcedures,
} from '@src/services/guardtour/activityprocedures/model'

type Props = {
  routes: KeyValue[]
  onFilter(e: IFilterActivityProcedures): void
}

export const ActivityProceduresFilter = (props: Props) => {
  const formRef = useRef<FormControllerRef<IFilterActivityProcedures>>(null)
  const defualtValue = new FilterActivityProcedures(undefined)
  const { routes, onFilter } = props

  const onChange = () => {
    const value = formRef.current?.getValues() ?? defualtValue
    // const searchTerm = value.filter?.toLowerCase() || ''
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
          All Task
        </h3>

        <div className='flex flex-wrap gap-3'>
          <div className='flex w-full md:w-14rem'>
            <TextField
              name='filter'
              placeholder='Search Route'
              className='w-full'
              style={{
                backgroundColor: '#F4F7FE',
                borderColor: '#F4F7FE',
              }}
              onChange={onChange}
            />
          </div>
        </div>
      </div>
    </FormController>
  )
}
