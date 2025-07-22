import { FC, PropsWithChildren } from 'react'
import { Breadcrumb } from '../breadcrumb'
import { Menu } from '../menu'
import { dmSans } from '@fonts'
import { Flex, Box } from '@chakra-ui/react'
import Header from '@components/header'

const menuW = '300px'

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Flex className={dmSans.className}>
      <Box
        pos='sticky'
        top={0}
        overflowY='auto'
        maxH='100vh'
        flex={`0 0 ${menuW}`}
        display={{ _: 'none', md: 'flex' }}
      >
        <Menu />
      </Box>
      <Box
        display='flex'
        flexDirection='column'
        flex={1}
        minH='100vh'
        width={`calc(100% - ${menuW})`}
        bg='selago'
      >
        <Box display={{ md: 'none' }}>
          <Header />
        </Box>
        <Box pt={{ _: '10px', md: '30px' }}>
          <Box>
            <Box px={{ _: '15px', md: '30px' }} py={{ _: '5px', md: '10px' }}>
              <Breadcrumb />
            </Box>
            <Box px={{ md: '30px' }}>{children}</Box>
          </Box>
        </Box>
      </Box>
    </Flex>
  )
}
