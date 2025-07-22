import Upsert from '@components/support/document/upsertNoSSR'
import withGenericServer from '@hocs/server/generic'
import { Box } from '@chakra-ui/react'
import SectionTitle from '@components/display/section-title'
import { useForm } from '@refinedev/react-hook-form'
import { PCODE } from '@src/data/constants/privilege'
import { useTranslate } from '@refinedev/core'

export default function CreateFAQ() {
  const form = useForm({
    defaultValues: {},
  })
  const translate = useTranslate()

  return (
    <Box maxW='inherit' pb='60px'>
      <SectionTitle>{translate('faqs.titles.create')}</SectionTitle>
      <Box pt='42px'>
        <Upsert form={form} formType='create' />
      </Box>
    </Box>
  )
}

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/support/faqs',
    accessPage: PCODE.CREATEANDEDITFAQS,
  }
)
