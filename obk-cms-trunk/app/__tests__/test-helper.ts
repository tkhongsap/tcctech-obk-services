const TEST_API_BASE_URL = 'http://localhost:3000/api'

export const generateApiURL = (path: string): string =>
  `${TEST_API_BASE_URL}${path}`

export const generateArtCultureCmsApiURL = (path: string): string =>
  `${TEST_API_BASE_URL}/art-culture/cms${path}`
