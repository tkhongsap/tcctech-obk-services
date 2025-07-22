import { AxiosError } from 'axios'

import type { NextApiRequest, NextApiResponse } from 'next'

import { API_POST_SMS_PASSWORD } from '@/src/config/api'

import { axios } from '@/src/config/app'

type ResponseData = {
  message?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { body, method } = req
  try {
    const response = await axios({
      url: API_POST_SMS_PASSWORD,
      method,
      data: body,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
      },
    })
    res.status(response.status).json(response.data)
  } catch (err: unknown) {
    const error = err as AxiosError
    // console.log(error)
    res.status(error.response?.status || 500).json({ error: error.message })
  }
}
