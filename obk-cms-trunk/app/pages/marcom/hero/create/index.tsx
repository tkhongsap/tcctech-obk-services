import withGenericServer from '@hocs/server/generic'
import { HeroData } from '@src/services/marcom/hero-banner/model'
import React from 'react'
import { useForm } from '@refinedev/react-hook-form'
import { PCODE } from '@src/data/constants/privilege'
import { Box } from '@chakra-ui/react'
import Upsert from '@components/marcom/hero/upsert'

const CretaeHeroBanner = () => {
  const defaultValue: any = new HeroData(undefined)
  const form = useForm({
    defaultValues: defaultValue,
  })
  return (
    <Box maxW='inherit' pb='60px'>
      <Upsert formData={form} defaultValue={defaultValue} formType='create' />
    </Box>
  )
}

export default CretaeHeroBanner

CretaeHeroBanner.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/marcom/hero',
    accessPage: PCODE.CREATEHERO,
  }
)
