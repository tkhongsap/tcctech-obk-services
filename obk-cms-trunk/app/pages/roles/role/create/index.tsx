import { RoleUpsert } from '@components/role/role/role-upsert'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import { IPrivilege } from '@src/services/role/model'
import { roleService } from '@src/services/role/service'

type Props = {
  privileges: IPrivilege[]
}

export default function CreateRole(props: Props) {
  return <RoleUpsert privileges={props.privileges} />
}

CreateRole.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const privilegesRes = await roleService.getPrivilege()
    const privileges = privilegesRes.data
    ctx.props = { ...ctx.props, privileges }
    return ctx
  },
  {
    redirectPath: '/roles/role',
    accessPage: PCODE.CREATEANDEDITNEWROLE,
  }
)
