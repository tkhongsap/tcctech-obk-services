import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button'
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
import {
  GetTaskActivity,
  IUpsertTaskManagement,
  UpsertTaskManagement,
} from '@src/services/guardtour/task-management/model'
import { taskManagementService } from '@src/services/guardtour/task-management/service'

import { toast } from 'react-toastify'
import { defaultToastMessage } from '@src/utils/default-toast'
import CalendarField from '@components/forms/components/calendar-field'
import { validateDateNotPass } from '@src/utils/validation'
import { KeyValue } from '@src/types/key-value'
import { schedulePlanService } from '@src/services/guardtour/scheduleplan/service'
import { formatLocalISO } from '@src/utils/format-time'

type Props = {
  socmember: KeyValue[]
  dataActivity: GetTaskActivity[]
}

export default function TsakCreateByActivity(props: Props) {
  const { socmember: socmemberdropdown, dataActivity } = props
  const [visiblePublishDialog, setVisiblePublishDialog] = useState(false)
  const { setMenuName, setMenuAction } = useLayoutContext()
  const router = useRouter()
  const formRef = useRef<FormControllerRef<UpsertTaskManagement>>(null)
  const [selectedActivity, setSelectedActivity] = useState<GetTaskActivity>()

  const handerSelectedActivity = async (e: any) => {
    const sel = dataActivity.find((a) => a.id == e)

    setSelectedActivity(sel)
  }

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    value = value.replace(/[^0-9\/:\s]/g, '')
    if (value.length <= 16) {
      if (value.length === 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4)
      } else if (value.length === 5) {
        value = value.slice(0, 5) + '/' + value.slice(5, 9)
      } else if (value.length === 10) {
        value = value.slice(0, 10) + ' ' + value.slice(10, 12)
      } else if (value.length === 13) {
        value = value.slice(0, 13) + ':' + value.slice(13, 15)
      }
    }
    e.target.value = value
  }
  const formatTime = (date: any) => {
    const d = new Date(date)
    return new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes()
    )
  }

  const startDate = formatTime(formRef.current?.getValues().startDate)
  const endDate = formatTime(formRef.current?.getValues().endDate)

  let data: IUpsertTaskManagement = {
    name: '',
    statusId: '',
    startDate: '',
    endDate: '',
    locationId: '',
    memberId: '',
    subtasks: [],
    cancelReason: '',
  }
  const formData = new UpsertTaskManagement()
  Object.assign(formData, data)

  const onPublish = async () => {
    setVisiblePublishDialog(false)
    const value = formRef.current?.getValues()
    const formattedStartDate = formatLocalISO(startDate!)
    const formattedEndDate = formatLocalISO(endDate!)

    let sendData: any = {
      StartDate: formattedStartDate,
      EndDate: formattedEndDate,
      ActivityProcedureId: selectedActivity?.id,
      Mid: value?.memberId,
    }

    const promise = taskManagementService
      .createTaskByActivity(sendData)
      .then(() => {
        router.push({
          pathname: '/guardtour/task-management',
        })
      })

    toast.promise(promise, defaultToastMessage)
  }

  useEffect(() => {
    setMenuName('Create Tark By Activity')
    setMenuAction(buttonAction)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuName])

  const OnCancel = () => {
    router.push({
      pathname: '/guardtour/task-management',
    })
  }

  const buttonAction = (
    <div className='flex flex-column xl:flex-row mb-5 justify-content-between align-items-center'>
      <div className='flex gap-3 px-3'>
        <Button
          className='px-5 text-primary-blue'
          label='Cancel'
          type='button'
          severity='secondary'
          text
          onClick={OnCancel}
        />
        <Button
          className='px-3 bg-primary-blue'
          label='Create Tsak'
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

  return (
    <>
      <FormController
        defualtValue={formData}
        ref={formRef}
        onSubmit={() => setVisiblePublishDialog(true)}
      >
        <div className='card mb-5'>
          <div className='p-2'>
            <span className='flex text-xl tw-text-[#2B3674] font-bold mb-5'>
              Select Activity
            </span>
            <div className='formgrid grid'>
              <div className='field flex col-12 align-items-end md:col-4'>
                <div
                  className='flex flex-column gap-2'
                  style={{ minWidth: '70px' }}
                >
                  <DropdownField
                    label='Acticity'
                    name='Acticity'
                    options={dataActivity}
                    optionLabel='taskName'
                    optionValue='id'
                    placeholder='Select Acticity..'
                    className='w-full'
                    showClear
                    rules={{ required: 'Acticity is required.' }}
                    onChange={(e) => handerSelectedActivity(e.value)}
                    filter
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='card mb-5'>
          <div className='p-2'>
            <span className='flex text-xl tw-text-[#2B3674] font-bold mb-5'>
              Details
            </span>

            <div className='formgrid grid'>
              <div className='field col-12 md:col-6'>
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
              <div className='field col-12 md:col-6'>
                <CalendarField
                  label='Start Date'
                  name='startDate'
                  onInput={handleDateInput}
                  minDate={new Date()}
                  rules={{
                    required: 'Start date is required.',
                    validate: validateDateNotPass,
                  }}
                  readOnlyInput={false}
                  showButtonBar
                  showTime
                />
                <span className='text-sm tw-text-[#818181]'>
                  Ex. MM/DD/YYYY HH:MM
                </span>
              </div>
              <div className='field col-12 md:col-6'>
                <CalendarField
                  label='End Date'
                  name='endDate'
                  onInput={handleDateInput}
                  minDate={new Date()}
                  rules={{
                    required: 'End date is required.',
                    validate: validateDateNotPass,
                  }}
                  readOnlyInput={false}
                  showButtonBar
                  showTime
                />
                <span className='text-sm tw-text-[#818181]'>
                  Ex. MM/DD/YYYY HH:MM
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
            {startDate.getTime() === endDate.getTime() ? (
              <div className='flex align-items-center gap-3'>
                <i className='pi pi-times-circle text-red-400 text-6xl' />
                <span>
                  <strong>Start Date</strong> and <strong>End Date</strong> must
                  be different.
                </span>
              </div>
            ) : startDate > endDate ? (
              <div className='flex align-items-center gap-3'>
                <i className='pi pi-times-circle text-red-400 text-6xl' />
                <span>
                  <strong>Start Date</strong> cannot be later than the{' '}
                  <strong>End Date</strong>.
                </span>
              </div>
            ) : (
              <span className='font-bold'>
                Are you sure you want to create this task ?
              </span>
            )}

            <div className='flex gap-3 mt-5'>
              {startDate !== endDate && startDate < endDate ? (
                <>
                  <Button
                    className='bg-primary-blue'
                    type='submit'
                    label='Confirm'
                    onClick={onPublish}
                  />
                  <Button
                    className='text-primary-blue'
                    type='button'
                    onClick={(e) => hide(e)}
                    label='Cancel'
                    outlined
                  />
                </>
              ) : (
                <Button
                  className='text-color-secondary'
                  type='button'
                  onClick={(e) => hide(e)}
                  label='Close'
                  outlined
                />
              )}
            </div>
          </div>
        )}
      ></Dialog>
    </>
  )
}
TsakCreateByActivity.activePrime = true
export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const socmemberData = await schedulePlanService.getSocMember().then((res) =>
      res.map((x) => {
        return { name: x.name, value: x.id } as KeyValue
      })
    )

    const activityData = await taskManagementService.getActivity()

    const dataActivity = activityData.data.data

    ctx.props = { ...ctx.props, socmember: socmemberData, dataActivity }

    return ctx
  },
  {},
  {
    redirectPath: '/guardtour/task-management',
    accessPage: PCODE.CREATETASKBYACTIVITYPROCEDURES,
  }
)
