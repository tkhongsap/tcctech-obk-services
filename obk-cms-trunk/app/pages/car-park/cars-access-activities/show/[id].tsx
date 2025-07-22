import React, { useEffect } from 'react'
import { Tag } from 'primereact/tag'
import LabelValue from '@components/display/label-value'
import { Box, SimpleGrid } from '@chakra-ui/react'
import { Table } from '@components/table/Table'
import withGenericServer from '@hocs/server/generic'
import SectionBlock from '@components/display/section-block'
import Heading from '@components/typography/heading'
import { useRouter } from 'next/router'
import { get, isEmpty } from 'lodash'
import dayjs from 'dayjs'
import { useMemo, useCallback, useState } from 'react'
import { ColumnProps } from 'primereact/column'
import { DataTableStateEvent } from 'primereact/datatable'
import { useDebounce } from 'primereact/hooks'
import * as OBBMSSDK from 'ob-bms-sdk'
import { IFilterParkingAccess } from '@components/car-park/carpark-interface'
import { ParkingAccessFilter } from '@components/car-park/carpark-filter'
import { ParkingLogResult } from 'ob-bms-sdk/dist/api'

export default function CarParkAccess() {
  const { query } = useRouter()
  const { id } = query
  const [parkingMemberAccessLogData, setParkingMemberAccessLogData] =
    useState<any>([])

  const [preParkingMemberAccessLogData, setPreParkingAccessLogData] =
    useState<ParkingLogResult>()
  const [
    filterParkingAccess,
    debouncedFilterParkingAccess,
    setFilterParkingAccess,
  ] = useDebounce<IFilterParkingAccess>({}, 400)

  const fetchData = useCallback(
    async (e: DataTableStateEvent) => {
      const direction = e?.sortOrder === -1 ? 'asc' : 'desc'

      if (id && typeof id === 'string') {
        let DatePicker
        if (!isEmpty(filterParkingAccess.date)) {
          DatePicker = filterParkingAccess.date?.map((item) => {
            return dayjs(item).format('YYYY-MM-DDTHH:mm:ssZ[Z]')
          })
        }
        const result = await OBBMSSDK.client.parkingAccessLogsIndex(
          e?.sortField,
          direction,
          (e?.page ?? 0) + 1,
          e?.rows,
          undefined,
          undefined,
          undefined,
          id,
          DatePicker && DatePicker[0],
          DatePicker && DatePicker[1]
        )
        setParkingMemberAccessLogData(result.data.data)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedFilterParkingAccess]
  )

  const fetchPreData = async () => {
    if (id && typeof id === 'string') {
      const result = await OBBMSSDK.client.parkingAccessLogsShow(id)
      setPreParkingAccessLogData(result.data.data)
    }
  }

  useEffect(() => {
    fetchPreData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: parkingMemberAccessLogData && 'transaction_date',
        header: 'Access/Leave time',
        style: { minWidth: '200px' },
        body: ({ transaction_date }) => {
          return dayjs(transaction_date).format('YYYY-MM-DD HH:mm').toString()
        },
      },
      {
        field: parkingMemberAccessLogData && 'durationTime',
        header: 'Duration',
        style: { minWidth: '200px' },
      },
      {
        field: parkingMemberAccessLogData && 'accessGate',
        header: 'Access gate',
        style: { minWidth: '200px' },
        body: (data) => {
          console.log(data)

          return data.status === 'onsite' ? data.terminal_id : data.accessGate
        },
      },
      {
        field: parkingMemberAccessLogData && 'terminal_id',
        header: 'Leave gate',
        style: { minWidth: '200px' },
        body: (data) => {
          return data.status === 'leave' ? data.terminal_id : '-'
        },
      },
      {
        field: parkingMemberAccessLogData && 'Status',
        header: 'Status',
        // style: { minWidth: '200px' },
        body: ({ status }) => {
          return (
            <div className=' w-full justify-center items-center'>
              <Tag
                style={{
                  backgroundColor:
                    status === 'onsite' && status ? '#EFF8E8' : '#F5F5F5',
                  color: status === 'onsite' ? '#59B413' : '#1B1B1B',
                  alignItems: 'center',
                }}
              >
                {status === 'onsite' ? 'Onsite' : 'Left'}
              </Tag>
            </div>
          )
        },
      },
    ],
    []
  )

  return (
    <>
      <>
        <SectionBlock bg={'white'}>
          <Heading color='biscay'>
            {preParkingMemberAccessLogData?.plate_number}
          </Heading>
          <Box pt='24px'>
            <SimpleGrid columns={3} spacingY='24px'>
              <Box flex={1}>
                <LabelValue label='Owner'>
                  <Box p='2px 8px'>{preParkingMemberAccessLogData?.name}</Box>
                </LabelValue>
              </Box>
              <Box flex={1}>
                <LabelValue label='Email'>
                  {get(
                    preParkingMemberAccessLogData,
                    'member.metadata.emails',
                    '-'
                  )}
                </LabelValue>
              </Box>
              <Box flex={1}>
                <Box flex={1}>
                  <LabelValue label='Company name'>
                    {get(
                      preParkingMemberAccessLogData,
                      'member.tenant_members[0].tenant.name',
                      '-'
                    )}
                  </LabelValue>
                </Box>
              </Box>
            </SimpleGrid>
          </Box>
        </SectionBlock>
      </>

      <div className='card mt-3'>
        <div>
          <div className='flex justify-content-between'></div>
          <div>
            <ParkingAccessFilter
              onFilter={setFilterParkingAccess}
              title='Cars Access Activities'
            />
            <div className='mt-8'>
              <Table
                columns={columns}
                data={parkingMemberAccessLogData}
                totalRecords={20}
                onTableStateChange={fetchData}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
CarParkAccess.activePrime = true

export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }
  return ctx
}, {})
