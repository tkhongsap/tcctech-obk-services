/* eslint-disable unused-imports/no-unused-vars-ts */
import React, { useEffect, useMemo, useState } from 'react'

import { useLayoutContext } from '@src/layout/context/layoutcontext'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import { usageMonitoring } from '@src/services/usagemonitoring/servive'
import { IGetUsageMonitoring } from '@src/services/usagemonitoring/model'
import { Table } from '@components/table/tabletoken'
import { ColumnProps } from 'primereact/column'

import Heading from '@components/typography/heading'
import { useTranslate } from '@refinedev/core'
import { DataTableStateEvent } from 'primereact/datatable'

type Props = {
  ecData: IGetUsageMonitoring
}

interface ComponentData {
  [key: string]: {
    ActualLogin: number
    WeekDay: number
    WeekEnd: number
  }
}

export default function UsageMonitoring(props: Props) {
  const { setMenuAction } = useLayoutContext()
  const [componentData, setComponentData] = useState<ComponentData>(() =>
    props?.ecData?.component ? JSON.parse(props.ecData.component) : {}
  )
  const [statisticsData, setstatistics] = useState(
    props?.ecData?.statistics ? JSON.parse(props.ecData.statistics) : {}
  )
  const statisticstranslate = useTranslate()
  const [isLoading, setIsLoading] = useState(false)
  const date = new Date()
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  const createdAtString = props.ecData?.createdAt ?? new Date().toISOString()
  const date7 = new Date(createdAtString)
  date7.setHours(date7.getHours() + 7)
  const formattedDate7 = date7.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const [tableState, setTableState] = useState<DataTableStateEvent>({
    filters: {},
    first: 0,
    multiSortMeta: [],
    rows: 10,
    sortField: 'id',
    sortOrder: -1,
  })

  const actualActiveDailyUser = props.ecData?.atcualActiveDailyUser ?? 0
  const fixedDailyUserTarget = props.ecData?.fixedDailyUserTarget ?? 0

  const percentage =
    typeof actualActiveDailyUser === 'number' &&
    typeof fixedDailyUserTarget === 'number' &&
    fixedDailyUserTarget !== 0
      ? (actualActiveDailyUser / fixedDailyUserTarget) * 100
      : 0
  const { setMenuName } = useLayoutContext()

  const statisticscolumns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'Date',
        header: 'Date',
        style: { minWidth: '100px' },
        sortable: false,
      },
      {
        field: 'TypeDay',
        header: 'TypeDay',
        style: { minWidth: '200px' },
        sortable: false,
        body: (rowData) => {
          if (!rowData.Date) return 'N/A'
          const date = new Date(rowData.Date)
          return date.toLocaleDateString('en-US', {
            weekday: 'long',
          })
        },
      },
      {
        field: 'Count',
        header: 'Count',
        style: { minWidth: '100px' },
        sortable: false,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [statisticstranslate]
  )

  const handleTableStateChange = (e: DataTableStateEvent) => {
    setTableState(e)
  }

  const StaffTable = () => {
    const totalActualLogin = Object.values(componentData).reduce(
      (sum, section) => sum + section.ActualLogin,
      0
    )
    const today = new Date().getDay()
    const isWeekday = today >= 1 && today <= 5
    const displayWeekDay = isWeekday ? 'Weekday' : 'Weekend'

    const totalWeekValue = Object.values(componentData).reduce(
      (sum, section) => sum + (isWeekday ? section.WeekDay : section.WeekEnd),
      0
    )

    return (
      <div className='p-4'>
        <h1 className='text-2xl font-bold mb-4'>Component</h1>
        <table className='w-full border-collapse border border-gray-300 shadow-md'>
          <thead className='bg-gray-200'>
            <tr>
              <th className='border p-2'>Component</th>
              <th className='border p-2'>Actual Login</th>
              <th className='border p-2'>{displayWeekDay}</th>
              <th className='border p-2'>Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(componentData).map((key) => {
              const section = componentData[key]
              const url = `/usagemonitoring/staff-by-componant?component=${key}`
              const weekValue = isWeekday ? section.WeekDay : section.WeekEnd
              return (
                <tr key={key} className='border'>
                  <td className='border p-2 font-semibold'>{key}</td>
                  <td className='border p-2 text-center'>
                    {section.ActualLogin}
                  </td>
                  <td className='border p-2 text-center'>{weekValue}</td>
                  <td className='border p-2 text-center'>
                    <a href={url}>View</a>
                  </td>
                </tr>
              )
            })}
            {}
            <tr className='border font-bold bg-gray-100'>
              <td className='border p-2 text-center'>Total</td>
              <td className='border p-2 text-center'>{totalActualLogin}</td>
              <td className='border p-2 text-center'>{totalWeekValue}</td>
              <td className='border p-2 text-center'>
                <a href='/usagemonitoring/all-staff'>View All</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  useEffect(() => {
    const menuAction = (
      <div className='card col '>
        <Heading as='span' color='biscay' fontSize='lg'>
          Date: {formattedDate}
        </Heading>
        <div className='font-medium text-base pt-1'>
          Last sync: {formattedDate7}
        </div>
      </div>
    )
    setMenuAction(menuAction)
    setMenuName('On-Ground Staff Ops App Usage Monitoring')
  }, [setMenuName])
  return (
    <div className='line-height-3 pb-6 text-sm line-height-3'>
      <div className='grid gap-5 mt-4'>
        <div className='col py-0'>
          <div className='card col ' style={{ minHeight: '200px' }}>
            <div>
              <Heading as='h4' color='biscay'>
                Total On-Ground Staff Must Use Ops App
              </Heading>
              <div className='font-medium text-base pt-1'>
                User : {props.ecData?.totlaOnGroundStaffMustUseOpsApp}
              </div>
            </div>
          </div>
          <div className='card col ' style={{ minHeight: '200px' }}>
            <div>
              <Heading as='h4' color='biscay'>
                Fixed Daily User Target
              </Heading>
              <div className='font-medium text-base pt-1'>
                Unique User : {props.ecData?.fixedDailyUserTarget}
              </div>
            </div>
          </div>
        </div>
        <div className='col py-0'>
          <div className='card col ' style={{ minHeight: '200px' }}>
            <div>
              <Heading as='h4' color='biscay'>
                % Actual Active Daily User
              </Heading>
              <div className='font-medium text-base pt-1'>
                {props.ecData?.atcualActiveDailyUser} /{' '}
                {props.ecData?.fixedDailyUserTarget}
              </div>
              <div className='font-medium text-base pt-1'>
                Unique User : {percentage.toFixed(2)}%
              </div>
            </div>
          </div>
          <div className='card col ' style={{ minHeight: '200px' }}>
            <div>
              <Heading as='h4' color='biscay'>
                Actual Active Daily User
              </Heading>
              <div className='font-medium text-base pt-1'>
                Unique User : {props.ecData?.atcualActiveDailyUser}
              </div>
            </div>
          </div>
        </div>
        <div className='col py-0'>
          <div className='card col ' style={{ minHeight: '200px' }}>
            <div>
              <Heading as='h4' color='biscay'>
                Total Daily On-Ground Staff Must Use Ops App (Without register)
              </Heading>
              <div className='font-medium text-base pt-1'>
                User :
                {
                  props.ecData
                    ?.totalDalilyOnGroundStaffMustUseOpsAppWithOutRegister
                }
              </div>
            </div>
          </div>
          <div className='card col flex-1' style={{ minHeight: '200px' }}>
            <div>
              <Heading as='h4' color='biscay'>
                Total Daily On-Ground Staff Must Use OpsApp (With register)
              </Heading>
              <div className='font-medium text-base pt-1'>
                User :
                {
                  props.ecData
                    ?.totalDalilyOnGroundStaffMustUseOpsAppWithRegister
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='grid gap-5 mt-4'>
        <div className='col py-0'>
          <div className='card col'>{StaffTable()}</div>
          <div className='card col flex-1'>
            <div>
              <Heading as='h4' color='biscay'>
                Log in Count Past 7 Days
              </Heading>
            </div>
            <Table
              columns={statisticscolumns}
              data={
                Array.isArray(statisticsData) ? statisticsData.slice(0, 7) : []
              }
              totalRecords={7}
              loading={isLoading}
              rows={7}
              sortField={tableState.sortField}
              sortOrder={-1}
              onTableStateChange={handleTableStateChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
UsageMonitoring.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    try {
      const res = await usageMonitoring.get()
      const ecData = res
      return {
        props: {
          ...ctx.props,
          ecData,
        },
      }
    } catch (error) {
      return {
        props: {
          ...ctx.props,
          ecData: null,
        },
      }
    }
  },
  {},
  {
    redirectPath: '/',
    accessPage: PCODE.USAGEMONITORINGSUM,
  }
)
