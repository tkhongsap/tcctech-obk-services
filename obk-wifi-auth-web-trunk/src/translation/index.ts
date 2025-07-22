import texts from './texts'

function getText(locale?: string, key?: string) {
  if (locale === undefined) {
    locale = 'en'
  }
  if (key === undefined) {
    key = ''
  }
  const ITexts = texts as Record<string, { [key: string]: string }>
  return ITexts[locale][key]
}

function getLangs(locale?: string, locales?: string[]) {
  // Returning all available languages, except the current
  return locales?.filter((lang: string) => lang !== locale)
}
export { getText, getLangs }
