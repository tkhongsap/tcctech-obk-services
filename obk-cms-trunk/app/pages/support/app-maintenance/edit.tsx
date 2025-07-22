import SectionTitle from '@components/display/section-title'
import { useForm } from '@refinedev/react-hook-form'
import Upsert from '@components/support/app-maintenance/upsert'
import { useEffect, useState } from 'react'
import { IAppMaintenanceData } from '.'
import useLoading from '@src/hooks/useLoading'
import { nextApi } from '@src/utils/api'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import { memberService } from '@src/services/member/service'
import { IPersonalInfo } from '@src/services/member/model'

type Props = {
  personalInfo: IPersonalInfo
}

export default function EditAppMaintenance(props: Props) {
  const form = useForm({
    defaultValues: {},
  })
  const { loading, startLoading, stopLoading } = useLoading()

  const [appMaintenanceData, setAppMaintenanceData] =
    useState<IAppMaintenanceData>()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    startLoading()
    await nextApi
      .get('/app-setting/app-maintenance')
      .then((res) => {
        console.log('fetch app maintenance data', res.data)
        setAppMaintenanceData(res.data)
      })
      .catch((err) => {
        console.log('fetch app maintenance data err', err)
      })
      .finally(() => {
        stopLoading()
      })
  }

  return (
    <div className='tw-max-w-inherit tw-pt-[60px]'>
      <SectionTitle>App Maintenance</SectionTitle>
      <div className='tw-pt-[42px]'>
        <Upsert
          data={appMaintenanceData || {}}
          form={form}
          formType='edit'
          loading={loading}
          startLoading={startLoading}
          stopLoading={stopLoading}
          userInfo={props.personalInfo}
        />
      </div>
    </div>
  )
}

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const res = await memberService.getByKeycloakId(ctx.props.userId)
    const personalInfo = res.data
    return { ...ctx, props: { personalInfo } }
  },
  {
    redirectPath: '/support/app-maintenance',
    accessPage: PCODE.UPDATEAPPMAINTENANCE,
  }
)
