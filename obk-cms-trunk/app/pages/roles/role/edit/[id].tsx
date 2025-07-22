import withGenericServer from '@hocs/server/generic'
import { RoleUpsert } from '@components/role/role/role-upsert'
import { IPrivilege, IRoleUpsertModel } from '@src/services/role/model'
import { roleService } from '@src/services/role/service'
import { PCODE } from '@src/data/constants/privilege'

type Props = {
  privileges: IPrivilege[]
  data: IRoleUpsertModel
}

export default function EditRole(props: Props) {
  return <RoleUpsert data={props.data} privileges={props.privileges} />
}
EditRole.activePrime = true
export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const { id } = ctx.props.query
    const res = await Promise.all([
      roleService.getPrivilege(),
      roleService.getRole(id),
    ])
    const privileges = res[0].data
    const data = res[1].data
    ctx.props = { ...ctx.props, privileges, data }
    return ctx
  },
  {
    redirectPath: '/roles/role',
    accessPage: PCODE.CREATEANDEDITNEWROLE,
  }
)
