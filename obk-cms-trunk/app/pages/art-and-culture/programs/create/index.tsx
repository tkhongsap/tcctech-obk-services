// import ProgramUpsert from '@components/art-and-culture/program/program-upsert'
import withGenericServer from '@hocs/server/generic'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'

const ProgramUpsert = dynamic(
  () => import('@components/art-and-culture/program/program-upsert'),
  { ssr: false }
)

export default function ArtCultureProgramCreatePage() {
  const { setMenuName } = useLayoutContext()

  useEffect(() => {
    setMenuName('Create Programs')
  }, [setMenuName])

  return (
    <>
      <ProgramUpsert type='create' />
    </>
  )
}

ArtCultureProgramCreatePage.activePrime = true
export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }
  return ctx
}, {})
