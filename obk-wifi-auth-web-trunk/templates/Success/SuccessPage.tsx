import { useRouter } from 'next/router'
import { getText } from '@/src/translation'

import { Box, Button, Typography } from '@mui/material'

import RootLayout from '../Home/layout'

import styles from './style.module.css'

const SuccessPage = () => {
  const { locale } = useRouter()
  return (
    <RootLayout>
      <Box py={2}>
        <Box my={2} height={200} sx={{ overflow: 'auto' }}>
          <Typography mb={3} variant={'body1'} fontWeight={'bold'}>
            <div
              className={styles.successHtml}
              dangerouslySetInnerHTML={{
                __html: getText(locale, 'successBody'),
              }}
            />
          </Typography>
          <Typography variant={'body1'} fontWeight={'bold'}>
            <div
              className={styles.successHtml}
              dangerouslySetInnerHTML={{
                __html: getText(locale, 'successCallCenter'),
              }}
            />
          </Typography>
          <Typography variant={'body1'} fontWeight={'bold'}>
            <div
              className={styles.successHtml}
              dangerouslySetInnerHTML={{
                __html: getText(locale, 'successEmail'),
              }}
            />
          </Typography>
        </Box>
        <Box mt={6}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            style={{ textTransform: 'none' }}
            href="https://www.onebangkok.com/"
          >
            {getText(locale, 'explore')}
          </Button>
        </Box>
      </Box>
    </RootLayout>
  )
}

export default SuccessPage
