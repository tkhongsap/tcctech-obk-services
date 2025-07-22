import Upsert from '@components/car-park/property/upsert'
import withGenericServer from '@hocs/server/generic'
import propertyService from '@src/services/carpark-config/property'
import { omit } from 'lodash'
import { PropertiesResponse } from 'ob-parking-sdk/dist/api'

export default function EditMallNamePage({
  data,
}: {
  data: PropertiesResponse
}) {
  return <Upsert id={data.id} type='update' initialData={omit(data, ['id'])} />
}

EditMallNamePage.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const query = ctx.props.query || {}
    const id = query.id || ''
    const response = await propertyService.getPropertyData(id)
    let data = response || null
    ctx.props = { ...ctx.props, data }
    return ctx
  },
  {
    redirectPath: '/car-park/property',
  }
)
