export interface IGetActivityProcedures {
  id: string
  code: string
  taskName: string
  subtaskActions: IGetSubTask[]
  location: string
  locationId: string
  // buildingZoneName?: string
  // floorName?: string
  // space?: string
}

export class GetActivityProcedures {
  id: string
  code: string
  taskName: string
  subtaskActions: IGetSubTask[]
  location: string
  locationId: string

  constructor(data: IGetActivityProcedures, actions: IActionList[]) {
    this.id = data?.id
    this.code = data?.code
    this.taskName = data?.taskName
    this.subtaskActions = data?.subtaskActions.map((x) => {
      const subtask: IGetSubTask = {
        name: x.name,
        actions: x.actions.map(
          (action) => actions.find((a) => a.id === action)!
        ),
      }
      return subtask
    })
    this.location = data?.location
    this.locationId = data?.locationId
  }
}

export interface IGetSubTask {
  id?: string
  seq?: number
  name: string
  actions: string[] | IActionList[]
}

export interface IFilterActivityProcedures {
  // id?: string
  filter?: string
  // searchTerm?: string
}

export class FilterActivityProcedures implements IFilterActivityProcedures {
  // id?: string
  filter?: string
  // searchTerm?: string

  constructor(data?: IFilterActivityProcedures) {
    // this.id = data?.id
    this.filter = data?.filter
    // this.searchTerm = data?.searchTerm
  }
}

export interface IGetActivityProceduresRecord {
  paginate: {
    total: number
  }
  data: IGetActivityProcedures[]
}

export interface IActivityProceduresTaskRecord {
  id?: string
  code: string
}

export interface IGetActivityProceduresTaskRecord {
  total: number
  data: IActivityProceduresTaskRecord[]
}

export interface IActivityProceduresLocationRecord {
  location: string
}

export interface IGetActivityProceduresLocationRecord {
  total: number
  data: IActivityProceduresLocationRecord[]
}

export interface IActionList {
  id: string
  name: string
}

export interface ILocationListRecord {
  lid: string
  locationCode: string
  name: string
  typeId: number
  type: string
  parentId: number
  refId: number
}

export interface ILocationSelected {
  lid: string
  buildingZoneName: string
  floorName: string
  space: string
  typeId: number
  parentLocationId: number
  refId: number
}

export interface IGetLocationListRecord {
  total: number
  data: ILocationListRecord[]
}

export interface ICreatetActivityProcedures {
  id?: string
  code: string
  taskName: string
  subtaskActions: IGetSubTask[]
  locationId: string
}

export class CreateActivityProcedures implements ICreatetActivityProcedures {
  id?: string
  code: string
  taskName: string
  subtaskActions: IGetSubTask[]
  locationId: string

  constructor(data: ICreatetActivityProcedures) {
    this.id = data?.id
    this.code = data?.code
    this.taskName = data?.taskName
    this.subtaskActions = data?.subtaskActions
    this.locationId = data?.locationId
  }
}

export interface IEditActivityProcedures {
  id?: string
  code?: string
  taskName: string
  subtaskActions: IGetSubTask[]
  locationId: string
  buildingRefId?: number
  floorRefId?: number
  unitRefId?: number
}

export class EditActivityProcedures implements IEditActivityProcedures {
  id?: string
  code?: string
  taskName: string
  subtaskActions: IGetSubTask[]
  locationId: string
  buildingRefId?: number
  floorRefId?: number
  unitRefId?: number

  constructor(data: IGetActivityProcedures, actions: IActionList[]) {
    this.id = data?.id
    this.code = data?.code
    this.taskName = data?.taskName
    this.subtaskActions = data?.subtaskActions.map((x) => {
      const subtask: IGetSubTask = {
        name: x.name,
        actions: x.actions.map(
          (action) => actions.find((a) => a.id === action)!.id
        ),
      }
      return subtask
    })
    this.locationId = data?.locationId
  }
}

export type VisibleDialog = {
  subtaskIndex?: number
  deleteSubtaskIndex?: number
}
