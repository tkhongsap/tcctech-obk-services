export default function extractKeys(obj, keys) {
  const d = {}
  keys.forEach(k => {
    d[k] = obj[k]
  })

  return d
}
