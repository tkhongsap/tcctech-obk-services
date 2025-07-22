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
import { KeyValue } from '@src/types/key-value'
import { toast } from 'react-toastify'
import { defaultToastMessage } from '@src/utils/default-toast'
import { schedulePlanService } from '@src/services/guardtour/scheduleplan/service'
import {
  IGetSchedulePlan,
  UpsertSchedulePlan,
} from '@src/services/guardtour/scheduleplan/model'
import CalendarField from '@components/forms/components/calendar-field'
import { validateDateNotPass } from '@src/utils/validation'
import MultipleSelectField from '@components/forms/components/multiple-select-field'
import { InputSwitch } from 'primereact/inputswitch'

type Props = {
  frequencies: KeyValue[]
  routes: KeyValue[]
  triggerErrorState: () => void
  socmemberdropdown: KeyValue[]
}

export default function SchedulePlanCreate(props: Props) {
  const { triggerErrorState, frequencies, routes, socmemberdropdown } = props
  const [visiblePublishDialog, setVisiblePublishDialog] = useState(false)
  const { setMenuName, setMenuAction } = useLayoutContext()
  const [checked, setChecked] = useState(false)
  const router = useRouter()
  const formRef = useRef<FormControllerRef<any>>(null)
  let data: IGetSchedulePlan = {
    id: '',
    route: '',
    frequency: [],
    startTime: '',
    endTime: '',
    memberId: '',
    memberName: '',
    isActive: false,
  }
  const formData = new UpsertSchedulePlan(data)

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

  const onPublish = async () => {
    setVisiblePublishDialog(false)
    const value = formRef.current?.getValues()

    const frequencyName = frequencies
      .filter((x) => value.frequencyId.includes(x.value))
      .map((x) => x.name)

    const routeName = routes.find((x) => x.value == value.routeId)!.name

    function formatTimeOnly(isoString: string): string {
      return (
        new Date(isoString).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }) + ':00'
      )
    }

    let sendData = {
      createData: [
        {
          route: routeName,
          frequency: frequencyName,
          startTime: formatTimeOnly(value.startTime),
          endTime: formatTimeOnly(value.endTime),
          memberId: value.memberId,
          isActive: checked,
        },
      ],
    }

    const promise = schedulePlanService
      .createSchedule(sendData)
      .then(() => {
        router.push({
          pathname: '/guardtour/scheduleplan',
        })
      })
      .catch((e) => {
        console.log('error', e)
      })
    toast.promise(promise, defaultToastMessage)
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

  useEffect(() => {
    onFrequencyShow()
    setMenuName('Create Schedule Plan')
    setMenuAction(buttonAction)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuName])

  const OnCancel = () => {
    router.push({
      pathname: '/guardtour/scheduleplan',
    })
  }

  const buttonAction = (
    <div className='flex flex-column xl:flex-row mb-5 justify-content-between align-items-center'>
      <div className='flex gap-3 px-3'>
        <Button
          className='px-5 text-primary-blue'
          label='Cancel'
          severity='secondary'
          text
          onClick={OnCancel}
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
                  label='Frequency'
                  name='frequencyId'
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
                  name='routeId'
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
                  rules={{ required: 'Member is required.' }}
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
        <div className='flex flex-wrap gap-3'>
          <Button
            type='button'
            className='px-5 text-primary-blue'
            label='Cancel'
            severity='secondary'
            text
            onClick={OnCancel}
          />
          <Button
            className='px-3 bg-primary-blue'
            label='Save schedule'
            onClick={() => onConfirmPublish()}
          />
        </div>
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
              Are you sure you want to create this item?
            </span>
            <div className='flex gap-3 mt-5'>
              <Button
                className='bg-primary-blue'
                label='Confirm'
                onClick={onPublish}
              />
              <Button
                className='text-primary-blue'
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
    const frequencyRes = await schedulePlanService.getFrequencyOptions()
    const frequencies = frequencyRes.map((x) => {
      return { name: x.frequency, value: x.frequencyId } as KeyValue
    })

    const socmember = await schedulePlanService.getSocMember()
    const socmemberdropdown = socmember.map((x) => {
      return { name: x.name, value: x.id } as KeyValue
    })
    const RoutesRes = await schedulePlanService.getAllRoute()
    console.log(socmember)

    const routes = RoutesRes.data
      .map((x) => {
        return { name: x.code, value: x.id } as KeyValue
      })
      .sort((a, b) => a.name.localeCompare(b.name))

    ctx.props = { ...ctx.props, frequencies, routes, socmemberdropdown }
    return ctx
  },
  {},
  {
    redirectPath: '/guardtour/scheduleplan',
    accessPage: PCODE.VIEWGUARDTOURSCHEDULEPLAN,
  }
)
