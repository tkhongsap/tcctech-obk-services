import React from 'react'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import { KeyValue } from '@src/types/key-value'
import { activityproceduresService } from '@src/services/guardtour/activityprocedures/service'

import { schedulePlanService } from '@src/services/guardtour/scheduleplan/service'
import {
  IActionList,
  UpsertTaskManagement,
} from '@src/services/guardtour/task-management/model'
import { TaskManagementUpsert } from '@components/guardtour/task-management/task-management-upsert'
import { ILocationListRecord } from '@src/services/guardtour/activityprocedures/model'

type Props = {
  socmember: KeyValue[]
  actions: IActionList[]
  locations: {
    buildings: ILocationListRecord[]
    floors: ILocationListRecord[]
    units: ILocationListRecord[]
  }
}

export default function TaskCreate(props: Props) {
  const { socmember, actions, locations } = props
  const formData = new UpsertTaskManagement()
  return (
    <>
      <TaskManagementUpsert
        MODE='CREATE'
        formData={formData}
        actions={actions}
        socmember={socmember}
        locations={locations}
        statusDropdown={[]}
        locationRef={{
          buildingRefId: 0,
          floorRefId: 0,
          unitRefId: 0,
        }}
      />
    </>
  )
}
TaskCreate.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const socmemberPromise = schedulePlanService.getSocMember().then((res) =>
      res.map((x) => {
        return { name: x.name, value: x.id } as KeyValue
      })
    )
    const actionsPromise = activityproceduresService.getActionList()

    const result = await Promise.all([socmemberPromise, actionsPromise])

    const socmember = result[0]
    const actions = result[1]

    const buildings = await activityproceduresService.getLocationList(1)

    let locations: {
      buildings: ILocationListRecord[]
      floors: ILocationListRecord[]
      units: ILocationListRecord[]
    } = {
      buildings: buildings,
      floors: [],
      units: [],
    }

    ctx.props = { ...ctx.props, socmember, actions, locations }
    return ctx
  },
  {},
  {
    redirectPath: '/guardtour/task-management',
    accessPage: PCODE.VIEWGUARDTOURTASKMANAGEMENT,
  }
)
