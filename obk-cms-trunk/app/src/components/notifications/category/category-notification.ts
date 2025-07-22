export class FilterCategory implements IFilterCategory {
  order?: number
  id:
    | {
        value: string
        operator: string
      }
    | undefined
  english?: string
  thai?: string
  chinese?: string
  count?: number
  status?: string
  lastupdate?: Date

  constructor(data: IFilterCategory | null) {
    this.order = data?.order
    this.id = data?.id
    this.english = data?.english
    this.thai = data?.thai
    this.chinese = data?.chinese
    this.count = data?.count
    this.status = data?.status
    this.lastupdate = data?.lastupdate
  }
}

export interface IFilterCategory {
  order?: number
  id:
    | {
        value: string
        operator: string
      }
    | undefined
  english?: string
  thai?: string
  chinese?: string
  count?: number
  status?: string
  lastupdate?: Date
}
