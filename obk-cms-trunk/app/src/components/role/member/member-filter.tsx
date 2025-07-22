import DropdownField from '@components/forms/components/dropdown-field'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import IconTextField from '@components/forms/components/icon-text-field'
import MultipleSelectField from '@components/forms/components/multiple-select-field'
import { IMemberFilterModel } from '@src/services/member/model'
import { IRole } from '@src/services/role/model'
import { SelectItem } from 'primereact/selectitem'
import { useRef } from 'react'

type Props = {
  // eslint-disable-next-line unused-imports/no-unused-vars-ts
  onFilter: (item: IMemberFilterModel) => void
  status: SelectItem[]
  role: IRole[]
}

export const MemberFilter = (props: Props) => {
  const formRef = useRef<FormControllerRef<IMemberFilterModel>>(null)
  const defualtValue: IMemberFilterModel = { roles: [], filter: '', status: [] }
  const rolesoptions = props.role.map((role) => ({
    label: role.name || '',
    value: role.rid || '',
  }))

  const onChange = () => {
    const value = formRef.current?.getValues() ?? defualtValue
    props.onFilter(value)
  }
  console.log(rolesoptions)
  return (
    <>
      <div className='flex flex-column lg:flex-row justify-content-between align-items-center w-full'>
        <div className=''>
          <h4 className='mx-3'>Member List</h4>
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
                placeholder='ID,Email,Assigned Role'
                onChange={onChange}
              />
            </div>
            <div className='w-14rem mx-1'>
              <MultipleSelectField
                name='roles'
                placeholder='Assigned Role'
                options={rolesoptions}
                onChange={onChange}
                optionLabel='label'
                optionValue='value'
                showSelectAll={false}
              />
            </div>
            <div className='w-14rem mx-1'>
              <DropdownField
                name='status'
                placeholder='Status'
                onChange={onChange}
                options={props.status}
              />
            </div>
          </div>
        </FormController>
      </div>
    </>
  )
}
