import Upsert from '@components/car-park/document-type/upsert'
import withGenericServer from '@hocs/server/generic'
export default function CreateDocumentTypePage() {
  return <Upsert id={null} type='create' initialData={null} />
}

CreateDocumentTypePage.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {
    redirectPath: '/car-park/document-type',
  }
)
