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
        const versionValue = JSON.parse(
          // @ts-ignore
          template.parameters.app_version.defaultValue?.value as string
        )
        return res.status(200).json([
          {
            version: versionValue?.ios?.version || '',
            updatedAt: versionValue?.ios?.updated_at || '',
            system: 'android',
          },
          {
            version: versionValue?.ios?.version || '',
            updatedAt: versionValue?.ios?.updated_at || '',
            system: 'ios',
          },
        ])
      })
      .catch(function (err) {
        console.error('Unable to get template: ', err)
        throw new Error('Unable to get template')
      })
  }
}
