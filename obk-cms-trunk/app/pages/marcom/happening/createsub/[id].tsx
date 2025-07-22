import { Box } from '@chakra-ui/react'
import { useForm } from '@refinedev/react-hook-form'
import Upsert from '@components/marcom/happening/upsert'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import { useRouter } from 'next/router'
import { HappeningData } from '@src/services/marcom/what-happening/model'

export default function CreateSubContent() {
  const defaultValue: any = new HappeningData(undefined)
  const form = useForm({
    defaultValues: defaultValue,
  })

  const { query } = useRouter()
  const { id } = query

  return (
    <Box maxW='inherit' pb='60px'>
      <Upsert
        formData={form}
        defaultValue={defaultValue}
        formType='create-sub'
        parent={id}
        isCategory={false}
      />
    </Box>
  )
}

CreateSubContent.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/marcom/happening',
    accessPage: PCODE.CREATEHAPPENNING,
  }
)
