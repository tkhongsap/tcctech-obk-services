import DropdownField from '@components/forms/components/dropdown-field'
import { FormController } from '@components/forms/components/form-controller'
import IconTextField from '@components/forms/components/icon-text-field'

type Props = {
  // eslint-disable-next-line unused-imports/no-unused-vars-ts
  onFilter: (item: any) => void
}

// TODO delete it
const dropdownOptions = ['value1', 'value2']

export const MemberListFilter = (props: Props) => {
  return (
    <>
      <div className='flex flex-column lg:flex-row justify-content-between align-items-center w-full'>
        <div className=''>
          <h4 className='mx-3'>Member List</h4>
        </div>
        <FormController defualtValue={{}} onSubmit={props.onFilter}>
          <div className='flex'>
            <div className='w-14rem mx-1'>
              <IconTextField
                iconClass='pi pi-search'
                name='search'
                placeholder='ID, Email, Assigned Role'
              />
            </div>
            <div className='w-14rem mx-1'>
              <DropdownField
                name='assignedRole'
                placeholder='Assigned Role'
                options={dropdownOptions}
              />
            </div>
            <div className='w-14rem mx-1'>
              <DropdownField
                name='status'
                placeholder='Status'
                options={dropdownOptions}
              />
            </div>
          </div>
        </FormController>
      </div>
    </>
  )
}
