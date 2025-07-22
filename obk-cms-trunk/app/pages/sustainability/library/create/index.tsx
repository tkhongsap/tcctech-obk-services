import { Box } from '@chakra-ui/react'
import Upsert from '@components/sustainability/digital-library/upsert'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import React from 'react'
import { useForm } from 'react-hook-form'

const CreateLibrary = () => {
  const defaultValue: any = {}
  const form = useForm({
    defaultValues: defaultValue,
  })
  return (
    <Box maxW='inherit' pb='60px'>
      <Upsert formData={form} defaultValue={defaultValue} formType='create' />
    </Box>
  )
}

export default CreateLibrary

CreateLibrary.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/sustainability/library',
    accessPage: PCODE.EDITLIBRARY,
  }
)
