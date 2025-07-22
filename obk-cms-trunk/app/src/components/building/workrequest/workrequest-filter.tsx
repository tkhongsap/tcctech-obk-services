import DropdownField from '@components/forms/components/dropdown-field'
import { FormController } from '@components/forms/components/form-controller'
import IconTextField from '@components/forms/components/icon-text-field'

type Props = {
  // eslint-disable-next-line unused-imports/no-unused-vars-ts
  onFilter: (item: any) => void
}

export const WorkRequestFilter = (props: Props) => {
  return (
    <>
      <div className='flex flex-column lg:flex-row justify-content-between align-items-center w-full'>
        <div className=''>
          <h4 className='mx-3'>List</h4>
        </div>
        <FormController defualtValue={{}} onSubmit={props.onFilter}>
          <div className='flex'>
            <div className='w-14rem mx-1'>
              <IconTextField
                iconClass='pi pi-search'
                name='search'
                placeholder='Search'
              />
            </div>
            <div className='w-14rem mx-1'>
              <DropdownField
                name='issueType'
                placeholder='Type of issue'
                options={[]}
              />
            </div>
            <div className='w-14rem mx-1'>
              <DropdownField
                name='location'
                placeholder='Location'
                options={[]}
              />
            </div>
          </div>
        </FormController>
      </div>
    </>
  )
}
