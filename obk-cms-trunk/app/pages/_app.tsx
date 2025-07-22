import { Refine } from '@refinedev/core'
// import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar'
import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from '@refinedev/nextjs-router'
import type { NextPage } from 'next'
import { AppProps } from 'next/app'

import dataProvider from '@refinedev/simple-rest'
import '@styles/global.css'
import '@styles/global.scss'
import { appWithTranslation, useTranslation } from 'next-i18next'
import { authProvider } from 'src/authProvider'
import theme from '@styles/theme'
import GlobalStyle from '@styles/global'
import { ThemeProvider } from 'styled-components'

import SvgDashboard from '@assets/svg/icon-menu-home.svg'
import navigation from '@src/data/navigation'

import * as OB_IAM_SDK from 'ob-iam-sdk'
import * as OB_DOCUMENT_SDK from 'ob-document-sdk'
import * as OB_BMS_SDK from 'ob-bms-sdk'
import * as OB_NOTI_SDK from 'ob-notification-sdk'
import * as OB_PARKING_SDK from 'ob-parking-sdk'

import { useEffect } from 'react'
import nookies from 'nookies'
import { ACCOUNT_ID_KEY, USER_TOKEN_KEY } from '@src/authProvider/constants'

import { PrimeReactProvider } from 'primereact/api'
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import { LayoutProvider } from '@src/layout/context/layoutcontext'
import '../styles/layout/layout.scss'
import { ChakraProvider } from '@chakra-ui/react'
import { ToastContainer } from 'react-toastify'
import Layout from '@src/layout/layout'
import 'react-quill/dist/quill.snow.css'
import 'public/tailwindcss/output.css'
import 'react-toastify/dist/ReactToastify.css'
import { passThrough } from '@src/utils/pass-through'
import PermissionContextProvider from '@src/hooks/permissionProvider'
import { getCookie } from 'cookies-next'
import { ACTIVITY_LOG_PLATFORM_TYPE } from '@src/data/constants/platform'
import 'ckeditor5/ckeditor5.css'

const API_URL = 'https://api.fake-rest.refine.dev'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  noLayout?: boolean
}

export type NextPageWithPrime<P = {}, IP = P> = NextPage<P, IP> & {
  activePrime?: boolean
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout & NextPageWithPrime
}

function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
  const authToken = nookies.get(null, USER_TOKEN_KEY as any)
  const accoutId = getCookie(ACCOUNT_ID_KEY)?.toString() || ''

  OB_IAM_SDK.setBaseUrl(process.env.OB_IAM_SDK_BASE_URL || '')
  OB_DOCUMENT_SDK.setBaseUrl(process.env.OB_DOCUMENT_SDK_BASE_URL || '')
  OB_BMS_SDK.setBaseUrl(process.env.BMS_BASEURL || '')
  OB_PARKING_SDK.setBaseUrl(process.env.OB_PARKING_SDK_BASE_URL || '')

  OB_DOCUMENT_SDK.axiosInstance.defaults.headers.common['x-account-id'] =
    accoutId
  OB_BMS_SDK.axiosInstance.defaults.headers.common['x-account-id'] = accoutId
  OB_IAM_SDK.axiosInstance.defaults.headers.common['x-account-id'] = accoutId
  OB_NOTI_SDK.axiosInstance.defaults.headers.common['x-account-id'] = accoutId
  OB_PARKING_SDK.axiosInstance.defaults.headers.common['x-account-id'] =
    accoutId

  OB_IAM_SDK.axiosInstance.defaults.headers.common['x-platform'] =
    ACTIVITY_LOG_PLATFORM_TYPE.CMS

  useEffect(() => {
    if (authToken) {
      OB_IAM_SDK.setAcessToken(authToken['user-token'])
      OB_DOCUMENT_SDK.setAcessToken(authToken['user-token'])
      OB_BMS_SDK.setAcessToken(authToken['user-token'])
    }
  }, [authToken])
  const renderComponent = () => {
    if (Component.noLayout) {
      return (
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      )
    }
    return (
      <LayoutProvider>
        <Layout>
          <PermissionContextProvider>
            {Component.activePrime ? (
              <PrimeReactProvider value={{ pt: passThrough }}>
                <Component {...pageProps} />
              </PrimeReactProvider>
            ) : (
              <ChakraProvider theme={theme}>
                <Component {...pageProps} />
              </ChakraProvider>
            )}
          </PermissionContextProvider>
        </Layout>
      </LayoutProvider>
    )
  }

  const { t, i18n } = useTranslation()

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  }

  return (
    <>
      <RefineKbarProvider>
        <ToastContainer />
        <Refine
          routerProvider={routerProvider}
          dataProvider={dataProvider(API_URL)}
          authProvider={authProvider}
          i18nProvider={i18nProvider}
          resources={[
            {
              name: 'Dashboard',
              list: '/dashboard',
              meta: {
                icon: SvgDashboard,
                label: 'Dashboard',
              },
            },
            ...navigation,
            {
              name: 'Style Guide',
              list: '/style-guide',
            },
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
            projectId: '9QgtuR-hQOoXz-8tE5A3',
          }}
        >
          <ThemeProvider theme={theme}>
            {renderComponent()}
            {/* </ChakraProvider> */}
            {/* </ToastContextProvider>
            </PrimeReactProvider> */}
            <GlobalStyle />
          </ThemeProvider>
          <RefineKbar />
          <UnsavedChangesNotifier />
          <DocumentTitleHandler />
        </Refine>
      </RefineKbarProvider>
    </>
  )
}

export default appWithTranslation(MyApp)
