/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo } from 'react'
import { useState } from 'react'
import withGenericServer from '@hocs/server/generic'
import { roleService } from 'src/services/role/service'
import { ColumnProps } from 'primereact/column'
import { Tag } from 'primereact/tag'
import ListAction from '@components/listworkrq/action'
import { RoleFilter } from '@components/role/role/role-filter'
import { Table } from '@components/table/Table'
import { useTranslate } from '@refinedev/core'
import { Button } from 'primereact/button'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { useRouter } from 'next/router'
import { IPrivilege, IRole, IRoleFilterModel } from '@src/services/role/model'
import { Badge } from 'primereact/badge'
import { DataTableStateEvent } from 'primereact/datatable'
import { useDebounce } from 'primereact/hooks'
import { PCODE } from '@src/data/constants/privilege'
import { usePermission } from '@src/hooks/permissionProvider'

export default function Role() {
  const router = useRouter()
  const translate = useTranslate()
  const { setMenuAction } = useLayoutContext()
  const [filterRole, debouncedFilterRole, setFilterRole] =
    useDebounce<IRoleFilterModel>({}, 400)
  const [tableState, setTableState] = useState<DataTableStateEvent>()
  const [data, setData] = useState<IRole[]>([])
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [privileges, setPrivileges] = useState<IPrivilege[]>([])
  const { checkAccess } = usePermission()

  const getData = useCallback(async () => {
    setIsLoading(true)
    roleService.getAll(filterRole, tableState).then((res) => {
      setData(res.data.data)
      setTotalRecords(res.data.totalRecords)
      setIsLoading(false)
    })
  }, [debouncedFilterRole, tableState])

  useEffect(() => {
    roleService.getPrivilege().then((res) => setPrivileges(res.data))
    setMenuAction(menuActionTemplate)
  }, [])

  useEffect(() => {
    getData()
  }, [debouncedFilterRole, tableState])

  const menuActionTemplate = (
    <div>
      {checkAccess(PCODE.CREATEANDEDITNEWROLE) && (
        <Button
          label='Create new role'
          className='bg-primary-blue'
          onClick={() => router.push('role/create')}
        />
      )}
    </div>
  )

  const statusTemplete = ({ isActive }: IRole) => {
    return (
      <Tag severity={isActive == 1 ? 'success' : 'danger'}>
        <div
          style={{
            fontSize: '12px',
          }}
        >
          {isActive ? 'Active' : 'Inactive'}
        </div>
      </Tag>
    )
  }

  const privilegesTemplate = (rowData: IRole) => {
    return (
      <div className='overflow-hidden'>
        <div className='white-space-nowrap overflow-hidden text-overflow-ellipsis'>
          {rowData.privilegeItems?.map((privilegeItem, i) => (
            <Badge
              className='m-1'
              key={i}
              value={privilegeItem.name}
              severity={'info'}
            />
          ))}
        </div>
      </div>
    )
  }

  const actionTemplete = (rowData: { rid: string | number }) => {
    if (checkAccess(PCODE.CREATEANDEDITNEWROLE)) {
      return <ListAction types={['edit']} id={rowData.rid} />
    }
  }

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'rid',
        style: { minWidth: '300px' },
        header: 'ID',
        sortable: true,
      },
      {
        field: 'name',
        style: { minWidth: '100px' },
        header: translate('Role'),
        sortable: true,
      },
      {
        field: 'privileges',
        style: { maxWidth: '500px', minWidth: '300px' },
        header: 'Privileges',
        body: privilegesTemplate,
      },
      {
        field: 'updatedDate',
        style: { minWidth: '200px' },
        header: 'Last Updated',
        sortable: true,
      },
      {
        field: 'updatedByName',
        style: { minWidth: '200px' },
        header: 'Updated by',
        sortable: true,
      },
      {
        field: 'isActive',
        style: { minWidth: '200px' },
        header: 'Status',
        body: statusTemplete,
        sortable: true,
      },
      {
        id: 'rid',
        header: 'Action',
        body: actionTemplete,
        frozen: true,
        alignFrozen: 'right',
      },
    ],
    [checkAccess, translate]
  )

  return (
    <div className='card'>
      <div>
        <div className='flex justify-content-between'>
          <RoleFilter privileges={privileges} onFilter={setFilterRole} />
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

Role.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/roles/role',
    accessPage: PCODE.VIEWROLEMANAGEMENTLIST,
  }
)
