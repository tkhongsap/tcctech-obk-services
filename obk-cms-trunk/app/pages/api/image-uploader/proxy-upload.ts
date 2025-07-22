import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const IMAGE_UPLOAD_URL =
  process.env.IMAGE_UPLOAD_URL ||
  'https://uat-obk.tccproptech.com/ob-resize/api/upload'

const FILE_MAX_SIZE = process.env.FILE_MAX_SIZE || '10mb'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: FILE_MAX_SIZE,
    },
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const response = await axios.post(IMAGE_UPLOAD_URL, req.body, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    res.status(response.status).json(response.data)
  } catch (error: any) {
    console.error(
      '[proxy-upload] error:',
      error.response?.data || error.message
    )
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Proxy error',
    })
  }
}
