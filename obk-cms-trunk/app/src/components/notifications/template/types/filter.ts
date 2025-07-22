export class FilterNotificationTemplate implements IFilterNotificationTemplate {
  name?: string
  category?: string
  status?: string
  tags?: string

  constructor(data?: IFilterNotificationTemplate) {
    this.name = data?.name
    this.category = data?.category
    this.status = data?.status
    this.tags = data?.tags
  }
}

export interface IFilterNotificationTemplate {
  name?: string
  category?: string
  status?: string
  tags?: string
}
