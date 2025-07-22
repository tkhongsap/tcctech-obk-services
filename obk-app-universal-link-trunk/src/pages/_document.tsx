import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <meta property='al:ios:url' content={process.env.IOS_URL} />
        <meta
          property='al:ios:app_store_id'
          content={process.env.IOS_APP_STORE_ID}
        />
        <meta property='al:ios:app_name' content={process.env.IOS_APP_NAME} />

        <meta property='al:android:url' content={process.env.ANDROID_URL} />
        <meta
          property='al:android:app_name'
          content={process.env.ANDROID_APP_NAME}
        />
        <meta
          property='al:android:package'
          content={process.env.ANDROID_PACKAGE_NAME}
        />
        <meta property='al:web:url' content={process.env.WEB_URL} />
      </Head>
      <body className='antialiased'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
