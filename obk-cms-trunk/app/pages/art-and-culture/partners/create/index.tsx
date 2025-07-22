import PartnerUpsert from '@components/art-and-culture/partner/partner-upsert'
import withGenericServer from '@hocs/server/generic'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { useEffect } from 'react'

export default function ArtCulturePartnerCreate() {
  const { setMenuName } = useLayoutContext()

  useEffect(() => {
    setMenuName('Create Partner')
  }, [setMenuName])

  return (
    <>
      <PartnerUpsert type='create'></PartnerUpsert>
    </>
  )
}

ArtCulturePartnerCreate.activePrime = true
export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }

  return ctx
}, {})
