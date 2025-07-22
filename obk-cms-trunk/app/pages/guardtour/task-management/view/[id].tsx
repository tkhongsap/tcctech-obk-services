import React from 'react'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import { KeyValue } from '@src/types/key-value'
import { activityproceduresService } from '@src/services/guardtour/activityprocedures/service'
import { schedulePlanService } from '@src/services/guardtour/scheduleplan/service'
import {
  IGetTaskManagementById,
  UpsertTaskManagement,
} from '@src/services/guardtour/task-management/model'
import { IActionList } from '@src/services/guardtour/task-management/model'
import { taskManagementService } from '@src/services/guardtour/task-management/service'
import { TaskManagementUpsert } from '@components/guardtour/task-management/task-management-upsert'
import { ILocationListRecord } from '@src/services/guardtour/activityprocedures/model'

type Props = {
  socmember: KeyValue[]
  actions: IActionList[]
  id: string
  data: IGetTaskManagementById
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

export default function TaskView(props: Props) {
  const {
    socmember,
    actions,
    id,
    data,
    statusDropdown,
    locationRef,
    locations,
  } = props

  const formData = new UpsertTaskManagement(data)

  return (
    <>
      <TaskManagementUpsert
        MODE='VIEW'
        data={data}
        formData={formData}
        actions={actions}
        id={id}
        socmember={socmember}
        statusDropdown={statusDropdown}
        locationRef={locationRef}
        locations={locations}
      />
    </>
  )
}
TaskView.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const { id } = ctx.props.query
    const socmemberPromise = schedulePlanService.getSocMember().then((res) =>
      res.map((x) => {
        return { name: x.name, value: x.id } as KeyValue
      })
    )

    const actionsPromise = activityproceduresService.getActionList()

    const dataPromise = taskManagementService.getById(id)
    const statusDropdownPromise = taskManagementService.getListStatus()

    const result = await Promise.all([
      socmemberPromise,
      actionsPromise,
      dataPromise,
      statusDropdownPromise,
    ])
    const socmember = result[0]
    const actions = result[1]
    const data = result[2]
    const statusDropdown = result[3]

    const locationSelected =
      await activityproceduresService.getLocationListById(data.locationId!)

    let currentLocation: ILocationListRecord = {
      ...locationSelected,
      locationCode: '',
      name: '',
      type: '',
      parentId: locationSelected.parentLocationId,
    }

    let locationRef = { buildingRefId: 0, floorRefId: 0, unitRefId: 0 }
    let locations: {
      buildings: ILocationListRecord[]
      floors: ILocationListRecord[]
      units: ILocationListRecord[]
    } = {
      buildings: [],
      floors: [],
      units: [],
    }

    if (currentLocation.typeId === 3) {
      locationRef.unitRefId = currentLocation.refId
      const res = await activityproceduresService.getLocationSelected(
        currentLocation.parentId
      )
      locationRef.floorRefId = currentLocation.refId
      const units = await activityproceduresService.getLocationList(
        3,
        currentLocation.parentId
      )
      locations.units = units
      currentLocation = res
    }

    if (currentLocation.typeId === 2) {
      const res = await activityproceduresService.getLocationSelected(
        currentLocation.parentId
      )
      locationRef.floorRefId = currentLocation.refId
      locationRef.buildingRefId = res.refId
      const floors = await activityproceduresService.getLocationList(
        2,
        currentLocation.parentId
      )
      locations.floors = floors
      currentLocation = res
    }

    if (currentLocation.typeId === 1) {
      const buildings = await activityproceduresService.getLocationList(1)
      locationRef.buildingRefId = currentLocation.refId
      locations.buildings = buildings
    }

    ctx.props = {
      ...ctx.props,
      socmember,
      actions,
      id,
      data,
      statusDropdown,
      locationRef,
      locations,
    }
    return ctx
  },
  {},
  {
    redirectPath: '/guardtour/task-management',
    accessPage: PCODE.VIEWGUARDTOURTASKMANAGEMENT,
  }
)
