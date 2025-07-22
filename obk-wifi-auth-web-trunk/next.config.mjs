import MillionLint from '@million/lint'

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'th'],
    defaultLocale: 'en',
    domains: [
      {
        domain: 'example.com',
        defaultLocale: 'en',
      },
      {
        domain: 'example.th',
        defaultLocale: 'th',
      },
    ],
  },
  reactStrictMode: true,
  compiler: {
    emotion: true,
  },
  output: 'standalone',
}

export default MillionLint.next({
  rsc: true,
  filter: {
    include: '**/components/*.{mtsx,mjsx,tsx,jsx}',
  },
})(nextConfig)
