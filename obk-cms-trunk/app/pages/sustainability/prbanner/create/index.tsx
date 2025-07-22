import { Box } from '@chakra-ui/react'
import Upsert from '@components/sustainability/pr-banner/upsert'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import { BannerData } from '@src/services/sustainability/pr-banner/model'
import React from 'react'
import { useForm } from 'react-hook-form'

const CreateBanner = () => {
  const defaultValue: any = new BannerData(undefined)
  const form = useForm({
    defaultValues: defaultValue,
  })

  return (
    <Box maxW='inherit' pb='60px'>
      <Upsert formData={form} defaultValue={defaultValue} formType='create' />
    </Box>
  )
}

export default CreateBanner

CreateBanner.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/sustainability/prbanner',
    accessPage: PCODE.EDITPRBANNER,
  }
)
