import React, { useEffect } from 'react'
import { Tag } from 'primereact/tag'
import LabelValue from '@components/display/label-value'
import { Box, SimpleGrid } from '@chakra-ui/react'
import { Table } from '@components/table/Table'
import withGenericServer from '@hocs/server/generic'
import SectionBlock from '@components/display/section-block'
import Heading from '@components/typography/heading'

import { useRouter } from 'next/router'

import { isEmpty } from 'lodash'
import dayjs from 'dayjs'

import useLoading from '@src/hooks/useLoading'
import { useMemo, useCallback, useState } from 'react'
import { ColumnProps } from 'primereact/column'
import { DataTableStateEvent } from 'primereact/datatable'
import { BuildingAccessFilter } from '@components/building-access/building-access-filter'
import { useDebounce } from 'primereact/hooks'
import { IFilterBuildingAccess } from '@components/building-access/building-access-interface'
import { KeyValue } from '@src/types/key-value'
import * as OBBMSSDK from 'ob-bms-sdk'
import {
  AccessorType,
  BuildingAccessLogResult,
  TowerData,
} from 'ob-bms-sdk/dist/api'

export default function BuildingAccessLogView() {
  const { query } = useRouter()
  const { id } = query
  const [tower, setTower] = useState<KeyValue[]>([])
  const [visitorsAccessLogData, setVisitorsAccessLogData] = useState<
    BuildingAccessLogResult[]
  >([])

  const [preAccessLogData, setPreAccessLogData] = useState<
    BuildingAccessLogResult[]
  >([])

  const { startLoading, stopLoading } = useLoading()
  const [
    filterBuildingAccess,
    debouncedFilterBuildingAccess,
    setFilterBuildingAccess,
  ] = useDebounce<IFilterBuildingAccess>({}, 400)

  useEffect(() => {
    fetchTowerData()
    fetchPreData()
  }, [])

  const fetchData = useCallback(
    async (e: DataTableStateEvent) => {
      const direction = e?.sortOrder === -1 ? 'asc' : 'desc'

      let DatePicker
      if (!isEmpty(filterBuildingAccess.date)) {
        DatePicker = filterBuildingAccess.date?.map((item) =>
          dayjs(item).format('YYYY-MM-DDTHH:mm:ssZ[Z]')
        )
      }

      if (id && typeof id === 'string') {
        startLoading()

        const buildingLogData = await OBBMSSDK.client.buildingAccessLogsIndex(
          AccessorType.Pass,
          e?.sortField,
          direction,
          (e?.page ?? 0) + 1,
          e?.rows,
          filterBuildingAccess.building,
          undefined,
          undefined,
          filterBuildingAccess.building,
          filterBuildingAccess.statusPass
            ? parseInt(filterBuildingAccess.statusPass)
            : undefined,
          DatePicker && DatePicker[0],
          DatePicker && DatePicker[1],
          id
        )
        setVisitorsAccessLogData(buildingLogData.data.data)
        stopLoading()
      }
    },
    [debouncedFilterBuildingAccess]
  )

  const fetchTowerData = async () => {
    try {
      const tower = await OBBMSSDK.client.towersIndex().then((res) => {
        const towerList = (res.data?.data as TowerData[])?.map(
          (tower: TowerData) => {
            return {
              name: tower.name,
              value: tower.name,
            }
          }
        )

        return towerList
      })
      setTower(tower)
    } catch (error) {
      console.error('Error fetching gate data:', error)
    }
  }

  const fetchPreData = async () => {
    try {
      if (id && typeof id === 'string') {
        const buildingLogData = await OBBMSSDK.client.buildingAccessLogsShow(
          id,
          AccessorType.Pass
        )
        setPreAccessLogData(buildingLogData.data.data)
      }
    } catch (error) {
      console.error('Error fetching gate data:', error)
    }
  }

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'Status',
        header: 'Status',
        headerClassName: 'text-[#676B9B]',
        style: { minWidth: '200px', color: '#676B9B' },
        body: ({ status }) => {
          return status === 0 ? <p>OnSite</p> : <p>Left</p>
        },
      },
      {
        field: 'transaction_date',
        header: 'Access/Leave time',
        headerStyle: { color: '#676B9B' },
        style: { minWidth: '200px', color: '#676B9B' },
        body: ({ transaction_date }) => {
          return dayjs(transaction_date).format('YYYY-MM-DD HH:mm').toString()
        },
      },
      {
        field: 'display_tower',
        header: 'Building',
        style: { minWidth: '200px', color: '#676B9B' },
        body: ({ display_tower }) => {
          return display_tower
        },
      },
      {
        field: 'turnstile_id',
        header: 'Turnstile',
        style: { minWidth: '200px', color: '#676B9B' },
        body: ({ turnstile_id }) => {
          return turnstile_id
        },
      },
    ],
    []
  )

  return (
    <>
      <>
        <SectionBlock bg={'white'}>
          <Heading color='#1B2559'>
            {preAccessLogData && preAccessLogData[0]?.visitor?.name}
          </Heading>
          <Box pt='24px'>
            <SimpleGrid columns={3} spacingY='24px'>
              <Box flex={1}>
                <LabelValue label='Visitor ID' colorLabel={'#273281'}>
                  <Box p='2px 8px'>{preAccessLogData[0]?.fs_account_id}</Box>
                </LabelValue>
              </Box>
              <Box flex={1}>
                {preAccessLogData && (
                  <LabelValue label='Status' colorLabel={'#273281'}>
                    <Tag
                      style={{
                        backgroundColor:
                          preAccessLogData[0]?.status === 0
                            ? '#EFF8E8'
                            : '#F5F5F5',
                        color: '#59B413',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        p='2px 8px'
                        color={
                          preAccessLogData[0]?.status === 0
                            ? '#59B413'
                            : '#1B1B1B'
                        }
                      >
                        {preAccessLogData[0]?.status === 0 ? 'Onsite' : 'Left'}
                      </Box>
                    </Tag>
                  </LabelValue>
                )}
              </Box>
              <Box flex={1}>
                <LabelValue label='Latest Inviter' colorLabel={'#273281'}>
                  -
                </LabelValue>
              </Box>
              <Box flex={1}>
                <LabelValue label='Email' colorLabel={'#273281'}>
                  {preAccessLogData[0]?.visitor?.email}
                </LabelValue>
              </Box>
              <Box flex={1}>
                <LabelValue
                  label='ID number/Passport number'
                  colorLabel={'#273281'}
                >
                  {preAccessLogData[0]?.visitor?.reference}
                </LabelValue>
              </Box>
              <Box flex={1}>
                <LabelValue label='Company' colorLabel={'#273281'}>
                  {preAccessLogData[0]?.visitor?.company_name}
                </LabelValue>
              </Box>
            </SimpleGrid>
          </Box>
        </SectionBlock>
      </>

      <div className='card mt-3'>
        <div>
          <div className='flex justify-content-between'></div>
          <div>
            <BuildingAccessFilter
              onFilter={setFilterBuildingAccess}
              building={tower}
              statusPass
              title='Building access Log'
            />
            <div className='mt-8'>
              <Table
                columns={columns}
                data={visitorsAccessLogData}
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
BuildingAccessLogView.activePrime = true

export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }
  return ctx
}, {})
