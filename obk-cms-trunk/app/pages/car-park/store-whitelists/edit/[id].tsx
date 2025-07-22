import Upsert from '@components/car-park/store-whitelist/upsert'
import withGenericServer from '@hocs/server/generic'
import { storeWhitelistService } from '@src/services/carpark-config/store-whitelist'
import { StoreWhitelistType } from '@src/types/car-park/carpark.store-whitelist'
import { PropertiesResponse } from 'ob-parking-sdk/dist/api'

export default function EditWhitelistDetailPage({
  data,
  property,
}: {
  data: StoreWhitelistType
  property: PropertiesResponse[]
}) {
  // eslint-disable-next-line unused-imports/no-unused-vars-ts
  const {
    id: storeId,
    // eslint-disable-next-line unused-imports/no-unused-vars-ts
    createdAt,
    // eslint-disable-next-line unused-imports/no-unused-vars-ts
    updatedAt,
    property: propertyData,
    ...restInitialData
  } = data
  const initialData = { ...restInitialData, propertyId: propertyData.id }
  return (
    <Upsert
      id={storeId}
      type='update'
      initialData={initialData}
      property={property}
    />
  )
}

EditWhitelistDetailPage.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const query = ctx.props.query || {}
    const id = query.id || ''
    const whitelistResponse = await storeWhitelistService.getStoreWhitelist(id)
    const propertyResponse = await storeWhitelistService.getPropertyIndex()

    let data = whitelistResponse || null
    let property = propertyResponse || null
    ctx.props = { ...ctx.props, data, property }
    return ctx
  },
  {
    redirectPath: '/car-park/store-whitelists',
  }
)
