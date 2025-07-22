import { AuthService } from '@src/services/api/auth/service'
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
    const authService = new AuthService()
    const oauthToken = await authService.getOauthToken()
    const proxy: httpProxy = httpProxy.createProxy()
    const cookie = req.headers?.cookie
    const csidMatch = cookie?.match(/csid=([^;]+)/)
    const csid = csidMatch ? csidMatch[1] : ''
    const headers = {
      ...(req.headers as any),
      Authorization: `Bearer ${oauthToken}`,
    }

    if ((req.headers as any)['redirect-proxy'] && csid) {
      headers['x-client-site-id'] = csid
    }

    const url = (req.headers as any)['redirect-proxy']
      ? process.env.API_BASE_URL
      : process.env.NEXT_PUBLIC_URL
    proxy.once('proxyRes', resolve).once('error', reject).web(req, res, {
      changeOrigin: true,
      target: url,
      headers: headers,
    })
  })
}
