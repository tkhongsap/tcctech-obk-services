import https from 'https'
import axios from 'axios'

export const APP_HOST =
  process.env.NEXT_PUBLIC_APP_HOST ?? 'http://localhost:4000'

/**
 * Disable only in development mode
 */
if (process.env.NODE_ENV === 'development') {
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  })
  axios.defaults.httpsAgent = httpsAgent
  // eslint-disable-next-line no-console
  console.log(process.env.NODE_ENV, 'RejectUnauthorized is disabled.')
}

export { axios }
