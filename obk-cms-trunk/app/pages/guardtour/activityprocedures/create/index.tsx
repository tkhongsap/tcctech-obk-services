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
import * as OBBMSSDK from 'ob-bms-sdk'
import { PCODE } from '@src/data/constants/privilege'
import DropdownField from '@components/forms/components/dropdown-field'
import { KeyValue } from '@src/types/key-value'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import { defaultToastMessage } from '@src/utils/default-toast'
// eslint-disable-next-line unused-imports/no-unused-imports-ts
import {
  IActionList,
  ICreatetActivityProcedures,
  CreateActivityProcedures,
  IGetSubTask,
  ILocationListRecord,
} from '@src/services/guardtour/activityprocedures/model'
import { activityproceduresService } from '@src/services/guardtour/activityprocedures/service'
import { ActivityProceduresActivity } from '@components/guardtour/activityprocedures/activityprocedures-activity'

type Props = { tasks: KeyValue[]; locations: any[] }

export default function ActivityProceduresCreate(props: Props) {
  OBBMSSDK.setBaseUrl(process.env.BMS_BASEURL || '')
  const [visiblePublishDialog, setVisiblePublishDialog] = useState(false)
  const { setMenuName, setMenuAction } = useLayoutContext()
  const [actionsTag, setActionsTag] = useState<IActionList[]>([])
  const router = useRouter()
  const [routeNameError, setRouteNameError] = useState<string | undefined>()
  const formRef = useRef<FormControllerRef<any>>(null)

  const [buildings, setBuildings] = useState<any[]>([])
  const [floors, setFloors] = useState<any[]>([])
  const [units, setUnits] = useState<any[]>([])

  const [selectedBuilding, setSelectedBuilding] = useState<any>(null)
  const [selectedFloor, setSelectedFloor] = useState<any>(null)
  const [selectedUnit, setSelectedUnit] = useState<any>(null)

  let data: ICreatetActivityProcedures = {
    id: '',
    code: '',
    taskName: '',
    subtaskActions: [{ actions: [], name: '', id: uuidv4() }],
    locationId: '',
  }
  const formData = new CreateActivityProcedures(data)

  const {} = props

  setMenuName('Activity Procedures')

  const checkDuplicateAndProceed = async () => {
    const value = formRef.current?.getValues()
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

  const onPublish = async () => {
    const currentValue: ICreatetActivityProcedures & {
      building?: any
      floor?: any
      unit?: any
    } = formRef.current?.getValues()

    const locationId =
      selectedUnit?.lid || selectedFloor?.lid || selectedBuilding?.lid || ''

    const { building, floor, unit, ...filteredCurrentValue } = currentValue

    const value: ICreatetActivityProcedures = {
      ...filteredCurrentValue,
      id: uuidv4(),
      locationId: locationId,
      subtaskActions: currentValue.subtaskActions.map(
        (activity: IGetSubTask) => ({
          name: activity.name,
          actions: activity.actions.map((action: any) => action.id),
        })
      ),
    }

    setVisiblePublishDialog(false)

    const promise = activityproceduresService.createActivity(value).then(() => {
      router.push({
        pathname: '/guardtour/activityprocedures',
      })
    })
    toast.promise(promise, defaultToastMessage)
  }

  useEffect(() => {
    setMenuName('Activity Procedures')
    setMenuAction(buttonAction)
  }, [setMenuName])

  useEffect(() => {
    activityproceduresService
      .getActionList()
      .then((data) => setActionsTag(data))
  }, [])

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const res = await activityproceduresService.getLocationList(1)

        if (Array.isArray(res)) {
          const buildingOptions = res.map((building: ILocationListRecord) => ({
            label: `${building.name} (${building.locationCode})`,
            value: {
              lid: building.lid,
              refId: building.refId,
            },
          }))
          setBuildings(buildingOptions)
        } else {
          setBuildings([])
        }
      } catch (error) {
        toast.error('Unable to fetch buildings.')
        setBuildings([])
      }
    }

    fetchBuildings()
  }, [])

  const handleBuildingChange = async (building: any) => {
    if (!building || !building.refId) {
      console.error('Invalid building data or missing refId:', building)
      return
    }

    setSelectedBuilding(building)
    setSelectedFloor(null)
    setSelectedUnit(null)
    setFloors([])
    setUnits([])

    try {
      const res = await activityproceduresService.getLocationList(
        2,
        building.refId
      )

      if (Array.isArray(res)) {
        const floorOptions = res.map((floor: ILocationListRecord) => ({
          label: floor.name,
          value: {
            lid: floor.lid,
            refId: floor.refId,
          },
        }))
        setFloors(floorOptions)
      } else {
        console.error('No valid floor data received:', res)
      }
    } catch (error) {
      console.error('Error fetching floors:', error)
      toast.error('Error fetching floors')
    }
  }

  const handleFloorChange = async (floor: any) => {
    if (!floor || !floor.refId) {
      console.error('Invalid floor data or missing refId:', floor)
      return
    }

    setSelectedFloor(floor)
    setSelectedUnit(null)
    setUnits([])

    try {
      const res = await activityproceduresService.getLocationList(
        3,
        floor.refId
      )

      if (Array.isArray(res)) {
        const unitOptions = res.map((unit: ILocationListRecord) => ({
          label: unit.name,
          value: {
            lid: unit.lid,
            refId: unit.refId,
          },
        }))
        setUnits(unitOptions)
      } else {
        console.error('No valid unit data received:', res)
      }
    } catch (error) {
      console.error('Error fetching units:', error)
      toast.error('Error fetching units')
    }
  }

  const OnCancel = () => {
    router.push({
      pathname: '/guardtour/activityprocedures',
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
              Create new
            </span>

            <div className='formgrid grid mb-3'>
              <div className='field col-12 md:col-4'>
                <TextField
                  label='Route'
                  name='code'
                  rules={{ required: 'Route is required.' }}
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
                  name='building'
                  options={buildings}
                  value={selectedBuilding}
                  onChange={(e) => {
                    if (e.value) {
                      handleBuildingChange(e.value)
                    } else {
                      setSelectedBuilding(null)
                      setSelectedFloor(null)
                      setSelectedUnit(null)
                      setFloors([])
                      setUnits([])
                    }
                  }}
                  placeholder='Select Building'
                  showClear
                  filter
                  rules={{ required: 'Building is required.' }}
                />
              </div>
              <div className='field col-12 md:col-4'>
                <DropdownField
                  label='Floor'
                  name='floor'
                  options={floors}
                  value={selectedFloor}
                  onChange={(e) => {
                    if (e.value) {
                      handleFloorChange(e.value)
                    } else {
                      setSelectedFloor(null)
                      setSelectedUnit(null)
                      setUnits([])
                    }
                  }}
                  placeholder='Select Floor'
                  showClear
                  filter
                  disabled={!selectedBuilding}
                />
              </div>
              <div className='field col-12 md:col-4'>
                <DropdownField
                  label='Unit'
                  name='unit'
                  options={units}
                  value={selectedUnit}
                  onChange={(e) => {
                    setSelectedUnit(e.value || null)
                  }}
                  placeholder='Select Unit'
                  showClear
                  filter
                  disabled={!selectedFloor}
                />
              </div>
            </div>

            <ActivityProceduresActivity actionsTag={actionsTag} />
          </div>
        </div>
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
ActivityProceduresCreate.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/guardtour/activityprocedures',
    accessPage: PCODE.VIEWGUARDTOURACTIVITYPROCUDER,
  }
)
