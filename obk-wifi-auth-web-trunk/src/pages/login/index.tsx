import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { getText } from '@/src/translation'

import { Box } from '@mui/material'
import LoginPage from '@/templates/Login/LoginPage'

const Success: NextPage = () => {
  const { locale } = useRouter()
  return (
    <Box>
      <Head>
        <title>{getText(locale, 'title')}</title>
        <meta name="description" content={getText(locale, 'title')} />
      </Head>
      <LoginPage />
    </Box>
  )
}

export default Success
