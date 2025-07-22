import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  sassOptions: {
    implementation: 'sass-embedded',
  },
  env: {
    APP_URL: process.env.APP_URL,
    IOS_URL: process.env.IOS_URL,
    IOS_APP_STORE_ID: process.env.IOS_APP_STORE_ID,
    IOS_APP_BUNDLE_ID: process.env.IOS_APP_BUNDLE_ID,
    IOS_TEAM_IDENTIFIER: process.env.IOS_TEAM_IDENTIFIER,
    IOS_APP_NAME: process.env.IOS_APP_NAME,
    ANDROID_URL: process.env.ANDROID_URL,
    ANDROID_PACKAGE_NAME: process.env.ANDROID_PACKAGE_NAME,
    ANDROID_APP_NAME: process.env.ANDROID_APP_NAME,
    WEB_URL: process.env.WEB_URL,
  },
  async headers() {
    return [
      {
        source: '/.well-known/apple-app-site-association',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
