import { Box } from '@chakra-ui/react'
import { useForm } from '@refinedev/react-hook-form'
import Upsert from '@components/sustainability/content-management/upsert'
import { ContentManagementData } from '@src/services/sustainability/content-mangement/model'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'

export default function CreateContent() {
  const defaultValue: any = new ContentManagementData(undefined)
  const form = useForm({
    defaultValues: defaultValue,
  })

  return (
    <Box maxW='inherit' pb='60px'>
      <Upsert formData={form} defaultValue={defaultValue} formType='create' />
    </Box>
  )
}

CreateContent.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/sustainability/all',
    accessPage: PCODE.EDITCONTENT,
  }
)
