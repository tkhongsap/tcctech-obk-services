import * as OB_BMS_SDK from 'ob-bms-sdk'
import * as OB_IAM_SDK from 'ob-iam-sdk'

import { MemberIndexInterface, VisitorTokenData } from 'ob-bms-sdk/dist/api'
import { first } from 'lodash'

class SelfRedemptionService {
  public async getInviteDetail(id: string) {
    try {
      const result = await OB_BMS_SDK.client.visitorTokensIndex(id)
      if (result.data.data) {
        const data = result!.data.data as VisitorTokenData[]
        const detail = first(data)
        return detail
      }
    } catch (error) {
      console.log(JSON.stringify(error))
    }
  }
  public async getTokenDetail(token: string) {
    try {
      const result = await OB_IAM_SDK.client.tokensShow(token)
      if (result.data.data?.token) {
        return result.data.data?.token
      }
    } catch (error) {
      console.log(JSON.stringify(error))
    }
  }
  public async getPersonId(id: string): Promise<string | undefined> {
    try {
      const result = await OB_BMS_SDK.client.membersIndex(undefined, id)

      if (result.data.data) {
        const data = result.data.data as MemberIndexInterface[]
        const member = first(data)
        const personId = member?.id
        return personId
      }
    } catch (error) {
      console.log(JSON.stringify(error))
    }
  }
}
const selfRedemptionService = new SelfRedemptionService()

export default selfRedemptionService
