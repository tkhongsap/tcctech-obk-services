import Upsert from '@components/support/document/upsertNoSSR'
import withGenericServer from '@hocs/server/generic'
import SectionTitle from '@components/display/section-title'
import { useForm } from '@refinedev/react-hook-form'
import { useRouter } from 'next/router'
import useLoading from '@src/hooks/useLoading'
import { useEffect, useState } from 'react'
import { IFaqDocumentDetail } from '@src/types/document'
import * as OB_DOCUMENT_SDK from 'ob-document-sdk'
import { markdownToHtml } from 'utils/markdown'
import { PCODE } from '@src/data/constants/privilege'
import { useTranslate } from '@refinedev/core'

export default function EditFAQ() {
  const form = useForm({
    defaultValues: {},
  })
  const translate = useTranslate()

  const { query } = useRouter()
  const { startLoading, stopLoading } = useLoading()
  const [documentData, setDocumentData] = useState<IFaqDocumentDetail>()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { id } = query
    if (id && typeof id === 'string') {
      startLoading()
      await OB_DOCUMENT_SDK.client
        .categoryShow('*', id)
        .then((res: any) => {
          console.log('Fetch history category detail successfully!!: ', res)
          setDocumentData(
            res?.data?.data.map((doc: any) => ({
              ...doc,
              list: doc.list.map((listDoc: any) => ({
                ...listDoc,
                body: {
                  en: markdownToHtml(listDoc.body.en),
                  th: markdownToHtml(listDoc.body.th),
                  cn: markdownToHtml(listDoc.body.cn),
                },
              })),
            }))
          )
        })
        .catch((err) => {
          console.log('Fetch history category detail error: ', err)
        })
        .finally(() => stopLoading())
    }
  }

  return (
    <div className='tw-max-w-inherit pt-[60px]'>
      <SectionTitle>{translate('faqs.titles.edit')}</SectionTitle>
      <div className='tw-pt-[42px]'>
        <Upsert data={documentData} form={form} formType='edit' />
      </div>
    </div>
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
