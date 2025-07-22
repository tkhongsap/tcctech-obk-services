/* eslint-disable */
import { useRef } from 'react'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import TextField from '@components/forms/components/text-field'
import {
  FilterRosterStaff,
  IFilterRosterStaff,
  IOpsAppRoleList,
} from '@src/services/usagemonitoring/roster/model'

type Props = {
  data: IOpsAppRoleList[]
  onFilter(e: IFilterRosterStaff): void
}

export const RosterStaffFilter = (props: Props) => {
  const formRef = useRef<FormControllerRef<IFilterRosterStaff>>(null)
  const defualtValue = new FilterRosterStaff({ filter: '' })
  const { onFilter, data } = props

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
          Component List
        </h3>
        <div className='flex gap-3'>
          <div className='flex flex-wrap gap-3'>
            <div className='flex w-full md:w-14rem'>
              <TextField
                name='component'
                placeholder='Search Component...'
                className='component'
                style={{
                  backgroundColor: '#F4F7FE',
                  borderColor: '#F4F7FE',
                }}
                onChange={onChange}
              />
            </div>
          </div>
        </div>
      </div>
    </FormController>
  )
}
