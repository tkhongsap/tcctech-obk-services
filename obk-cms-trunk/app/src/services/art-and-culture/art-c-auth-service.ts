import axios, { AxiosInstance } from 'axios'
import NodeCache from 'node-cache'
import https from 'https'

export class ArtCultureAuthService {
  readonly OAUTH_TOKEN_KEY = 'art-c-oauth-token'
  readonly CMS_OAUTH_TOKEN_KEY = 'art-c-cms-oauth-token'
  _cache = new NodeCache({ stdTTL: 100, checkperiod: 60, deleteOnExpire: true })

  private _httpClient: AxiosInstance

  constructor() {
    const oauthToken = this._cache.get(this.OAUTH_TOKEN_KEY)
    const axiosConfig = {
      baseURL: process.env.ART_CULTURE_API_URL,
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
      client_id: process.env.ART_CULTURE_CLIENT_ID,
      client_secret: process.env.ART_CULTURE_CLIENT_SECRET,
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

  getCmsOauthToken(userToken: string, renew: boolean = false): Promise<string> {
    const oauthToken = this._cache.get(this.CMS_OAUTH_TOKEN_KEY)

    if (oauthToken && !renew) {
      return Promise.resolve().then(() => oauthToken as string)
    }

    const req = {
      client_id: process.env.ART_CULTURE_CMS_CLIENT_ID,
      client_secret: process.env.ART_CULTURE_CMS_CLIENT_SECRET,
      grant_type: process.env.GRANT_TYPE,
    }

    return this._httpClient
      .post('/cms-api/oauth2/token', req, {
        headers: {
          'user-token': `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        this._cache.set(
          this.CMS_OAUTH_TOKEN_KEY,
          res.data.access_token,
          res.data.expires_in
        )
        return this._cache.get(this.CMS_OAUTH_TOKEN_KEY) as string
      })
  }
}
