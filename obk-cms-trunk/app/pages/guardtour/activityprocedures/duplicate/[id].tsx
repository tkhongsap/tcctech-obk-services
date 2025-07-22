import { useEffect, useRef } from 'react'
import { useState } from 'react'
import withGenericServer from '@hocs/server/generic'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { Button } from 'primereact/button'
import router from 'next/router'
import * as OBBMSSDK from 'ob-bms-sdk'
import { PCODE } from '@src/data/constants/privilege'
import { activityproceduresService } from '@src/services/guardtour/activityprocedures/service'
import {
  IActionList,
  IGetActivityProcedures,
  IGetSubTask,
  VisibleDialog,
  EditActivityProcedures,
  ILocationListRecord,
  ILocationSelected,
} from '@src/services/guardtour/activityprocedures/model'

import { KeyValue } from '@src/types/key-value'
import React from 'react'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import DropdownField from '@components/forms/components/dropdown-field'
import TextField from '@components/forms/components/text-field'
import { Dialog } from 'primereact/dialog'
import { toast } from 'react-toastify'
import { ActivityProceduresActivityTable } from '@components/guardtour/activityprocedures/activityprocedures-activity-table'
import { ActivityProceduresActivityCreate } from '@components/guardtour/activityprocedures/activityprocedures-activity-create'
import { defaultToastMessage } from '@src/utils/default-toast'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  tasks: KeyValue[]
  locations: KeyValue[]
  data: IGetActivityProcedures
  id: string
  actions: IActionList[]
  locationSelected: ILocationSelected
}

