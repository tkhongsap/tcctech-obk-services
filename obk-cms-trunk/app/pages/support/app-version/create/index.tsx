import Upsert from '@components/support/app-version/upsert'
import withGenericServer from '@hocs/server/generic'
import { Box } from '@chakra-ui/react'
import SectionTitle from '@components/display/section-title'
import { useForm } from '@refinedev/react-hook-form'
import { useResource } from '@refinedev/core'
import { useEffect, useState } from 'react'
import { nextApi } from '@src/utils/api'
import useLoading from '@src/hooks/useLoading'
import { IAppVersionDocumentLog } from '@src/types/document'
import { PCODE } from '@src/data/constants/privilege'
import { memberService } from '@src/services/member/service'
import { IPersonalInfo } from '@src/services/member/model'

type Props = {
  personalInfo: IPersonalInfo
}

export default function CreateAppVersion(props: Props) {
  const resouces = useResource()
  const form = useForm({
    defaultValues: {},
  })

  const { loading, startLoading, stopLoading } = useLoading()
  const [versionData, setVersionData] = useState<IAppVersionDocumentLog>()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    startLoading()
    await nextApi
      .get('/app-setting/app-version-update')
      .then((res) => {
        console.log('fetch app version data', res.data)
        setVersionData(res.data)
      })
      .catch((err) => {
        console.log('fetch app version data err', err)
      })
      .finally(() => {
        stopLoading()
      })
  }

  return (
    <Box maxW='inherit' pb='60px'>
      <SectionTitle>Create {resouces?.resource?.meta?.label}</SectionTitle>
      <Box pt='42px'>
        <Upsert
          form={form}
          loading={loading}
          data={versionData}
          startLoading={startLoading}
          stopLoading={stopLoading}
          user={props.personalInfo?.name}
        />
      </Box>
    </Box>
  )
}

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const res = await memberService.getByKeycloakId(ctx.props.userId)
    const personalInfo = res.data
    return { ...ctx, props: { personalInfo } }
  },
  {},
  {
    redirectPath: '/support/app-version',
    accessPage: PCODE.UPDATENEWAPPVERSION,
  }
)
