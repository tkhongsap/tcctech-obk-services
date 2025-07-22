import { getMockSuccessResponse } from '@src/services/http-client'
import mockdata from './mockdata.json'

class WorkRequestServiceClass {
  getTaskWorkRequest() {
    return [
      {
        id: '1000',
        name: 'Task one',
      },
      {
        id: '1001',
        name: 'Task Two',
      },
      {
        id: '1002',
        name: 'Task Three',
      },
    ]
  }

  getWRequestMini() {
    // const data = mockdata
    return Promise.resolve(this.getTaskWorkRequest().slice(0, 5))
  }

  getAll() {
    const data = mockdata
    return getMockSuccessResponse(data)
  }
}

export const WorkRequestService = new WorkRequestServiceClass()
