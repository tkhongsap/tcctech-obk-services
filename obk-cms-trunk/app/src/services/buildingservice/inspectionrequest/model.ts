export interface IGetInspectionRequest {
  id: string
  title: string
  description: string
  status: string
  comment: string
  location: string
  image: string[]
  priority: string
  srEventNames: string
  srEventId: string[]
  srEventOther: string
  srProblemNames: string
  srProblemId: string[]
  srProblemOther: string
  locationType: string | null
  createdDate: string
}

export class GetInspectionRequest {
  id: string
  title: string
  description: string
  status: string
  comment: string
  location: string
  image: string[]
  priority: string
  srEventNames: string
  srEventId: string[]
  srEventOther: string
  srProblemNames: string
  srProblemId: string[]
  srProblemOther: string
  locationType: string | null
  createdDate: string

  constructor(data?: GetInspectionRequest) {
    this.id = data?.id ?? ''
    this.title = data?.title ?? ''
    this.description = data?.description ?? ''
    this.status = data?.status ?? ''
    this.comment = data?.comment ?? ''
    this.location = data?.location ?? ''
    this.image = data?.image ?? []
    this.priority = data?.priority ?? ''
    this.srEventNames = data?.srEventNames ?? ''
    this.srEventId = data?.srEventId ?? []
    this.srEventOther = data?.srEventOther ?? ''
    this.srProblemNames = data?.srProblemNames ?? ''
    this.srProblemId = data?.srProblemId ?? []
    this.srProblemOther = data?.srProblemOther ?? ''
    this.locationType = data?.locationType ?? null
    this.createdDate = data?.createdDate ?? ''
  }
}

export interface iGetEventType {
  id?: string
  event?: string
}

export interface iGetProblemType {
  id?: string
  problem?: string
}

export interface IGetInspectionRequestRecord {
  paginate: {
    total: number
  }
  total: number
  data: IGetInspectionRequest[]
}

export interface IGetEventTypeRecord {
  data: IEventTypeRecord[]
}

export interface IEventTypeRecord {
  id?: string
  name_th: string
  name_en: string
}

export interface IGetProblemTypeRecord {
  data: IProblemTypeRecord[]
}

export interface IProblemTypeRecord {
  id?: string
  name_th: string
  name_en: string
}
