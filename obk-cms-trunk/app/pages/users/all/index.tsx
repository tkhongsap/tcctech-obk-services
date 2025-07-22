import { useEffect, useMemo } from 'react'

import { useTranslate } from '@refinedev/core'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import ListAction from '@components/list/action'

import withGenericServer from '@hocs/server/generic'
import { UserStatusBadge } from '@components/statusBadge'
import { USER_STATUS } from '@src/data/constants/status'
import Table from '@components/table'
import { PAGE_SIZE } from '@components/table/constants'
import useTableTools from '@src/hooks/useTableTools'
import * as OB_IAM_SDK from 'ob-iam-sdk'
import * as OB_BMS_SDK from 'ob-bms-sdk'
import { PCODE } from '@src/data/constants/privilege'

export default function User() {
  const translate = useTranslate()

  const {
    filters,
    setFilters,
    sorting,
    setSorting,
    currentPage,
    setCurrentPage,
    setPagination,
    pagination,
  } = useTableTools()

  const [userList, setUserList] = useState([]) as any
  const [tenant, setTenant] = useState([]) as any

  const normalizeData = (data: any[]) => {
    return data.map((item) => {
      let email = ''
      let phoneNumber = ''

      if (Array.isArray(item.identities)) {
        // Find the email identity with default true
        const emailIdentity = item.identities.find(
          (identity: any) => identity.provider === 'email' && identity.default
        )
        if (emailIdentity) {
          email = emailIdentity.identifier
        }

        // Find the phone identity with default true
        const phoneIdentity = item.identities.find(
          (identity: any) => identity.provider === 'phone' && identity.default
        )
        if (phoneIdentity) {
          phoneNumber = phoneIdentity.identifier
        }
      }

      const status = item.deleted_at ? 'suspend' : 'active'
      return {
        ...item,
        name: `${item?.profile?.first_name || ''} ${
          (item?.profile?.middle_name || '') + ' '
        }${item?.profile?.last_name || ''}`,
        role: 'Office worker',
        email: email,
        phoneNumber: phoneNumber,
        status: status,
      }
    })
  }

  const fetchData = async (
    search?: string,
    filters?: { filterBy: string; filterKey: string }[]
  ) => {
    const filterBy =
      filters?.map((filter) => filter.filterBy).join(',') || undefined
    const filterKey =
      filters?.map((filter) => filter.filterKey).join(',') || undefined
    const order_by = sorting[0]?.id
    const order_direction = sorting[0]?.desc ? 'desc' : 'asc'
    await OB_IAM_SDK.client
      ?.accountsIndex(
        search || '',
        order_by,
        order_direction,
        currentPage,
        PAGE_SIZE,
        filterBy,
        filterKey
      )
      .then((res) => {
        console.log('fetch user list successfully', res)
        const normalizedData = normalizeData(res?.data?.data as any[])
        setUserList(normalizedData)
        setPagination({
          ...pagination,
          totalData: res.data?.pagination?.total || 1,
          currentPage: res.data?.pagination?.page_number || 1,
          totalPage: res.data?.pagination?.total_page || 1,
        })
      })
      .catch((err) => {
        console.log('fetch user list fail', err)
      })
  }

  const fetchTenant = async () => {
    await OB_BMS_SDK.client
      .tenantsIndex()
      .then((res) => {
        console.log('Fetch tenant success!!', res.data)
        const list = (res.data.data as any[])?.map((item: any) => ({
          name: item.name,
          value: item.uid,
        }))
        setTenant([{ name: 'All', value: '' }, ...list])
      })
      .catch((err) => console.log('Fail to fetch tenant', err))
  }

  useEffect(() => {
    fetchData()
    fetchTenant()
  }, [])

  useEffect(() => {
    const search = filters.find(
      (filter: any) => filter.field === 'search'
    )?.value
    const otherFilters = filters
      .filter((filter: any) => filter.field !== 'search')
      .map((filter: any) => ({
        filterBy: filter.field,
        filterKey: filter.value,
      }))
    fetchData(search, otherFilters)
  }, [filters, currentPage, sorting])

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'id',
        header: translate('users.fields.id'),
        sortable: true,
        className: 'tw-max-w-[120px] tw-truncate',
      },
      {
        id: 'title',
        accessorKey: 'name',
        header: translate('users.fields.title'),
        sortable: true,
        cell: function render({ getValue }) {
          const value = getValue() as any
          return (
            <span className='!tw-text-[#273281] tw-font-bold'>{value}</span>
          )
        },
      },
      {
        id: 'company',
        accessorKey: 'company_name',
        header: translate('users.fields.company'),
        sortable: true,
      },
      {
        id: 'role',
        accessorKey: 'role',
        header: translate('users.fields.role'),
        sortable: true,
        className: 'tw-whitespace-nowrap',
      },
      {
        id: 'email',
        accessorKey: 'email',
        header: translate('users.fields.email'),
        sortable: true,
      },
      {
        id: 'phoneNumber',
        accessorKey: 'phoneNumber',
        header: translate('users.fields.phoneNumber'),
        sortable: true,
        cell: function render({ getValue }) {
          const phoneNumber = getValue() as string
          return (
            <div>
              <div>{phoneNumber}</div>
            </div>
          )
        },
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'status',
        cell: function render({ getValue }) {
          const value = getValue()
          return <UserStatusBadge status={value as USER_STATUS} />
        },
      },
      {
        id: 'actions',
        accessorKey: 'id',
        header: translate('table.actions'),
        cell: function render({ getValue }) {
          return <ListAction types={['show']} id={getValue()} />
        },
        className: 'tw-col-sticky-end',
      },
    ],
    [translate]
  )

  const paginationProps = {
    currentPage: currentPage,
    pageOnChange: setCurrentPage,
    totalPage: pagination.totalPage,
  }

  const onFilter = (items: any) => setFilters(items)

  return (
    <div className='tw-max-w-inherit tw-pb-[60px]'>
      <div className='tw-px-[15px] lg:tw-px-0'>
        <div className='tw-text-[#707EAE] tw-text-sm tw-font-medium'>Users</div>
        <div className='tw-text-[#2B3674] tw-text-[34px] tw-font-bold'>
          All users
        </div>
      </div>
      <Table
        columns={columns}
        data={userList}
        onFilter={onFilter}
        paginationProps={paginationProps}
        sortingProps={{ sorting, setSorting }}
        className='tw-my-5 lg:tw-my-[60px]'
        customFilter={[
          {
            field: 'role',
            options: [
              {
                name: 'Office worker',
                // using this when implement filter role backend
                // value: 'office-worker'
                value: '',
              },
            ],
            placeholder: 'Role',
          },
          {
            field: 'company',
            options: tenant,
            placeholder: 'Company',
          },
          {
            field: 'status',
            options: [
              { name: 'All', value: '' },
              { name: 'Active', value: 'active' },
              { name: 'Suspend', value: 'suspend' },
            ],
            placeholder: 'Status',
          },
        ]}
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
    redirectPath: '/users/all',
    accessPage: PCODE.VIEWUSERLISTANDDETAILS,
  }
)
