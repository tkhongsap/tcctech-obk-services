import AddOnUpsert from '@components/art-and-culture/add-on/add-on-upsert'
import withGenericServer from '@hocs/server/generic'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import React, { useEffect } from 'react'

export default function ArtCultureAddOnCreatePage() {
  const { setMenuName } = useLayoutContext()

  useEffect(() => {
    setMenuName(`Create Add-On`)
  }, [setMenuName])

  return (
    <>
      <AddOnUpsert type='create' />
    </>
  )
}

ArtCultureAddOnCreatePage.activePrime = true
export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }
  return ctx
}, {})
