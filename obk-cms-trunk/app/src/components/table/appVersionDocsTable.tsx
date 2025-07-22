import React, { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { TableProps } from '@src/types/table'
import { IAppVersionDocumentLog } from '@src/types/document'
import { useNavigation, useResource, useTranslate } from '@refinedev/core'
import dayjs from 'dayjs'
import ListAction from '@components/list/action'
import SectionTitle from '@components/display/section-title'
import RoundedButton from '@components/button/rounded'
import HeadlessVersionListing from './headlessVersionListing'
import { PLATFORM_TYPE } from '@src/data/constants/platform'
import Table from '.'
import Skeleton from '@components/skeleton'

interface IAppVersionDocsTable extends TableProps {
  data?: IAppVersionDocumentLog[]
  pastVersionData?: IAppVersionDocumentLog[]
  previousVersionData?: IAppVersionDocumentLog[]
}

const AppVersionVersionListing = ({
  // TODO: Implement this next phase
  currentVersionList,
  olderVersionList,
  tableTools,
  isLoading,
  currentVersionTitle,
  olderVersionTitle,
  latestVersionList,
}: {
  currentVersionList: any
  olderVersionList?: any
  tableTools: any
  isLoading?: boolean
  currentVersionTitle?: string
  olderVersionTitle?: string
  latestVersionList: any
}) => {
  const resources = useResource()
  const { create } = useNavigation()
  return (
    <div>
      <div className='tw-flex tw-items-center tw-justify-between tw-w-full tw-flex-wrap tw-mb-[60px]'>
        <SectionTitle>{resources?.resource?.meta?.label}</SectionTitle>
        <div className='tw-flex tw-items-center tw-gap-[34px]'>
          <RoundedButton
            bg='primaryBlue'
            color='white'
            onClick={() => create(resources.identifier || '')}
          >
            Update app enforced version
          </RoundedButton>
        </div>
      </div>
      {isLoading ? (
        <Skeleton.ListSkeleton className='tw-mb-5 tw-bg-white tw-rounded-[10px]' />
      ) : (
        <Table
          columns={currentVersionList.columns}
          data={currentVersionList.data}
          sortingProps={{
            sorting: tableTools.sorting,
            setSorting: tableTools.setSorting,
          }}
          title='Current version'
          className='tw-mb-8'
        />
      )}
      <HeadlessVersionListing
        currentVersionList={latestVersionList}
        olderVersionList={olderVersionList}
        tableTools={tableTools}
        isLoading={isLoading}
        currentVersionTitle={currentVersionTitle}
        olderVersionTitle={olderVersionTitle}
      />
    </div>
  )
}

const AppVersionDocsTable = ({
  data,
  pastVersionData,
  tableTools,
  isLoading,
  previousVersionData,
}: IAppVersionDocsTable) => {
  const translate = useTranslate()
  const isData = data && data?.length > 0

  const currentVersionCols = useMemo<ColumnDef<IAppVersionDocumentLog>[]>(
    () => [
      {
        id: 'system',
        accessorKey: isData && 'system',
        header: translate('appVersion.fields.system'),
        className: 'tw-w-[200px]',
        cell: function render({ getValue }: any) {
          return (
            <span className='tw-font-bold tw-text-[#2B3674]'>
              {
                PLATFORM_TYPE[
                  getValue()?.toLowerCase() as keyof typeof PLATFORM_TYPE
                ]
              }
            </span>
          )
        },
      },
      {
        id: 'version',
        accessorKey: isData && 'version',
        header: function render() {
          return (
            <span className='tw-flex tw-justify-center tw-w-full'>
              {translate('appVersion.fields.version')}
            </span>
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
        accessorKey: isData && 'updatedAt',
        header: translate('legals.fields.updatedAt'),
        className: 'tw-w-[200px]',
        cell: function render({ getValue }) {
          return dayjs(getValue() as string)
            .format('YYYY-MM-DD HH:mm')
            .toString()
        },
      },
    ],
    [translate, data]
  )

  const appVersionCols = useMemo<ColumnDef<IAppVersionDocumentLog>[]>(
    () => [
      {
        id: 'system',
        accessorKey: isData && 'system',
        header: translate('appVersion.fields.system'),
        cell: function render({ getValue }: any) {
          return (
            <span className='tw-font-bold tw-text-[#2B3674]'>
              {
                PLATFORM_TYPE[
                  getValue()?.toLowerCase() as keyof typeof PLATFORM_TYPE
                ]
              }
            </span>
          )
        },
      },
      // TODO: Implement this next phase
      // {
      //   id: 'type',
      //   accessorKey: isData && 'updateType',
      //   header: translate('appVersion.fields.type'),
      // },
      {
        id: 'version',
        accessorKey: isData && 'version',
        header: function render() {
          return (
            <span className='tw-flex tw-justify-center tw-w-full'>
              {translate('appVersion.fields.version')}
            </span>
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
        accessorKey: isData && 'system',
        cell: function render({ getValue }) {
          return <ListAction types={['show']} id={getValue()} />
        },
        className: 'tw-col-sticky-end',
      },
    ],
    [translate, data]
  )

  const pastVersionCols = useMemo<ColumnDef<IAppVersionDocumentLog>[]>(
    () => [
      {
        id: 'system',
        accessorKey: isData && 'system',
        header: translate('appVersion.fields.system'),
        cell: function render({ getValue }: any) {
          return (
            <span className='tw-font-bold tw-text-[#2B3674]'>
              {
                PLATFORM_TYPE[
                  getValue()?.toLowerCase() as keyof typeof PLATFORM_TYPE
                ]
              }
            </span>
          )
        },
        sortable: true,
      },
      // TODO: Implement this next phase
      // {
      //   id: 'type',
      //   accessorKey: isData && 'updateType',
      //   header: translate('appVersion.fields.type'),
      // },
      {
        id: 'version',
        accessorKey: isData && 'version',
        header: function render() {
          return (
            <span className='tw-flex tw-justify-center'>
              {translate('appVersion.fields.version')}
            </span>
          )
        },
        cell: function render({ getValue }: any) {
          return (
            <div className='tw-font-bold tw-text-[#2B3674]'>{getValue()}</div>
          )
        },
        className: 'tw-flex tw-justify-center tw-w-full',
        sortable: true,
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
        header: translate('table.actions'),
        accessorKey: isData && 'id',
        cell: function render({ getValue }) {
          return <ListAction types={['show']} id={getValue()} />
        },
        className: 'tw-col-sticky-end',
      },
    ],
    [translate, data]
  )

  const latestVersionList = {
    columns: appVersionCols,
    data: previousVersionData,
  }

  const currentVersionList = {
    columns: currentVersionCols,
    data: data,
  }

  // TODO: Implement this next phase
  const olderVersionList = {
    columns: pastVersionCols,
    data: pastVersionData,
  }

  return (
    <AppVersionVersionListing
      latestVersionList={latestVersionList}
      olderVersionList={olderVersionList}
      currentVersionList={currentVersionList}
      tableTools={tableTools}
      isLoading={isLoading}
      currentVersionTitle='Latest soft/hard update enforced'
      olderVersionTitle='Past versions (History)'
    />
  )
}

export default AppVersionDocsTable
