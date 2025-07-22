import FaqUpsert from '@components/art-and-culture/faq/faq-upsert'
import withGenericServer from '@hocs/server/generic'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { useEffect } from 'react'

export default function ArtCultureFaqCreate() {
  const { setMenuName } = useLayoutContext()

  useEffect(() => {
    setMenuName('Create Faq')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <FaqUpsert type='create'></FaqUpsert>
    </>
  )
}

ArtCultureFaqCreate.activePrime = true
export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }

  return ctx
}, {})
