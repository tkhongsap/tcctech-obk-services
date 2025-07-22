import { firebase } from 'services/libs/firebase'
import type { NextApiRequest, NextApiResponse } from 'next'
import cors from 'services/configs/cors'

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
        const externalCameraList = JSON.parse(
          // @ts-ignore
          template.parameters.external_camera_list.defaultValue?.value
        )

        return res.status(200).json([externalCameraList])
      })
      .catch(function (err) {
        console.error('Unable to get template: ', err)
        throw new Error('Unable to get template')
      })
  }
}
