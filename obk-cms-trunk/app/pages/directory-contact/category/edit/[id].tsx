/* eslint-disable */
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useNavigation, useTranslate } from '@refinedev/core'
import { useState } from 'react'
import withGenericServer from '@hocs/server/generic'
import { Column, ColumnProps } from 'primereact/column'
import { TableAction } from '@components/display/table-action'
import { Table } from '@components/table/Table'
import { IIssueType } from '@src/services/buildingservice/issuetype/model'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { Button } from 'primereact/button'
import router from 'next/router'
import * as OBBMSSDK from 'ob-bms-sdk'
import { PCODE } from '@src/data/constants/privilege'
import { directoryContactService } from '@src/services/directory-contact/service'
import { toast } from 'react-toastify'
import {
  IFilterDirectoryContact,
  IGetDirectoryContact,
  IGetDirectoryContactCategory,
  IUpsertDirectoryContact,
  UpsertDirectoryContact,
  UpsertDirectoryContactCategory,
} from '@src/services/directory-contact/model'
import { defaultToastMessage } from '@src/utils/default-toast'

import { DirectoryContactFilter } from '@components/directory-contact/directory-contact-filter'
import { DataTable, DataTableStateEvent } from 'primereact/datatable'
import { useDebounce } from 'primereact/hooks'
import { KeyValue } from '@src/types/key-value'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import TextField from '@components/forms/components/text-field'
import { v4 as uuidv4 } from 'uuid'
import { Dialog } from 'primereact/dialog'
import _ from 'lodash'
import { log } from 'console'
import React from 'react'
import 'primeicons/primeicons.css'

type Props = { resdata: IGetDirectoryContactCategory }

