import { SuccessResponse, httpClient } from '@src/services/http-client'
import { IMyAccount } from './model'

class MyAccountService {
  get(id: string) {
    return httpClient.get<SuccessResponse<IMyAccount[]>>(
      `/api/v1/Member?id=${id}`
    )
  }
}

export const myAccountService = new MyAccountService()
