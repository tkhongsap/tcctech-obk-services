import { RegisterService } from '@src/services/api/register/service'
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  console.log('handler work')
  if (req.method === 'POST') {
    try {
      const registerService = new RegisterService()
      await registerService.checkHeader()
      console.log('--------------checkHeader--------------', req.body)
      const registerRes = await registerService.register({
        emailOrPhone: req.body.emailOrPhone,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
      })
      console.log('--------------registerRes--------------')
      res.status(200).json(registerRes.data)
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
