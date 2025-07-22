export function languageSelector(
  data: Record<string, never>,
  language: string,
) {
  if (language === '*' || (!(language in data) && !('en' in data))) {
    return data;
  }
  return data[language] ?? data['en'];
}
