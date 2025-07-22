import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { getText } from '@/src/translation'

import { Box, Divider, Grid, Typography } from '@mui/material'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const { locale } = useRouter()
  const [height, setHeight] = useState('100%')
  const [flagPopUp, setFlagPopUp] = useState(false)

  const handleWindowResize = () => {
    if (window.innerHeight < 720) {
      // setHeight(window.innerHeight + 'px')
      setHeight('100%')
      setFlagPopUp(true)
    } else {
      setHeight('100%')
      setFlagPopUp(false)
    }
  }

  useEffect(() => {
    if (global?.window && window.innerHeight) {
      if (window.innerHeight < 720) {
        setHeight(window.innerHeight + 'px')
        setFlagPopUp(true)
      }
      window.addEventListener('resize', handleWindowResize)
      return () => window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  return (
    <Box>
      <Box
        display={'flex'}
        position={'fixed'}
        justifyContent={'center'}
        alignItems={'center'}
        height={'100%'}
        width={'100%'}
      >
        <Image
          priority
          alt="bg"
          src={'/bg.webp'}
          fill
          style={{ objectFit: 'cover' }}
        />
      </Box>
      <Grid
        container
        position={'fixed'}
        justifyContent={'flex-end'}
        alignItems={'center'}
        height={height}
      >
        <Grid
          bgcolor={'rgba(0, 0, 0, 0.4)'}
          height={height}
          alignItems={'center'}
          item
          md={4}
          xs={12}
        >
          <Grid
            container
            p={5}
            height={height}
            width={'100%'}
            flexWrap={'wrap'}
            alignContent={'space-between'}
            overflow={'auto'}
          >
            <Box
              m={'auto'}
              alignContent={'center'}
              height={flagPopUp ? '20%' : '50%'}
            >
              <Image
                priority
                alt="logo"
                src={'/logo.png'}
                height={50}
                width={240}
              />
            </Box>
            <Box
              width={'100%'}
              height={flagPopUp ? '80%' : '50%'}
              alignContent={'flex-end'}
            >
              <Typography mb={2} variant={'h5'} fontWeight={'bold'}>
                {getText(locale, 'subtitle')}
              </Typography>
              <Grid item xs={4}>
                <Divider sx={{ borderColor: 'white' }} />
              </Grid>
              {children}
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default RootLayout
