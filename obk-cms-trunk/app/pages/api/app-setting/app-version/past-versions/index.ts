import { appVersionService } from '@src/services/app-version'
import type { NextApiRequest, NextApiResponse } from 'next'
import cors from 'services/configs/cors'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await cors(req, res)

  const { currentPage, pageSize, sorting, direction } = req.query

  const current_page =
    typeof currentPage === 'string' ? parseInt(currentPage) : 1
  const page_size = typeof pageSize === 'string' ? parseInt(pageSize) : 10

  if (req.method === 'GET') {
    await appVersionService
      .getPastVersions(
        page_size,
        current_page,
        sorting as string,
        direction as 'desc' | 'asc'
      )
      .then((data) => {
        return res.status(200).json(data)
      })
      .catch((err) => {
        console.error('Unable to get past versions: ', err)
        throw new Error('Unable to get past versions')
      })
  }
}
