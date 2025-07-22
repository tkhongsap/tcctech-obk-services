import { formatTimeOnly } from '@src/utils/format-time'

export interface IGetSchedulePlan {
  memberName: string
  id: string
  route: string
  frequency: string[]
  startTime: string
  endTime: string
  memberId: string
  isActive: boolean
}

export class GetSchedulePlan {
  memberName: string
  id: string
  route: string
  frequency: string[]
  startTime: Date
  endTime: Date
  memberId: string

  constructor(data: IGetSchedulePlan) {
    this.memberName = data?.memberName
    this.id = data?.id
    this.route = data?.route
    this.frequency = Array.isArray(data?.frequency) ? data.frequency : []
    const startDateNow = new Date()
    const endDateNow = new Date()

    startDateNow.setHours(
      Number(data.startTime.split(':')[0]),
      Number(data.startTime.split(':')[1]),
      Number(data.startTime.split(':')[2])
    )
    endDateNow.setHours(
      Number(data.endTime.split(':')[0]),
      Number(data.endTime.split(':')[1]),
      Number(data.endTime.split(':')[2])
    )

    this.startTime = startDateNow
    this.endTime = endDateNow
    this.memberId = data?.memberId
  }
}

export interface IEditSchedulePlan {
  sdpid: string
  route: string
  frequency: string[]
  startTime: string
  endTime: string
  memberId: string
}

export class EditSchedulePlan implements IEditSchedulePlan {
  sdpid: string
  route: string
  frequency: string[]
  startTime: string
  endTime: string
  memberId: string

  constructor(data: IGetSchedulePlan) {
    this.sdpid = data.id
    this.route = data?.route
    this.frequency = Array.isArray(data?.frequency) ? data.frequency : []
    this.startTime = formatTimeOnly(data?.startTime)
    this.endTime = formatTimeOnly(data?.endTime)
    this.memberId = data?.memberId
  }
}
export interface IGetSocMember {
  data: ISocMember[]
}

export interface ISocMember {
  id: string
  name: string
}

export interface IFilterSchedulePlan {
  Filter?: string
  StartTime?: string
  EndTime?: string
  RouteId?: string
}
export class FilterSchedulePlan implements IFilterSchedulePlan {
  Filter?: string
  StartTime?: string
  EndTime?: string
  RouteId?: string

  constructor(data?: IFilterSchedulePlan) {
    this.Filter = data?.Filter
    this.StartTime = data?.StartTime
    this.EndTime = data?.EndTime
    this.RouteId = data?.RouteId
  }
}

export interface IGetSchedulePlanRoute {
  activityId: string
  activity: string
}
export interface IGetSchedulePlanRecord {
  paginate: {
    total: number
  }
  data: IGetSchedulePlan[]
}
export interface IGetSchedulePlanRouteRecord {
  total: number
  data: ISchedulePlanRouteRecord[]
}

export interface ISchedulePlanRouteRecord {
  id?: string
  code: string
}

export interface IGetFrequencyData {
  frequencyId: string[]
  frequency: string[]
}

export interface ISchedulePlanRouteSubTaskRecord {
  name: string
  action: []
}

export interface IUpsertSchedulePlan {
  route: string
  frequency: string[]
  startTime: string
  endTime: string
  memberId: string
}

export class UpsertSchedulePlan implements IUpsertSchedulePlan {
  route: string
  frequency: string[]
  startTime: string
  endTime: string
  memberId: string

  constructor(data: IGetSchedulePlan) {
    this.route = data?.route
    this.frequency = Array.isArray(data?.frequency) ? data.frequency : []
    this.startTime = data?.startTime
    this.endTime = data?.endTime
    this.memberId = data?.memberId
  }
}
