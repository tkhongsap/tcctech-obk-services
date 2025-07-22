import React, { useMemo } from 'react'
import dayjs from 'dayjs'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslate } from '@refinedev/core'

import VersionList from '@components/common/version-listing'
import ListAction from '@components/list/action'
import { IDocumentLog } from '@src/types/document'
import { TableProps } from '@src/types/table'

interface ILegalDocsTable extends TableProps {
  data?: IDocumentLog[]
}

const LegalDocsTable = ({ data, tableTools, isLoading }: ILegalDocsTable) => {
  const translate = useTranslate()
  const isData = data && data?.length > 0

  const currentVersionCols = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: 'id',
        accessorKey: isData && 'id',
        header: translate('legals.fields.id'),
      },
      {
        id: 'version',
        accessorKey: isData && 'version',
        header: translate('legals.fields.version'),
        className: 'tw-flex tw-justify-center',
      },
      {
        id: 'updatedAt',
        accessorKey: isData && 'updatedAt',
        header: translate('legals.fields.updatedAt'),
        cell: function render({ getValue }) {
          return dayjs(getValue() as string)
            .format('YYYY-MM-DD HH:mm')
            .toString()
        },
      },
      {
        id: 'updatedBy',
        accessorKey: isData && 'updatedBy',
        header: translate('legals.fields.updatedBy'),
      },
      {
        id: 'actions',
        header: translate('table.actions'),
        accessorKey: isData && 'id',
        cell: function render({ getValue }) {
          return <ListAction types={['edit']} id={getValue()} />
        },
        className: 'tw-col-sticky-end',
      },
    ],
    [translate, data]
  )

  const olderVersionCols = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: 'id',
        accessorKey: isData && 'id',
        header: translate('legals.fields.id'),
        sortable: true,
      },
      {
        id: 'version',
        accessorKey: isData && 'version',
        header: translate('legals.fields.version'),
        sortable: true,
        className: 'tw-flex tw-justify-center',
      },
      {
        id: 'updatedAt',
        accessorKey: isData && 'updatedAt',
        header: translate('legals.fields.updatedAt'),
        cell: function render({ getValue }) {
          return dayjs(getValue() as string)
            .format('YYYY-MM-DD HH:mm')
            .toString()
        },
        sortable: true,
      },
      {
        id: 'updatedBy',
        accessorKey: isData && 'updatedBy',
        header: translate('legals.fields.updatedBy'),
        sortable: true,
      },
      {
        id: 'actions',
        accessorKey: isData && 'id',
        header: translate('table.actions'),
        cell: function render({ getValue }) {
          return <ListAction types={['show']} id={getValue()} />
        },
        className: 'tw-col-sticky-end',
      },
    ],
    [translate, data]
  )

  const getEachCurentVersion = () => {
    return data?.reduce((acc: any, doc: any) => {
      const item = acc[doc.documentId]
      if (item) {
        if (item.version < doc.version) {
          acc[doc.documentId] = doc
        }
      } else {
        acc[doc.documentId] = doc
      }
      return acc
    }, {})
  }

  const currentVersionData = getEachCurentVersion()

  const normalizedCurrentVersionData = Object.keys(getEachCurentVersion()).map(
    (key) => currentVersionData[key]
  ) as any

  const currentVersionList = {
    columns: currentVersionCols,
    data: isData && normalizedCurrentVersionData,
  }

  const olderVersionList = {
    columns: olderVersionCols,
    data: data,
  }

  return (
    <VersionList
      currentVersionList={currentVersionList}
      olderVersionList={olderVersionList}
      tableTools={tableTools}
      isLoading={isLoading}
    />
  )
}

export default LegalDocsTable
