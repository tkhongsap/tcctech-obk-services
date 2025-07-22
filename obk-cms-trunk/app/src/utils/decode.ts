import { CSID, TOKEN_KEY, USER_TOKEN_KEY } from '@src/authProvider/constants'
import { getCookie } from 'cookies-next'
import { jwtDecode } from 'jwt-decode'
import nookies from 'nookies'

export const decodeAccessToken = () => {
  const accessToken = nookies.get()[USER_TOKEN_KEY]
  const result = jwtDecode(accessToken)
  return result
}

export const decodeKeyCloakToken = (ctx?: any) => {
  const token = getCookie(TOKEN_KEY, ctx)
  if (!token) {
    return null
  }
  const decode = jwtDecode<{ preferred_username: string }>(token!.toString())
  return decode.preferred_username ?? null
}

export const getCookieCSID = (ctx?: any) => {
  const csid = getCookie(CSID, ctx)
  return csid ?? ''
}
