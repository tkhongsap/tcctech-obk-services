// import { AuthPage } from "@refinedev/core";

import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { authProvider } from 'src/authProvider'

import { Box } from '@chakra-ui/react'

import withSigin from '@hocs/withSigin'
import { appConfigService } from '@src/services/app-config/service'
import parse from 'html-react-parser'

const TermsConditions: any = withSigin((props: any) => {
  const { termsConditions } = props
  return (
    <Box>
      <Box
        fontSize={36}
        fontWeight={700}
        lineHeight='56px'
        color='astronaut'
        pt='117px'
      >
        Terms and Conditions
      </Box>

      <Box width={410} pt='41px'>
        {parse(termsConditions)}
      </Box>
    </Box>
  )
})

TermsConditions.noLayout = true

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

  const res = await appConfigService.get('TERMS_AND_CONDITIONS')
  const termsConditions = res.data

  return {
    props: {
      ...translateProps,
      termsConditions,
    },
  }
}

export default TermsConditions
