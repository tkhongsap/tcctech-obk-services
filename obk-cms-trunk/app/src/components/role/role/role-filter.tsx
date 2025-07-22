import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import IconTextField from '@components/forms/components/icon-text-field'
import MultipleSelectField from '@components/forms/components/multiple-select-field'
import { IPrivilege, IRoleFilterModel } from '@src/services/role/model'
import { useRef } from 'react'

type Props = {
  // eslint-disable-next-line unused-imports/no-unused-vars-ts
  onFilter: (item: IRoleFilterModel) => void
  privileges: IPrivilege[]
}

export const RoleFilter = (props: Props) => {
  const formRef = useRef<FormControllerRef<IRoleFilterModel>>(null)
  const defualtValue: IRoleFilterModel = { privilges: [], filter: '' }

  const onChange = () => {
    const value = formRef.current?.getValues() ?? defualtValue
    props.onFilter(value)
  }

  return (
    <>
      <div className='flex flex-column lg:flex-row justify-content-between align-items-center w-full'>
        <div className=''>
          <h4 className='mx-3'>Role List</h4>
        </div>
        <FormController
          ref={formRef}
          defualtValue={defualtValue}
          onSubmit={props.onFilter}
        >
          <div className='flex'>
            <div className='w-14rem mx-1'>
              <IconTextField
                iconClass='pi pi-search'
                name='filter'
                placeholder='Search'
                onChange={onChange}
              />
            </div>
            <div className='w-14rem mx-1'>
              <MultipleSelectField
                name='privilges'
                placeholder='Privilges'
                options={props.privileges}
                optionGroupChildren='privilegeItems'
                onChange={onChange}
                optionGroupLabel='name'
                optionLabel='name'
                optionValue='ptid'
                showSelectAll={false}
              />
            </div>
          </div>
        </FormController>
      </div>
    </>
  )
}
