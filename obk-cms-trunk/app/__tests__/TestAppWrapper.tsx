import React from 'react'
import { Refine } from '@refinedev/core'
import { ChakraProvider } from '@chakra-ui/react'
import { RefineKbarProvider } from '@refinedev/kbar'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider } from 'styled-components'
import theme from '@styles/theme'
import { LayoutProvider } from '@src/layout/context/layoutcontext'
import PermissionContextProvider from '@src/hooks/permissionProvider'
import Layout from '@src/layout/layout'
import GlobalStyle from '@styles/global'
import { PrimeReactProvider } from 'primereact/api'
import { passThrough } from '@src/utils/pass-through'
import dataProvider from '@refinedev/simple-rest'
import { authProvider } from '@src/authProvider'
import SvgDashboard from '@assets/svg/icon-menu-home.svg'
import navigation from '@src/data/navigation'

import routerProvider from '@refinedev/nextjs-router'

interface TestAppWrapperProps {
  children: React.ReactNode
  activePrime?: boolean
}

const API_URL = 'https://api.fake-rest.refine.dev'

const TestAppWrapper: React.FC<TestAppWrapperProps> = ({
  children,
  activePrime = false,
}) => {
  return (
    <RefineKbarProvider>
      <Refine
        routerProvider={routerProvider}
        dataProvider={dataProvider(API_URL)}
        authProvider={authProvider}
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
        <ToastContainer />
        <LayoutProvider>
          <Layout>
            <PermissionContextProvider>
              <ThemeProvider theme={theme}>
                <ChakraProvider theme={theme}>
                  {activePrime ? (
                    <PrimeReactProvider value={{ pt: passThrough }}>
                      {children}
                    </PrimeReactProvider>
                  ) : (
                    <ChakraProvider theme={theme}>{children}</ChakraProvider>
                  )}
                  <GlobalStyle />
                </ChakraProvider>
              </ThemeProvider>
            </PermissionContextProvider>
          </Layout>
        </LayoutProvider>
      </Refine>
    </RefineKbarProvider>
  )
}

export default TestAppWrapper
