/* eslint-disable */
import { KeyValue } from '@src/types/key-value'
import { useRef } from 'react'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import TextField from '@components/forms/components/text-field'
import DropdownField from '@components/forms/components/dropdown-field'
import {
  FilterOpsAppRegister,
  IFilterOpsAppRegister,
  IOpsAppRoleList,
} from '@src/services/opsapp-register/model'

type Props = {
  roles: IOpsAppRoleList[]
  onFilter(e: IFilterOpsAppRegister): void
}

export const OpsAppRegisterFilter = (props: Props) => {
  const formRef = useRef<FormControllerRef<IFilterOpsAppRegister>>(null)
  const defualtValue = new FilterOpsAppRegister(undefined)
  const { onFilter, roles } = props

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
          Member List
        </h3>
        <div className='flex gap-3'>
          <div className='flex flex-wrap gap-3'>
            <div className='flex w-full md:w-14rem'>
              <TextField
                name='filter'
                placeholder='Search Email'
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
                name='roles'
                options={roles}
                optionLabel='roleName'
                optionValue='rid'
                placeholder='Select Role..'
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
