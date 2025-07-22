import { isDate } from 'date-fns'
import { formatDate } from './dates'

function parseDataToString(data) {
  let d
  if (data) {
    d = {}
    Object.keys(data).forEach(k => {
      const v = data[k]
      switch (typeof v) {
        case 'object':
          if (isDate(v)) {
            d[k] = formatDate(v)
          } else if (Array.isArray(v)) {
            d[k] = v
          } else {
            d[k] = parseDataToString(v)
          }
          break
        default:
          d[k] = v
          break
      }
    })
  }
  return d
}

export function getUrlNBody(url, data, method = 'GET') {
  switch (method) {
    case 'GET':
      return {
        url: `${url}${
          data
            ? `?${new URLSearchParams(parseDataToString(data)).toString()}`
            : ''
        }`,
      }
  }
  return {
    url,
    body: JSON.stringify(parseDataToString(data)),
  }
}

export default async function fetcher(
  rawUrl,
  data,
  autHeader,
  method = 'GET',
  headers = {
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Credentials': 'true',
  }
) {
  headers.employeeId = autHeader?.employeeId

  const { url, body } = getUrlNBody(rawUrl, data, method)

  const res = await fetch(url, {
    headers,
    method,
    body,
  })

  if (!res.ok) {
    const error = new Error('HTTP status code: ' + res.status)
    // Attach extra info to the error object.
    error.info = await res.json()
    error.status = res.status
    throw error
  }

  return res.json()
}

export async function postFetcher(rawUrl, data, autHeader = null) {
  return fetcher(rawUrl, data, autHeader, 'POST')
}
