import { useEffect, useMemo } from 'react'
import { useTranslate } from '@refinedev/core'
import { useState } from 'react'
import withGenericServer from '@hocs/server/generic'
import { ColumnProps } from 'primereact/column'
import { Table } from '@components/table/tableroster'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { PCODE } from '@src/data/constants/privilege'
import React from 'react'
import router from 'next/router'
import { componentregisterService } from '@src/services/usagemonitoring/component/service'
import { IGetComponentRegister } from '@src/services/usagemonitoring/component/model'
import { Button } from 'primereact/button'
import { toast } from 'react-toastify'

type Props = { dataComponent: IGetComponentRegister[] }

export default function ComponentRegister(props: Props) {
  const translate = useTranslate()
  const { setMenuName } = useLayoutContext()
  const [data, setData] = useState<IGetComponentRegister[]>([])
  const { setMenuAction } = useLayoutContext()
  const [isLoading, setIsLoading] = useState(false)
  const [lastClickedTime, setLastClickedTime] = useState(0)

  setMenuName('All Staff')

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
        header: 'Name',
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
    setData(props.dataComponent)
  })

  const onExport = async () => {
    const currentTime = Date.now()
    if (isLoading || currentTime - lastClickedTime < 3000) {
      return
    }
    setIsLoading(true)
    try {
      await componentregisterService.export()
      toast.success('Export successful')
    } catch (error) {
      toast.error('Export failed')
    } finally {
      router.push({
        pathname: '/usagemonitoring/component',
      })
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
      <div className='grid gap-5 mt-4'>
        <div className='card col flex-1'>
          <div>
            <div>
              <Table
                columns={columns}
                data={data}
                loading={isLoading}
                sortField='component'
                sortOrder={-1}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

ComponentRegister.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const dataComponent = await componentregisterService
      .getAll()
      .then((res) => {
        return res
      })
    ctx.props = { ...ctx.props, dataComponent }
    return ctx
  },
  {},
  {
    redirectPath: '/roster',
    accessPage: PCODE.VIEWGUARDTOURSCHEDULEPLAN,
  }
)
