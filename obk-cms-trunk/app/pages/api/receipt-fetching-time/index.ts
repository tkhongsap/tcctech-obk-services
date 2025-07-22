import { firebase } from 'services/libs/firebase'
import type { NextApiRequest, NextApiResponse } from 'next'
import cors from 'services/configs/cors'

const DEFAULT_FETCHING_TIME = 3000

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await cors(req, res)

  const config = firebase.remoteConfig()

  if (req.method === 'GET') {
    await config
      .getTemplate()
      .then(function (template) {
        const receiptFetchingTime = JSON.parse(
          // @ts-ignore
          template.parameters.receipt_fetching_time.defaultValue?.value ||
            DEFAULT_FETCHING_TIME
        )

        return res.status(200).json(receiptFetchingTime)
      })
      .catch(function (err) {
        console.error('Unable to get template: ', err)
        throw new Error('Unable to get template')
      })
  }
}
