import { useCallback, useEffect, useMemo } from 'react'
import { Dialog } from 'primereact/dialog'
import { useTranslate } from '@refinedev/core'
import { useState } from 'react'
import withGenericServer from '@hocs/server/generic'
import { ColumnProps } from 'primereact/column'
import { Table } from '@components/table/Table'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import router from 'next/router'
import { PCODE } from '@src/data/constants/privilege'
import { DataTableStateEvent } from 'primereact/datatable'
import { useDebounce } from 'primereact/hooks'
import React from 'react'
import { Button } from 'primereact/button'
import { opsappregisterService } from '@src/services/opsapp-register/service'
import {
  IFilterOpsAppRegister,
  IGetOpsAppRegister,
  IOpsAppRoleList,
  isActive,
  UnlockUser,
} from '@src/services/opsapp-register/model'
import { OpsAppRegisterFilter } from '@components/opsapp-register/opsapp-register-filter'
import { InputSwitch } from 'primereact/inputswitch'
import { toast } from 'react-toastify'

type Props = { roles: IOpsAppRoleList[] }

export default function OpsAppRegister(props: Props) {
  const translate = useTranslate()
  const [isLoading, setIsLoading] = useState(false)
  const { setMenuAction } = useLayoutContext()
  const { setMenuName } = useLayoutContext()
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const [data, setData] = useState<IGetOpsAppRegister[]>([])
  const [filter, debouncedFilter, setFilter] =
    useDebounce<IFilterOpsAppRegister>({}, 400)
  const [tableState, setTableState] = useState<DataTableStateEvent>({
    filters: {},
    first: 0,
    multiSortMeta: [],
    rows: 10,
    sortField: 'updatedDate',
    sortOrder: -1,
  })

  const { roles } = props

  const [selectedUser, setSelectedUser] = useState<IGetOpsAppRegister | null>(
    null
  )
  const [showLockDialog, setShowLockDialog] = useState(false)
  const [showisActiveDialog, setShowisActiveDialog] = useState(false)

  const handleToggleLock = (user: IGetOpsAppRegister) => {
    setSelectedUser(user)
    setShowLockDialog(true)
  }
  const handleToggleisActive = (user: IGetOpsAppRegister) => {
    setSelectedUser(user)
    setShowisActiveDialog(true)
  }

  const confirmToggleisActive = async () => {
    if (!selectedUser) return

    const sendData: isActive = {
      mid: selectedUser.mid,
      isActive: selectedUser.isActive ? false : true,
    }

    try {
      await opsappregisterService.isActive(sendData)
      toast.success('Updated user isActive status successfully')
      setData((prev) =>
        prev.map((item) =>
          item.mid === selectedUser.mid
            ? { ...item, isActive: !item.isActive }
            : item
        )
      )
    } catch (error) {
      toast.error('Failed to update isActive status')
    } finally {
      setShowisActiveDialog(false)
      setSelectedUser(null)
    }
  }

  const confirmToggleLock = async () => {
    if (!selectedUser) return

    const sendData: UnlockUser = {
      mid: selectedUser.mid,
    }

    try {
      await opsappregisterService.unlockUser(sendData)
      toast.success('Updated user lock status successfully')
      setData((prev) =>
        prev.map((item) =>
          item.mid === selectedUser.mid
            ? { ...item, isLocked: !item.isLocked }
            : item
        )
      )
    } catch (error) {
      toast.error('Failed to update lock status')
    } finally {
      setShowLockDialog(false)
      setSelectedUser(null)
    }
  }

  setMenuName('Ops App Register')

  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString)
    date.setHours(date.getHours() + 7)
    const day = date.getDate().toString().padStart(2, '0')
    const month = date.toLocaleString('en-US', { month: 'short' })
    const year = date.getFullYear()

    let hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return `${day} ${month} ${year} ${hours}:${minutes}`
  }

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'mid',
        header: 'Member ID',
        style: { minWidth: '100px' },
        sortable: false,
      },
      {
        field: 'email',
        header: 'Email',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'name',
        header: 'Name',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'userType',
        header: 'Role',
        style: { minWidth: '100px' },
        sortable: true,
        body: (data: IGetOpsAppRegister) => {
          return data.roles.map((role) => role.roleName).join(', ')
        },
      },
      {
        field: 'isLocked',
        header: 'isLocked',
        style: { minWidth: '100px' },
        sortable: true,
        body: (data: any) => (
          <InputSwitch
            checked={data.isLocked}
            onChange={() => handleToggleLock(data)}
            disabled={!data.isLocked}
          />
        ),
      },
      {
        field: 'IsActive',
        header: 'isActive',
        style: { minWidth: '100px' },
        sortable: true,
        body: (data: any) => (
          <InputSwitch
            checked={data.isActive}
            onChange={() => handleToggleisActive(data)}
          />
        ),
      },

      {
        field: 'updatedDate',
        header: 'Update Date',
        style: { minWidth: '100px' },
        sortable: true,
        body: (data: IGetOpsAppRegister) => {
          return <span>{formatDate(data.updatedDate)}</span>
        },
      },
      {
        id: 'actions',
        accessorKey: 'id',
        header: translate('table.actions'),
        style: { maxWidth: '100px' },
        frozen: true,
        alignFrozen: 'right',
        body: (data: IGetOpsAppRegister) => {
          return (
            <>
              <a
                className='p-button p-component p-button-text font-bold cursor-pointer text-primary-blue'
                onClick={() => router.push('/opsapp-register/edit/' + data.mid)}
              >
                Edit
              </a>
            </>
          )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translate]
  )

  const onCreateUser = () => {
    router.push({
      pathname: '/opsapp-register/create',
    })
  }

  const onExport = async () => {
    await opsappregisterService.export()
  }

  const onFilter = (item: IFilterOpsAppRegister) => {
    const newFilter = { ...item }
    setFilter(newFilter)
  }

  const getData = useCallback(async () => {
    setIsLoading(true)
    await opsappregisterService
      .getAll(filter, tableState)
      .then((res) => {
        setData(res.data)
        setTotalRecords(res.totalRecords)
        if (res.totalRecords === 0) {
          setIsLoading(false)
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilter, tableState])

  useEffect(() => {
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilter, tableState])

  useEffect(() => {
    const menuAction = (
      <div className='flex gap-3'>
        <Button
          outlined
          className='text-primary-blue'
          label='Export'
          onClick={onExport}
        />
        <Button
          className='bg-primary-blue'
          label='Create new user'
          onClick={onCreateUser}
        />
      </div>
    )
    setMenuAction(menuAction)
    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuAction])

  return (
    <>
      <div className='card'>
        <div>
          <div className='mb-4'>
            <OpsAppRegisterFilter roles={roles} onFilter={onFilter} />
          </div>
          <div>
            <Table
              columns={columns}
              data={data}
              totalRecords={totalRecords}
              loading={isLoading}
              rows={10}
              sortField='updatedDate'
              sortOrder={-1}
              onTableStateChange={setTableState}
            />
          </div>
        </div>
      </div>

      <Dialog
        draggable={false}
        blockScroll={true}
        visible={showisActiveDialog}
        style={{ minWidth: '30vw' }}
        onHide={() => {
          setShowisActiveDialog(false)
        }}
        modal
        content={({ hide }) => (
          <div className='flex flex-column bg-white p-5 border-round-lg'>
            <span className='font-bold'>
              Are you sure you want to change the active user?
            </span>
            <div className='flex gap-3 mt-5'>
              <Button
                className='bg-primary-blue'
                label='Confirm'
                onClick={confirmToggleisActive}
              />
              <Button
                className='text-primary-blue'
                onClick={(e) => hide(e)}
                label='Cancel'
                outlined
              />
            </div>
          </div>
        )}
      >
        {' '}
      </Dialog>

      <Dialog
        draggable={false}
        blockScroll={true}
        visible={showLockDialog}
        style={{ minWidth: '30vw' }}
        onHide={() => {
          setShowLockDialog(false)
        }}
        modal
        content={({ hide }) => (
          <div className='flex flex-column bg-white p-5 border-round-lg'>
            <span className='font-bold'>
              Are you sure you want to change the lock user?
            </span>
            <div className='flex gap-3 mt-5'>
              <Button
                className='bg-primary-blue'
                label='Confirm'
                onClick={confirmToggleLock}
              />
              <Button
                className='text-primary-blue'
                onClick={(e) => hide(e)}
                label='Cancel'
                outlined
              />
            </div>
          </div>
        )}
      >
        {' '}
      </Dialog>
    </>
  )
}

OpsAppRegister.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const roleRes = await opsappregisterService.getOpsAppRoleList()
    const roles = roleRes

    ctx.props = { ...ctx.props, roles }
    return ctx
  },
  {},
  {
    redirectPath: '/opsapp-register',
    accessPage: PCODE.VIEWONBOARDINGREGISTER,
  }
)
