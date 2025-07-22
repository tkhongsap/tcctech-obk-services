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
  dataRoster: IOpsAppRoleList[]
  onFilter(e: IFilterRosterStaff): void
}

export const RosterStaffFilter = (props: Props) => {
  const formRef = useRef<FormControllerRef<IFilterRosterStaff>>(null)
  const defualtValue = new FilterRosterStaff({ filter: '' })
  const { onFilter, dataRoster } = props

  const onChange = () => {
    const value = formRef.current?.getValues() ?? defualtValue
    console.log('Current filter value:', value) // ล็อกค่าเพื่อดูว่ากำลังส่งค่าอะไรไป
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
          Staff Roster List
        </h3>
        <div className='flex gap-3'>
          <div className='flex flex-wrap gap-3'>
            <div className='flex w-full md:w-14rem'></div>
          </div>
        </div>
      </div>
    </FormController>
  )
}
