const replaceParams = (url, params = {}) => {
  Object.keys(params).map(key => (url = url.replace(`:${key}`, params[key])))
  return url.replace(/:[\w_]*$/, '')
}
export function isValidUrl(url) {
  var urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // validate fragment locator
  return !!urlPattern.test(url)
}
export default function url(path, params = {}) {
  return replaceParams(path, params)
}
export function fullUrl(path, params = {}) {
  // eslint-disable-next-line no-undef
  return `${APP_HOST}${replaceParams(path, params)}`
}
export function getUrl(url, params = {}) {
  let path = `${url}?`
  Object.entries(params).forEach(
    ([key, value]) => (path = path.concat(`${key}=${value}&`))
  )
  return path
}
