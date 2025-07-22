import { TOKEN_KEY } from '@src/authProvider/constants'
import { decodeKeyCloakToken } from '@src/utils/decode'
import axios, { AxiosHeaders, AxiosInstance, AxiosResponse } from 'axios'
import { getCookie } from 'cookies-next'
import https from 'https'

class HttpClient {
  private static _instance: HttpClient
  private static _axiosInstance: AxiosInstance
  private static _csid: string = ''

  public static setCSID(csid: string) {
    HttpClient._csid = csid
  }

  public static get instance() {
    this._instance || (this._instance = new this())
    this._axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_URL,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    })
    this._axiosInstance.interceptors.request.use((request) => {
      request.headers.set('redirect-proxy', 'true')
      const auth = getCookie(TOKEN_KEY)

      if (HttpClient._csid) {
        request.headers.set('x-client-site-id', HttpClient._csid)
      }

      if (auth) {
        //request.headers.set('Authorization', `Bearer ${auth}`)

        if (
          request.method &&
          ['post', 'put', 'delete', 'patch'].includes(request.method)
        ) {
          request.data = {
            ...request.data,
            keyCloakUserId: decodeKeyCloakToken(auth),
          }
        }
      }
      return request
    })
    return this._axiosInstance
  }
}

export const httpClient = HttpClient.instance
export const setCSID = HttpClient.setCSID

export type SuccessResponse<T> = {
  code: number
  data: T
}

/**
 * @remove_later
 */
export const getMockSuccessResponse = (
  d?: any
): Promise<AxiosResponse<any, any>> => {
  return new Promise((resolve) => {
    resolve({
      data: d,
      status: 200,
      statusText: 'Success',
      config: { headers: new AxiosHeaders() },
      headers: new AxiosHeaders(),
    })
  })
}
