import PlaylistUpsert from '@components/art-and-culture/playlist/playlist-upsert'
import withGenericServer from '@hocs/server/generic'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import React, { useEffect } from 'react'

export default function ArtCulturePlaylistCreate() {
  const { setMenuName } = useLayoutContext()

  useEffect(() => {
    setMenuName('Create Playlist')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <PlaylistUpsert type='create'></PlaylistUpsert>
    </>
  )
}

ArtCulturePlaylistCreate.activePrime = true
export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }

  return ctx
}, {})
