import axios from 'axios'
import nookies from 'nookies'

import { USER_TOKEN_KEY } from '@src/authProvider/constants'

const baseURLObDocument: string = process.env.OB_DOCUMENT_API_BASE_URL || ''
const baseNextApiURL: string = process.env.NEXT_PUBLIC_URL || ''

export const api = axios.create()

export const documentApi = axios.create({ baseURL: baseURLObDocument })

export const nextApi = axios.create({ baseURL: `${baseNextApiURL}/api` })

api.interceptors.request.use((request) => {
  const cookies = nookies.get()
  if (cookies[USER_TOKEN_KEY]) {
    request.headers.set('Authorization', `Bearer ${cookies[USER_TOKEN_KEY]}`)
  }
  return request
})

documentApi.interceptors.request.use((request) => {
  const cookies = nookies.get()
  if (cookies[USER_TOKEN_KEY]) {
    request.headers.set('Authorization', `Bearer ${cookies[USER_TOKEN_KEY]}`)
  }
  return request
})

nextApi.interceptors.request.use((request) => {
  const cookies = nookies.get()
  if (cookies[USER_TOKEN_KEY]) {
    request.headers.set('Authorization', `Bearer ${cookies[USER_TOKEN_KEY]}`)
  }
  return request
})
