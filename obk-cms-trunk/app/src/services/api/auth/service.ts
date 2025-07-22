import axios, { AxiosInstance } from 'axios'
import NodeCache from 'node-cache'
import https from 'https'

export class AuthService {
  readonly OAUTH_TOKEN_KEY = 'oauth-token'
  _cache = new NodeCache({ stdTTL: 100, checkperiod: 60, deleteOnExpire: true })

  private _httpClient: AxiosInstance

  constructor() {
    const oauthToken = this._cache.get(this.OAUTH_TOKEN_KEY)
    const axiosConfig = {
      baseURL: process.env.AUTH_URL,
      headers: { Authorization: `Bearer ${oauthToken}` },
      // TODO remove httpsAgent later.
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    }

    this._httpClient = axios.create(axiosConfig)
    this._httpClient.interceptors.request.use((request) => {
      const oauthToken = this._cache.get(this.OAUTH_TOKEN_KEY)
      if (oauthToken) {
        request.headers.set('Authorization', `Bearer ${oauthToken}`)
      }
      return request
    })
  }

  getOauthToken(renew: boolean = false): Promise<string> {
    const oauthToken = this._cache.get(this.OAUTH_TOKEN_KEY)
    if (oauthToken && !renew) {
      return Promise.resolve().then(() => oauthToken as string)
    }
    const req = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: process.env.GRANT_TYPE,
    }
    return this._httpClient.post('/api/oauth2/token', req).then((res) => {
      this._cache.set(
        this.OAUTH_TOKEN_KEY,
        res.data.access_token,
        res.data.expires_in
      )
      return this._cache.get(this.OAUTH_TOKEN_KEY) as string
    })
  }

  // async checkHeader() {
  //   try {
  //     await this._httpClient.get('/api/v1/tools/checkheader')
  //     return true
  //   } catch (error: any) {
  //     console.error(error)
  //     if (
  //       error.response &&
  //       error.response.status === 401 &&
  //       error.response.data.error === 'invalid_token'
  //     ) {
  //       await this.getOauthToken(true)
  //       return true
  //     }
  //   }
  // }

  login(req: { username: string; password: string }) {
    return this._httpClient.post('/api/v1/operation/kc/login', req)
  }
}
