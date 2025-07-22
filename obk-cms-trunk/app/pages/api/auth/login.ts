import { AuthService } from '@src/services/api/auth/service'
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'POST') {
    try {
      const authService = new AuthService()
      await authService.getOauthToken()
      console.log('--------------checkHeader--------------', req.body)
      const loginRes = await authService.login({
        username: req.body.username,
        password: req.body.password,
      })
      console.log('--------------loginRes--------------')
      res.status(200).json(loginRes.data)
      return
    } catch (error: any) {
      console.error('--------------Error--------------', error.response.data)
      if (error.response) {
        res.status(error.response?.status ?? 400).json(error.response.data)
        return
      }
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }
}
