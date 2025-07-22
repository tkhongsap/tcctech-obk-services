import withGenericServer from '@hocs/server/generic'
import AppVersionDocsTable from '@components/table/appVersionDocsTable'
import useTableTools from '@src/hooks/useTableTools'
import useLoading from '@src/hooks/useLoading'
import { IAppVersionDocumentLog } from '@src/types/document'
import { useEffect, useState } from 'react'
import { nextApi } from '@src/utils/api'
import { PCODE } from '@src/data/constants/privilege'
import { PAGE_SIZE } from '@components/table/constants'

export default function AppVersion() {
  const tableTools = useTableTools()
  const { loading, startLoading, stopLoading } = useLoading()
  const { currentPage, setPagination, pagination, sorting } = tableTools

  const [versionData, setVersionData] = useState<IAppVersionDocumentLog[]>([])
  const [previousVersionData, setPreviousVersionData] = useState<
    IAppVersionDocumentLog[]
  >([])
  const [pastVersionData, setPastVersionData] = useState<
    IAppVersionDocumentLog[]
  >([])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchPreviousData()
  }, [])

  useEffect(() => {
    fetchPastVersionData()
  }, [currentPage, sorting])

  const fetchData = async () => {
    startLoading()
    await nextApi
      .get('/app-setting/app-version')
      .then((res) => {
        console.log('fetch app version data', res.data)
        setVersionData(res.data)
      })
      .catch((err) => {
        console.log('fetch app version data err', err)
      })
      .finally(() => {
        stopLoading()
      })
  }

  const fetchPreviousData = async () => {
    startLoading()
    await nextApi
      .get('/app-setting/app-version-update')
      .then((res) => {
        console.log('fetch previous app version data', res.data)
        setPreviousVersionData(res.data)
      })
      .catch((err) => {
        console.log('fetch previous app version data err', err)
      })
      .finally(() => {
        stopLoading()
      })
  }

  const fetchPastVersionData = async () => {
    startLoading()
    await nextApi
      .get('/app-setting/app-version/past-versions', {
        params: {
          currentPage,
          pageSize: PAGE_SIZE,
          sorting: sorting[0]?.id || 'updatedAt',
          direction: sorting[0]?.desc ? 'desc' : 'asc',
        },
      })
      .then((res) => {
        console.log('fetch past versions', res.data)
        setPastVersionData(
          res.data?.data?.map((item: any) => ({
            ...item,
            updatedAt: item.updated_at,
            updatedBy: item.updated_by,
          }))
        )
        setPagination({
          ...pagination,
          totalData: res.data?.pagination?.total || 1,
          currentPage: res.data?.pagination?.page_number || 1,
          totalPage: res.data?.pagination?.total_page || 1,
        })
      })
      .catch((err) => {
        console.log('fetch past versions err', err)
      })
      .finally(() => {
        stopLoading()
      })
  }

  return (
    <div className='tw-max-w-inherit tw-pb-[60px]'>
      <AppVersionDocsTable
        data={versionData}
        pastVersionData={pastVersionData}
        tableTools={tableTools}
        isLoading={loading}
        previousVersionData={previousVersionData}
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
    redirectPath: '/support/app-version',
    accessPage: PCODE.VIEWAPPVERSION,
  }
)
