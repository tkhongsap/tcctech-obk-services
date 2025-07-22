import { useCallback, useEffect, useMemo } from 'react'
import { useTranslate } from '@refinedev/core'
import { useState } from 'react'
import withGenericServer from '@hocs/server/generic'
import { ColumnProps } from 'primereact/column'
import { TableAction } from '@components/display/table-action'
import { Table } from '@components/table/Table'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { Button } from 'primereact/button'
import router from 'next/router'
import * as OBBMSSDK from 'ob-bms-sdk'
import { PCODE } from '@src/data/constants/privilege'
import { directoryContactService } from '@src/services/directory-contact/service'
import {
  IFilterDirectoryContact,
  IGetDirectoryContact,
} from '@src/services/directory-contact/model'

import { DirectoryContactFilter } from '@components/directory-contact/directory-contact-filter'
import { DataTableStateEvent } from 'primereact/datatable'
import { useDebounce } from 'primereact/hooks'
import { KeyValue } from '@src/types/key-value'
import React from 'react'

type Props = { categories: KeyValue[] }

export default function DirectoryContact(props: Props) {
  OBBMSSDK.setBaseUrl(process.env.BMS_BASEURL || '')
  const translate = useTranslate()
  const [isLoading, setIsLoading] = useState(false)
  const { setMenuAction } = useLayoutContext()
  const { setMenuName } = useLayoutContext() //Title Name (temporary)
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const [data, setData] = useState<IGetDirectoryContact[]>([])
  const [filter, debouncedFilter, setFilter] =
    useDebounce<IFilterDirectoryContact>({}, 400)
  const [tableState, setTableState] = useState<DataTableStateEvent>({
    filters: {},
    first: 0,
    multiSortMeta: [],
    rows: 10,
    sortField: 'updatedAt',
    sortOrder: -1,
  })

  const { categories } = props

  setMenuName('Directory Contact') //Title Name (temporary)

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'nameEn',
        header: 'Title',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'nameTh',
        header: 'Thai',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'nameZh',
        header: 'Simplify Chinese',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'phonenumber',
        header: 'Phone Number',
        style: { minWidth: '100px' },
      },
      {
        field: 'category',
        header: 'Category',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'updatedAt',
        header: 'Last update',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        field: 'updatedBy',
        header: 'Update By',
        style: { minWidth: '100px' },
        sortable: true,
      },
      {
        id: 'actions',
        accessorKey: 'id',
        header: translate('table.actions'),
        style: { minWidth: '100px' },
        frozen: true,
        alignFrozen: 'right',
        body: (data: IGetDirectoryContact) => {
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

  const onCreateDirectoryContact = () => {
    router.push({
      pathname: '/directory-contact/create',
    })
  }

  const onFilter = (item: IFilterDirectoryContact) => {
    setFilter(item)
  }

  const getData = useCallback(async () => {
    console.log('getdata')
    setIsLoading(true)
    await directoryContactService
      .getAll(filter, tableState)
      .then((res) => {
        setData(res.data)
        setTotalRecords(res.totalRecord)
        if (res.totalRecord === 0) {
          setIsLoading(false)
        }
      })
      .finally(() => {
        setIsLoading(false)
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilter, tableState])

  useEffect(() => {
    console.log('useEffect')
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilter, tableState])

  useEffect(() => {
    const menuAction = (
      <div className='flex gap-3'>
        <Button
          className={`${
            categories.length <= 0 ? `bg-gray-400` : 'bg-primary-blue'
          }`}
          label='Add contact'
          onClick={onCreateDirectoryContact}
          disabled={categories.length <= 0}
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
            <DirectoryContactFilter
              categories={categories}
              onFilter={onFilter}
            />
          </div>
          <div>
            <Table
              columns={columns}
              data={data}
              totalRecords={totalRecords}
              loading={isLoading}
              rows={10}
              sortField='updatedAt'
              sortOrder={-1}
              onTableStateChange={setTableState}
            />
          </div>
        </div>
      </div>
    </>
  )
}

DirectoryContact.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const categoriesRes = await directoryContactService.getAllCategory()
    const categories = categoriesRes.data
      .map((x) => {
        return { name: x.category, value: x.categoryId } as KeyValue
      })
      .sort((a, b) => a.name.localeCompare(b.name))
    ctx.props = { ...ctx.props, categories }
    return ctx
  },
  {},
  {
    redirectPath: '/directory-contact',
    accessPage: PCODE.VIEWDIRECTORYCONTACT,
  }
)
