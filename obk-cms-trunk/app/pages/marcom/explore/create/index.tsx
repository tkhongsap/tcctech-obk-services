import withGenericServer from '@hocs/server/generic'
import React from 'react'
import { useForm } from 'react-hook-form'
import { PCODE } from '@src/data/constants/privilege'
import { Box } from '@chakra-ui/react'
import Upsert from '@components/marcom/explore/upsert'
import { ExploreData } from '@src/services/marcom/explore-one-bangkok/model'

const CretaeEvent = () => {
  const defaultValue: any = new ExploreData(undefined)
  const form = useForm({
    defaultValues: defaultValue,
  })
  return (
    <Box maxW='inherit' pb='60px'>
      <Upsert formData={form} defaultValue={defaultValue} formType='create' />
    </Box>
  )
}

export default CretaeEvent

CretaeEvent.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/marcom/explore',
    accessPage: PCODE.CREATEEXPLORE,
  }
)
