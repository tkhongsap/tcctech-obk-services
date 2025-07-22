import { useCallback, useEffect, useMemo } from 'react'
import { useTranslate } from '@refinedev/core'
import { useState } from 'react'
import withGenericServer from '@hocs/server/generic'
import { ColumnProps } from 'primereact/column'
import { Table } from '@components/table/Table'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { PCODE } from '@src/data/constants/privilege'
import { DataTableStateEvent } from 'primereact/datatable'
import { useDebounce } from 'primereact/hooks'
import React from 'react'
import { Button } from 'primereact/button'
import { staffTableregisterService } from '@src/services/usagemonitoring/staff-table/service'
import {
  IStaffRolesList,
  IUpsertStaffTableRegister,
  IFilterStaffTableRegister,
} from '@src/services/usagemonitoring/staff-table/model'
import { StaffTableRegisterFilter } from '@components/opsapp-register/staff-table/staff-table-filter'
import * as XLSX from 'xlsx'
import router from 'next/router'
import { InputSwitch } from 'primereact/inputswitch'
import { toast } from 'react-toastify'
import { Dialog } from 'primereact/dialog'
import { defaultToastMessage } from '@src/utils/default-toast'

type Props = { roles: IStaffRolesList[] }

export default function StaffTableRegister(props: Props) {
  const translate = useTranslate()
  const [isLoading, setIsLoading] = useState(false)
  const { setMenuAction } = useLayoutContext()
  const { setMenuName } = useLayoutContext()
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const [data, setData] = useState<any[]>([])
  const [dialogData, setDialogData] = useState<IUpsertStaffTableRegister[]>([])
  const [dialogVisible, setDialogVisible] = useState(false)
  const [errData, setErrData] = useState<any>([])
  const [showImportResult, setShowImportResult] = useState(false)

  const [filter, debouncedFilter, setFilter] =
    useDebounce<IFilterStaffTableRegister>({}, 400)
  const [tableState, setTableState] = useState<DataTableStateEvent>({
    filters: {},
    first: 0,
    multiSortMeta: [],
    rows: 10,
    sortField: 'updatedDate',
    sortOrder: -1,
  })
  const {} = props

  setMenuName('Staff List Table')

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'staffName',
        header: 'Staff Name',
        style: { minWidth: '100px' },
      },
      {
        field: 'email',
        header: 'Email',
        style: { minWidth: '100px' },
      },
      {
        field: 'component',
        header: 'Component',
        style: { minWidth: '100px' },
      },
      {
        field: 'position',
        header: 'Position',
        style: { minWidth: '100px' },
      },
      {
        field: 'company',
        header: 'Company',
        style: { minWidth: '100px' },
      },
      {
        field: 'createdByName',
        header: 'Created by',
        style: { minWidth: '100px' },
      },
      {
        field: 'updatedByName',
        header: 'Updated by',
        style: { minWidth: '100px' },
      },
      {
        field: 'mustUseOpsApp',
        header: 'Must Use OpsApp',
        style: { minWidth: '100px' },
        body: (data: any) => {
          return (
            <InputSwitch
              id='mustUseOpsApp'
              name='mustUseOpsApp'
              checked={data.mustUseOpsApp ?? false}
              onChange={() => {
                handleChangeMustUseOpsApp(data)
              }}
            />
          )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translate]
  )

  const handleChangeMustUseOpsApp = (value: any) => {
    let sendData: { data: IUpsertStaffTableRegister[] } = { data: [] }

    sendData.data = [
      {
        email: value!.email,
        mustUseOpsApp: !value!.mustUseOpsApp,
        isActive: value.isActive,
        staffName: value.staffName,
        component: value.component,
        company: value.company,
        position: value.position,
      },
    ]
    const promise = staffTableregisterService.createUser(sendData).then(() => {
      toast.promise(promise, defaultToastMessage)
      getData()
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsLoading(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = e.target?.result
        if (data) {
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const sheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(sheet)
          const transformedData: IUpsertStaffTableRegister[] = jsonData.map(
            (row: any) => {
              return {
                staffName: row['Staff Name*'],
                email: row['Email*'],
                component: row['Component*']?.split('|')[0].trim(),
                position: row['Position'],
                location: row[''],
                company: row['Company'],
                mustUseOpsApp: row['MustUseOpsApp*'],
              }
            }
          )
          setDialogData(transformedData)
          setDialogVisible(true)
        }
        setIsLoading(false)
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const onConfirmImport = () => {
    setIsLoading(true)
    const sendData = { data: dialogData }

    staffTableregisterService
      .createUser(sendData)
      .then((e) => {
        setErrData(e.data)
        setDialogVisible(false)
        setShowImportResult(true)
      })
      .catch(() => {
        toast.error('Import failed')
        setIsLoading(false)
      })
  }

  const closeImportResultDialog = () => {
    setShowImportResult(false)
    setErrData(null)
    getData()
    router.push({
      pathname: '/usagemonitoring/staff',
    })
  }

  const onImport = () => {
    const inputElement = document.createElement('input')
    inputElement.type = 'file'
    inputElement.accept = '.xlsx,.xls'
    inputElement.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const isExcelFile =
          file.name.endsWith('.xlsx') || file.name.endsWith('.xls')

        if (!isExcelFile) {
          toast.error('Please upload an Excel file (.xlsx or .xls).')
          return
        }
        handleFileUpload(e as unknown as React.ChangeEvent<HTMLInputElement>)
      }
    }

    inputElement.click()
  }

  const onExport = async () => {
    await staffTableregisterService.export()
  }

  const onFilter = (item: IFilterStaffTableRegister) => {
    setFilter(item)
  }

  const onCreateUser = () => {
    router.push({
      pathname: '/usagemonitoring/staff/create',
    })
  }

  const getData = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await staffTableregisterService.getAll(filter, tableState)
      setData(res.data)
      setTotalRecords(res.paginate.total)
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }, [debouncedFilter, tableState])

  useEffect(() => {
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilter, tableState])

  const onExportStaff = async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      await staffTableregisterService.exportStaff()
      toast.success('Export success')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(
    () => {
      const menuAction = (
        <div className='flex gap-3'>
          <Button
            outlined
            className='text-primary-blue'
            label='Export Excel Template'
            onClick={onExport}
            disabled={isLoading}
          />
          <Button
            outlined
            className='bg-primary-gray text-white'
            label='Export Excel Staff'
            onClick={onExportStaff}
            disabled={isLoading}
          />
          <Button
            className='bg-primary-green'
            label='Import Excel'
            onClick={onImport}
          />

          <Button
            className='bg-primary-blue'
            label='Create User'
            onClick={onCreateUser}
          />
        </div>
      )
      setMenuAction(menuAction)
      setIsLoading(false)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setMenuAction]
  )

  return (
    <>
      <div className='card'>
        <div>
          <div className='mb-4'>
            <StaffTableRegisterFilter roles={data} onFilter={onFilter} />
          </div>
          <div>
            <Table
              columns={columns}
              data={data}
              totalRecords={totalRecords}
              loading={isLoading}
              rows={10}
              sortField='seq'
              sortOrder={-1}
              onTableStateChange={setTableState}
            />
          </div>
          <Dialog
            header='Confirm the following data to import'
            visible={dialogVisible}
            onHide={() => setDialogVisible(false)}
            footer={
              <div>
                <Button
                  label='Confirm'
                  onClick={onConfirmImport}
                  autoFocus
                  style={{
                    width: '100%',
                    marginTop: '15px',
                    marginBottom: '-10px',
                  }}
                />
              </div>
            }
          >
            <div>
              <ul>
                {dialogData.map((item, index) => (
                  <li key={index}>
                    <strong>Staff Name:</strong> {item.staffName} <br />
                    <strong>Email:</strong> {item.email} <br />
                    <strong>Component:</strong> {item.component} <br />
                    <strong>Position:</strong> {item.position} <br />
                    <strong>Company:</strong> {item.company} <br />
                    <strong>mustUseOpsApp:</strong>{' '}
                    {item.mustUseOpsApp != null
                      ? item.mustUseOpsApp
                        ? 'Yes'
                        : 'No'
                      : ''}
                    <hr />
                  </li>
                ))}
              </ul>
            </div>
          </Dialog>

          {showImportResult && (
            <Dialog
              style={{ width: 500 }}
              header='Import Result'
              visible={showImportResult}
              onHide={closeImportResultDialog}
            >
              <div className='data-container'>
                <div className='data-item' style={{ color: 'blue' }}>
                  <strong>Update Data:</strong> {errData?.data?.updateData}
                </div>

                <div className='data-item' style={{ color: 'green' }}>
                  <strong>Create Data:</strong> {errData?.data?.createData}
                </div>

                <div className='data-item' style={{ color: 'red' }}>
                  <strong>Errors: ({errData?.data?.errors?.length})</strong>
                  <ul>
                    {errData?.data?.errors?.map((item: any, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Dialog>
          )}
        </div>
      </div>
    </>
  )
}

StaffTableRegister.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const roleRes = await staffTableregisterService.getStaffRolesList()
    const roles = roleRes

    ctx.props = { ...ctx.props, roles }
    return ctx
  },
  {},
  {
    redirectPath: '/usagemonitoring/staff',
    accessPage: PCODE.USAGEMONITORINGSTAFF,
  }
)