export default function DirectoryContact(props: Props) {
  const translate = useTranslate()
  const { resdata } = props
  const [isLoading, setIsLoading] = useState(false)
  const { setMenuName } = useLayoutContext() //Title Name (temporary)
  const [visiblePublishDialog, setVisiblePublishDialog] = useState(false)
  const [visibleDeleteDialog, setVisibleDeleteDialog] = useState(false)
  const [data, setData] = useState<IGetDirectoryContact[]>([])
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const formRef = useRef<FormControllerRef<any>>(null)
  const [tableState, setTableState] = useState<DataTableStateEvent>()

  const formData = new UpsertDirectoryContactCategory(resdata)

  setMenuName('Directory Contact') //Title Name (temporary)

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'nameEn',
        header: 'Title',
        style: { minWidth: '100px' },
      },
      {
        field: 'nameTh',
        header: 'Thai',
        style: { minWidth: '100px' },
      },
      {
        field: 'nameZh',
        header: 'Simplify Chinese',
        style: { minWidth: '100px' },
      },
      {
        field: 'phonenumber',
        header: 'Phone Number',
        style: { minWidth: '100px' },
      },
      {
        field: 'updatedAt',
        header: 'Last update',
        style: { minWidth: '100px' },
      },
      {
        field: 'updatedBy',
        header: 'Update By',
        style: { minWidth: '100px' },
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
              <a
                className='p-button p-component p-button-text font-bold cursor-pointer'
                onClick={() =>
                  router.push('/directory-contact/edit/' + data.id)
                }
              >
                Edit
              </a>
            </>
          )
        },
      },
    ],
    [translate]
  )

  useEffect(() => {
    setIsLoading(true)
    directoryContactService
      .getAll({ categoryId: resdata.categoryId })
      .then((res) => {
        setData(res.data)
        setTotalRecords(res.totalRecord)
      })
      .finally(() => setIsLoading(false))
  }, [tableState])

  const dynamicColumns = columns.map((col, i) => {
    return (
      <Column
        key={col.field}
        columnKey={col.field}
        field={col.field}
        header={col.header}
      />
    )
  })

  const OnCancel = () => {
    router.push({
      pathname: '/directory-contact',
    })
  }

  const onConfirmPublish = async () => {
    const isValid = await formRef.current?.trigger()
    if (isValid) {
      setVisiblePublishDialog(true)
    }
  }

  const onPublish = async () => {
    setVisiblePublishDialog(false)
    const value = formRef.current?.getValues()
    const categoryName = value.category

    let sendData: IUpsertDirectoryContact = {
      categoryId: value.categoryId,
      categoryName: categoryName,
      contactList: data,
    }

    const promise = directoryContactService.createNumber(sendData).then(() => {
      router.push({
        pathname: '/directory-contact',
      })
    })
    toast.promise(promise, defaultToastMessage)
  }

  const onDeleteCategory = () => {
    const promise = directoryContactService
      .deleteCategory(resdata.categoryId)
      .then(() => {
        router.push({
          pathname: '/directory-contact',
        })
      })
    toast.promise(promise, defaultToastMessage)
  }

  const buttonAction = (
    <div className='flex flex-column xl:flex-row justify-content-between align-items-end'>
      <div className='flex gap-3'>
        <Button
          type='submit'
          className='px-5 bg-primary-blue'
          label='Publish'
          onClick={onConfirmPublish}
        />
        <Button
          type='button'
          className='px-5'
          label='Delete this category'
          severity='danger'
          onClick={() => setVisibleDeleteDialog(true)}
        />
        <Button
          className='px-5 text-primary-blue'
          type='button'
          label='Cancel'
          severity='secondary'
          text
          onClick={OnCancel}
        />
      </div>
    </div>
  )

  return (
    <>
      <FormController ref={formRef} defualtValue={formData} onSubmit={() => {}}>
        <div className='card'>
          <div>
            <div className='mb-4 flex'>
              <div className='flex flex-wrap gap-3 w-full justify-content-between mb-4'>
                <div className='flex w-full md:w-14rem'>
                  <TextField
                    label='Category name'
                    name='category'
                    rules={{ required: 'Category name is required.' }}
                  />
                </div>
                {buttonAction}
              </div>
            </div>
            <div>
              <DataTable
                value={data}
                reorderableRows
                onRowReorder={(e) => setData(e.value)}
                tableStyle={{ minWidth: '50rem' }}
                first={tableState?.first ?? 0}
                loading={isLoading}
              >
                <Column rowReorder style={{ width: '3rem' }} />
                {columns.map((col) => (
                  <Column key={col.field} {...col} body={col.body} />
                ))}
              </DataTable>
            </div>
          </div>
        </div>
        {buttonAction}
      </FormController>

      <Dialog
        draggable={false}
        blockScroll={true}
        visible={visiblePublishDialog}
        style={{ minWidth: '30vw' }}
        onHide={() => {
          setVisiblePublishDialog(false)
        }}
        modal
        content={({ hide }) => (
          <div className='flex flex-column bg-white p-5 border-round-lg'>
            <span className='font-bold'>
              Are you sure you want to publish the changes?
            </span>
            <div className='flex gap-3 mt-5'>
              <Button
                className='bg-primary-blue'
                label='Confirm'
                onClick={onPublish}
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
      ></Dialog>
      <Dialog
        draggable={false}
        blockScroll={true}
        visible={visibleDeleteDialog}
        style={{ minWidth: '30vw' }}
        onHide={() => {
          setVisibleDeleteDialog(false)
        }}
        modal
        content={({ hide }) => (
          <div className='flex flex-column bg-white p-5 border-round-lg'>
            <i
              className='pi pi-times-circle'
              style={{ color: 'red', fontSize: '4rem' }}
            />
            <br />
            <span className='tw-text-2xl tw-text-[#1B2559] tw-font-bold'>
              Are you sure you want to delete this item?
            </span>
            <span className='font-bold mt-4'>
              Warning: If you delete this category, all contacts within it will
              be moved to "Inactive." <br /> This means they will no longer be
              displayed in the app, but will still be visible on the CMS.
            </span>
            <span className='font-bold mt-3'>Please proceed with caution.</span>
            <div className='flex justify-center gap-3 mt-5'>
              <Button
                className='px-5'
                label='Delete'
                severity='danger'
                onClick={onDeleteCategory}
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
      ></Dialog>
    </>
  )
}

DirectoryContact.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const { id } = ctx.props.query
    const data = await directoryContactService.getDataCategory(id)
    const resdata = data.data
    console.log(resdata)
    ctx.props = { ...ctx.props, resdata }
    return ctx
  },
  {},
  {
    redirectPath: '/directory-contact',
    accessPage: PCODE.VIEWDIRECTORYCONTACT,
  }
)
