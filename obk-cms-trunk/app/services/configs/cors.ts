import NextCors from 'nextjs-cors'
import { NextApiRequest, NextApiResponse } from 'next'

const cors = async (req: NextApiRequest, res: NextApiResponse) => {
  await NextCors(req, res, {
    origin: '*',
    methods: ['POST', 'OPTIONS', 'PUT', 'GET', 'HEAD'],
  })
}

export default cors
