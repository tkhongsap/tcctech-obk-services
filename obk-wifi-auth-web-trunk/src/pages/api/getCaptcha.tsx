import { AxiosError } from 'axios'

import type { NextApiRequest, NextApiResponse } from 'next'

import { API_GET_VERIFICATION_CODE } from '@/src/config/api'

import { axios } from '@/src/config/app'

import { encode } from '@/src/utils/base64'

type ResponseData = {
  message?: string
  error?: string
  image?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { method, query } = req
  try {
    const response = await axios({
      url: API_GET_VERIFICATION_CODE,
      method,
      params: query,
      responseType: 'arraybuffer',
    })

    const image = encode(response.data)

    res.status(response.status).json({ image })
  } catch (err: unknown) {
    const error = err as AxiosError
    // console.log(error)
    res.status(error.response?.status || 500).json({ error: error.message })
  }
}
