const { i18n } = require('./next-i18next.config')

console.log(process?.env?.APP_PREFIX, 'APP_PREFIX')

module.exports = {
  images: {
    // For older Next.js versions (<=12), you might use the 'domains' array:
    domains: [
      'obk-uat-image.s3.ap-southeast-1.amazonaws.com',
      'obk-prod-image.s3.ap-southeast-1.amazonaws.com',
      'localhost',
      'uat-obk.tccproptech.com', // minio on uat
      'obk-prod.tccproptech.com', // minio on prod
    ],
    // For Next.js 13 and later, use remotePatterns (more specific and secure)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'obk-prod.tccproptech.com', // Only the hostname, no path
        port: '',
        pathname: '/**', // Allow any path under this hostname
      },
      {
        protocol: 'https',
        hostname: 'uat-obk.tccproptech.com', // Only the hostname, no path
        port: '',
        pathname: '/**', // Allow any path under this hostname
      },
      // Add other remote image domains if you have them
    ],
  },
  i18n,
  assetPrefix: process?.env?.APP_PREFIX || '',
  basePath: process?.env?.APP_PREFIX || '',
  transpilePackages: ['@refinedev/nextjs-router'],
  async rewrites() {
    return [
      {
        source: '/notifications/inapp/draft',
        destination: '/notifications/inapp?filter=draft',
      },
      {
        source: '/notifications/inapp/template',
        destination: '/notifications/inapp?filter=template',
      },
      {
        source: '/notifications/inapp/:type/create',
        destination: '/notifications/inapp/create',
      },
      {
        source: '/notifications/inapp/:type/edit/:id',
        destination: '/notifications/inapp/edit/:id',
      },
      {
        source: '/notifications/inapp/:type/show/:id',
        destination: '/notifications/inapp/show/:id',
      },
      {
        source: '/support/access-information/edit/:id',
        destination: '/support/access-information/edit/:id',
      },
    ]
  },
  compiler: {
    styledComponents: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: 'cleanupIds',
                  cleanupIDs: false, // Disable cleaning Up IDs
                },
              ],
            },
          },
        },
      ],
    })
    return config
  },
  env: {
    REACT_APP_VERSION: process.env.REACT_APP_VERSION,
    FIREBASE_ADMIN_SDK_TYPE: process.env.FIREBASE_ADMIN_SDK_TYPE,
    FIREBASE_ADMIN_SDK_PROJECT_ID: process.env.FIREBASE_ADMIN_SDK_PROJECT_ID,
    FIREBASE_ADMIN_SDK_PRIVATE_KEY_ID:
      process.env.FIREBASE_ADMIN_SDK_PRIVATE_KEY_ID,
    FIREBASE_ADMIN_SDK_PRIVATE_KEY: process.env.FIREBASE_ADMIN_SDK_PRIVATE_KEY,
    FIREBASE_ADMIN_SDK_CLIENT_EMAIL:
      process.env.FIREBASE_ADMIN_SDK_CLIENT_EMAIL,
    FIREBASE_ADMIN_SDK_CLIENT_ID: process.env.FIREBASE_ADMIN_SDK_CLIENT_ID,
    FIREBASE_ADMIN_SDK_AUTH_URI: process.env.FIREBASE_ADMIN_SDK_AUTH_URI,
    FIREBASE_ADMIN_SDK_TOKEN_URI: process.env.FIREBASE_ADMIN_SDK_TOKEN_URI,
    FIREBASE_ADMIN_SDK_AUTH_PROVIDER_X509_CERT_URL:
      process.env.FIREBASE_ADMIN_SDK_AUTH_PROVIDER_X509_CERT_URL,
    FIREBASE_ADMIN_SDK_CLIENT_CERT_URL:
      process.env.FIREBASE_ADMIN_SDK_CLIENT_CERT_URL,
    FIREBASE_ADMIN_SDK_UNIVERAL_DOMAIN:
      process.env.FIREBASE_ADMIN_SDK_UNIVERAL_DOMAIN,
    FIREBASE_SDK_API_KEY: process.env.FIREBASE_SDK_API_KEY,
    FIREBASE_SDK_AUTH_DOMAIN: process.env.FIREBASE_SDK_AUTH_DOMAIN,
    FIREBASE_SDK_PROJECT_ID: process.env.FIREBASE_SDK_PROJECT_ID,
    FIREBASE_SDK_STORAGE_BUCKET: process.env.FIREBASE_SDK_STORAGE_BUCKET,
    FIREBASE_SDK_MESSAGING_SENDER_ID:
      process.env.FIREBASE_SDK_MESSAGING_SENDER_ID,
    FIREBASE_SDK_APP_ID: process.env.FIREBASE_SDK_APP_ID,
    FIREBASE_SDK_MEASUREMENT_ID: process.env.FIREBASE_SDK_MEASUREMENT_ID,
    AUTH_URL: process.env.AUTH_URL,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    GRANT_TYPE: process.env.GRANT_TYPE,
    NEXT_PUBLIC_ENV_BASE_URL: process.env.NEXT_PUBLIC_ENV_BASE_URL,
    API_BASE_URL: process.env.API_BASE_URL,
    OB_IAM_SDK_BASE_URL: process.env.OB_IAM_SDK_BASE_URL,
    OB_DOCUMENT_SDK_BASE_URL: process.env.OB_DOCUMENT_SDK_BASE_URL,
    OB_DOCUMENT_API_BASE_URL: process.env.OB_DOCUMENT_API_BASE_URL,
    BMS_BASEURL: process.env.BMS_BASEURL,
    OB_NOTIFICATION_BASE_URL: process.env.OB_NOTIFICATION_BASE_URL,
    OB_NOTIFICATION_SDK_BASE_URL: process.env.OB_NOTIFICATION_SDK_BASE_URL,
    S3_ENDPOINT: process.env.S3_ENDPOINT,
    ART_CULTURE_API_URL: process.env.ART_CULTURE_API_URL,
    ART_CULTURE_CLIENT_ID: process.env.ART_CULTURE_CLIENT_ID,
    ART_CULTURE_CLIENT_SECRET: process.env.ART_CULTURE_CLIENT_SECRET,
    ART_CULTURE_UNIVERSAL_LINK: process.env.ART_CULTURE_UNIVERSAL_LINK,
    SUSTAIN_UNIVERSAL_LINK: process.env.SUSTAIN_UNIVERSAL_LINK,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    VENUE_CLIENT_ID: process.env.VENUE_CLIENT_ID,
    VENUE_CLIENT_SECRET: process.env.VENUE_CLIENT_SECRET,
    OB_PARKING_SDK_BASE_URL: process.env.OB_PARKING_SDK_BASE_URL,
    OB_PARKING_API_BASE_URL: process.env.OB_PARKING_API_BASE_URL,
  },
}
