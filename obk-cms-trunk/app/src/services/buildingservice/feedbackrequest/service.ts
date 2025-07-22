import { getMockSuccessResponse } from '@src/services/http-client'
import mockdata from './mockdata.json'
import { ICreateAWorkOrderModel } from './model'

class FeedbackRequestService {
  getAll() {
    const data = mockdata
    return getMockSuccessResponse(data)
  }

  get(feedbackId: string) {
    const data = mockdata.find((x) => x.id === feedbackId)
    return getMockSuccessResponse(data)
  }

  createWorkOrder(data: ICreateAWorkOrderModel) {
    console.log(data)
    return getMockSuccessResponse('success')
  }
}

export const feedbackRequestService = new FeedbackRequestService()
