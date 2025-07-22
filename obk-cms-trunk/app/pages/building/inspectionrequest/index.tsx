import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslate } from '@refinedev/core'
import withGenericServer from '@hocs/server/generic'
import { ColumnProps } from 'primereact/column'
import { TableAction } from '@components/display/table-action'
import { Table } from '@components/table/Table'
import { Tag } from 'primereact/tag'
import { DataTableStateEvent } from 'primereact/datatable'
import { PCODE } from '@src/data/constants/privilege'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { IGetInspectionRequest } from '@src/services/buildingservice/inspectionrequest/model'
import { inspectionRequestService } from '@src/services/buildingservice/inspectionrequest/service'

export default function InspectionRequest() {
  const translate = useTranslate()
  const [isLoading, setIsLoading] = useState(false)
  const { setMenuName } = useLayoutContext()
  const [data, setData] = useState<IGetInspectionRequest[]>([])
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const [tableState, setTableState] = useState<DataTableStateEvent>({
    filters: {},
    first: 0,
    multiSortMeta: [],
    rows: 10,
    sortField: 'name',
    sortOrder: -1,
  })

  setMenuName('Urgent Service Request')
  function formatDate(dateString: string | undefined) {
    if (!dateString) return ''

    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'id',
        header: 'ID',
        style: { minWidth: '100px' },
      },

      {
        field: 'title',
        header: 'Title',
        style: { minWidth: '100px' },
      },
      {
        field: 'description',
        header: 'description',
        style: { minWidth: '100px' },
      },
      {
        field: 'createdDate',
        header: 'createdDate',
        style: { minWidth: '100px' },

        body: (data: IGetInspectionRequest) => {
          return formatDate(data.createdDate)
        },
      },
      {
        field: 'location',
        header: 'Location',
        style: { minWidth: '100px' },
      },
      {
        field: 'srEventNames',
        header: 'Event',
        style: { minWidth: '150px' },
        body: (data: IGetInspectionRequest) => {
          return Array.isArray(data.srEventNames)
            ? data.srEventNames.join(', ')
            : '-'
        },
      },
      {
        field: 'srProblemNames',
        header: 'Problem',
        style: { minWidth: '150px' },
        body: (data: IGetInspectionRequest) => {
          return Array.isArray(data.srProblemNames)
            ? data.srProblemNames.join(', ')
            : '-'
        },
      },
      {
        field: 'status',
        header: 'Status',
        style: { minWidth: '120px' },

        body: ({ status }) => {
          return (
            <div>
              {status === 'Pending' && (
                <Tag
                  style={{ backgroundColor: '#D3D3D3', borderColor: '#3F3F3F' }}
                  className='border-1 font-medium'
                >
                  Pending
                </Tag>
              )}
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
        body: (data: IGetInspectionRequest) => {
          return (
            <>
              <TableAction types={['edit']} id={data.id} />
            </>
          )
        },
      },
    ],
    [translate]
  )

  const getData = useCallback(async () => {
    setIsLoading(true)
    await inspectionRequestService
      .getAll(tableState)
      .then((res) => {
        setData(res.data)
        setTotalRecords(res.paginate.total)
        console.log('res', res)
      })
      .finally(() => {
        setIsLoading(false)
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableState])

  useEffect(() => {
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableState])

  return (
    <>
      <div className='card'>
        <div>
          <div>
            <div className='font-bold text-xl mb-3'>Requested List</div>
            <Table
              columns={columns}
              data={data}
              loading={isLoading}
              totalRecords={totalRecords}
              rows={10}
              sortField='updatedDate'
              sortOrder={-1}
              onTableStateChange={setTableState}
            />
          </div>
        </div>
      </div>
    </>
  )
}

InspectionRequest.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/building/inspectionrequest',
    accessPage: PCODE.VIEWINSPECTIONREQUESTLISTANDDETAILS,
  }
)
