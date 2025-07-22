/* eslint-disable */
import { useRef } from 'react'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import TextField from '@components/forms/components/text-field'
import {
  FilterRosterRegister,
  IFilterRosterRegister,
  IRosterRoleList,
} from '@src/services/roster/model'

type Props = {
  data: IRosterRoleList[]
  onFilter(e: IFilterRosterRegister): void
}

export const RosterRegisterFilter = (props: Props) => {
  const formRef = useRef<FormControllerRef<IFilterRosterRegister>>(null)
  const defualtValue = new FilterRosterRegister({ filter: '' })
  const { onFilter, data } = props

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
          List
        </h3>
        <div className='flex gap-3'>
          <div className='flex flex-wrap gap-3'>
            <div className='flex w-full md:w-14rem'>
              <TextField
                name='component'
                placeholder='Search Component'
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
