/* eslint-disable */
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
import { whatHappeningService } from '@src/services/what-happening/service'
import { WhatHappeningFilter } from '@components/what-happening/what-happening-filter'
import { DataTableStateEvent } from 'primereact/datatable'
import { useDebounce } from 'primereact/hooks'
import {
  IFilterWhatHappening,
  IGetWhatHappening,
} from '@src/services/what-happening/model'
import React from 'react'
import { Icon } from '@chakra-ui/icons'
import { Tag } from 'primereact/tag'
import { confirmDialog } from 'primereact/confirmdialog'
import { toast } from 'react-toastify'
import { defaultToastMessage } from '@src/utils/default-toast'
import { Dropdown } from 'primereact/dropdown'
import { sortBy } from 'lodash'

type Props = {}

export default function WhatHappening(props: Props) {
  OBBMSSDK.setBaseUrl(process.env.BMS_BASEURL || '')
  const translate = useTranslate()
  const [isLoading, setIsLoading] = useState(false)
  const { setMenuAction } = useLayoutContext()
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const [data, setData] = useState<IGetWhatHappening[]>([])
  const [currentDisplay, setCurrentDisplay] = useState<IGetWhatHappening[]>([])
  const [filter, debouncedFilter, setFilterWhatHappening] =
    useDebounce<IFilterWhatHappening>({}, 400)
  const [tableState, setTableState] = useState<DataTableStateEvent>({
    filters: {},
    first: 0,
    multiSortMeta: [],
    rows: 10,
    sortField: 'body.eventStartDate',
    sortOrder: -1,
  })

  const IconCell = ({
    value,
    IconComponent,
    color,
    onClick = () => {},
    className = '',
  }: {
    value: any
    IconComponent: React.ElementType
    color: string
    onClick?: any
    className?: string
  }) =>
    value ? (
      <IconComponent
        style={{ color }}
        onClick={onClick}
        className={className}
      />
    ) : null

  const {} = props

  function PinIcon(props: any) {
    return (
      <Icon viewBox='0 0 24 24' {...props}>
        <path
          fill='currentColor'
          d='M19.1835 7.80516L16.2188 4.83755C14.1921 2.8089 13.1788 1.79457 12.0904 2.03468C11.0021 2.2748 10.5086 3.62155 9.5217 6.31506L8.85373 8.1381C8.59063 8.85617 8.45908 9.2152 8.22239 9.49292C8.11619 9.61754 7.99536 9.72887 7.86251 9.82451C7.56644 10.0377 7.19811 10.1392 6.46145 10.3423C4.80107 10.8 3.97088 11.0289 3.65804 11.5721C3.5228 11.8069 3.45242 12.0735 3.45413 12.3446C3.45809 12.9715 4.06698 13.581 5.28476 14.8L6.69935 16.2163L2.22345 20.6964C1.92552 20.9946 1.92552 21.4782 2.22345 21.7764C2.52138 22.0746 3.00443 22.0746 3.30236 21.7764L7.77841 17.2961L9.24441 18.7635C10.4699 19.9902 11.0827 20.6036 11.7134 20.6045C11.9792 20.6049 12.2404 20.5358 12.4713 20.4041C13.0192 20.0914 13.2493 19.2551 13.7095 17.5825C13.9119 16.8472 14.013 16.4795 14.2254 16.1835C14.3184 16.054 14.4262 15.9358 14.5468 15.8314C14.8221 15.593 15.1788 15.459 15.8922 15.191L17.7362 14.4981C20.4 13.4973 21.7319 12.9969 21.9667 11.9115C22.2014 10.826 21.1954 9.81905 19.1835 7.80516Z'
        />
      </Icon>
    )
  }

  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = date.toLocaleString('en-US', { month: 'short' })
    const year = date.getFullYear()

    let hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return `${day} ${month} ${year} (${hours}:${minutes})`
  }

  const formatDateShow = (dateString: string | Date): string => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = date.toLocaleString('en-US', { month: 'short' })
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
  }

  const formatDateEvent = (
    startDate: string | Date,
    endDate: string | Date
  ): string => {
    const formatDate = (dateString: string | Date): string => {
      const date = new Date(dateString)
      const day = date.getDate().toString().padStart(2, '0')
      const month = date.toLocaleString('en-US', { month: 'short' })
      const year = date.getFullYear()
      return `${day} ${month} ${year}`
    }
    const formattedStartDate = formatDate(startDate)
    const formattedEndDate = formatDate(endDate)
    return `${formattedStartDate} - ${formattedEndDate}`
  }

  const onClickCurrent = (item: IGetWhatHappening) => {
    const isCurrentDisplayed = item.body.isCurrentDisplay
    const dialogMessage = isCurrentDisplayed
      ? 'Are you sure you want to remove this item from current display?'
      : 'Are you sure you want to select this item to current display?'

    confirmDialog({
      message: dialogMessage,
      closable: false,
      draggable: false,
      style: { minWidth: '30vw' },
      contentClassName: 'flex font-bold',
      footer: (option) => (
        <div className='flex gap-3'>
          <Button
            type='submit'
            label='Confirm'
            className='bg-primary-blue'
            onClick={async () => {
              option.accept()
              const promise = whatHappeningService.toggleCurrentDiplay(item.id)
              promise
                .then(async () => {
                  await getData()
                })
                .catch((error) => {
                  if (error.response && error.response?.status === 400) {
                    switch (error.response.data?.data) {
                      case 'MAXIMUM_EXCEED': {
                        confirmDialog({
                          message: `Maximum Current Display is 3.`,
                          closable: false,
                          draggable: false,
                          style: { minWidth: '30vw' },
                          contentClassName: 'flex font-bold',
                          footer: (option) => (
                            <div className='flex gap-3'>
                              <Button
                                className='text-primary-blue'
                                label='Close'
                                outlined
                                onClick={option.reject}
                              />
                            </div>
                          ),
                        })
                        break
                      }
                      case 'INVALID_EVENT_DATE': {
                        confirmDialog({
                          message: `Invalid Date can't be Current Display.`,
                          closable: false,
                          draggable: false,
                          style: { minWidth: '30vw' },
                          contentClassName: 'flex font-bold',
                          footer: (option) => (
                            <div className='flex gap-3'>
                              <Button
                                className='text-primary-blue'
                                label='Close'
                                outlined
                                onClick={option.reject}
                              />
                            </div>
                          ),
                        })
                        break
                      }
                      case 'INVALID_PUBLISH_DATE': {
                        confirmDialog({
                          message: `Invalid Date can't be Current Display.`,
                          closable: false,
                          draggable: false,
                          style: { minWidth: '30vw' },
                          contentClassName: 'flex font-bold',
                          footer: (option) => (
                            <div className='flex gap-3'>
                              <Button
                                className='text-primary-blue'
                                label='Close'
                                outlined
                                onClick={option.reject}
                              />
                            </div>
                          ),
                        })
                        break
                      }
                      default:
                        throw error
                    }
                  } else {
                    throw error
                  }
                })
            }}
          />
          <Button
            className='text-primary-blue'
            label='Cancel'
            text
            onClick={option.reject}
          />
        </div>
      ),
    })
  }

  const changeOrder = (id: string, seq: number) => {
    confirmDialog({
      message: `Are you sure you want to change order?`,
      closable: false,
      draggable: false,
      style: { minWidth: '30vw' },
      contentClassName: 'flex font-bold',
      footer: (option) => (
        <div className='flex gap-3'>
          <Button
            type='submit'
            label='Confirm'
            className='bg-primary-blue'
            onClick={async () => {
              option.accept()
              const promise = whatHappeningService.reorderCurrentDisplay(
                id,
                seq
              )
              toast.promise(
                promise.then(async () => {
                  await getData()
                }),
                defaultToastMessage
              )
            }}
          />
          <Button
            className='text-primary-blue'
            label='Cancel'
            text
            onClick={option.reject}
          />
        </div>
      ),
    })
  }

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'order',
        accessorKey: 'configOrder',
        header: 'Order',
        style: { width: '100px' },
        sortable: false,
        body: (data: IGetWhatHappening) => {
          return data.body.isCurrentDisplay ? (
            <Dropdown
              value={data.body.seq}
              options={currentDisplay.map((x) => x.body.seq)}
              onChange={(e) => changeOrder(data.id, e.value)}
            />
          ) : (
            <></>
          )
        },
      },
      {
        field: 'isPin',
        accessorKey: 'isPin',
        header: 'Pin',
        sortable: false,
        style: { width: '80px' },
        body: (data: IGetWhatHappening) => (
          <IconCell
            value={true}
            IconComponent={PinIcon}
            color={data.body.isCurrentDisplay ? '#ff0000' : '#e0e0e0'}
            onClick={() => {
              if (!data.published || !data.active) {
                return
              }
              onClickCurrent(data)
            }}
            className='cursor-pointer'
          />
        ),
      },
      {
        field: 'id',
        header: 'ID',
        style: { width: '250px' },
        sortable: false,
      },
      {
        field: 'body.content.en.title',
        header: 'Title',
        style: { width: '300px' },
        sortable: true,
        sortField: 'body.content.en.title',
      },
      {
        field: 'published',
        header: 'Status',
        style: { width: '150px' },
        sortable: true,
        sortField: 'published',
        body: (data: IGetWhatHappening) => {
          return data.published ? <span>Published</span> : <span>Draft</span>
        },
      },
      {
        field: 'body.showStartDate',
        header: 'Show Start - End',
        style: { width: '250px' },
        sortable: true,
        sortField: 'body.showStartDate',
        body: (data: IGetWhatHappening) => {
          const startDate = data.body.showStartDate
          const endDate = data.body.showEndDate
          return (
            <span>
              {startDate
                ? endDate
                  ? formatDateEvent(startDate, endDate)
                  : formatDateShow(startDate) + ' - ' + 'Not specified'
                : ''}
            </span>
          )
        },
      },
      {
        field: 'body.eventStartDate',
        header: 'Event Start - End',
        style: { width: '250px' },
        sortable: true,
        sortField: 'body.eventStartDate',
        body: (data: IGetWhatHappening) => {
          const startDate = data.body.eventStartDate
          const endDate = data.body.eventEndDate
          return (
            <span>
              {startDate && endDate ? formatDateEvent(startDate, endDate) : ''}
            </span>
          )
        },
      },
      {
        field: 'updated_at',
        header: 'Last update',
        style: { width: '200px' },
        sortable: true,
        sortField: 'updated_at',
        body: (data: IGetWhatHappening) => {
          return <span>{formatDate(data.updated_at)}</span>
        },
      },
      {
        field: 'updated_by',
        header: 'Updated By',
        style: { width: '200px' },
        sortable: true,
        sortField: 'updated_by',
      },
      {
        field: 'active',
        // accessorKey: 'content',
        header: 'Active',
        style: { width: '100px' },
        body: (data: IGetWhatHappening) => {
          return (
            <div>
              {data.active ? (
                <Tag severity='success'>Active</Tag>
              ) : (
                <Tag severity='danger'>Inactive</Tag>
              )}
            </div>
          )
        },
        sortable: true,
        sortField: 'active',
      },
      {
        id: 'actions',
        accessorKey: 'id',
        header: translate('table.actions'),
        style: { width: '100px' },
        frozen: true,
        alignFrozen: 'right',
        body: (data: IGetWhatHappening) => {
          return (
            <>
              <TableAction types={['edit']} id={data.id} />
            </>
          )
        },
      },
    ],
    [translate, onClickCurrent]
  )

  const onCreateWhatHappening = () => {
    router.push({
      pathname: '/what-happening/create',
    })
  }
  const onFilter = (item: IFilterWhatHappening) => {
    setFilterWhatHappening(item)
  }

  const getData = useCallback(async () => {
    setIsLoading(true)
    const currentDisplay = await whatHappeningService.getCurrentDisplay()
    tableState.rows = 10 - currentDisplay.length
    const res = await whatHappeningService.getAll(filter, tableState)
    setCurrentDisplay(currentDisplay)
    res.data.unshift(...sortBy(currentDisplay, (x) => x.body.seq))
    setData(res.data)
    setTotalRecords(res.totalRecords + currentDisplay.length * res.totalPage)
    setIsLoading(false)
  }, [debouncedFilter, tableState])

  useEffect(() => {
    getData()
  }, [debouncedFilter, tableState])

  useEffect(() => {
    const menuAction = (
      <div className='flex gap-3'>
        <Button
          className='bg-primary-blue'
          label='Create new what’s happening'
          onClick={onCreateWhatHappening}
        />
      </div>
    )
    setMenuAction(menuAction)
    setIsLoading(false)
  }, [setMenuAction])

  return (
    <>
      <div className='card'>
        <div>
          <div className='mb-4'>
            <WhatHappeningFilter onFilter={onFilter} />
          </div>
          <div>
            <Table
              columns={columns}
              data={data}
              totalRecords={totalRecords}
              loading={isLoading}
              rows={10}
              sortField='body.eventStartDate'
              sortOrder={-1}
              onTableStateChange={setTableState}
              tableStyle={{ tableLayout: 'fixed' }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

WhatHappening.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/what-happening',
    accessPage: PCODE.VIEWWHATHAPPENING,
  }
)
