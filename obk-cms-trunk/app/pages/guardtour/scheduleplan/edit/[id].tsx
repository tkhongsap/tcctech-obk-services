/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import TextField from '@components/forms/components/text-field'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import { useRouter } from 'next/router'
import { Dialog } from 'primereact/dialog'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import DropdownField from '@components/forms/components/dropdown-field'
import { toast } from 'react-toastify'
import { KeyValue } from '@src/types/key-value'

import { defaultToastMessage } from '@src/utils/default-toast'
import { schedulePlanService } from '@src/services/guardtour/scheduleplan/service'
import {
  GetSchedulePlan,
  IGetSchedulePlan,
} from '@src/services/guardtour/scheduleplan/model'
import MultipleSelectField from '@components/forms/components/multiple-select-field'
import CalendarField from '@components/forms/components/calendar-field'
import { validateDateNotPass } from '@src/utils/validation'
import { formatTimeOnly } from '@src/utils/format-time'
import { InputSwitch } from 'primereact/inputswitch'

type Props = {
  frequencies: KeyValue[]
  routes: KeyValue[]
  triggerErrorState: () => void
  data: IGetSchedulePlan
  id: string
  socmemberdropdown: KeyValue[]
}

export default function SchedulePlanCreate(props: Props) {
  const [visiblePublishDialog, setVisiblePublishDialog] = useState(false)
  const [visibleDeleteDialog, setVisibleDeleteDialog] = useState(false)
  const { setMenuName, setMenuAction } = useLayoutContext()
  const router = useRouter()
  const formRef = useRef<FormControllerRef<any>>(null)

  const {
    frequencies,
    routes,
    data,
    id,
    triggerErrorState,
    socmemberdropdown,
  } = props

  const [checked, setChecked] = useState(data.isActive)

  const formData = new GetSchedulePlan(data)

  const formatTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    value = value.replace(/[^0-9:]/g, '')
    if (value.length === 2 && !value.includes(':')) {
      value = value + ':'
    }
    if (value.length > 5) {
      value = value.slice(0, 5)
    }
    if (value.length > 2 && value[2] !== ':') {
      value = value.slice(0, 2) + ':' + value.slice(3)
    }
    e.target.value = value
  }

  const onSaveUpdate = async () => {
    setVisiblePublishDialog(false)
    const value = formRef.current?.getValues()
    const routeName = routes.find((x) => x.value == value.route)!.name

    let sendData: any = {
      sdpid: id,
      route: routeName,
      frequency: value.frequency,
      startTime: formatTimeOnly(value.startTime),
      endTime: formatTimeOnly(value.endTime),
      memberId: value.memberName,
      isActive: checked,
    }

    console.log('senddata', sendData)

    const promise = schedulePlanService
      .updateSchedulePlan(sendData)
      .then(() => {
        router.push({
          pathname: '/guardtour/scheduleplan',
        })
      })
    toast.promise(promise, defaultToastMessage)
  }

  const onDeleteSchedulePlan = async () => {
    const value = formRef.current?.getValues()
    await schedulePlanService
      .deleteSchedule(value.id)
      .then((res) => {
        console.log('res', res)

        router.push({
          pathname: '/guardtour/scheduleplan',
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }

  useEffect(() => {
    onFrequencyShow()
    setMenuName('Edit Schedule Plan')
    setMenuAction(buttonAction)
  }, [setMenuName])

  const OnCancel = () => {
    router.push({
      pathname: '/guardtour/scheduleplan',
    })
  }
  const onFrequencyShow = () => {
    const selectAllLabel = document.querySelector(
      'label.p-multiselect-select-all-label[data-pc-section="headerselectalllabel"]'
    )

    if (selectAllLabel && !selectAllLabel.classList.contains('text-added')) {
      selectAllLabel.textContent = 'Everyday'
      selectAllLabel.classList.add('text-added')
    }
  }

  const buttonAction = (
    <div className='flex flex-column xl:flex-row mb-5 justify-content-between align-items-center'>
      <div className='flex gap-3 px-3'>
        <Button
          type='button'
          className='px-5 text-primary-blue'
          label='Cancel'
          severity='secondary'
          text
          onClick={OnCancel}
        />
        <Button
          type='button'
          className='px-5'
          label='Delete'
          severity='danger'
          onClick={() => setVisibleDeleteDialog(true)}
        />
        <Button
          className='px-3 bg-primary-blue'
          label='Save schedule'
          onClick={() => {
            formRef.current?.trigger().then((res) => {
              if (res) {
                setVisiblePublishDialog(true)
              }
            })
          }}
        />
      </div>
    </div>
  )

  const onConfirmPublish = async () => {
    const isValid = await formRef.current?.trigger()
    if (isValid) {
      setVisiblePublishDialog(true)
    }
  }

  return (
    <>
      <FormController
        defualtValue={formData}
        ref={formRef}
        onSubmit={() => setVisiblePublishDialog(true)}
      >
        <div className='card mb-5'>
          <div className='p-2'>
            <span className='flex text-xl font-bold mb-5'>Details</span>

            <div className='formgrid grid'>
              <div className='field col-12 md:col-4'>
                <TextField label='Schedule ID' name='id' disabled />
              </div>
              <div className='field col-12 md:col-4'>
                <MultipleSelectField
                  label='Day'
                  name='frequency'
                  options={frequencies}
                  optionLabel='name'
                  optionValue='value'
                  placeholder='Select Day..'
                  className='w-full'
                  showClear
                  rules={{ required: 'Frequency is required.' }}
                  display='chip'
                  onShow={onFrequencyShow}
                />
              </div>
              <div className='field col-12 md:col-4'>
                <DropdownField
                  label='Route'
                  name='route'
                  options={routes}
                  optionLabel='name'
                  optionValue='value'
                  placeholder='Select Route..'
                  className='w-full'
                  showClear
                  rules={{ required: 'Route is required.' }}
                />
              </div>
            </div>

            <div className='formgrid grid'>
              <div className='field col-12 md:col-4'>
                <CalendarField
                  label='Start Time'
                  name='startTime'
                  rules={{
                    required: 'Start Time is required.',
                    validate: validateDateNotPass,
                  }}
                  onChange={triggerErrorState}
                  onInput={formatTime}
                  readOnlyInput={false}
                  showTime
                  showButtonBar
                  timeOnly
                />
              </div>
              <div className='field col-12 md:col-4'>
                <CalendarField
                  label='End Time'
                  name='endTime'
                  rules={{
                    required: 'End Time is required.',
                    validate: validateDateNotPass,
                  }}
                  onChange={triggerErrorState}
                  onInput={formatTime}
                  readOnlyInput={false}
                  showTime
                  showButtonBar
                  timeOnly
                />
              </div>
              <div className='field col-12 md:col-4'>
                <DropdownField
                  label='Assign member'
                  name='memberId'
                  options={socmemberdropdown}
                  optionLabel='name'
                  optionValue='value'
                  placeholder='Select Member..'
                  className='w-full'
                  showClear
                  filter
                  rules={{ required: 'Activity procedure is required.' }}
                />
              </div>
            </div>
            <div className='formgrid grid'>
              <div className='field flex col-12 align-items-end md:col-4'>
                <div
                  className='flex flex-column gap-2'
                  style={{ minWidth: '70px' }}
                >
                  <label htmlFor='isActive' className='font-bold'>
                    {checked ? 'Active' : 'InActive'}
                  </label>
                  <InputSwitch
                    id='isActive'
                    name='isActive'
                    checked={checked}
                    onChange={(e) => setChecked(e.value)}
                  />
                </div>
                <span className='text-xs pb-2 text-gray-500'>
                  Toggle to active or inActive Schedule Plan
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-wrap gap-3'>{buttonAction}</div>
      </FormController>

      <Dialog
        draggable={false}
        blockScroll={true}
        visible={visiblePublishDialog}
        style={{ minWidth: '30vw' }}
        onHide={() => {
          setVisiblePublishDialog(false)
        }}
        modal
        content={({ hide }) => (
          <div className='flex flex-column bg-white p-5 border-round-lg'>
            <span className='font-bold'>
              Are you sure you want to publish the changes?
            </span>
            <div className='flex gap-3 mt-5'>
              <Button
                className='bg-primary-blue'
                type='submit'
                label='Confirm'
                onClick={onSaveUpdate}
              />
              <Button
                className='text-primary-blue'
                type='button'
                onClick={(e) => hide(e)}
                label='Cancel'
                outlined
              />
            </div>
          </div>
        )}
      ></Dialog>

      <Dialog
        draggable={false}
        blockScroll={true}
        visible={visibleDeleteDialog}
        style={{ minWidth: '30vw' }}
        onHide={() => {
          setVisibleDeleteDialog(false)
        }}
        modal
        content={({ hide }) => (
          <div className='flex flex-column bg-white p-5 border-round-lg'>
            <span className='font-bold'>
              Are you sure you want to delete this schedule?
            </span>
            <div className='flex gap-3 mt-5'>
              <Button
                className='px-5'
                type='submit'
                label='Delete'
                severity='danger'
                onClick={onDeleteSchedulePlan}
              />
              <Button
                className='text-primary-blue'
                type='button'
                onClick={(e) => hide(e)}
                label='Cancel'
                outlined
              />
            </div>
          </div>
        )}
      ></Dialog>
    </>
  )
}
SchedulePlanCreate.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const { id } = ctx.props.query
    const frequencyRes = schedulePlanService.getFrequencyOptions()
    const frequencies = frequencyRes.map((x) => {
      return { name: x.frequency, value: x.frequencyId } as KeyValue
    })
    const socmember = await schedulePlanService.getSocMember()

    const RoutesRes = await schedulePlanService.getAllRoute()
    const routes = RoutesRes.data
      .map((x) => {
        return { name: x.code, value: x.id } as KeyValue
      })
      .sort((a, b) => a.name.localeCompare(b.name))

    const socmemberdropdown = socmember.map((x) => {
      return { name: x.name, value: x.id } as KeyValue
    })
    const data = await schedulePlanService.getById(id)
    const routeid = routes.find((x) => x.name == data.route)
    const memberid = socmemberdropdown.find((x) => x.name == data.memberName)
    const days = frequencies
      .map((x) => {
        let found = data.frequency.find((freq) => freq === x.name)
        return found ? x.value : null
      })
      .filter((value) => value !== null || undefined) as string[]
    console.log(memberid)
    if (routeid != null) {
      data.route = routeid.value
    }
    if (memberid != null) {
      data.memberName = memberid.value
    }
    if (days != null) {
      data.frequency = days
    }
    ctx.props = {
      ...ctx.props,
      frequencies,
      routes,
      data,
      id,
      socmemberdropdown,
    }

    return ctx
  },
  {},
  {
    redirectPath: '/guardtour/scheduleplan',
    accessPage: PCODE.VIEWGUARDTOURSCHEDULEPLAN,
  }
)
