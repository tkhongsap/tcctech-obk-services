import { RemovememberService } from '@src/services/api/removemember/service'
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
      const removeMemberService = new RemovememberService()
      await removeMemberService.checkHeader()
      console.log('--------------checkHeader--------------', req.body)
      const removeMemberRes = await removeMemberService.removeMember({
        username: req.body.username,
        removeAttribute: req.body.removeAttribute,
      })
      console.log('--------------RemoveMemberRes--------------')
      res.status(200).json(removeMemberRes.data)
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
