import withGenericServer from '@hocs/server/generic'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'

const ArtCCategoryUpsert = dynamic(
  () => import('@components/art-and-culture/art-c/art-c-category-upsert'),
  { ssr: false }
)

export default function ArtCCategoryCreate() {
  const { setMenuName } = useLayoutContext()

  useEffect(() => {
    setMenuName(`Create Art & Culture Sub Category`)
  }, [])

  return (
    <>
      <ArtCCategoryUpsert type='create' />
    </>
  )
}

ArtCCategoryCreate.activePrime = true
export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }
  return ctx
}, {})
