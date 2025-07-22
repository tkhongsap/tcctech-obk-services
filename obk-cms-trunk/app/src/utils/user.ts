import { decodeAccessToken } from './decode'
import * as OB_IAM_SDK from 'ob-iam-sdk'

export const getUserFullnameFromToken = async () => {
  const userData = decodeAccessToken()
  const { sub } = userData
  const user = await OB_IAM_SDK.client
    .accountShow(sub || '')
    .catch((err) => console.log('Cannot get user account', err))
  const fullName = `${user?.data?.data?.account?.profile?.first_name || ''} ${
    user?.data?.data?.account?.profile?.middle_name || ''
  } ${user?.data?.data?.account?.profile?.last_name || ''}`
  return user?.data?.data?.account?.profile?.first_name ? fullName : '-'
}
