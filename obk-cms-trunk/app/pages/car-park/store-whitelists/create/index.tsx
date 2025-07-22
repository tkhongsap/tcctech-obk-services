import Upsert from '@components/car-park/store-whitelist/upsert'
import withGenericServer from '@hocs/server/generic'
import { storeWhitelistService } from '@src/services/carpark-config/store-whitelist'
import { PropertiesResponse } from 'ob-parking-sdk/dist/api'

export default function CreateWhitelistPage({
  property,
}: {
  property: PropertiesResponse[]
}) {
  return (
    <div className='tw-flex-1'>
      <div className='tw-pt-[42px]'>
        <Upsert
          id={null}
          type='create'
          initialData={null}
          property={property}
        />
      </div>
    </div>
  )
}

CreateWhitelistPage.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const propertyResponse = await storeWhitelistService.getPropertyIndex()
    let property = propertyResponse || null
    ctx.props = { ...ctx.props, property }
    return ctx
  },
  {
    redirectPath: '/car-park/store-whitelists',
  }
)
