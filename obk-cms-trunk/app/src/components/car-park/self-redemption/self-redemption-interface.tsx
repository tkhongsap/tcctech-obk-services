export interface IFilterSelfRedemption {
  filter?: string
  status?: string
  date?: string[]
}

export class FilterSelfRedemption implements IFilterSelfRedemption {
  filter?: string
  status?: string
  date?: string[]

  constructor(data?: IFilterSelfRedemption) {
    this.filter = data?.filter
    this.status = data?.status
    this.date = data?.date ?? []
  }
}
