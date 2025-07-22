import withGenericServer from '@hocs/server/generic'
import useLoading from '@src/hooks/useLoading'
import useTableTools from '@src/hooks/useTableTools'
import { IFaqDocumentLog, IHistoryCategoryResponse } from '@src/types/document'
import React, { useEffect, useState } from 'react'
import * as OB_DOCUMENT_SDK from 'ob-document-sdk'
import DocsTable from '@components/table/docsTable'
import { snakeCase } from 'lodash'
import { PAGE_SIZE } from '@components/table/constants'

const LegalContent = () => {
  const tableTools = useTableTools()
  const { loading, startLoading, stopLoading } = useLoading()

  const [currentVersionList, setCurrentVersionList] = useState<
    IHistoryCategoryResponse[]
  >([])
  const [prevVersionList, setPrevVersionList] = useState<
    IHistoryCategoryResponse[]
  >([])

  const [customFilter, setCustomFilter] = useState<any>([
    {
      field: 'category_id',
      placeholder: 'Category',
      options: [],
    },
  ])

  const {
    setPagination,
    pagination,
    currentPage,
    setFilters,
    filters,
    sorting,
  } = tableTools

  useEffect(() => {
    fetchData()
  }, [currentPage])

  useEffect(() => {
    setCustomFilter([
      {
        field: 'category_id',
        placeholder: 'Category',
        options: [
          {
            name: 'All',
            value: '',
          },
          ...currentVersionList.map((item) => {
            return {
              name:
                typeof item.title === 'string'
                  ? JSON.parse(item.title).en
                  : item.title?.en,
              value: item.id,
            }
          }),
        ],
      },
    ])
  }, [currentVersionList])

  useEffect(() => {
    fetchData(filters[0]?.field, filters[0]?.value)
  }, [filters, sorting])

  const fetchType = async () => {
    const result = await OB_DOCUMENT_SDK.client
      .typeShow('legal')
      .catch((err) => {
        console.log('Fetch type error', err)
      })
    return result?.data?.data as unknown as any[]
  }

  const fetchData = async (filterBy?: string, filterKey?: string) => {
    startLoading()
    const typeData = await fetchType()
    const type = typeData ? typeData[0] : ''
    const sortingColumn = snakeCase(sorting[0]?.id)
    const sortingDirection = sorting[0]?.desc ? 'desc' : 'asc'

    await OB_DOCUMENT_SDK.client
      .historyCategoryIndex(
        type?.type,
        sortingColumn,
        sortingDirection,
        currentPage,
        PAGE_SIZE,
        filterBy,
        filterKey
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
      .categoryShow('*', undefined, type?.id)
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
  }

  const normalizedData = (data: IHistoryCategoryResponse[]) => {
    return data?.map((item) => {
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

  const onFilter = (items: any) => {
    if (Array.isArray(items) && items.length > 0 && setFilters) {
      // const search = items[0].value
      setFilters(items)
      fetchData()
    } else {
      // If items array is empty (no search filter), fetch data without search parameter
      setFilters(items)
      fetchData()
    }
  }

  return (
    <div className='max-w-inherit pb-[60px]'>
      <DocsTable
        currentData={cuurentData}
        prevData={prevData}
        tableTools={tableTools}
        isLoading={loading}
        searchable={false}
        createable={false}
        onFilter={onFilter}
        isSearchFilter={false}
        customFilter={customFilter}
        type='legal'
      />
    </div>
  )
}

export default LegalContent

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    return ctx
  },
  {
    redirectPath: '/legal/legal-content',
  }
)
