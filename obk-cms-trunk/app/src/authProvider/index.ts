import { AuthBindings } from '@refinedev/core'
import { setCookie, getCookie, deleteCookie } from 'cookies-next'
import { ACCOUNT_ID_KEY, CSID, MID, TOKEN_KEY, USER_NAME } from './constants'
import axios from 'axios'
import { memberService } from '@src/services/member/service'
import { decodeKeyCloakToken } from '@src/utils/decode'
import * as OB_IAM_SDK from 'ob-iam-sdk'
import { RegisterAuthRequestBody } from 'ob-iam-sdk/dist/api'
import { IPersonalInfo } from '@src/services/member/model'

const getAccountId = async (email: string) => {
  return OB_IAM_SDK.client
    .accountAccountId_1(email.toLocaleLowerCase())
    .then((res) => {
      console.log('Get account id from IAM success', res.data.data?.account_id)
      setCookie(ACCOUNT_ID_KEY, res.data.data?.account_id)
    })
}

const loginWithIAM = async (member: IPersonalInfo) => {
  getAccountId(member.email).catch(async (err) => {
    console.log('Get account id from IAM fail', err.response)
    if (err.response?.data?.error?.message === 'Account not found') {
      const nameArr = member.name.split(' ')
      const registerIAMBody = {
        profile: {
          first_name: nameArr[0],
          last_name: nameArr[1] || '',
          dob: new Date().toISOString(),
        },
        identities: {
          provider: 'keycloak',
          identifier: member.email,
        },
        push_token: {
          value: '',
          type: '',
        },
        device: {
          device_id: 'cms',
          os: 'android',
        },
      } as RegisterAuthRequestBody
      await OB_IAM_SDK.client
        .authRegister(registerIAMBody)
        .then(() => getAccountId(member.email))
        .catch((err) => {
          console.log('Register IAM failed', err.response)
        })
    }
  })
}

export const authProvider: AuthBindings = {
  login: async ({ email, username, password, remember }) => {
    console.log(email)
    console.log(remember)
    const client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_URL,
    })
    return await client
      .post('/api/auth/login', { username: username, password: password })
      .then(async (res) => {
        const token = res.data?.access_token

        setCookie(TOKEN_KEY, token, {
          maxAge: 60 * 60,
          path: '/',
        })

        const auth = getCookie(TOKEN_KEY)
        decodeKeyCloakToken(auth)
        const member = await memberService.getByKeycloakId(
          decodeKeyCloakToken(auth)!
        )

        setCookie(USER_NAME, member.data.name, {
          maxAge: 60 * 60,
          path: '/',
        })

        if (member.data.status === 2) {
          loginWithIAM(member.data)

          setCookie(MID, member.data?.mid, {
            maxAge: 60 * 60,
            path: '/',
          })

          const isObk = member.data.csid.includes(
            '3075169a-bb4c-463f-a602-dac99228ceac'
          )
          if (isObk) {
            setCookie(CSID, '3075169a-bb4c-463f-a602-dac99228ceac', {
              maxAge: 60 * 60,
              path: '/',
            })
          } else {
            setCookie(CSID, '9b84961b-1de6-445b-bd19-12430950d226', {
              maxAge: 60 * 60,
              path: '/',
            })
          }

          return {
            success: true,
            redirectTo: '/',
          }
        } else {
          deleteCookie(TOKEN_KEY)
          deleteCookie(ACCOUNT_ID_KEY)
          deleteCookie(CSID)
          let errmessage = 'member is suspend'
          if (member.data.status === 1) {
            errmessage = 'member is pending'
          }
          return {
            success: false,
            error: {
              message: 'Login failed',
              name: errmessage,
            },
          }
        }
      })
      .catch(() => {
        deleteCookie(TOKEN_KEY)
        deleteCookie(ACCOUNT_ID_KEY)
        deleteCookie(CSID)
        return Promise.reject({
          success: false,
          error: {
            message: 'Login failed',
            name: 'Invalid email or password',
          },
        })
      })
  },
  logout: async () => {
    deleteCookie(TOKEN_KEY)
    deleteCookie(ACCOUNT_ID_KEY)
    deleteCookie(CSID)
    deleteCookie(MID)
    deleteCookie(USER_NAME)
    return {
      success: true,
      redirectTo: '/login',
    }
  },
  check: async (ctx: any) => {
    const auth = getCookie(TOKEN_KEY, ctx)

    if (auth) {
      return {
        authenticated: true,
      }
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: '/login',
    }
  },
  getPermissions: async () => {
    const auth = getCookie(TOKEN_KEY)
    if (auth) {
      decodeKeyCloakToken(auth)
      const res = await memberService.getByKeycloakId(
        decodeKeyCloakToken(auth)!
      )
      if (res.data.status !== 2) {
        deleteCookie(TOKEN_KEY)
        deleteCookie(ACCOUNT_ID_KEY)
        deleteCookie(CSID)
      }
      return res.data.roles.flatMap((x) => x.privilegeItems ?? [])
    }
    return []
  },
  getIdentity: async () => {
    const auth = getCookie(TOKEN_KEY)
    if (auth) {
      const parsedUser = JSON.parse(auth)
      return parsedUser
    }
    return null
  },
  onError: async (error) => {
    console.error(error)
    return { error }
  },
}
