import { useCallback, useMemo } from 'react'
import { useTranslate } from '@refinedev/core'
import { useState } from 'react'
import withGenericServer from '@hocs/server/generic'
import { ColumnProps } from 'primereact/column'
import { TableAction } from '@components/display/table-action'
import { Table } from '@components/table/Table'
import { IServiceRequest } from '@src/services/buildingservice/servicerequest/model'
import { Tag } from 'primereact/tag'
import * as OBBMSSDK from 'ob-bms-sdk'
import { ServiceRequestData } from 'ob-bms-sdk/api/api'
import { formatDateTime } from 'utils/dayjs'
import { DataTableStateEvent } from 'primereact/datatable'
import { PCODE } from '@src/data/constants/privilege'

export default function ServiceRequest() {
  OBBMSSDK.setBaseUrl(process.env.BMS_BASEURL || '')
  const translate = useTranslate()
  const [isLoading, setIsLoading] = useState(false)
  const [serviceRequest, setServiceRequest] = useState<ServiceRequestData[]>([])

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'references',
        header: 'ID',
        style: { minWidth: '200px' },
        sortable: true,
      },
      {
        field: 'issue_type.name',
        header: 'Type of issue',
        style: { minWidth: '200px' },
      },
      {
        field: 'tower.name',
        header: 'Building',
        style: { minWidth: '200px' },
      },
      {
        field: 'title',
        header: 'Title',
        style: { minWidth: '200px' },
      },
      {
        field: 'created_at',
        header: 'Created date',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'requester_id',
        header: 'Created by',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'status',
        header: 'status',
        sortable: true,
        style: { minWidth: '120px' },
        body: ({ status }) => {
          return (
            <div>
              {status === 'submitted' && (
                <Tag
                  style={{ backgroundColor: '#FFFEC1', borderColor: '#FFB800' }}
                  className='border-1 font-medium'
                >
                  Submitted
                </Tag>
              )}
              {status === 'in_progress' && (
                <Tag
                  style={{ backgroundColor: '#D6F2FF', borderColor: '#068EFF' }}
                  className='border-1 font-medium'
                >
                  In progress
                </Tag>
              )}
              {status === 'done' && (
                <Tag
                  style={{ backgroundColor: '#DFF9E5', borderColor: '#1E7735' }}
                  className='border-1  font-medium'
                >
                  Done
                </Tag>
              )}
            </div>
          )
        },
      },
      {
        id: 'actions',
        accessorKey: 'id',
        header: translate('table.actions'),
        style: { minWidth: '100px' },
        frozen: true,
        alignFrozen: 'right',
        body: (data: ServiceRequestData) => {
          return <TableAction types={['show']} id={data.id} />
        },
      },
    ],
    [translate]
  )

  const fetchCategory = useCallback(async (e: DataTableStateEvent) => {
    const direction = e.sortOrder == -1 ? 'asc' : 'desc'
    OBBMSSDK.client
      .serviceRequestsIndex(
        undefined,
        e.sortField,
        direction,
        (e.page ?? 0) + 1,
        e.rows
      )
      .then((res: any) => {
        console.log(res)
        const serviceRequestData = res?.data?.data.map(
          (rs: IServiceRequest) => ({
            ...rs,
            created_at: new Date(rs.created_at)
              .toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true, // Include AM/PM marker
              })
              .replace(',', ''), // Removing comma after the date
          })
        ) as ServiceRequestData[]

        const decorateData = serviceRequestData.map((data) => {
          return {
            ...data,
            created_at: formatDateTime(data.created_at),
            requester_id: data.requester.tenant_members
              ?.map(
                (x) => (x.tenant.display_name! as { nameEn: string }).nameEn
              )
              .join(',') as string,
          }
        })
        setServiceRequest(decorateData)
        setIsLoading(false)
        return decorateData
      })
  }, [])

  return (
    <>
      <div className='card'>
        <div>
          <div className='font-bold text-xl mb-3'>Requested List</div>
          <div>
            <Table
              columns={columns}
              data={serviceRequest}
              loading={isLoading}
              totalRecords={50}
              onTableStateChange={fetchCategory}
            />
          </div>
        </div>
      </div>
    </>
  )
}

ServiceRequest.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/building/servicerequest',
    accessPage: PCODE.VIEWSERVICEREQUESTLISTANDDETAILS,
  }
)
