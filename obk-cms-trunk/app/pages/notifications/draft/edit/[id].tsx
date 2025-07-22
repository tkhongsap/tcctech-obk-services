import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'

export default function NotificationDraft() {
  return <></>
}

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/users/all',
    accessPage: PCODE.EDITDRAFT,
  }
)
