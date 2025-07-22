import withGenericServer from '@hocs/server/generic'
import DocsTable from '@components/table/docsTable'
import useLoading from '@src/hooks/useLoading'
import useTableTools from '@src/hooks/useTableTools'
import { IFaqDocumentLog, IHistoryCategoryResponse } from '@src/types/document'
import * as OB_DOCUMENT_SDK from 'ob-document-sdk'
import { useCallback, useEffect, useState } from 'react'
import { PAGE_SIZE } from '@components/table/constants'
import snakeCase from 'lodash/snakeCase'
import { PCODE } from '@src/data/constants/privilege'
type Props = {
  can: string[]
}
export default function Faq(props: Props) {
  const tableTools = useTableTools()
  const { setPagination, pagination } = tableTools
  const { loading, startLoading, stopLoading } = useLoading()
  const { sorting, currentPage } = tableTools

  const [currentVersionList, setCurrentVersionList] = useState<
    IHistoryCategoryResponse[]
  >([])
  const [prevVersionList, setPrevVersionList] = useState<
    IHistoryCategoryResponse[]
  >([])

  const fetchType = async () => {
    const result = await OB_DOCUMENT_SDK.client.typeShow('faq').catch((err) => {
      console.log('Fetch type error', err)
    })
    return result?.data?.data as unknown as any[]
  }

  const fetchData = useCallback(async () => {
    startLoading()
    const dataType = await fetchType()
    const type = dataType ? dataType[0] : ''
    const sortingColumn = snakeCase(sorting[0]?.id)
    const sortingDirection = sorting[0]?.desc ? 'desc' : 'asc'
    await OB_DOCUMENT_SDK.client
      .historyCategoryIndex(
        type?.type,
        sortingColumn,
        sortingDirection,
        currentPage,
        PAGE_SIZE
      )
      .then((res) => {
        setPrevVersionList(res.data?.data as IHistoryCategoryResponse[])
        setPagination({
          ...pagination,
          totalData: res.data?.pagination?.total || 1,
          currentPage: res.data?.pagination?.page_number || 1,
          totalPage: res.data?.pagination?.total_page || 1,
        })
        console.log('Fetch history category successfully!!: ', res)
      })
      .catch((err) => {
        console.log('Fetch history category error', err)
      })
    await OB_DOCUMENT_SDK.client
      .categoryCmsShow('*', undefined, type?.id)
      .then((res) => {
        setCurrentVersionList(res.data?.data as IHistoryCategoryResponse[])
        console.log('Fetch current category successfully!!: ', res)
      })
      .catch((err) => {
        console.log('Fetch current category error', err)
      })
      .finally(() => {
        stopLoading()
      })
  }, [currentPage, sorting])

  useEffect(() => {
    console.log(props.can)
    fetchData()
  }, [currentPage, sorting])

  const normalizedData = (data: IHistoryCategoryResponse[]) => {
    return data.map((item) => {
      const title =
        typeof item.title === 'string' ? JSON.parse(item.title) : item.title
      return {
        id: item.id,
        title: {
          en: title.en || '-',
          th: title.th || '-',
        },
        version: item.version,
        active: item.active,
        updatedAt: item.updated_at,
        updatedBy: item.updated_by,
        updatedByName: item.updated_by_name,
        documents: item.history_document,
        image: item.image,
        numberOfDocuments: item.history_document
          ? item.history_document?.length
          : item.list?.length || 0,
        categoryId: item.category_id,
      } as IFaqDocumentLog
    })
  }

  const prevData = normalizedData(prevVersionList)
  const cuurentData = normalizedData(currentVersionList)

  return (
    <div className='tw-max-w-inherit tw-pb-[60px]'>
      <DocsTable
        currentData={cuurentData}
        prevData={prevData}
        tableTools={tableTools}
        isLoading={loading}
        btnLabel='Create new FAQ category'
        searchable={false}
        type='faq'
        access={props.can}
      />
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
    accessPage: PCODE.VIEWFAQLISTANDDETAILS,
  }
)
