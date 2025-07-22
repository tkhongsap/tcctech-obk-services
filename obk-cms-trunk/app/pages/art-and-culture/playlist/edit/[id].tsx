import PlaylistUpsert from '@components/art-and-culture/playlist/playlist-upsert'
import withGenericServer from '@hocs/server/generic'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { artCPlaylistServices } from '@src/services/art-and-culture/art-c-playlist-services'
import { IPlaylist } from '@src/services/art-and-culture/model'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export default function ArtCulturePlaylistEdit() {
  const router = useRouter()
  const { query } = router
  const { id } = query

  const { setMenuName } = useLayoutContext()
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState<IPlaylist | null>(null)

  useEffect(() => {
    setMenuName('Edit Playlist')
  }, [setMenuName])

  const fetchContent = async () => {
    if (!id) router.push('/art-and-culture/playlist')
    setIsLoading(true)

    await artCPlaylistServices
      .get(`${id}`, 'all')
      .then((res) => {
        const { data } = res.data
        setContent(data)
      })
      .catch(() => {
        alert("Something went wrong, can't fetch content.")
        router.push('/art-and-culture/playlist')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchContent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {!isLoading && content && (
        <PlaylistUpsert type='update' playlistItem={content} />
      )}
    </>
  )
}

ArtCulturePlaylistEdit.activePrime = true
export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }
  return ctx
}, {})
