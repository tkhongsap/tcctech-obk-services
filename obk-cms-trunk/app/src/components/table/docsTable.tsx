import { useGetLocale, useTranslate } from '@refinedev/core'
import React, { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import ListAction from '@components/list/action'
import VersionList from '@components/common/version-listing'
import { IFaqDocumentLog } from '@src/types/document'
import { CategoryBadge } from '@components/statusBadge'
import { CATEGORY_STATUS } from '@src/data/constants/status'
import { TableProps } from '@src/types/table'

interface IDocsTable extends TableProps {
  currentData?: IFaqDocumentLog[]
  prevData?: IFaqDocumentLog[]
  searchable?: boolean
  createable?: boolean
  onFilter?: (value: any) => void
  isSearchFilter?: boolean
  customFilter?: {
    field: string
    options: { label: string; value: string }[]
    placeholder: string
  }[]
  btnLabel?: string
  type?: 'legal' | 'faq'
  access?: string[]
}

const DocsTable = ({
  currentData,
  prevData,
  tableTools,
  isLoading,
  searchable = true,
  createable = true,
  onFilter,
  isSearchFilter,
  customFilter,
  btnLabel,
  type = 'legal',
  access,
}: IDocsTable) => {
  const translate = useTranslate()
  const locale = useGetLocale()
  const currentLocale = locale()
  const isCurrentData = currentData && currentData?.length > 0
  const isPrevData = prevData && prevData?.length > 0

  const currentFAQVersionCols = useMemo<ColumnDef<IFaqDocumentLog>[]>(
    () => [
      {
        id: 'id',
        accessorKey: isCurrentData && 'id',
        header: translate('faqs.fields.id'),
        className: 'tw-max-w-[150px]  tw-min-w-[150px] tw-truncate',
      },
      {
        id: 'category',
        accessorKey: isCurrentData && `title.${currentLocale}`,
        header: translate('faqs.fields.category'),
        cell: function render({ getValue }: any) {
          return (
            <span className='tw-font-bold tw-text-[#2B3674]'>{getValue()}</span>
          )
        },
      },
      {
        id: 'version',
        accessorKey: isCurrentData && 'version',
        header: function render() {
          return (
            <div className='tw-flex tw-justify-center tw-w-full'>
              {translate('faqs.fields.version')}
            </div>
          )
        },
        cell: function render({ getValue }: any) {
          return (
            <div className='tw-font-bold tw-flex tw-justify-center tw-w-full tw-text-[#2B3674]'>
              {getValue()}
            </div>
          )
        },
      },
      {
        id: 'question',
        accessorKey: isCurrentData && 'numberOfDocuments',
        header: function render() {
          return (
            <div className='tw-flex tw-justify-center tw-w-full'>
              {translate('faqs.fields.question')}
            </div>
          )
        },
        cell: function render({ getValue }: any) {
          return (
            <div className='tw-font-bold tw-flex tw-justify-center tw-w-full tw-text-[#2B3674]'>
              {getValue()}
            </div>
          )
        },
      },
      {
        id: 'updatedAt',
        accessorKey: isCurrentData && 'updatedAt',
        header: translate('legals.fields.updatedAt'),
        cell: function render({ getValue }) {
          return dayjs(getValue() as string)
            .format('YYYY-MM-DD HH:mm')
            .toString()
        },
      },
      {
        id: 'updatedByName',
        accessorKey: isCurrentData && 'updatedByName',
        header: translate('legals.fields.updatedBy'),
      },
      {
        id: 'active',
        accessorKey: isCurrentData && 'active',
        header: function render() {
          return (
            <div className='tw-flex tw-justify-center tw-w-full'>
              {translate('faqs.fields.status')}
            </div>
          )
        },
        cell: function render({ getValue }) {
          return (
            <div className='tw-flex tw-justify-center'>
              <CategoryBadge
                status={
                  getValue() ? CATEGORY_STATUS.ACTIVE : CATEGORY_STATUS.INACTIVE
                }
              />
            </div>
          )
        },
      },
      {
        id: 'actions',
        header: translate('table.actions'),
        accessorKey: isCurrentData && 'id',
        cell: function render({ getValue }) {
          const categoryId = getValue()
          return <ListAction types={['edit']} id={categoryId} />
        },
        className: 'tw-col-sticky-end',
      },
    ],
    [translate, isCurrentData]
  )

  const olderFAQVersionCols = useMemo<ColumnDef<IFaqDocumentLog>[]>(
    () => [
      {
        id: 'id',
        accessorKey: isPrevData && 'id',
        header: translate('faqs.fields.id'),
        className: 'tw-max-w-[150px] tw-min-w-[150px] tw-truncate',
        sortable: true,
      },
      {
        id: 'category',
        accessorKey: isPrevData && `title.${currentLocale}`,
        header: translate('faqs.fields.category'),
        cell: function render({ getValue }: any) {
          return (
            <span className='tw-font-bold tw-text-[#2B3674]'>{getValue()}</span>
          )
        },
      },
      {
        id: 'version',
        accessorKey: isPrevData && 'version',
        sortable: true,
        header: function render() {
          return (
            <div className='tw-flex tw-justify-center tw-w-full'>
              {translate('faqs.fields.version')}
            </div>
          )
        },
        cell: function render({ getValue }: any) {
          return (
            <div className='tw-font-bold tw-flex tw-justify-center tw-w-full tw-text-[#2B3674]'>
              {getValue()}
            </div>
          )
        },
      },
      {
        id: 'question',
        accessorKey: isPrevData && 'documents',
        sortable: true,
        header: function render() {
          return (
            <div className='tw-flex tw-justify-center tw-w-full'>
              {translate('faqs.fields.question')}
            </div>
          )
        },
        cell: function render({ getValue }: any) {
          return (
            <div className='tw-font-bold tw-flex tw-justify-center tw-w-full tw-text-[#2B3674]'>
              {getValue().length}
            </div>
          )
        },
      },
      {
        id: 'updatedAt',
        accessorKey: isPrevData && 'updatedAt',
        header: translate('legals.fields.updatedAt'),
        sortable: true,
        cell: function render({ getValue }) {
          return dayjs(getValue() as string)
            .format('YYYY-MM-DD HH:mm')
            .toString()
        },
      },
      {
        id: 'updatedByName',
        accessorKey: isPrevData && 'updatedByName',
        header: translate('legals.fields.updatedBy'),
        sortable: true,
      },
      {
        id: 'actions',
        accessorKey: isPrevData && 'id',
        header: translate('table.actions'),
        cell: function render({ getValue }) {
          return <ListAction types={['show']} id={getValue()} />
        },
        className: 'tw-col-sticky-end',
      },
    ],
    [translate, isPrevData]
  )

  const currentVersionCols = useMemo<ColumnDef<IFaqDocumentLog>[]>(
    () => [
      {
        id: 'id',
        accessorKey: isCurrentData && 'id',
        header: translate('faqs.fields.id'),
        className: 'tw-max-w-[150px]  tw-min-w-[150px] tw-truncate',
      },
      {
        id: 'category',
        accessorKey: isCurrentData && `title.${currentLocale}`,
        header: translate('faqs.fields.category'),
        cell: function render({ getValue }: any) {
          return (
            <span className='tw-font-bold tw-text-[#2B3674]'>{getValue()}</span>
          )
        },
      },
      {
        id: 'version',
        accessorKey: isCurrentData && 'version',
        header: function render() {
          return (
            <div className='tw-flex tw-justify-center tw-w-full'>
              {translate('faqs.fields.version')}
            </div>
          )
        },
        cell: function render({ getValue }: any) {
          return (
            <div className='tw-font-bold tw-flex tw-justify-center tw-w-full tw-text-[#2B3674]'>
              {getValue()}
            </div>
          )
        },
      },
      {
        id: 'updatedAt',
        accessorKey: isCurrentData && 'updatedAt',
        header: translate('legals.fields.updatedAt'),
        cell: function render({ getValue }) {
          return dayjs(getValue() as string)
            .format('YYYY-MM-DD HH:mm')
            .toString()
        },
      },
      {
        id: 'updatedByName',
        accessorKey: isCurrentData && 'updatedByName',
        header: translate('legals.fields.updatedBy'),
      },
      {
        id: 'actions',
        header: translate('table.actions'),
        accessorKey: isCurrentData && 'id',
        cell: function render({ getValue }) {
          const categoryId = getValue()
          return <ListAction types={['edit']} id={categoryId} />
        },
        className: 'tw-col-sticky-end',
      },
    ],
    [translate, isCurrentData]
  )

  const olderVersionCols = useMemo<ColumnDef<IFaqDocumentLog>[]>(
    () => [
      {
        id: 'id',
        accessorKey: isPrevData && 'id',
        header: translate('faqs.fields.id'),
        className: 'tw-max-w-[150px] tw-min-w-[150px] tw-truncate',
        sortable: true,
      },
      {
        id: 'category',
        accessorKey: isPrevData && `title.${currentLocale}`,
        header: translate('faqs.fields.category'),
        cell: function render({ getValue }: any) {
          return (
            <span className='tw-font-bold tw-text-[#2B3674]'>{getValue()}</span>
          )
        },
      },
      {
        id: 'version',
        accessorKey: isPrevData && 'version',
        sortable: true,
        header: function render() {
          return (
            <div className='tw-flex tw-justify-center tw-w-full'>
              {translate('faqs.fields.version')}
            </div>
          )
        },
        cell: function render({ getValue }: any) {
          return (
            <div className='tw-font-bold tw-flex tw-justify-center tw-w-full tw-text-[#2B3674]'>
              {getValue()}
            </div>
          )
        },
      },
      {
        id: 'updatedAt',
        accessorKey: isPrevData && 'updatedAt',
        header: translate('legals.fields.updatedAt'),
        sortable: true,
        cell: function render({ getValue }) {
          return dayjs(getValue() as string)
            .format('YYYY-MM-DD HH:mm')
            .toString()
        },
      },
      {
        id: 'updatedByName',
        accessorKey: isPrevData && 'updatedByName',
        header: translate('legals.fields.updatedBy'),
        sortable: true,
      },
      {
        id: 'actions',
        accessorKey: isPrevData && 'id',
        header: translate('table.actions'),
        cell: function render({ getValue }) {
          return <ListAction types={['show']} id={getValue()} />
        },
        className: 'tw-col-sticky-end',
      },
    ],
    [translate, isPrevData]
  )

  const currentVersionList = {
    columns: type === 'legal' ? currentVersionCols : currentFAQVersionCols,
    data: isCurrentData && currentData,
  }

  const olderVersionList = {
    columns: type === 'legal' ? olderVersionCols : olderFAQVersionCols,
    data: prevData,
  }

  return (
    <VersionList
      currentVersionList={currentVersionList}
      olderVersionList={olderVersionList}
      tableTools={tableTools}
      isLoading={isLoading}
      searchable={searchable}
      createable={createable}
      onFilter={onFilter}
      isSearchFilter={isSearchFilter}
      customFilter={customFilter}
      btnLabel={btnLabel}
      access={access}
    />
  )
}

export default DocsTable
