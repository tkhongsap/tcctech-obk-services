import { ResetPasswordService } from '@src/services/api/resetpassword/service'
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
      const resetPasswordService = new ResetPasswordService()
      await resetPasswordService.checkHeader()
      console.log('--------------checkHeader--------------', req.body)
      const resetpassRes = await resetPasswordService.resetpassword({
        username: req.body.username,
        newpassword: req.body.newpassword,
      })
      console.log('--------------ResetPasswordRes--------------')
      res.status(200).json(resetpassRes.data)
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
