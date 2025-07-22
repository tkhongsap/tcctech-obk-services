/* eslint-disable unused-imports/no-unused-vars-ts */
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
  FormControl,
} from '@chakra-ui/react'
import withSigin from '@hocs/withSigin'
import { useEffect, useState } from 'react'
import { registerService } from '@src/services/register/service'
import router from 'next/dist/client/router'
import { memberService } from '@src/services/member/service'
import axios from 'axios'
import Link from 'next/link'
import PasswordIndicatorBar from '@components/password-strength'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
interface Error {
  isInputNameError?: boolean
  inputNameError?: string
  isPasswordError?: boolean
  passwordError?: string
  isConfirmPasswordError?: boolean
  confirmPasswordError?: string
  isCheckBoxError?: boolean
  checkBoxError?: string
  isCommonError?: boolean
  commonError?: string
}
const Register: any = withSigin((props: any) => {
  const { TextInputBlock } = props
  const [name, setName] = useState()
  const [password, setPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()
  const [registerstep, setregisterstep] = useState(props.registerStep)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isChecked, setIsChecked] = useState(false)
  const [visiblePassword, setVisiblePassword] = useState(false)
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false)

  const [error, setError] = useState<Error>({})

  const onSubmit = async () => {
    const data = {
      emailOrPhone: props.email,
      password: password!,
      firstname: name!,
      lastname: 'cms',
    }
    setIsLoading(true)

    const client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_URL,
    })
    if (registerstep === 2) {
      await client
        .post('/api/auth/register', data)
        .then((res) => {
          let upsertmember = {
            mid: props.id,
            name: name!,
            status: 2,
            password: password!,
            KeycloakUser: res.data.username,
          }
          registerService.activemember(upsertmember)
          setIsLoading(false)
          setregisterstep(registerstep + 1)
        })
        .catch((err) => {
          setError({
            isCommonError: true,
            commonError:
              ' Something went worng or user exists with same username or email, Please contact admin',
          })
        })
    } else {
      await setIsLoading(false)
      setregisterstep(registerstep + 1)
    }
    return
  }

  const checkValidate = (step: number) => {
    let error: Error = {
      isInputNameError: false,
      inputNameError: '',
      isPasswordError: false,
      passwordError: '',
      isConfirmPasswordError: false,
      confirmPasswordError: '',
      isCheckBoxError: false,
      checkBoxError: '',
      isCommonError: false,
      commonError: '',
    }
    let res = true
    if (step === 1 && (!name || typeof name === 'undefined')) {
      error.isInputNameError = true
      error.inputNameError = 'name must be null'
      res = false
    }
    if (step === 2) {
      if (
        !password &&
        typeof password === 'undefined' &&
        !confirmPassword &&
        typeof confirmPassword === 'undefined' &&
        isChecked != true
      ) {
        error.isPasswordError = true
        ;(error.passwordError = 'Password and Repeat password can not be null'),
          (error.isConfirmPasswordError = true)
        ;(error.confirmPasswordError = ''), (error.isCheckBoxError = true)
        error.checkBoxError = 'Term and Condition and Privacy statement'
        res = false
      }
      if (password !== confirmPassword) {
        error.isConfirmPasswordError = true
        error.inputNameError = 'Password and Repeat password do not match'
        res = false
      }
      if (isChecked != true) {
        error.isCheckBoxError = true
        error.checkBoxError = 'Term and Condition and Privacy statement'
        res = false
      }
    }
    console.log(error)
    setError(error)
    return res
  }

  const onNextStep = async (step: number) => {
    setError({})
    console.log(checkValidate(step))
    if (checkValidate(step)) {
      if (step === 2) {
        await onSubmit()
        return
      }
      setError({})
      setIsLoading(false)
      setregisterstep(registerstep + 1)
    }
  }
  useEffect(() => {}, [])
  return (
    <Box>
      {registerstep === 1 && (
        <>
          {registerstep === 1 && (
            <>
              <Box
                fontSize={36}
                fontWeight={700}
                lineHeight='56px'
                color='astronaut'
                pt='117px'
              >
                What is your name?
              </Box>
              <Box fontSize={16} color='rockBlue'>
                We will use this information to identify and personalize the
                communication with you.
              </Box>
              <Box width={410} pt='41px'>
                <Box>
                  <FormControl isRequired isInvalid={error.isInputNameError}>
                    <TextInputBlock
                      name='name'
                      label='Name'
                      type='text'
                      onChange={setName}
                      value={name}
                    />
                  </FormControl>
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
                    onClick={() => {
                      onNextStep(registerstep)
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </>
      )}
      {registerstep === 2 && (
        <>
          <Box
            fontSize={36}
            fontWeight={700}
            lineHeight='56px'
            color='astronaut'
            pt='117px'
          >
            Set up password
          </Box>
          <Box fontSize={16} color='rockBlue'>
            We will use this information to identify and personalize the
            communication with you.
          </Box>
          <Box width={410} pt='41px'>
            <Box>Password</Box>
            <Box pt='13px'>
              <Box>
                <FormControl isRequired isInvalid={error.isPasswordError}>
                  <InputGroup width='100%'>
                    <Input
                      size='lg'
                      borderRadius='16px'
                      type={visiblePassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e: any) => setPassword(e.target.value)}
                    />
                    <InputRightElement
                      onClick={(e: any) => setVisiblePassword(!visiblePassword)}
                    >
                      {visiblePassword ? <ViewOffIcon /> : <ViewIcon />}
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </Box>
            </Box>
            <Box pt='13px'>
              <Box>Repeat Password</Box>
              <Box pt='13px'>
                <FormControl
                  isRequired
                  isInvalid={error.isConfirmPasswordError}
                >
                  <InputGroup>
                    <Input
                      size='lg'
                      borderRadius='16px'
                      type={visibleConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e: any) => setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement
                      onClick={(e: any) =>
                        setVisibleConfirmPassword(!visibleConfirmPassword)
                      }
                    >
                      {visibleConfirmPassword && <ViewOffIcon />}
                      {!visibleConfirmPassword && <ViewIcon />}
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                {error.isConfirmPasswordError && (
                  <Box mt={2} color='red'>
                    Passwords do not match
                  </Box>
                )}
              </Box>
            </Box>
            <Box pt='10px'>
              <PasswordIndicatorBar password={password} />
            </Box>
            <Flex
              pt='33px'
              justifyContent='space-between'
              alignItems='center'
              fontSize={14}
            >
              <Flex alignItems='center'>
                <Box>
                  <FormControl isRequired isInvalid={error.isCheckBoxError}>
                    <Checkbox
                      size='lg'
                      borderRadius={'50px'}
                      isChecked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                    />{' '}
                  </FormControl>
                </Box>
                <Box
                  pl='11px'
                  color={error.isCheckBoxError ? 'red' : 'astronaut'}
                >
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
            </Flex>
            <Box pt='33px'>
              <Button
                isLoading={isLoading}
                bg='primaryBlue'
                color='white'
                variant='brand'
                width='100%'
                onClick={() => onNextStep(registerstep)}
              >
                Next
              </Button>
            </Box>
          </Box>
        </>
      )}
      {registerstep === 3 && (
        <>
          <Box
            fontSize={36}
            fontWeight={700}
            lineHeight='56px'
            color='astronaut'
            pt='117px'
          >
            Your account is activated!
          </Box>
          <Box fontSize={16} color='rockBlue'>
            We will use this information to identify and personalize the
            communication with you.
          </Box>
          <Box width={410} pt='41px'>
            <Box pt='33px'>
              <Button
                isLoading={isLoading}
                bg='primaryBlue'
                color='white'
                variant='brand'
                width='100%'
                onClick={() => {
                  router.push('/login')
                }}
              >
                Sign in
              </Button>
            </Box>
          </Box>
        </>
      )}
      {registerstep === 0 && (
        <>
          <Box
            fontSize={36}
            fontWeight={700}
            lineHeight='56px'
            color='astronaut'
            pt='117px'
          >
            Sorry, Your invitation is expired
          </Box>
          <Box fontSize={16} color='rockBlue'>
            Please get in touch with the operations team.
          </Box>
          <Box width={410} pt='41px'></Box>
        </>
      )}
    </Box>
  )
})
Register.noLayout = true

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context)
  const { id, invitecode } = context.query
  let registerStep = 0
  await registerService
    .get(id.toString(), invitecode.toString())
    .then((res) => {
      if (res) {
        registerStep = 1
      }
      return
    })
  var email = await memberService.get(id.toString())
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
      registerStep: registerStep,
      id: id,
      email: email.data.email,
    },
  }
}

export default Register
