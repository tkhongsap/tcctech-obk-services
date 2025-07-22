// @ts-nocheck
import { firebase } from 'services/libs/firebase'
import type { NextApiRequest, NextApiResponse } from 'next'
import cors from 'services/configs/cors'
import { appVersionService } from '@src/services/app-version'

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
          template.parameters.app_version_update.defaultValue?.value as string
        )
        return res.status(200).json([
          {
            version: versionValue?.android?.version || '',
            updatedAt: versionValue?.android?.updated_at || '',
            updatedBy: versionValue?.android?.updated_by || '',
            message: versionValue?.android?.message || '',
            system: 'android',
          },
          {
            version: versionValue?.ios?.version || '',
            updatedAt: versionValue?.ios?.updated_at || '',
            updatedBy: versionValue?.ios?.updated_by || '',
            message: versionValue?.ios?.message || '',
            system: 'ios',
          },
        ])
      })
      .catch(function (err) {
        console.error('Unable to get template: ', err)
        throw new Error('Unable to get template')
      })
  }

  if (req.method === 'PUT') {
    const { ios, android } = req.body

    const template = await config.getTemplate()

    const versionUpdateParameter = JSON.parse(
      template.parameters.app_version_update.defaultValue.value
    )

    const versionUpdateValue = {
      ios: {
        force: true,
        version: ios?.version || versionUpdateParameter?.ios?.version,
        updated_at: ios
          ? new Date().toISOString()
          : versionUpdateParameter?.ios?.updated_at,
        updated_by: ios?.updatedBy || versionUpdateParameter?.ios?.updated_by,
        message: ios?.message || versionUpdateParameter?.ios?.message,
      },
      android: {
        force: true,
        version: android?.version || versionUpdateParameter?.android?.version,
        updated_at: android
          ? new Date().toISOString()
          : versionUpdateParameter?.android?.updated_at,
        updated_by:
          android?.updatedBy || versionUpdateParameter?.android?.updated_by,
        message: android?.message || versionUpdateParameter?.android?.message,
      },
    }

    config
      .publishTemplate({
        ...template,
        // @ts-ignore
        etag: template.etagInternal,
        parameters: {
          ...template.parameters,
          app_version_update: {
            ...template.parameters.app_version_update,
            defaultValue: {
              value: JSON.stringify(versionUpdateValue),
            },
          },
        },
      })
      .then(async () => {
        console.log('Successfully updated template')
        const appVersionPastVersionBody = ios
          ? {
              system: 'ios',
              version: versionUpdateValue.ios.version,
              updated_by: versionUpdateValue.ios.updated_by,
              message: versionUpdateValue.ios.message,
              updated_at: new Date(versionUpdateValue.ios.updated_at),
            }
          : {
              system: 'android',
              version: versionUpdateValue.android.version,
              updated_by: versionUpdateValue.android.updated_by,
              message: versionUpdateValue.android.message,
            }
        await appVersionService
          .addPastVersion(appVersionPastVersionBody)
          .then((res) => {
            console.log('Successfully added past version', res)
          })
          .catch((err) => {
            console.error('Unable to add past version: ', err)
            throw new Error('Unable to add past version')
          })
        return res.status(200).json(versionUpdateValue)
      })
      .catch(function (err) {
        console.error('Unable to update template: ', err)
        throw new Error('Unable to update template')
      })
  }
}
