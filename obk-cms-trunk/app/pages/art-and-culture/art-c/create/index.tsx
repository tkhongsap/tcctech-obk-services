import withGenericServer from '@hocs/server/generic'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'

const ArtCUpsert = dynamic(
  () => import('@components/art-and-culture/art-c/art-c-upsert'),
  { ssr: false }
)

export default function ArtCultureArtCCreate() {
  const { setMenuName } = useLayoutContext()

  useEffect(() => {
    setMenuName(`Create Art & Culture Category`)
  }, [])

  return (
    <>
      <ArtCUpsert type='create' />
    </>
  )
}

ArtCultureArtCCreate.activePrime = true
export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }
  return ctx
}, {})
