import { useEffect, useMemo } from 'react'
import { useTranslate } from '@refinedev/core'
import { useState } from 'react'
import withGenericServer from '@hocs/server/generic'
import { ColumnProps } from 'primereact/column'
import { Table } from '@components/table/tableroster'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { PCODE } from '@src/data/constants/privilege'
import { useDebounce } from 'primereact/hooks'
import React from 'react'
import { rosterStaffService } from '@src/services/usagemonitoring/roster/service'
import {
  IFilterRosterStaff,
  IGetRosterStaff,
} from '@src/services/usagemonitoring/roster/model'
import { Button } from 'primereact/button'
import { toast } from 'react-toastify'

type Props = { dataRoster: IGetRosterStaff[]; component: string }
export default function RosterStaff(props: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const translate = useTranslate()
  const [data, getData] = useState<IGetRosterStaff[]>([])
  useDebounce<IFilterRosterStaff>({}, 400)
  const { setMenuAction } = useLayoutContext()
  const { setMenuName } = useLayoutContext()
  const [lastClickedTime, setLastClickedTime] = useState(0)

  const { dataRoster, component } = props

  setMenuName('Staff by Componant')
  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'email',
        header: 'Email',
        style: { minWidth: '100px' },
        sortable: false,
      },

      {
        field: 'staffName',
        header: 'Staff Name',
        style: { minWidth: '100px' },
        sortable: false,
      },
      {
        field: 'component',
        header: 'Component',
        style: { minWidth: '100px' },
        sortable: false,
      },
      {
        field: 'mustUseOpsApp',
        header: 'Must Use OpsApp',
        style: { minWidth: '100px' },
        sortable: false,
        body: (rowData) => (rowData.mustUseOpsApp ? 'Yes' : 'No'),
      },
      {
        field: 'loginToDay',
        header: 'Login Today',
        style: { minWidth: '100px' },
        sortable: false,
        body: (rowData) => (rowData.loginToDay ? 'Yes' : 'No'),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translate]
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getData(dataRoster)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onExport = async () => {
    const currentTime = Date.now()
    if (isLoading || currentTime - lastClickedTime < 3000) {
      return
    }
    setIsLoading(true)
    try {
      await rosterStaffService.export()
      toast.success('Export successful')
    } catch (error) {
      toast.error('Export failed')
    } finally {
      setIsLoading(false)
      setLastClickedTime(currentTime)
    }
  }

  useEffect(() => {
    const menuAction = (
      <div className='flex gap-3'>
        <Button
          outlined
          className='text-primary-blue'
          label='Export'
          onClick={onExport}
          disabled={isLoading}
        />
      </div>
    )
    setMenuAction(menuAction)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuAction])

  return (
    <>
      <div className='card'>
        <div>
          <div className='mb-4'>
            <h3 className='tw-text-2xl tw-text-[#1B2559] tw-font-bold'>
              Staff Actual Login by Component : {component} {}
            </h3>
          </div>
          <div>
            <Table
              columns={columns}
              data={data}
              loading={isLoading}
              sortField='Component'
              sortOrder={-1}
            />
          </div>
        </div>
      </div>
    </>
  )
}

RosterStaff.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const { component } = ctx.props.query
    const dataRoster = await rosterStaffService
      .getAll({ Component: component })
      .then((res) => {
        return res
      })
      .finally(() => {})
    ctx.props = { ...ctx.props, dataRoster, component }
    return ctx
  },
  {},
  {
    redirectPath: '/roster',
    accessPage: PCODE.VIEWGUARDTOURSCHEDULEPLAN,
  }
)
