import { MemberUpsert } from '@components/role/member/member-upsert'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import { IRole } from '@src/services/role/model'
import { roleService } from '@src/services/role/service'

type Props = {
  role: IRole[]
  csid: string
}

export default function CreateMember(props: Props) {
  return <MemberUpsert role={props.role} csid={props.csid} />
}

CreateMember.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const roleRes = await roleService.getRoles()
    const role = roleRes.data.data
    ctx.props = { ...ctx.props, role }
    return ctx
  },
  {},
  {
    redirectPath: '/roles/member',
    accessPage: PCODE.INVITEANDEDITMEMBER,
  }
)
