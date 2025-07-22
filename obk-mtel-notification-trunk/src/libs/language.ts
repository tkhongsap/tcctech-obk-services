export function languageSelector(data: Record<string, never>, language: string) {
  if (!data || typeof data !== 'object') {
    console.log('Invalid data object, returning default value');
    return data ?? '';
  }
  if (language === '*' || (!(language in data) && !('en' in data))) {
    return data;
  }
  return data[language] ?? data['en'];
}
