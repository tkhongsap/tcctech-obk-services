import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { useState } from 'react'

import MobileMenu from '@components/menu/mobile'

export default function Header(props: any) {
  const { sticky = true } = props
  const bgColor = useColorModeValue(
    'refine.header.bg.light',
    'refine.header.bg.dark'
  )

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  let stickyProps: BoxProps = {}
  if (sticky) {
    stickyProps = {
      position: 'sticky',
      top: 0,
      zIndex: 1,
    }
  }

  return (
    <Box
      py='2'
      pr='4'
      pl='2'
      display='flex'
      alignItems='center'
      justifyContent='space-between'
      w='full'
      height='64px'
      bg={bgColor}
      borderBottom='1px'
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      {...stickyProps}
    >
      <Box>
        <Box onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <HamburgerIcon />
        </Box>
      </Box>

      {mobileMenuOpen && (
        <MobileMenu
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      )}
    </Box>
  )
}
