import { get } from 'lodash'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

import axios from 'axios'

import { Box, Button, Fade, FormControl, Grid, TextField } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'

import { SUCCESS_ROUTE } from '@/src/config/route'

import {
  DUPLICATE_DEVICE,
  GLOBAL,
  INVALID_OTP,
  OTP_EXPIRE,
  REMAIN_LOCK_OTP,
  USER_IS_LOCKED,
  USER_OR_PASS_ERROR,
} from '@/src/config/errorCode'

import { getText } from '@/src/translation'

import { calculateMinutesDifference, serialize } from '@/src/utils/commonUtils'
import { FormEvent, KeyboardEvent } from '@/src/utils/type'

import RootLayout from '../Home/layout'

import { useNavigationStore, useStore } from '@/src/store'

import styles from './style.module.css'

const LoginPage = () => {
  const [count, setCount] = useState(0)
  const [countExpire, setCountExpire] = useState<Date | null>(null)

  const router = useRouter()
  const { locale } = useRouter()

  const [mobile, setMobile] = useState('')
  const [code, setCode] = useState('')
  const [otp, setOTP] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [displayOtpPage, setDisplayOtpPage] = useState(false)
  const [flagError, setFlagError] = useState(false)
  const [flagMobile, setFlagMobile] = useState(true)
  const [flagLock, setFlagLock] = useState(false)
  const [flagExpire, setFlagExpire] = useState(false)
  const [captcha, setCaptcha] = useState({ src: '' })
  const [remain, setRemain] = useState('')

  const [errorMessage, setErrorMessage] = useState('')

  const { imageSrc, setImageSrc } = useStore()

  const { currentPath, previousPath } = useNavigationStore()

  const regex = /^\d+$/

  useEffect(() => {
    const splitPrevious = previousPath.split('/th')[1] || previousPath
    const splitCurrent = currentPath.split('/th')[1] || currentPath
    const checkRoute = splitPrevious !== splitCurrent
    if (!imageSrc) {
      getCaptcha()
    } else {
      if (checkRoute) {
        getCaptcha()
      }
      setIsLoading(false)
      setCaptcha({ src: imageSrc })
    }
  }, [router])

  useEffect(() => {
    let intervalId: NodeJS.Timeout
    if (count > 0) {
      // console.log(count)
      intervalId = setInterval(() => setCount(count - 1), 1000)
    } else if (count === 0 && flagLock) {
      setFlagLock(false)
    }

    return () => clearInterval(intervalId)
  }, [count])

  const getCaptcha = async () => {
    setIsLoading(true)
    try {
      const { uaddress, umac, apmac } = router.query
      const currentUnixTimestamp = Math.floor(Date.now() / 1000)
      if (uaddress && umac && (apmac || router.query['ac-ip'])) {
        let params = {
          date: currentUnixTimestamp,
          uaddress,
          umac,
        }
        if (apmac) {
          params = Object.assign({}, params, { apmac })
        } else if (router.query['ac-ip']) {
          params = Object.assign({}, params, { acip: router.query['ac-ip'] })
        }
        // API for get captcha image
        const res = await axios.get('/api/getCaptcha', { params })
        const src = `data:image/jpeg;base64,${res.data.image}`
        setCaptcha({ src })
        setImageSrc(src)
        setIsLoading(false)
      }
    } catch (e) {
      // console.log(e)
      setIsLoading(false)
    }
  }

  const getSmsPwd = async () => {
    setIsLoading(true)
    try {
      const {
        pushPageId,
        apmac,
        ssid,
        uaddress,
        umac,
        lang,
        vendor,
        nodeIp,
        siteId,
        authType,
      } = router.query
      let query = {
        pushPageId,
        ssid,
        uaddress,
        umac,
        lang,
        telephone: mobile.trim(),
        validCode: code.trim(),
        esn: '',
        armac: '',
        registerCode: '',
        authType,
        vendor,
        nodeIp,
        siteId,
      }
      if (apmac) {
        query = Object.assign({}, query, { apmac, acip: '' })
      } else if (router.query['ac-ip']) {
        query = Object.assign({}, query, {
          apmac: '',
          acip: router.query['ac-ip'],
        })
      }
      const body = serialize(Object(query))
      // API for request OTP
      const res = await axios.post('/api/getSmsPwd', body)
      if (Object.keys(res.data[0])[0] === 'successMsg') {
        setCount(60)
        setCountExpire(new Date())
        setFlagLock(false)
        setFlagMobile(false)
      } else {
        const errmsg = res.data[0].errmsg
        if (errmsg === INVALID_OTP) {
          setErrorMessage('captcha')
        } else if (errmsg === REMAIN_LOCK_OTP) {
          setErrorMessage('otpMax')
        } else if (errmsg === GLOBAL) {
          setErrorMessage('global')
        }
        setFlagError(true)
      }
      setIsLoading(false)
      setDisplayOtpPage(true)
    } catch (e) {
      // console.log(e)
      setFlagError(true)
      setIsLoading(false)
    }
  }

  const login = async () => {
    setIsLoading(true)
    try {
      const { pushPageId, apmac, ssid, uaddress, umac, authType } = router.query
      let query = {
        pushPageId,
        userPass: otp.trim(),
        esn: '',
        armac: '',
        authType,
        ssid,
        uaddress,
        umac,
        accessMac: '',
        businessType: '',
        agreed: 1,
        registerCode: '',
        questions: '',
        dynamicValidCode: '',
        dynamicRSAToken: '',
        validCode: code.trim(),
        userName: mobile.trim(),
      }
      if (apmac) {
        query = Object.assign({}, query, { apmac, acip: '' })
      } else if (router.query['ac-ip']) {
        query = Object.assign({}, query, {
          apmac: '',
          acip: router.query['ac-ip'],
        })
      }
      const body = serialize(Object(query))
      // API for connect Internet
      const res = await axios.post('/api/login', body)
      // console.log(res)
      if (res.data.success) {
        setTimeout(() => {
          router.push(SUCCESS_ROUTE)
        }, 1000)
      } else {
        const { errorcode } = res.data
        if (errorcode === USER_OR_PASS_ERROR || errorcode === '10542') {
          // TODO: OTP error
          const { remainTimes, lockTime } = res.data.data
          if (remainTimes === '-1') {
            // TODO: OTP max
            setFlagLock(true)
            setErrorMessage('otpMax')
            setCount(60 * parseInt(lockTime))
          } else {
            setRemain(`(${remainTimes}/${lockTime})`)
            setErrorMessage('otp')
          }
        } else if (errorcode === USER_IS_LOCKED) {
          // TODO: OTP max remain lock
          const { remainLockTime } = res.data.data
          setFlagLock(true)
          setErrorMessage('otpMaxCount')
          setCount(60 * parseInt(remainLockTime))
        } else if (errorcode === OTP_EXPIRE) {
          // TODO: OTP expire
          setFlagExpire(true)
          setErrorMessage('otpExpire')
        } else if (errorcode === DUPLICATE_DEVICE) {
          // TODO: Login more than 2 device
          setFlagExpire(true)
          setErrorMessage('duplicateDevice')
        }
        setIsLoading(false)
        setFlagError(true)
      }
    } catch (e) {
      // console.log(e)
      setFlagError(true)
      setIsLoading(false)
    }
  }

  const validateMobile = (value: string) => {
    // if (value !== '' && value.length < 10) {
    //   return getText(locale, 'validateMobileDigit')
    // }
    if (value !== '' && !regex.test(value)) {
      return getText(locale, 'validateMobile')
    }
    return null
  }

  const validateOtp = (value: string) => {
    if (value !== '' && value.length < 6) {
      return getText(locale, 'validateOtpDigit')
    }
    return null
  }

  const validateNumeric = (event: KeyboardEvent) => {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
    ]
    if (!allowedKeys.includes(event.key) && !regex.test(event.key)) {
      event.preventDefault()
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (flagError) {
      // Error case
      const minutes = calculateMinutesDifference(countExpire) || 0
      if (displayOtpPage && (count !== 0 || minutes < 5)) {
        setFlagError(false)
        setOTP('')
      } else {
        resetForm()
      }
    } else if (mobile !== '' && code !== '' && otp !== '') {
      // Login case
      setMobile(get(e, 'target.mobile.value', ''))
      setCode(get(e, 'target.code.value', ''))
      setOTP(get(e, 'target.otp.value', ''))
      login()
    } else if (mobile !== '' && code !== '') {
      // Request Otp case
      setMobile(get(e, 'target.mobile.value', ''))
      setCode(get(e, 'target.code.value', ''))
      getSmsPwd()
    }
  }

  const validateDisable = () => {
    const checkCount = count === 0
    const checkFlow = !!validateMobile(mobile) || mobile === '' || code === ''
    const checkOtp = !!validateOtp(otp) || otp === ''
    if (flagMobile) {
      // Mobile and captcha section
      if (!flagLock && !checkCount) {
        return true
      } else if (displayOtpPage) {
        return isLoading || !flagMobile || !flagError || !checkCount
      }
      return isLoading || flagError || (flagMobile && checkFlow)
    }
    if (flagLock) {
      // Login lock
      return true
    }
    if (flagExpire) {
      // Otp expire case
      return true
    }
    if (flagError) {
      // Error page section
      if (errorMessage === 'global') {
        // Case errmsg === GLOBAL
        return true
      }
      return false
    }

    // Otp section
    return isLoading || flagError || (!flagMobile && checkOtp)
  }

  const resetForm = () => {
    getCaptcha()
    setMobile('')
    setCode('')
    setOTP('')
    setRemain('')
    setDisplayOtpPage(false)
    setFlagMobile(true)
    setFlagError(false)
    setFlagExpire(false)
    setIsLoading(false)
    setErrorMessage('')
  }

  const errorSection = (
    <Box>
      {errorMessage === 'captcha' && (
        <div
          className={styles.loginHtml}
          dangerouslySetInnerHTML={{
            __html: getText(locale, 'errorCaptcha'),
          }}
        />
      )}
      {errorMessage === 'otp' && (
        <Box>
          <Box>{`${getText(locale, 'errorOtp')} ${remain}`}</Box>
          <Box>
            <div
              className={styles.loginHtml}
              dangerouslySetInnerHTML={{
                __html: getText(locale, 'errorTryAgain'),
              }}
            />
          </Box>
        </Box>
      )}
      {errorMessage === 'otpMax' && (
        <div
          className={styles.loginHtml}
          dangerouslySetInnerHTML={{
            __html: getText(locale, 'errorOtpMax'),
          }}
        />
      )}
      {errorMessage === 'otpMaxCount' && (
        <Box>
          <div
            className={styles.loginHtml}
            dangerouslySetInnerHTML={{
              __html: getText(locale, 'errorMaxCount'),
            }}
          />
          <Box>{`${getText(locale, 'errorCount')} ${count} ${getText(locale, 'countUnit')}`}</Box>
        </Box>
      )}
      {errorMessage === 'otpExpire' && (
        <div
          className={styles.loginHtml}
          dangerouslySetInnerHTML={{
            __html: getText(locale, 'errorExpire'),
          }}
        />
      )}
      {errorMessage === 'duplicateDevice' && (
        <div
          className={styles.loginHtml}
          dangerouslySetInnerHTML={{
            __html: getText(locale, 'errorConnect'),
          }}
        />
      )}
      {(errorMessage === '' || errorMessage === 'global') && (
        <div
          className={styles.loginHtml}
          dangerouslySetInnerHTML={{
            __html: getText(locale, 'errorGlobal'),
          }}
        />
      )}
    </Box>
  )

  const mobileSection = (
    <Box>
      <TextField
        name="mobile"
        fullWidth
        label={getText(locale, 'mobile')}
        variant="standard"
        value={mobile}
        onChange={e => setMobile(e.target.value)}
        sx={{
          '.MuiInputLabel-formControl': {
            color: 'white',
          },
          '.MuiInputLabel-formControl.Mui-focused': {
            color: 'white',
          },
          '.MuiInput-underline::after': {
            borderColor: 'white',
          },
        }}
        InputProps={{
          sx: { height: 50, fontSize: '22px', letterSpacing: 2 },
        }}
        inputProps={{ maxLength: 15 }}
        error={!!validateMobile(mobile)}
        helperText={validateMobile(mobile)}
        onKeyDown={validateNumeric}
      />
      {captcha.src !== '' && (
        <Box>
          <Box mt={2} />
          <TextField
            name="code"
            fullWidth
            label={getText(locale, 'code')}
            variant="standard"
            value={code}
            onChange={e => setCode(e.target.value)}
            sx={{
              '.MuiInputLabel-formControl': {
                color: 'white',
              },
              '.MuiInputLabel-formControl.Mui-focused': {
                color: 'white',
              },
              '.MuiInput-underline::after': {
                borderColor: 'white',
              },
            }}
            InputProps={{
              sx: { height: 50, fontSize: '22px' },
            }}
          />
          <Box mt={2} />
          <Box display={'flex'}>
            <Image
              loading={'lazy'}
              alt="captcha-code"
              src={captcha.src}
              width={80}
              height={45}
              style={{ width: 'auto' }}
            />
            <Box ml={1} my={'auto'}>
              <Button
                color="secondary"
                variant="contained"
                onClick={getCaptcha}
                sx={{ minWidth: '45px', height: '45px' }}
              >
                <RefreshIcon />
              </Button>
            </Box>
          </Box>
          <Box pt={1}>
            <small style={{ lineHeight: 1 }}>
              <div
                className={styles.loginHtml}
                dangerouslySetInnerHTML={{
                  __html: getText(locale, 'mobileHint'),
                }}
              />
            </small>
          </Box>
        </Box>
      )}
    </Box>
  )

  const otpSection = (
    <Box>
      <TextField
        name="otp"
        fullWidth
        label={getText(locale, 'otp')}
        variant="standard"
        value={otp}
        onChange={e => setOTP(e.target.value)}
        sx={{
          '.MuiInputLabel-formControl': {
            color: 'white',
          },
          '.MuiInputLabel-formControl.Mui-focused': {
            color: 'white',
          },
          '.MuiInput-underline::after': {
            borderColor: 'white',
          },
        }}
        InputProps={{
          sx: { height: 50, fontSize: '22px', letterSpacing: 2 },
        }}
        inputProps={{ maxLength: 6 }}
        error={!!validateOtp(otp)}
        helperText={validateOtp(otp)}
        onKeyDown={validateNumeric}
      />
      <Box>
        <small>
          <div
            className={styles.loginHtml}
            dangerouslySetInnerHTML={{
              __html: getText(locale, 'otpHint'),
            }}
          />
        </small>
      </Box>
    </Box>
  )

  const buttonSection = (
    <Box
      mt={
        errorMessage === 'captcha'
          ? 6
          : displayOtpPage &&
              (count !== 0 ||
                (calculateMinutesDifference(countExpire) || 0) < 5)
            ? 3
            : 6
      }
    >
      {/* Always display */}
      {errorMessage !== 'captcha' && (
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          type="submit"
          style={{ textTransform: 'none' }}
          disabled={validateDisable()}
        >
          {flagError
            ? getText(locale, 'acceptError')
            : !flagLock && !displayOtpPage && count !== 0 && count < 60
              ? `${getText(locale, 'countText')} ${count} ${getText(locale, 'countUnit')}`
              : !flagLock && !displayOtpPage && count === 0
                ? getText(locale, 'acceptMobile')
                : getText(locale, 'acceptOtp')}
        </Button>
      )}
      {/* Display after access otp section */}
      {displayOtpPage && (
        <Box mt={1}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => resetForm()}
            style={{ textTransform: 'none' }}
          >
            {getText(locale, 'backText')}
          </Button>
        </Box>
      )}
    </Box>
  )

  return (
    <RootLayout>
      <Grid flexWrap={'wrap'} alignContent={'space-between'} py={2}>
        <form
          onKeyDown={event => {
            if (event.key === 'Enter') {
              event.preventDefault()
            }
          }}
          onSubmit={handleSubmit}
        >
          <Box my={2} height={200}>
            <FormControl fullWidth>
              <Fade
                in={flagError}
                style={{ display: flagError ? 'block' : 'none' }}
              >
                {errorSection}
              </Fade>
              <Fade
                in={!displayOtpPage && !flagError}
                style={{
                  display: flagError
                    ? 'none'
                    : !displayOtpPage && !flagError
                      ? 'block'
                      : 'none',
                }}
              >
                {mobileSection}
              </Fade>
              <Fade
                in={displayOtpPage && !flagError}
                style={{
                  display: flagError
                    ? 'none'
                    : !displayOtpPage && !flagError
                      ? 'none'
                      : 'block',
                }}
              >
                {otpSection}
              </Fade>
            </FormControl>
          </Box>
          {buttonSection}
        </form>
      </Grid>
    </RootLayout>
  )
}

export default LoginPage
