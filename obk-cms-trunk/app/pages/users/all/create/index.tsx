import { HeadlessCreateInferencer } from '@refinedev/inferencer/headless'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'

export default function CreateUser() {
  return <HeadlessCreateInferencer />
}

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/roles/member',
    accessPage: PCODE.EDITUSERDETAILS,
  }
)
