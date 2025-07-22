import withGenericServer from '@hocs/server/generic'
import Upsert from '@components/car-park/campaign-management/upsert'
import campaignService from '@src/services/carpark/campaign'
import { CampaignType } from '@src/types/car-park/campaign'
export default function CampaignManagementPage({
  data,
}: {
  data: CampaignType | null
}) {
  return (
    <Upsert
      data={data?.defaultValue || null}
      updatedAt={data?.updatedAt || ''}
      updatedBy={data?.updatedBy || ''}
    />
  )
}

CampaignManagementPage.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const initialData = await campaignService.getCampaign()
    const data = initialData || null
    ctx.props = { ...ctx.props, data }
    return ctx
  },
  {
    redirectPath: '/car-park/campaign-management',
  }
)
