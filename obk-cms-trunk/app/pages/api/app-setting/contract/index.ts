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
        const contractValue = JSON.parse(
          // @ts-ignore
          template.parameters.contract.defaultValue?.value as string
        )
        return res.status(200).json({
          phone: contractValue?.call_contract_center,
          email: contractValue?.email_contract_center,
          updatedBy: contractValue?.updated_by || '-',
          updatedAt: contractValue?.updated_at || '-',
        })
      })
      .catch(function (err) {
        console.error('Unable to get template: ', err)
        throw new Error('Unable to get template')
      })
  }

  if (req.method === 'PUT') {
    const { phone, email, updatedBy } = req.body
    const contractValue = {
      call_contract_center: phone,
      email_contract_center: email,
      updated_by: updatedBy,
      updated_at: new Date().toISOString(),
    }
    const template = await config.getTemplate()
    config
      .publishTemplate({
        ...template,
        // @ts-ignore
        etag: template.etagInternal,
        parameters: {
          ...template.parameters,
          contract: {
            ...template.parameters.contract,
            defaultValue: {
              value: JSON.stringify(contractValue),
            },
          },
        },
      })
      .then(function () {
        console.log('Successfully updated template')
        return res.status(200).json({
          phone: contractValue?.call_contract_center,
          email: contractValue?.email_contract_center,
        })
      })
      .catch(function (err) {
        console.error('Unable to update template: ', err)
        throw new Error('Unable to update template')
      })
  }
}
