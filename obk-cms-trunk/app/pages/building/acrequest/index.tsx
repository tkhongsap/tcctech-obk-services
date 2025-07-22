import { useCallback, useMemo } from 'react'
import { useTranslate } from '@refinedev/core'
import { useState } from 'react'
import withGenericServer from '@hocs/server/generic'
import { ColumnProps } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { TableAction } from '@components/display/table-action'
import { Table } from '@components/table/Table'
// import { IAcRequest } from '@src/services/buildingservice/acrequest/model'
import * as OBBMSSDK from 'ob-bms-sdk'
import { DataTableStateEvent } from 'primereact/datatable'
import {
  ACRequestResponse,
  RequesterDataTenantMembersInner,
} from 'ob-bms-sdk/dist/api'
import { PCODE } from '@src/data/constants/privilege'

export default function AcRequest() {
  OBBMSSDK.setBaseUrl(process.env.BMS_BASEURL || '')
  const translate = useTranslate()
  const [isLoading, setIsLoading] = useState(false)
  const [acRequest, setAcRequest] = useState<ACRequestResponse[]>([])

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'references',
        header: 'ID',
        style: { minWidth: '180px' },
        sortable: true,
      },
      {
        field: 'requester.tenant_members.tenant.name',
        header: 'Tenant name',
        style: { minWidth: '200px' },
        sortable: true,
        body: (rowData: ACRequestResponse) => {
          if (
            rowData.requester.tenant_members &&
            Array.isArray(rowData.requester.tenant_members) &&
            rowData.requester.tenant_members.length > 0
          ) {
            return rowData.requester.tenant_members
              .map(
                (request: RequesterDataTenantMembersInner) =>
                  request.tenant.name
              )
              .join(', ')
          } else {
            return 'N/A'
          }
        },
      },
      {
        field: 'tower.name',
        header: 'Building',
        style: { minWidth: '180px' },
      },
      {
        field: 'floor.name',
        header: 'Floor',
        style: { minWidth: '100px' },
      },
      {
        field: 'ac_zone.name',
        header: 'Zone',
        style: { minWidth: '200px' },
        body: (rowData: ACRequestResponse) => {
          if (
            rowData.ac_zone &&
            Array.isArray(rowData.ac_zone) &&
            rowData.ac_zone.length > 0
          ) {
            return rowData.ac_zone
              .map((zone: { ac_zone: { name: any } }) => zone.ac_zone.name)
              .join(', ')
          } else {
            return 'N/A'
          }
        },
      },
      {
        field: 'from',
        header: 'Form',
        style: { minWidth: '200px' },
        sortable: true,
      },
      {
        field: 'to',
        header: 'To',
        style: { minWidth: '200px' },
        sortable: true,
      },
      {
        field: 'status',
        sortable: true,
        // accessorKey: 'content',
        header: 'status',
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
              {status === 'approved' && (
                <Tag
                  style={{ backgroundColor: '#DFF9E5', borderColor: '#1E7735' }}
                  className='border-1  font-medium'
                >
                  Approved
                </Tag>
              )}
              {status === 'rejected' && (
                <Tag
                  style={{ backgroundColor: '#FFE1DF', borderColor: '#A5170F' }}
                  className='border-1  font-medium'
                >
                  Rejected
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
        body: (data: ACRequestResponse) => {
          return <TableAction types={['show']} id={data.id} />
        },
        className: 'col-sticky-end', //to draw line between cell
      },
    ],
    [translate]
  )

  const fetchAcRequest = useCallback(async (e: DataTableStateEvent) => {
    const direction = e.sortOrder == -1 ? 'asc' : 'desc'
    OBBMSSDK.client
      .acRequestIndex(e.sortField, direction, (e.page ?? 0) + 1, e.rows)
      .then((res: any) => {
        const acRequestData = res?.data?.data.map((rs: ACRequestResponse) => ({
          ...rs,
          from: new Date(rs.from)
            .toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false, // Include AM/PM marker
            })
            .replace(',', ''), // Removing comma after the date
          to: new Date(rs.to)
            .toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false, // Include AM/PM marker
            })
            .replace(',', ''), // Removing comma after the date
        })) as ACRequestResponse[]
        setAcRequest(acRequestData)
        setIsLoading(false)
        console.log(acRequestData)
        return acRequestData
      })
  }, [])

  return (
    <>
      <div>
        <div className='card'>
          <div>
            <div className='flex justify-content-between'></div>
            <div>
              <Table
                columns={columns}
                data={acRequest}
                loading={isLoading}
                totalRecords={50}
                onTableStateChange={fetchAcRequest}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

AcRequest.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/building/acrequest',
    accessPage: PCODE.VIEWAIRCONDITIONERREQUESTLISTANDDETAILS,
  }
)
