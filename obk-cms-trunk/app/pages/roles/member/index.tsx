/* eslint-disable unused-imports/no-unused-vars-ts */
import { useCallback, useEffect, useMemo } from 'react'
import { useTranslate } from '@refinedev/core'
import { useState } from 'react'
import withGenericServer from '@hocs/server/generic'
import { ColumnProps } from 'primereact/column'
import { IMember } from '@components/role/member/types/member'
import { MemberFilter } from '@components/role/member/member-filter'
import { Table } from '@components/table/Table'
import { useRouter } from 'next/router'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { memberService } from '@src/services/member/service'
import { Button } from 'primereact/button'
import { IGetMember, IMemberFilterModel } from '@src/services/member/model'
import { DataTableStateEvent } from 'primereact/datatable'
import { Badge } from 'primereact/badge'
import { format } from 'date-fns'
import { SelectItem } from 'primereact/selectitem'
import { usePermission } from '@src/hooks/permissionProvider'
import { IRole } from '@src/services/role/model'
import { roleService } from '@src/services/role/service'
import { useDebounce } from 'primereact/hooks'
import { PCODE } from '@src/data/constants/privilege'
import ListAction from '@components/listworkrq/action'
import { Tag } from 'primereact/tag'
export default function Member(props: any) {
  const router = useRouter()
  const translate = useTranslate()
  const { setMenuAction } = useLayoutContext()
  const { currentPage, setCurrentPage } = props
  const [filterMember, debouncedFilterRole, setFilterMember] =
    useDebounce<IMemberFilterModel>({}, 400)
  const [tableState, setTableState] = useState<DataTableStateEvent>()
  const [totalRecords, setTotalRecords] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [data, setData] = useState([]) as any
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState<IRole[]>([])
  const { checkAccess } = usePermission()
  const getData = useCallback(async () => {
    setPerPage(50)
    setIsLoading(true)
    console.log(filterMember)
    await memberService.getAll(filterMember, tableState).then((res) => {
      setData(res.data)
      setTotalRecords(res.totalRecords)
      console.log('totalrecord' + res.totalRecords)
      setIsLoading(false)
    })
  }, [debouncedFilterRole, tableState])

  function getStatusBadge(status: number) {
    let statusValue: {
      severity: 'warning' | 'success' | 'danger' | 'info' | null | undefined
      value: string
    }
    switch (status) {
      case 1:
        statusValue = { severity: 'warning', value: 'Pending' }
        break
      case 2:
        statusValue = { severity: 'success', value: 'Granted' }
        break
      case 0:
        statusValue = { severity: 'danger', value: 'Suspended' }
        break
      default:
        statusValue = { severity: 'info', value: 'Unknown' }
        break
    }

    return (
      <Tag key='pending' severity={statusValue.severity}>
        <span
          style={{
            fontSize: '12px',
          }}
        >
          {statusValue.value}
        </span>
      </Tag>
    )
  }

  const memberTemplate = (rowData: IGetMember) => {
    return (
      <div className='overflow-hidden'>
        <div className='white-space-nowrap overflow-hidden text-overflow-ellipsis'>
          {getStatusBadge(rowData.status)}
        </div>
      </div>
    )
  }

  const roleTemplate = (rowData: IGetMember) => {
    return (
      <div className='overflow-hidden'>
        <div className='white-space-nowrap overflow-hidden text-overflow-ellipsis'>
          {rowData.roles?.map((roleItem, i) => (
            <Badge className='m-1' key={i} value={roleItem.roleName} />
          ))}
        </div>
      </div>
    )
  }

  const updateDateToDateText = (rowData: IGetMember) => {
    var datestring = format(rowData.updatedDate, 'yyyy-MM-dd HH:mm')
    return <div>{datestring}</div>
  }
  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'mid',
        header: 'Assigned ID',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'email',
        header: 'Email',
        style: { minWidth: '200px' },
        sortable: true,
      },
      {
        header: 'Assigned Role',
        style: { minWidth: '200px' },
        body: roleTemplate,
      },
      {
        field: 'updatedDate',
        header: 'Last Update',
        style: { minWidth: '200px' },
        body: updateDateToDateText,
        sortable: true,
      },
      {
        field: 'updatedByName',
        header: 'Updated By',
        style: { minWidth: '200px' },
        sortable: true,
      },
      {
        header: 'Status',
        style: { minWidth: '200px' },
        body: memberTemplate,
      },
      {
        id: 'actions',
        accessorKey: 'id',
        header: translate('table.actions'),
        style: { minWidth: '100px' },
        frozen: true,
        alignFrozen: 'right',
        body: (data: IMember) => {
          if (checkAccess(PCODE.INVITEANDEDITMEMBER)) {
            return <ListAction types={['edit']} id={data.mid} />
          }
        },
      },
    ],
    [checkAccess, translate]
  )

  const statusData: SelectItem[] = [
    { value: 1, label: 'Pending' },
    { value: 2, label: 'Granted' },
    { value: 0, label: 'Suspended' },
  ]

  useEffect(() => {
    getData()
  }, [debouncedFilterRole, tableState])

  useEffect(() => {
    setMenuAction(menuActionTemplate)
  }, [checkAccess])

  useEffect(() => {
    roleService.getRoles().then((res) => {
      setRole(res.data.data)
    })
  }, [])

  const menuActionTemplate = (
    <div>
      {checkAccess(PCODE.INVITEANDEDITMEMBER) && (
        <Button
          className='bg-primary-blue'
          label='Invite a Member'
          onClick={() => router.push('member/create')}
        />
      )}
    </div>
  )

  return (
    <div className='card'>
      <div>
        <div className='flex justify-content-between'>
          <MemberFilter
            onFilter={setFilterMember}
            status={statusData}
            role={role}
          />
        </div>
        <div>
          <Table
            columns={columns}
            data={data}
            totalRecords={totalRecords}
            loading={isLoading}
            onTableStateChange={setTableState}
          />
        </div>
      </div>
    </div>
  )
}
Member.activePrime = true
export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/roles/member',
    accessPage: PCODE.VIEWMEMBERMANAGEMENTLIST,
  }
)
