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
import DropdownField from '@components/forms/components/dropdown-field'
import { KeyValue } from '@src/types/key-value'

import CalendarField from '@components/forms/components/calendar-field'
import { validateDateNotPass } from '@src/utils/validation'
import {
  ICancelTask,
  IGetSubTask,
  IGetTaskManagementById,
  UpsertTaskManagement,
} from '@src/services/guardtour/task-management/model'
import { IActionList } from '@src/services/guardtour/task-management/model'
import { formatLocalISO } from '@src/utils/format-time'
import { taskManagementService } from '@src/services/guardtour/task-management/service'
import { defaultToastMessage } from '@src/utils/default-toast'
import { toast } from 'react-toastify'
import {
  ILocationListRecord,
  VisibleDialog,
} from '@src/services/guardtour/activityprocedures/model'
import { TaskManagementSubtaskUpsert } from './task-management-subtask-upsert'
import { TaskManagementSubtaskTable } from './task-management-subtask-table'
import { AxiosResponse } from 'axios'
import TextAreaField from '@components/forms/components/text-area-field'
import { activityproceduresService } from '@src/services/guardtour/activityprocedures/service'
import { TaskManagementSubtaskTableView } from './task-management-subtask-table-view'

type Props = {
  id?: string
  MODE: 'EDIT' | 'CREATE' | 'VIEW'
  data?: IGetTaskManagementById
  formData: UpsertTaskManagement
  socmember: KeyValue[]
  actions: IActionList[]
  statusDropdown: KeyValue[]
  locationRef: {
    buildingRefId: number
    floorRefId: number
    unitRefId: number
  }
  locations: {
    buildings: ILocationListRecord[]
    floors: ILocationListRecord[]
    units: ILocationListRecord[]
  }
}

