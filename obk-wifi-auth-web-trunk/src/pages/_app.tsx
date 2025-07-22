import { useEffect, useMemo, useState } from 'react'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import { Box, CssBaseline, Grid, PaletteMode } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'

// import Button from '@mui/material/Button'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import theme from '@/material-theme'

import { getDesignTokens } from '@/src/styles/theme'

// import LangSwitcher from '@/src/components/LangSwitcher'
// import SeansonalEffect from '@/src/components/SeansonalEffect'
import 'overlayscrollbars/overlayscrollbars.css'
import '../styles/globals.css'

import { useNavigationStore } from '@/src/store'

const LangSwitcher = dynamic(() => import('@/src/components/LangSwitcher'), {
  ssr: false,
})

const App = ({ Component, pageProps }: AppProps) => {
  const [
    mode,
    // , setMode
  ] = useState<PaletteMode>('dark')

  const router = useRouter()
  const { currentPath, setPreviousPath, setCurrentPath } = useNavigationStore()

  useEffect(() => {
    // On route change start, set the previous path
    const handleRouteChangeStart = (url: string) => {
      setPreviousPath(currentPath || router.pathname)
      setCurrentPath(url.split('?')[0])
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
  }, [router.events, currentPath, setPreviousPath, setCurrentPath])

  const theme = useMemo(() => {
    return createTheme(getDesignTokens(mode))
  }, [mode])

  const [queryClient] = useState(() => new QueryClient())
  return (
    <Box>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Grid width={'100%'} position={'fixed'} textAlign={'end'} zIndex={1}>
          <LangSwitcher />
        </Grid>
        {/* <SeansonalEffect type={`${mode === 'light' ? 'summer' : 'winter'}`} /> */}
        {/* <Button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
          Switch Season
        </Button> */}
        <QueryClientProvider client={queryClient}>
          {/* <ReactQueryDevtools /> */}
          <Component {...pageProps} />
        </QueryClientProvider>
      </ThemeProvider>
    </Box>
  )
}

export default App
