import {
  useRef,
  // useState
} from 'react'
import { useRouter } from 'next/router'
import { getText } from '@/src/translation'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import type { OverlayScrollbarsComponentRef } from 'overlayscrollbars-react'

import { Box, Button, Link } from '@mui/material'
import styles from './style.module.css'

const ConsentPage = ({ onClick }: { onClick?: () => void }) => {
  const { locale } = useRouter()
  // const [check, setCheck] = useState(false)

  const osRef = useRef<OverlayScrollbarsComponentRef>(null)

  // const scrollEvent = () => {
  //   const { current } = osRef
  //   const osInstance = current?.osInstance()

  //   if (!osInstance) {
  //     return
  //   }

  //   const overflowAmount = osInstance?.state().overflowAmount
  //   const scrollOffsetElement = osInstance?.elements().scrollOffsetElement
  //   const scrollTop = scrollOffsetElement?.scrollTop

  //   if (overflowAmount?.y === scrollTop) {
  //     // osRef.current?.getElement()?.focus()
  //     setCheck(true)
  //   } else {
  //     setCheck(false)
  //   }
  // }

  const scrollContent = () => {
    const { current } = osRef
    const osInstance = current?.osInstance()

    if (!osInstance) {
      return
    }

    const { scrollOffsetElement } = osInstance.elements()

    scrollOffsetElement.scrollTo({
      behavior: 'smooth',
      left: 0,
      top: 0,
    })
  }

  return (
    <Box py={2}>
      <OverlayScrollbarsComponent
        ref={osRef}
        style={{ maxHeight: '200px', zIndex: 99 }}
        // events={{
        //   scroll: () => {
        //     // if (check) {
        //     //   alert('Hello')
        //     // }
        //     scrollEvent()
        //   },
        // }}
        defer
      >
        <div
          className={styles.consentHtml}
          dangerouslySetInnerHTML={{ __html: getText(locale, 'consent') }}
        />
        <Link
          style={{ wordBreak: 'break-word' }}
          color={'white'}
          underline="none"
          href="https://www.onebangkok.com/en/privacy-policy/"
        >
          https://www.onebangkok.com/en/privacy-policy/
        </Link>
        <Box mt={2} textAlign={'center'}>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            style={{ textTransform: 'none' }}
            onClick={scrollContent}
          >
            {getText(locale, 'consentButton')}
          </Button>
        </Box>
      </OverlayScrollbarsComponent>
      {/* <Box height={200} sx={{ overflow: 'auto' }}>
        <div
          className={styles.consentHtml}
          dangerouslySetInnerHTML={{ __html: getText(locale, 'consent') }}
        />
        <Link
          style={{ wordBreak: 'break-word' }}
          color={'white'}
          underline="none"
          rel="noopener noreferrer"
          href="https://www.onebangkok.com/en/privacy-policy/"
        >
          https://www.onebangkok.com/en/privacy-policy/
        </Link>
      </Box> */}
      <Box mt={6}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          style={{ textTransform: 'none' }}
          onClick={onClick}
        >
          {getText(locale, 'acceptConsent')}
        </Button>
      </Box>
    </Box>
  )
}

export default ConsentPage
