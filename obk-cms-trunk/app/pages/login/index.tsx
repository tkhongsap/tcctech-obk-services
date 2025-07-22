import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { authProvider } from 'src/authProvider'

import {
  Flex,
  Box,
  Button,
  Checkbox,
  InputGroup,
  InputRightElement,
  Input,
} from '@chakra-ui/react'

import withSigin from '@hocs/withSigin'
import { useLogin } from '@refinedev/core'
import { useState } from 'react'
import Link from 'next/link'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

interface LoginError {
  name?: string
  message?: string
}

const Login: any = withSigin(
  (props: any) => {
    const { TextInputBlock } = props

    const [username, setUsername] = useState('test1@test.com')
    const [password, setPassword] = useState('P@ssw0rd')
    const [error, setError] = useState<LoginError | undefined>({})
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [visiblePassword, setVisiblePassword] = useState<boolean>(false)
    const { mutate: login } = useLogin()
    const onSubmit = async () => {
      const values = {
        username: username,
        password: password,
      }
      setIsLoading(true)
      login(values, {
        onSettled: (res) => {
          setIsLoading(false)
          if (res && !res.success) {
            setError(res.error)
          }
        },
        onError: ({ error: errorObj }: any) => {
          setError(errorObj)
        },
      })
    }

    return (
      <Box>
        <Box
          fontSize={36}
          fontWeight={700}
          lineHeight='56px'
          color='astronaut'
          pt='117px'
        >
          Sign In
        </Box>

        <Box fontSize={16} color='rockBlue'>
          Enter your email and password to sign in!
        </Box>

        {error?.name && <Box color='red'>{error?.name}</Box>}

        <Box width={410} pt='41px'>
          <Box>
            <TextInputBlock
              label='Email'
              type='text'
              onChange={setUsername}
              value={username}
            />
          </Box>
          <Box pt='24px'>
            <Box>
              <Box>Password</Box>
              <Box pt='13px'>
                <InputGroup>
                  <Input
                    size='lg'
                    borderRadius='16px'
                    type={visiblePassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e: any) => setPassword(e.target.value)}
                  />
                  <InputRightElement
                    height='100%'
                    onClick={() => setVisiblePassword(!visiblePassword)}
                  >
                    {visiblePassword && <ViewOffIcon />}
                    {!visiblePassword && <ViewIcon />}
                  </InputRightElement>
                </InputGroup>
              </Box>
            </Box>
          </Box>
          <Flex
            pt='33px'
            justifyContent='space-between'
            alignItems='center'
            fontSize={14}
          >
            <Flex alignItems='center'>
              <Box>
                <Checkbox size='lg' borderRadius={'50px'} defaultChecked />
              </Box>
              <Box pl='11px' color='astronaut'>
                Keep me logged in
              </Box>
            </Flex>
            <Box fontWeight={500} lineHeight='20px' color='primaryBlue'>
              <Link href='/forgot-password'>Forget password?</Link>{' '}
            </Box>
          </Flex>

          <Box pt='33px'>
            <Button
              isLoading={isLoading}
              bg='primaryBlue'
              color='white'
              variant='brand'
              width='100%'
              onClick={onSubmit}
            >
              Sign In
            </Button>
          </Box>
        </Box>

        {/* <Box>
                  <Box>email: demo@refine.dev</Box>
                  <Box>password: demodemo</Box>
                </Box> */}
      </Box>
    )
  }
  // />
)
// }
// )

Login.noLayout = true

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context)

  const translateProps = await serverSideTranslations(context.locale ?? 'en', [
    'common',
  ])

  if (authenticated) {
    return {
      props: {},
      redirect: {
        destination: redirectTo ?? '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      ...translateProps,
    },
  }
}

export default Login
