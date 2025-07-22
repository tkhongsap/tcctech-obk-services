import Upsert from '@components/support/document/upsertNoSSR'
import withGenericServer from '@hocs/server/generic'
import SectionTitle from '@components/display/section-title'
import { useForm } from '@refinedev/react-hook-form'
import { useGetLocale, useResource } from '@refinedev/core'
import { useRouter } from 'next/router'
import useLoading from '@src/hooks/useLoading'
import { useEffect, useState } from 'react'
import { IFaqDocumentDetail } from '@src/types/document'
import * as OB_DOCUMENT_SDK from 'ob-document-sdk'
import { markdownToHtml } from 'utils/markdown'

export default function EditLegal() {
  const resources = useResource()
  const form = useForm({
    defaultValues: {},
  })

  const { query } = useRouter()
  const { startLoading, stopLoading } = useLoading()
  const [documentData, setDocumentData] = useState<IFaqDocumentDetail[] | null>(
    null
  )
  const locale = useGetLocale()
  const currentLocale = locale()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (query.id) {
      fetchData()
    }
  }, [query.id])

  const fetchData = async () => {
    const { id } = query
    if (id && typeof id === 'string') {
      setLoading(true)
      startLoading()
      await OB_DOCUMENT_SDK.client
        .categoryShow('*', id)
        .then((res: any) => {
          console.log('Fetch history category detail successfully!!: ', res)
          setDocumentData([
            {
              ...res?.data?.data[0],
              title: {
                en:
                  typeof res?.data?.data[0]?.title === 'string'
                    ? JSON.parse(res?.data?.data[0]?.title).en
                    : res?.data?.data[0]?.title?.en,
                th:
                  typeof res?.data?.data[0]?.title === 'string'
                    ? JSON.parse(res?.data?.data[0]?.title).th
                    : res?.data?.data[0]?.title?.th,
                cn:
                  typeof res?.data?.data[0]?.title === 'string'
                    ? JSON.parse(res?.data?.data[0]?.title).cn
                    : res?.data?.data[0]?.title?.cn,
              },
              list: res?.data?.data[0]?.list?.map((doc: any) => {
                return {
                  ...doc,
                  title: {
                    en: doc?.title?.en,
                    th: doc?.title?.th,
                    cn: doc?.title?.cn,
                  },
                  body: {
                    en: markdownToHtml(doc?.body?.en),
                    th: markdownToHtml(doc?.body?.th),
                    cn: markdownToHtml(doc?.body?.cn),
                  },
                }
              }),
            },
          ])
        })
        .catch((err) => {
          console.log('Fetch history category detail error: ', err)
        })
        .finally(() => {
          setLoading(false)
          stopLoading()
        })
    }
  }

  return (
    <div className='tw-max-w-inherit'>
      <SectionTitle>Edit {resources?.resource?.meta?.label}</SectionTitle>
      <div className='tw-pt-[42px]'>
        {loading ? (
          <p> </p>
        ) : (
          <Upsert
            submitMsg={`Are you sure you want to publish ${
              documentData
                ? // @ts-ignore
                  '“' + documentData[0]?.title[currentLocale ?? 'en'] + '”'
                : ''
            } changes?`}
            data={documentData}
            form={form}
            formType='edit'
            addabled={false}
          />
        )}
      </div>
    </div>
  )
}

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    return ctx
  },
  {
    redirectPath: '/legal/legal-content/edit',
  }
)
