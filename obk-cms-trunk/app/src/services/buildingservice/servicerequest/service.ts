import { getMockSuccessResponse } from '@src/services/http-client'
import mockdata from './mockdata.json'
import { IServiceRequest } from './model'

class ServiceRequestService {
  getAll() {
    const data = mockdata
    return getMockSuccessResponse(data)
  }

  get(ticketID: string) {
    const data = mockdata.find((x) => x.id === ticketID)
    return getMockSuccessResponse(data)
  }

  reject(data: IServiceRequest) {
    console.log(data)
    return getMockSuccessResponse('success')
  }
}

export const serviceRequestService = new ServiceRequestService()
