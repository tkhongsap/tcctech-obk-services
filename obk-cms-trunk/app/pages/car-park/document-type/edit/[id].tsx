import withGenericServer from '@hocs/server/generic'
import { documentTypeService } from '@src/services/carpark-config/document-type'
import Upsert from '@components/car-park/document-type/upsert'
import { ConfigDocsTypeResponse } from 'ob-parking-sdk/dist/api'

export default function EditDocumentTypePage({
  data,
}: {
  data: ConfigDocsTypeResponse
}) {
  return (
    <Upsert
      id={data.id}
      type='update'
      initialData={{ keyword: data.keyword, type: data.type }}
    />
  )
}

EditDocumentTypePage.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const query = ctx.props.query || {}
    const id = query.id || ''
    const response = await documentTypeService.getDocumentType(id)
    let data = response || null
    ctx.props = { ...ctx.props, data }
    return ctx
  },
  {
    redirectPath: '/car-park/mall-address',
  }
)
