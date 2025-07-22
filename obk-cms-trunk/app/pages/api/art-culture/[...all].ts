import { ArtCultureAuthService } from '@src/services/art-and-culture/art-c-auth-service'
import httpProxy from 'http-proxy'
import { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    // Enable `externalResolver` option in Next.js
    externalResolver: true,
    bodyParser: false,
  },
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  new Promise(async (resolve, reject) => {
    const authService = new ArtCultureAuthService()
    const proxy: httpProxy = httpProxy.createProxy()

    const cookie = req.headers?.cookie
    const userTokenMatch = cookie?.match(/user-data-access=([^;]+)/)
    const userToken = userTokenMatch ? userTokenMatch[1] : ''

    let oauthToken

    if (req.url?.includes('/art-culture/cms/')) {
      req.url = req.url!.replace('/api/art-culture/cms/', '/cms-api/')
      oauthToken = await authService.getCmsOauthToken(userToken)
    } else {
      req.url = req.url!.replace('/art-culture', '')
      oauthToken = await authService.getOauthToken()
    }

    // Prevent the header field from being too large.
    delete req.headers.cookie

    proxy
      .once('proxyRes', resolve)
      .once('error', reject)
      .web(req, res, {
        changeOrigin: true,
        target: process.env.ART_CULTURE_API_URL,
        secure: true,
        headers: {
          ...(req.headers as any),
          'user-token': `Bearer ${userToken}`,
          Authorization: `Bearer ${oauthToken}`,
        },
      })
  })
}
