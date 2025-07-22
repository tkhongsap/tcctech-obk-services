import { appVersionService } from '@src/services/app-version'
import type { NextApiRequest, NextApiResponse } from 'next'
import cors from 'services/configs/cors'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await cors(req, res)

  const { id } = req.query

  if (req.method === 'GET') {
    await appVersionService
      .getPastVersion(id as string)
      .then((data) => {
        return res.status(200).json(data)
      })
      .catch((err) => {
        console.error('Unable to get past version: ', err)
        throw new Error('Unable to get past version')
      })
  }
}