export const TaskManagementUpsert = (props: Props) => {
  const {
    id,
    data,
    formData,
    socmember: socmemberdropdown,
    actions,
    statusDropdown,
    locationRef,
    MODE,
  } = props

  const [visiblePublishDialog, setVisiblePublishDialog] = useState(false)
  const [visibleSubtaskDialog, setVisibleSubtaskDialog] =
    useState<VisibleDialog>({})
  const [visibleCancelTaskDialog, setVisibleCancelTaskDialog] = useState(false)
  const { setMenuName, setMenuAction } = useLayoutContext()
  const formSubtaskRef = useRef<FormControllerRef<IGetSubTask>>(null)
  const subtaskTableRef = useRef<{
    upsertSubtask: () => Promise<boolean> | undefined
  }>(null)
  const [isLoading, setIsloading] = useState(false)
  const [errorMessage, setErrormessage] = useState<string>()
  const router = useRouter()
  const formRef = useRef<FormControllerRef<UpsertTaskManagement>>(null)
  const cancelFormRef = useRef<FormControllerRef<ICancelTask>>(null)
  const defualtCancelFormValue: ICancelTask = {
    tid: id,
    statusId: '6',
    cancelReason: '',
  }

  const [buildings, setBuildings] = useState<ILocationListRecord[]>([])
  const [floors, setFloors] = useState<ILocationListRecord[]>([])
  const [units, setUnits] = useState<ILocationListRecord[]>([])

  const [selectedLocation, setSelectedLocation] = useState(locationRef)

  //check startDate and endDate only hour:minute\
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

  const validateSubtasks = () => {
    const subtasks = formRef.current?.getValues().subtasks
    if (subtasks === undefined || subtasks.length <= 0) {
      setErrormessage('Subtask is required.')
      return false
    }
    setErrormessage(undefined)
    return true
  }

  const onPublish = async () => {
    setVisiblePublishDialog(false)

    const currentValue = formRef.current?.getValues()

    const locationId =
      currentValue?.unitRefId && currentValue.unitRefId > 0
        ? (
            await activityproceduresService.getLocationSelected(
              currentValue.unitRefId
            )
          )?.lid
        : currentValue?.floorRefId && currentValue.floorRefId > 0
        ? (
            await activityproceduresService.getLocationSelected(
              currentValue.floorRefId
            )
          )?.lid
        : currentValue?.buildingRefId && currentValue.buildingRefId > 0
        ? (
            await activityproceduresService.getLocationSelected(
              currentValue.buildingRefId
            )
          )?.lid
        : ''

    delete currentValue?.buildingRefId
    delete currentValue?.floorRefId
    delete currentValue?.unitRefId

    if (currentValue) {
      currentValue.startDate = formatLocalISO(currentValue.startDate!)
      currentValue.endDate = formatLocalISO(currentValue.endDate!)
      currentValue.locationId = locationId
      setIsloading(true)
      let promiseAction: Promise<AxiosResponse<any, any>>
      if (MODE === 'CREATE') {
        promiseAction = taskManagementService.createTask(currentValue)
      } else {
        promiseAction = taskManagementService.updateTask(currentValue)
      }
      const promise = promiseAction
        .then(() => {
          router.push({
            pathname: '/guardtour/task-management',
          })
        })
        .finally(() => setIsloading(false))

      toast.promise(promise, defaultToastMessage)
    }
  }

  const onCancelTask = async () => {
    cancelFormRef.current?.trigger().then((res) => {
      if (res) {
        setVisibleCancelTaskDialog(false)
        const value = cancelFormRef.current?.getValues()

        const promise = taskManagementService
          .deleteTask(value!)
          .then(() => {
            router.push({ pathname: '/guardtour/task-management' })
          })
          .finally(() => setIsloading(false))

        toast.promise(promise, defaultToastMessage)
      }
    })
  }

  const onCloseCancelTask = () => {
    cancelFormRef.current?.reset()
    cancelFormRef.current?.clearErrors()
    setVisibleCancelTaskDialog(false)
  }

  useEffect(() => {
    let menu = ''
    if (MODE === 'EDIT') {
      menu = 'Edit Task'
    } else if (MODE === 'CREATE') {
      menu = 'Create Task'
    } else {
      menu = 'View Task'
    }
    setMenuName(menu)
    setMenuAction(buttonAction)
  }, [setMenuAction])

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        let buildings = await activityproceduresService.getLocationList(1)
        buildings = buildings.map((building) => ({
          ...building,
          name: `${building.name} (${building.locationCode})`,
        }))
        setBuildings(buildings)
        if (!formData.locationId) return
        const locationSelected =
          await activityproceduresService.getLocationListById(
            formData.locationId
          )
        let currentLocation: ILocationListRecord = {
          ...locationSelected,
          locationCode: '',
          name: '',
          type: '',
          parentId: locationSelected.parentLocationId,
        }

        if (currentLocation.typeId === 3) {
          formRef.current?.setValue('unitRefId', currentLocation.refId)
          const res = await activityproceduresService.getLocationSelected(
            currentLocation.parentId
          )

          currentLocation = res
        }

        if (currentLocation.typeId === 2) {
          const units = await activityproceduresService.getLocationList(
            3,
            currentLocation.refId
          )
          setUnits(units)

          const res = await activityproceduresService.getLocationSelected(
            currentLocation.parentId
          )
          formRef.current?.setValue('floorRefId', currentLocation.refId)
          setSelectedLocation((pre) => ({
            ...pre,
            floorRefId: currentLocation.refId,
          }))

          currentLocation = res
        }

        if (currentLocation.typeId === 1) {
          const floors = await activityproceduresService.getLocationList(
            2,
            currentLocation.refId
          )
          setFloors(floors)

          formRef.current?.setValue('buildingRefId', currentLocation.refId)
          setSelectedLocation((pre) => ({
            ...pre,
            buildingRefId: currentLocation.refId,
          }))

          let buildings = await activityproceduresService.getLocationList(1)
          buildings = buildings.map((building) => ({
            ...building,
            name: `${building.name} (${building.locationCode})`,
          }))
          setBuildings(buildings)
        }
      } catch (error) {
        toast.error('Unable to fetch buildings.')
      }
    }

    fetchBuildings()
  }, [])

  const onUpsertSubtask = () => {
    subtaskTableRef.current?.upsertSubtask()?.then((res) => {
      if (res) {
        setErrormessage(undefined)
      }
    })
  }

  const handleBuildingChange = async (value?: number) => {
    setSelectedLocation({
      buildingRefId: value ?? 0,
      floorRefId: 0,
      unitRefId: 0,
    })

    formRef.current?.setValue('floorRefId', undefined)
    formRef.current?.setValue('unitRefId', undefined)

    setFloors([])
    setUnits([])

    if (!value) {
      return
    }

    try {
      const res = await activityproceduresService.getLocationList(2, value)

      setFloors(res)
    } catch (error) {
      console.error('Error fetching floors:', error)
      toast.error('Error fetching floors')
    }
  }

  const handleFloorChange = async (value?: number) => {
    setSelectedLocation((pre) => ({
      ...pre,
      floorRefId: value ?? 0,
      unitRefId: 0,
    }))

    formRef.current?.setValue('unitRefId', undefined)

    setUnits([])

    if (!value) {
      return
    }

    try {
      const res = await activityproceduresService.getLocationList(3, value)

      setUnits(res)
    } catch (error) {
      console.error('Error fetching units:', error)
      toast.error('Error fetching units')
    }
  }

  const handleUnitChange = async (value?: number) => {
    setSelectedLocation((prev) => ({
      ...prev,
      unitRefId: value ?? 0,
    }))
  }

  const onCancel = () => {
    router.push({
      pathname: '/guardtour/task-management',
    })
  }

  const onDownloadTasklist = () => {
    if (!id) return
    taskManagementService.downloadReport(id).then((rs) => {
      router.push(rs.data.path)
    })
  }

  const buttonAction = (
    <div className='flex flex-column xl:flex-row mb-5 justify-content-between align-items-center'>
      <div className='flex gap-3 px-3'>
        <Button
          type='button'
          className='px-5 text-primary-blue'
          label='Cancel'
          severity='secondary'
          loading={isLoading}
          text
          onClick={onCancel}
        />
        {['EDIT'].includes(MODE) &&
          (formData!.statusId === '0' || formData!.statusId === '1') && (
            <Button
              className='px-5'
              label='Cancel this task'
              severity='danger'
              onClick={() => setVisibleCancelTaskDialog(true)}
            />
          )}
        {['EDIT', 'CREATE'].includes(MODE) && (
          <Button
            className='px-3 bg-primary-blue'
            label={MODE === 'EDIT' ? 'Save Change' : 'Create Task'}
            type='submit'
            loading={isLoading}
            onClick={() => {
              formRef.current?.trigger().then((res) => {
                if (!validateSubtasks()) {
                  return
                }

                if (res) {
                  setVisiblePublishDialog(true)
                }
              })
            }}
          />
        )}
        {['VIEW'].includes(MODE) && (
          <Button
            className='bg-primary-blue'
            type='button'
            label='Download Task'
            onClick={onDownloadTasklist}
          />
        )}
      </div>
    </div>
  )

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

  return (
    <>
      <FormController defualtValue={formData} ref={formRef} onSubmit={() => {}}>
        <div className='card mb-5'>
          <div className='p-2'>
            <span className='flex text-xl font-bold mb-5'>Details</span>

            <div className='formgrid grid'>
              <div className='field col-12 md:col-4'>
                <TextField
                  label='Task Name'
                  name='name'
                  rules={{ required: 'Name is required.' }}
                  disabled={MODE === 'VIEW'}
                />
              </div>
              <div className='field col-12 md:col-4'>
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
                  disabled={MODE === 'VIEW'}
                />
                <span className='text-sm tw-text-[#818181]'>
                  Ex. MM/DD/YYYY HH:MM
                </span>
              </div>
              <div className='field col-12 md:col-4'>
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
                  disabled={MODE === 'VIEW'}
                />
                <span className='text-sm tw-text-[#818181]'>
                  Ex. MM/DD/YYYY HH:MM
                </span>
              </div>
            </div>
            <div className='formgrid grid mb-3'>
              <div className='field col-12 md:col-4'>
                <DropdownField
                  label='Building'
                  name='buildingRefId'
                  options={buildings}
                  optionLabel='name'
                  optionValue='refId'
                  onChange={(e) => handleBuildingChange(e.value)}
                  placeholder='Select Building'
                  showClear
                  filter
                  rules={{ required: 'Building is required.' }}
                  disabled={MODE === 'VIEW'}
                />
              </div>
              <div className='field col-12 md:col-4'>
                <DropdownField
                  label='Floor'
                  name='floorRefId'
                  options={floors}
                  optionLabel='name'
                  optionValue='refId'
                  onChange={(e) => handleFloorChange(e.value)}
                  placeholder='Select Floor'
                  showClear
                  filter
                  disabled={
                    selectedLocation.buildingRefId <= 0 || MODE === 'VIEW'
                  }
                />
              </div>
              <div className='field col-12 md:col-4'>
                <DropdownField
                  label='Unit'
                  name='unitRefId'
                  options={units}
                  optionLabel='name'
                  optionValue='refId'
                  onChange={(event) => {
                    if ('value' in event) {
                      handleUnitChange(event.value)
                    } else {
                      console.error('Invalid event structure:', event)
                    }
                  }}
                  placeholder='Select Unit'
                  showClear
                  filter
                  disabled={selectedLocation.floorRefId <= 0 || MODE === 'VIEW'}
                />
              </div>
            </div>
            <div className='formgrid grid'>
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
                  disabled={MODE === 'EDIT' || MODE === 'VIEW'}
                />
              </div>
              {['EDIT', 'VIEW'].includes(MODE) && (
                <div className='field col-12 md:col-4'>
                  <DropdownField
                    label='Status'
                    name='statusId'
                    options={statusDropdown}
                    optionLabel='name'
                    optionValue='value'
                    placeholder='Select Status'
                    className='w-full'
                    showClear
                    disabled
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {formSubtaskRef.current && MODE !== 'VIEW' && (
          <TaskManagementSubtaskTable
            formSubtaskRef={formSubtaskRef}
            setVisibleDialog={setVisibleSubtaskDialog}
            visibleDialog={visibleSubtaskDialog}
            ref={subtaskTableRef}
            actions={actions}
            errorMessage={errorMessage}
            MODE={MODE}
          />
        )}

        {MODE === 'VIEW' && (
          <TaskManagementSubtaskTableView
            subtasks={data?.subtasks}
            actions={[]}
            statusDropdown={[]}
          />
        )}

        {buttonAction}
      </FormController>

      <Dialog
        draggable={false}
        blockScroll={true}
        visible={visibleCancelTaskDialog}
        style={{ minWidth: '30vw' }}
        onHide={onCloseCancelTask}
        modal
        content={({}) => (
          <FormController
            defualtValue={defualtCancelFormValue}
            ref={cancelFormRef}
            onSubmit={() => {}}
          >
            <div className='flex flex-column bg-white p-5 border-round-lg'>
              <div className='formgrid grid p-2'>
                <div className='field col-12'>
                  <TextAreaField
                    id='cancelReason'
                    name='cancelReason'
                    label='Cancel reason'
                    autoResize
                    placeholder='Enter reason for cancellation'
                    rules={{ required: 'Cancel Reason is required.' }}
                  />
                </div>
              </div>
              <div className='flex gap-3 mt-2'>
                <Button
                  className='bg-primary-blue'
                  label='Confirm'
                  type='button'
                  onClick={onCancelTask}
                />
                <Button
                  className='text-primary-blue'
                  onClick={onCloseCancelTask}
                  label='Cancel'
                  type='button'
                  outlined
                />
              </div>
            </div>
          </FormController>
        )}
      ></Dialog>

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
                {MODE === 'EDIT'
                  ? 'Are you sure you want to save this task ?'
                  : 'Are you sure you want to create this task ?'}
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

      <TaskManagementSubtaskUpsert
        actions={actions}
        setVisibleDialog={setVisibleSubtaskDialog}
        visibleDialog={visibleSubtaskDialog}
        formSubtaskRef={formSubtaskRef}
        onSubmitCallBack={onUpsertSubtask}
      />
    </>
  )
}
