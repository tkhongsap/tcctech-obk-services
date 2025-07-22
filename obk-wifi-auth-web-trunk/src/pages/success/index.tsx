import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { getText } from '@/src/translation'

import { Box } from '@mui/material'
import SuccessPage from '@/templates/Success/SuccessPage'

const Success: NextPage = () => {
  const { locale } = useRouter()
  return (
    <Box>
      <Head>
        <title>{getText(locale, 'title')}</title>
        <meta name="description" content={getText(locale, 'title')} />
      </Head>
      <SuccessPage />
    </Box>
  )
}

export default Success
