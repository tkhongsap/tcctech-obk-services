export function encode(str) {
  const buff = Buffer.from(str, 'utf8')
  return buff.toString('base64')
}

export function decode(base64Str) {
  const buff = Buffer.from(base64Str, 'base64')
  return buff.toString('utf8')
}
