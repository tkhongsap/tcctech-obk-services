// import { AuthPage } from "@refinedev/core";
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { authProvider } from 'src/authProvider'
import {
  Flex,
  Box,
  Button,
  Checkbox,
  FormControl,
  InputGroup,
  Input,
  InputRightElement,
} from '@chakra-ui/react'
import axios from 'axios'
import withSigin from '@hocs/withSigin'
import { useState } from 'react'
import { memberService } from '@src/services/member/service'
import { IResetPasswordCode } from '@src/services/member/model'
import { useRouter } from 'next/router'
import PasswordIndicatorBar from '@components/password-strength'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
const ResetPassword: any = withSigin((props: any) => {
  const { isVerify, id, username } = props
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [checkboxError, setCheckboxError] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [isResetSuccess, SetIsResetSuccess] = useState<boolean>(false)
  const router = useRouter()
  const [visiblePassword, setVisiblePassword] = useState(false)
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false)

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    if (password === confirmPassword) {
      const client = axios.create({
        baseURL: process.env.NEXT_PUBLIC_URL,
      })
      const data = {
        username: username,
        newpassword: password!,
      }
      await client.post('/api/auth/resetpassword', data).then(() => {
        let resetid: IResetPasswordCode = { resetPasswordCode: id }
        memberService.resetPassword(resetid).then((rs) => {
          if (rs.data.isSuccess) {
            SetIsResetSuccess(true)
          }
        })
      })
    } else {
      setPasswordError(true)
    }
    if (!isChecked) {
      setCheckboxError(true)
    }
  }
  const onGoToLogin = () => {
    router.push({
      pathname: '/login',
    })
  }
  return (
    <form onSubmit={handleSubmit}>
      {isVerify && !isResetSuccess && (
        <Box>
          <Box
            fontSize={36}
            fontWeight={700}
            lineHeight='56px'
            color='astronaut'
            pt='117px'
          >
            Set up your new password
          </Box>
          <Box width={410} pt='41px'>
            <Box>
              <FormControl isRequired isInvalid={passwordError}>
                <InputGroup width='100%'>
                  <Input
                    size='lg'
                    borderRadius='16px'
                    type={visiblePassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e: any) => setPassword(e.target.value)}
                  />
                  <InputRightElement
                    onClick={() => setVisiblePassword(!visiblePassword)}
                  >
                    {visiblePassword ? <ViewOffIcon /> : <ViewIcon />}
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </Box>
          </Box>
          <Box width={410} pt='41px'>
            <Box>
              <FormControl isRequired isInvalid={passwordError}>
                <InputGroup>
                  <Input
                    size='lg'
                    borderRadius='16px'
                    type={visibleConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e: any) => setConfirmPassword(e.target.value)}
                  />
                  <InputRightElement
                    onClick={() =>
                      setVisibleConfirmPassword(!visibleConfirmPassword)
                    }
                  >
                    {visibleConfirmPassword && <ViewOffIcon />}
                    {!visibleConfirmPassword && <ViewIcon />}
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              {passwordError && (
                <Box mt={2} color='red'>
                  Passwords do not match
                </Box>
              )}
            </Box>
            <Box pt='10px'>
              <PasswordIndicatorBar password={password} />
            </Box>
          </Box>
          <Flex alignItems='center'>
            <Box>
              <FormControl isRequired isInvalid={checkboxError}>
                <Checkbox
                  size='lg'
                  borderRadius={'50px'}
                  isChecked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />{' '}
              </FormControl>
            </Box>
            <Box pl='11px' color='astronaut'>
              I read and accept{' '}
              <Link target='_blank' href='/terms-conditions'>
                <u>Terms and Conditions</u>
              </Link>{' '}
              and
              <Link target='_blank' href='/privacystatement'>
                <u>Privacy Statement</u>
              </Link>
            </Box>
          </Flex>
          <Box pt='41px'>
            <Button
              bg='primaryBlue'
              color='white'
              variant='brand'
              width='100%'
              type='submit'
            >
              Next
            </Button>
          </Box>
        </Box>
      )}
      {isVerify === false && !isResetSuccess && (
        <Box>
          <Box
            fontSize={36}
            fontWeight={700}
            lineHeight='56px'
            color='astronaut'
            pt='117px'
          >
            Set up your new password
          </Box>
          <Box>Sorry Token is invalid or expire</Box>
        </Box>
      )}

      {isResetSuccess && (
        <Box>
          <Box
            fontSize={36}
            fontWeight={700}
            lineHeight='56px'
            color='astronaut'
            pt='117px'
          >
            Your password was changed
          </Box>
          <Box>Welcome to One Bangkok Operations Board.</Box>
          <Button
            bg='primaryBlue'
            color='white'
            variant='brand'
            width='100%'
            type='button'
            onClick={onGoToLogin}
          >
            Sign in
          </Button>
        </Box>
      )}
    </form>
  )
})

ResetPassword.noLayout = true

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context)
  const { id } = context.query
  let isVerify = false
  let username = ''
  const translateProps = await serverSideTranslations(context.locale ?? 'en', [
    'common',
  ])
  await memberService.getResetPasswordCode(id.toString()).then((res) => {
    if (res.data.isVerify) {
      isVerify = true
      username = res.data.email
    }
  })
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
      id: id,
      isVerify: isVerify,
      username: username,
    },
  }
}

export default ResetPassword
