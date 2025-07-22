import { Flex, Box, Center, Input } from '@chakra-ui/react'
import { dmSans } from '@fonts'
import SvgObLogo from '@assets/svg/ob-logo.svg'
import { ChangeEvent } from 'react'

interface TextInputBlock {
  label: string
  type: string
  value?: string
  onChange?: Function
}

const Hoc = (Component: any) => {
  const RenderComponent = (props: any) => {
    const TextInputBlock = ({
      label,
      type,
      onChange,
      value = '',
    }: TextInputBlock) => {
      const handleOnchange = (e: ChangeEvent<HTMLInputElement>) => {
        if (onChange) onChange(e.target.value)
      }
      return (
        <Box>
          <Box>{label}</Box>
          <Box pt='13px'>
            <Input
              size='lg'
              borderRadius='16px'
              type={type}
              onChange={handleOnchange}
              value={value}
            />
          </Box>
        </Box>
      )
    }

    const newProps = {
      ...props,
      TextInputBlock,
    }
    return (
      // <Component {...newProps} />

      <Flex minH='100vh' className={dmSans.className}>
        <Center px='20px' flex={1}>
          <Box>
            <Center>
              <SvgObLogo width='308' />
            </Center>
            <Box>
              <Component {...newProps} />
            </Box>
          </Box>
        </Center>
        <Flex
          display={{ _: 'none', md: 'block' }}
          flex='0 0 60vw'
          bgImage="url('/images/png/login-bg.png')"
          bgRepeat='no-repeat'
          bgSize='cover'
          bgPos='top left'
        />
      </Flex>
    )
  }

  return RenderComponent
}

Hoc.noLayout = true
export default Hoc
