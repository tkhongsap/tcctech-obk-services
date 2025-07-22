/* eslint-disable */
import { KeyValue } from '@src/types/key-value'
import { useRef, useState } from 'react'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import {
  FilterSchedulePlan,
  IFilterSchedulePlan,
} from '@src/services/guardtour/scheduleplan/model'
import CalendarField from '@components/forms/components/calendar-field'
import TextField from '@components/forms/components/text-field'

type Props = {
  routes: KeyValue[]
  onFilter(e: IFilterSchedulePlan): void
}

export const SchedulePlanFilter = (props: Props) => {
  const formRef = useRef<FormControllerRef<IFilterSchedulePlan>>(null)
  const defualtValue = new FilterSchedulePlan(undefined)
  const { routes, onFilter } = props
  const [selectedRouteId, setSelectedRouteId] = useState<string | undefined>()
  const [selectedRouteTitle, setSelectedRouteTitle] = useState<string>('')

  const onChange = () => {
    const value = formRef.current?.getValues() ?? defualtValue
    // if (value.StartTime) value.StartTime = formatTimeOnly(value.StartTime)
    // // if (value.EndTime) value.EndTime = formatTimeOnly(value.EndTime)
    // setSelectedRouteId(value.RouteId)
    // setSelectedRouteTitle(
    //   routes.find((route) => route.value === value.RouteId)?.name || ''
    // )
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
          {/* {selectedRouteTitle || 'All Routes'} */}
        </h3>
        <div className='flex gap-3'>
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
            {/* <div className='flex w-full md:w-14rem'>
              <CalendarField
                // label='Start Time'
                name='StartTime'
                placeholder='Start Time'
                onChange={onChange}
                timeOnly
              />
            </div>
            <div className='flex w-full md:w-14rem'>
              <CalendarField
                // label='End Time'
                placeholder='End Time'
                name='EndTime'
                onChange={onChange}
                timeOnly
              />
            </div> */}
          </div>
        </div>
      </div>
    </FormController>
  )
}