export default function ActivityProceduresEdit(props: Props) {
  const { data, actions } = props
  OBBMSSDK.setBaseUrl(process.env.BMS_BASEURL || '')
  const [visiblePublishDialog, setVisiblePublishDialog] = useState(false)
  const [visibleSubtaskDialog, setVisibleSubtaskDialog] =
    useState<VisibleDialog>({})

  const [isLoading, setIsLoading] = useState(false)
  const { setMenuAction, setMenuName } = useLayoutContext()
  const formRef = useRef<FormControllerRef<EditActivityProcedures>>(null)
  const formSubtaskRef = useRef<FormControllerRef<IGetSubTask>>(null)
  const subtaskTableRef = useRef<{ upsertSubtask: () => void }>(null)
  const [routeNameError, setRouteNameError] = useState<string | undefined>()

  const formData = new EditActivityProcedures(data, actions)

  const [buildings, setBuildings] = useState<ILocationListRecord[]>([])
  const [floors, setFloors] = useState<ILocationListRecord[]>([])
  const [units, setUnits] = useState<ILocationListRecord[]>([])

  const [selectedLocation, setSelectedLocation] = useState({
    buildingRefId: 0,
    floorRefId: 0,
    unitRefId: 0,
  })

  const checkDuplicateAndProceed = async () => {
    const value = formRef.current?.getValues()
    if (!value?.code) return
    const isDuplicate = await activityproceduresService.checkDuplicate(
      value.code
    )

    if (isDuplicate.data.message) {
      setRouteNameError(isDuplicate.data.message)
      return false
    } else {
      setRouteNameError(undefined)
      setVisiblePublishDialog(true)
      return true
    }
  }

  const onSaveUpdate = async () => {
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

    const value: EditActivityProcedures = {
      id: uuidv4(),
      code: currentValue!.code,
      locationId: locationId,
      subtaskActions: currentValue!.subtaskActions,
      taskName: currentValue!.taskName,
    }

    const promise = activityproceduresService
      .duplicateActivity(value)
      .then(() => {
        router.push({
          pathname: '/guardtour/activityprocedures',
        })
      })
      .finally(() => setIsLoading(false))
    toast.promise(promise, defaultToastMessage)
  }

  setMenuName('Activity Procedures')

  const onUpsertSubtask = () => {
    subtaskTableRef.current?.upsertSubtask()
  }

  useEffect(() => {
    setMenuAction(menuAction)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuAction])

  useEffect(() => {
    if (formRef.current) {
      formRef.current?.setValue('code', '')
    }
  }, [])

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

  const OnCancel = () => {
    router.push({
      pathname: '/guardtour/activityprocedures',
    })
  }

  const menuAction = (
    <div className='flex flex-column xl:flex-row mb-5 justify-content-between align-items-center'>
      <div className='flex gap-3 px-3'>
        <Button
          className='px-5 text-primary-blue'
          label='Cancel'
          severity='secondary'
          type='button'
          outlined
          onClick={OnCancel}
          text
        />
        <Button
          className='px-3 bg-primary-blue'
          type='submit'
          label='Create Activity'
          onClick={() => {
            formRef.current?.trigger().then((res) => {
              if (res) {
                checkDuplicateAndProceed()
              }
            })
          }}
        />
      </div>
    </div>
  )

  return (
    <>
      <FormController defualtValue={formData} ref={formRef} onSubmit={() => {}}>
        <div className='card mb-5'>
          <div className='p-2'>
            <span className='flex text-xl tw-text-[#2B3674] font-bold mb-5'>
              Details
            </span>

            <div className='formgrid grid mb-3'>
              <div className='field col-12 md:col-4'>
                <TextField
                  label='Route'
                  name='code'
                  rules={{ required: 'Code is required.' }}
                  className={routeNameError ? 'border-red-600' : ''}
                  onChange={() => setRouteNameError(undefined)}
                />
                {routeNameError && (
                  <small className='text-red-600'>{routeNameError}</small>
                )}
              </div>
              <div className='field col-12 md:col-4'>
                <TextField
                  label='Task Name'
                  name='taskName'
                  rules={{ required: 'Task Name is required.' }}
                />
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
                  disabled={selectedLocation.buildingRefId <= 0}
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
                  disabled={selectedLocation.floorRefId <= 0}
                />
              </div>
            </div>
          </div>
        </div>
        {formSubtaskRef.current && (
          <ActivityProceduresActivityTable
            formSubtaskRef={formSubtaskRef}
            setVisibleDialog={setVisibleSubtaskDialog}
            visibleDialog={visibleSubtaskDialog}
            ref={subtaskTableRef}
            actions={actions}
          />
        )}
        <div className='flex flex-wrap gap-3'>
          <Button
            type='button'
            className='px-5 text-primary-blue'
            label='Cancel'
            severity='secondary'
            outlined
            onClick={OnCancel}
            text
          />
          <Button
            className='px-3 bg-primary-blue'
            type='submit'
            label='Create Activity'
            onClick={() => {
              formRef.current?.trigger().then((res) => {
                if (res) {
                  checkDuplicateAndProceed()
                }
              })
            }}
          />
        </div>
      </FormController>

      <ActivityProceduresActivityCreate
        actions={actions}
        setVisibleDialog={setVisibleSubtaskDialog}
        visibleDialog={visibleSubtaskDialog}
        formSubtaskRef={formSubtaskRef}
        onSubmitCallBack={onUpsertSubtask}
      />

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
                loading={isLoading}
                onClick={onSaveUpdate}
              />
              <Button
                className='text-primary-blue'
                onClick={(e) => hide(e)}
                label='Cancel'
                loading={isLoading}
                outlined
              />
            </div>
          </div>
        )}
      ></Dialog>
    </>
  )
}

ActivityProceduresEdit.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const { id } = ctx.props.query
    const taskRes = await activityproceduresService.getAllTask()
    const tasks = taskRes.data
      .map((x) => {
        return { name: x.code, value: x.code } as KeyValue
      })
      .sort((a, b) => a.name.localeCompare(b.name))

    const data = await activityproceduresService.getById(id)

    const locationSelected =
      await activityproceduresService.getLocationListById(data.locationId)

    data.subtaskActions.forEach((x, i) => {
      x.seq = i
    })
    const actions = await activityproceduresService.getActionList()

    ctx.props = {
      ...ctx.props,
      tasks,
      data,
      actions,
      id,
      locationSelected,
    }
    return ctx
  },
  {},
  {
    redirectPath: '/guardtour/activityprocedures',
    accessPage: PCODE.VIEWGUARDTOURACTIVITYPROCUDER,
  }
)
