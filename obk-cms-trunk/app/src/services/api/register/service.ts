import axios, { AxiosInstance } from 'axios'
import NodeCache from 'node-cache'
import https from 'https'

export class RegisterService {
  readonly OAUTH_TOKEN_KEY = 'oauth-token'
  _cache = new NodeCache({ stdTTL: 100, checkperiod: 60 })

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

  getOauthToken() {
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
    })
  }

  async checkHeader() {
    const oauthToken = this._cache.get(this.OAUTH_TOKEN_KEY)
    try {
      if (!oauthToken) {
        await this.getOauthToken()
        return true
      }
      await this._httpClient.get('/api/v1/tools/checkheader')
      return true
    } catch (error: any) {
      console.error(error)
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.error === 'invalid_token'
      ) {
        await this.getOauthToken()
        return true
      }
    }
  }
  register(req: {
    emailOrPhone: string
    password: string
    firstname: string
    lastname: string
  }) {
    return this._httpClient.post('/api/v1/operation/kc/user', req)
  }
}
