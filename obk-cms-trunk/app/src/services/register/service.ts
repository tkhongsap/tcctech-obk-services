import { httpClient } from '../http-client'
import { IRegisterUpsertModel } from './model'
class RegisterService {
  get(id: string, invitecode: string) {
    return httpClient
      .get<boolean>(
        '/api/v1/Member/InviteMember?id=' + id + '&invitemember=' + invitecode
      )
      .then((res) => res.data)
  }

  activemember(data: IRegisterUpsertModel) {
    return httpClient.put<string>('/api/v1/member/active', data)
  }
}

export const registerService = new RegisterService()
