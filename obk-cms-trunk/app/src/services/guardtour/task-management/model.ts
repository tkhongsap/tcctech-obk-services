export interface IGetTaskManagement {
  id: string
  name: string
  status: number
  statusText?: string
  memberId: string
  locationId?: string
  locationName: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  acknowleageBeforeMinutes: number
  startToEndDate: string
  subtasks: IGetSubTask[]
}

export class GetTaskManagement {
  id: string
  name: string
  status: number
  statusS?: string
  memberId: string
  locationId?: string
  locationName: string
  startDate: Date
  startTime: string
  endDate: Date
  endTime: string
  acknowleageBeforeMinutes: number
  subtasks: IGetSubTask[]

  constructor(data: IGetTaskManagement) {
    this.id = data?.id
    this.name = data?.name
    this.status = data?.status
    this.memberId = data?.memberId
    this.statusS = data.status.toString()
    this.locationId = data?.locationId
    this.locationName = data?.locationName
    this.startDate = new Date(data?.startDate)
    this.startTime = data?.startTime
    this.endTime = data?.endTime
    this.endDate = new Date(data?.endDate)
    this.acknowleageBeforeMinutes = data?.acknowleageBeforeMinutes
    this.subtasks = data?.subtasks
  }
}

export interface IGetTaskManagementById {
  id: string
  name: string
  status: number
  memberId: string
  locationName: string
  locationId?: string
  startDate: string
  startTime: string
  startDateTime: Date
  endDate: string
  endTime: string
  endDateTime: Date
  acknowleageBeforeMinutes: number
  startToEndDate: string
  subtasks: IGetSubTaskbyId
  cancelReason?: string
}

export class GetTaskManagementbyId {
  id: string
  name: string
  status: number
  statusS: string
  memberId: string
  locationName: string
  locationId?: string
  startDate: Date
  startTime: string
  endDate: Date
  endTime: string
  acknowleageBeforeMinutes: number
  subtasks: IGetSubTaskbyId
  cancelReason?: string

  constructor(data: IGetTaskManagementById) {
    this.id = data?.id
    this.name = data?.name
    this.status = data?.status
    this.memberId = data?.memberId
    this.locationName = data?.locationName
    this.startDate = new Date(data?.startDate)
    this.startTime = data?.startTime
    this.statusS = data?.status.toString()
    this.endTime = data?.endTime
    this.endDate = new Date(data?.endDate)
    this.acknowleageBeforeMinutes = data?.acknowleageBeforeMinutes
    this.subtasks = data?.subtasks
    this.locationId = data?.locationId
    this.cancelReason = data?.cancelReason
  }
}

export interface IFilterTaskManagement {
  filter?: string
  status?: number
  memberId?: string
  dateStart?: string
  dateEnd?: string
}

export class FilterTaskManagement implements IFilterTaskManagement {
  filter?: string
  memberId?: string
  status?: number
  dateStart?: string
  dateEnd?: string

  constructor(data?: IFilterTaskManagement) {
    this.filter = data?.filter
    this.memberId = data?.memberId
    this.status = data?.status
    this.dateStart = data?.dateStart
    this.dateEnd = data?.dateEnd
  }
}

export interface IGetTaskManagementRecord {
  paginate: {
    total: number
  }
  data: IGetTaskManagement[]
}

export interface IGetSubTaskbyId {
  data: [
    {
      id: string
      name: string
      status: string
      action: [
        {
          actionId: string
          name: string
        }
      ]
    }
  ]
}

export interface IGetSubTask {
  name: string
  statusId: 0
  actionIds: string[] | IActionList[]
}

export interface IActionList {
  id: string
  name: string
}

export interface ICreateTaskManagement {
  name: string
  statusId: number
  startDate: string
  endDate: string
  locationId: string
  memberId: string
  subtasks: IGetSubTask[]
}

export class CreateTaskManagement implements ICreateTaskManagement {
  name: string
  statusId: number
  startDate: string
  endDate: string
  locationId: string
  memberId: string
  subtasks: IGetSubTask[]

  constructor(data: ICreateTaskManagement) {
    this.name = data?.name
    this.statusId = data?.statusId
    this.startDate = data?.startDate
    this.endDate = data?.endDate
    this.locationId = data?.locationId
    this.memberId = data?.memberId
    this.subtasks = data?.subtasks
  }
}

export interface IUpsertTaskManagement {
  tid?: string
  name: string
  statusId?: string
  startDate?: Date | string
  endDate?: Date | string
  locationId: string
  memberId: string
  subtasks: IGetSubTask[]
  cancelReason?: string
  buildingRefId?: number
  floorRefId?: number
  unitRefId?: number
}

export class UpsertTaskManagement implements IUpsertTaskManagement {
  tid?: string
  name: string
  statusId?: string
  startDate?: Date | string
  endDate?: Date | string
  locationId: string
  memberId: string
  subtasks: IGetSubTask[]
  cancelReason?: string
  buildingRefId?: number
  floorRefId?: number
  unitRefId?: number

  constructor(
    data?: IGetTaskManagementById,
    locationRef?: {
      buildingRefId: number
      floorRefId: number
      unitRefId: number
    }
  ) {
    this.tid = data?.id
    this.name = data?.name ?? ''
    this.statusId =
      data?.status !== undefined ? data?.status.toString() : undefined
    this.startDate = data?.startDateTime
      ? new Date(data.startDateTime)
      : undefined
    this.endDate = data?.endDateTime ? new Date(data.endDateTime) : undefined
    this.locationId = data?.locationId ?? ''
    this.memberId = data?.memberId ?? ''
    const subtasks =
      data?.subtasks.data.map((a) => {
        return {
          name: a.name,
          statusId: 0,
          actionIds: a.action.map((action) => action.actionId),
        } as IGetSubTask
      }) ?? []
    this.subtasks = data?.subtasks ? subtasks : []
    this.cancelReason = data?.cancelReason
    this.buildingRefId = locationRef?.buildingRefId
    this.floorRefId = locationRef?.floorRefId
    this.unitRefId = locationRef?.unitRefId
  }
}

export interface ICancelTask {
  tid?: string
  statusId: string
  cancelReason: string
}

export interface GetTaskActivity {
  id: string
  code: string
  taskName: string
  locationId: string
  subtaskActions: SubtaskAction[]
  location: string
  updatedDate: Date
  updatedBy: string
}

export interface SubtaskAction {
  name: string
  actions: string[]
}
