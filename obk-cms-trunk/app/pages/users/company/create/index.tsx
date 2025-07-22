import { HeadlessCreateInferencer } from '@refinedev/inferencer/headless'
import withGenericServer from '@hocs/server/generic'

export default function BlogPostCreate() {
  return <HeadlessCreateInferencer />
}

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    return ctx
  },
  {
    redirectPath: '/users/company',
  }
)
