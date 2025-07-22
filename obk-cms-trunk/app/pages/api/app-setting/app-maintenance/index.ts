// @ts-nocheck
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
        const maintenanceValue = JSON.parse(
          // @ts-ignore
          template.parameters.app_maintenance.defaultValue?.value as string
        )
        return res.status(200).json({
          ios: {
            underMaintenance: maintenanceValue?.ios?.under_maintenance,
            updatedAt: maintenanceValue?.ios?.updated_at,
          },
          android: {
            underMaintenance: maintenanceValue?.android?.under_maintenance,
            updatedAt: maintenanceValue?.android?.updated_at,
          },
          updatedAt: maintenanceValue?.updated_at || '-',
          updatedBy: maintenanceValue?.updated_by || '-',
          message: maintenanceValue?.message || {},
        })
      })
      .catch(function (err) {
        console.error('Unable to get template: ', err)
        throw new Error('Unable to get template')
      })
  }

  if (req.method === 'PUT') {
    const { ios, android, updatedBy, message } = req.body

    const template = await config.getTemplate()

    const maintenanceParameter = JSON.parse(
      template.parameters.app_maintenance.defaultValue.value
    )

    const maintenanceValue = {
      ios: {
        under_maintenance: ios.underMaintenance,
        updated_at: ios.updatedAt,
      },
      android: {
        under_maintenance: android.underMaintenance,
        updated_at: android.updatedAt,
      },
      updated_by: updatedBy || maintenanceParameter?.updated_by,
      updated_at: new Date().toISOString() || maintenanceParameter?.updated_at,
      message: message || maintenanceParameter?.message,
    }
    config
      .publishTemplate({
        ...template,
        // @ts-ignore
        etag: template.etagInternal,
        parameters: {
          ...template.parameters,
          app_maintenance: {
            ...template.parameters.app_maintenance,
            defaultValue: {
              value: JSON.stringify(maintenanceValue),
            },
          },
        },
      })
      .then(function () {
        console.log('Successfully updated template')
        return res.status(200).json(maintenanceValue)
      })
      .catch(function (err) {
        console.error('Unable to update template: ', err)
        throw new Error('Unable to update template')
      })
  }
}
