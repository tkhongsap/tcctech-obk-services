import withGenericServer from '@hocs/server/generic'

export default function WorkRequestEdit() {
  return <></>
}

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    return ctx
  },
  {
    redirectPath: '/users/all',
  }
)
