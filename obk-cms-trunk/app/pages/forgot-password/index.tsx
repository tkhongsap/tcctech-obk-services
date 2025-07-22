// import { AuthPage } from "@refinedev/core";

import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { authProvider } from 'src/authProvider'

import { Flex, Box, Button } from '@chakra-ui/react'

import withSigin from '@hocs/withSigin'
import { useState } from 'react'
import { memberService } from '@src/services/member/service'
import { IForgotPassword } from '@src/services/member/model'
import Link from 'next/link'

const ForgotPassword: any = withSigin(
  (props: any) => {
    const { TextInputBlock } = props

    const upsertForgotpassword: IForgotPassword = { email: '' }
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const onSubmit = async () => {
      setIsLoading(true)
      upsertForgotpassword.email = username
      memberService.forgotPassword(upsertForgotpassword).then((res) => {
        setIsLoading(false)
        if (res.data.isSuccess == true) {
          setIsSuccess(true)
        } else {
          setError(res.data.message)
        }
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
          Reset password
        </Box>
        {isSuccess == false && (
          <>
            <Box fontSize={16} color='rockBlue'>
              Enter your email or phone number along with your password to sign
              in
              {error && <Box color='red'>{error}</Box>}
            </Box>
            <Box width={410} pt='41px'>
              <Box>
                <TextInputBlock
                  label='Email'
                  type='text'
                  onChange={setUsername}
                  value={username}
                />
              </Box>

              <Flex
                pt='33px'
                justifyContent='space-between'
                alignItems='center'
                fontSize={14}
              ></Flex>

              <Box pt='33px'>
                <Button
                  isLoading={isLoading}
                  bg='primaryBlue'
                  color='white'
                  variant='brand'
                  width='100%'
                  onClick={onSubmit}
                >
                  Send email
                </Button>
              </Box>
            </Box>
          </>
        )}
        {isSuccess == true && (
          <Box fontSize={16} color='rockBlue'>
            Send Set Up new password to email
            <Link href='/login'>
              <u>Login</u>
            </Link>{' '}
          </Box>
        )}

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

ForgotPassword.noLayout = true

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

export default ForgotPassword
