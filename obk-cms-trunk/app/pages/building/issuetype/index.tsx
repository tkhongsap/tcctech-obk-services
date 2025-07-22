import { useEffect, useMemo } from 'react'
import { useTranslate } from '@refinedev/core'
import { useState } from 'react'
import withGenericServer from '@hocs/server/generic'
import { ColumnProps } from 'primereact/column'
import { TableAction } from '@components/display/table-action'
import { Table } from '@components/table/Table'
import { IIssueType } from '@src/services/buildingservice/issuetype/model'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { Button } from 'primereact/button'
import router from 'next/router'
import { IssueTypeData } from 'ob-bms-sdk/api/api'
import * as OBBMSSDK from 'ob-bms-sdk'
import { PCODE } from '@src/data/constants/privilege'

export default function NotificationCategory() {
  OBBMSSDK.setBaseUrl(process.env.BMS_BASEURL || '')
  const translate = useTranslate()
  const [isLoading, setIsLoading] = useState(false)
  const [issueType, setIssueType] = useState<IssueTypeData[]>([])
  const { setMenuAction } = useLayoutContext()

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'id',
        header: 'ID',
        style: { minWidth: '100px' },
      },
      {
        field: 'name',
        header: 'English',
        style: { minWidth: '100px' },
      },
      {
        field: 'display_name.th',
        header: 'Thai',
        style: { minWidth: '200px' },
      },
      {
        field: 'display_name.zh',
        header: 'Simplify Chinese',
        style: { minWidth: '200px' },
      },
      {
        field: 'updated_at',
        header: 'Last update',
        style: { minWidth: '200px' },
      },
      {
        id: 'actions',
        accessorKey: 'id',
        header: translate('table.actions'),
        style: { minWidth: '100px' },
        frozen: true,
        alignFrozen: 'right',
        body: (data: IIssueType) => {
          return <TableAction types={['edit']} id={data.id} />
        },
      },
    ],
    [translate]
  )

  const onCreateNewIssueType = () => {
    router.push({
      pathname: '/building/issuetype/create',
    })
  }

  useEffect(() => {
    fetchIssueType()
    const menuAction = (
      <div className='flex gap-3'>
        <Button label='Create new issue type' onClick={onCreateNewIssueType} />
      </div>
    )
    setMenuAction(menuAction)
    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuAction])

  const fetchIssueType = () => {
    OBBMSSDK.client.issueTypesIndex().then((res: any) => {
      const issueTypeData = res?.data?.data.map((rs: IssueTypeData) => ({
        ...rs,
        updated_at: new Date(rs.updated_at)
          .toLocaleString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // Include AM/PM marker
          })
          .replace(',', ''),
      })) as IssueTypeData[]

      issueTypeData.sort((a, b) => a.name.localeCompare(b.name))

      setIssueType(issueTypeData)
      console.log(issueTypeData)
      return issueTypeData
    })
  }

  return (
    <>
      <div className='card'>
        <div>
          <div className='mb-4'>
            <span className='font-bold text-2xl'>List of issue types</span>
          </div>
          <div>
            <Table columns={columns} data={issueType} loading={isLoading} />
          </div>
        </div>
      </div>
    </>
  )
}

NotificationCategory.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/issuetype',
    accessPage: PCODE.VIEWISSUETYPELISTANDDETAILS,
  }
)
