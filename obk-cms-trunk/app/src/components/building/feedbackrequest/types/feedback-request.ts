export class FilterFeedbackRequest implements IFilterFeedbackRequest {
  title:
    | {
        value: string
        operator: string
      }
    | undefined
  datetime?: Date
  location?: string[]
  problemtype?: string
  issue?: string
  status?: string
  keyword?: string

  constructor(data: IFilterFeedbackRequest | null) {
    this.title = data?.title
    this.datetime = data?.datetime
    this.location = data?.location
    this.problemtype = data?.problemtype
    this.issue = data?.issue
    this.status = data?.status
    this.keyword = data?.keyword
  }
}

export interface IFilterFeedbackRequest {
  title:
    | {
        value: string
        operator: string
      }
    | undefined
  datetime?: Date
  location?: string[]
  problemtype?: string
  issue?: string
  status?: string
  keyword?: string
}

export interface IFeedbackRequest {
  id: string
  issue: string
  author: string
  status: string
  datetime: string
  location: string
  problemtype: string
  feedbackcode: string
  description: string
  image: string
  authorname: string
  email: string
  phonenumber: string
}
