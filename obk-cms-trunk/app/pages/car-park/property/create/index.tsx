import Upsert from '@components/car-park/property/upsert'
import withGenericServer from '@hocs/server/generic'

export default function CreateMallNamePage() {
  return <Upsert id={null} type='create' initialData={null} />
}

CreateMallNamePage.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {
    redirectPath: '/car-park/property',
  }
)
