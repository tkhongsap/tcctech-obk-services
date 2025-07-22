import { MemberUpsert } from '@components/role/member/member-upsert'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import {
  IMemberUpsertModel,
  MemberUpsertModel,
} from '@src/services/member/model'
import { memberService } from '@src/services/member/service'
import { IRole } from '@src/services/role/model'
import { roleService } from '@src/services/role/service'

type Props = {
  role: IRole[]
  data: IMemberUpsertModel
  csid: string
}

export default function EditMember(props: Props) {
  return <MemberUpsert role={props.role} data={props.data} csid={props.csid} />
}

EditMember.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const roleRes = await roleService.getRoles()
    const role = roleRes.data.data
    const { id } = ctx.props.query

    var member = await memberService.get(id)

    let data: MemberUpsertModel = {
      email: member.data.email,
      mid: id,
      name: member.data.name,
      roleItem: member.data.roles.map((r: any) => r.rid),
      status: member.data.status,
      keyCloakUserId: member.data.keyCloakUserId,
    }

    ctx.props = { ...ctx.props, role, data }

    return ctx
  },
  {},
  {
    redirectPath: '/roles/member',
    accessPage: PCODE.INVITEANDEDITMEMBER,
  }
)
