import { useEffect, useState } from 'react'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { useRouter } from 'next/router'
import { IArtCTypeItem } from '@src/services/art-and-culture/model'
import withGenericServer from '@hocs/server/generic'
import { artCServices } from '@src/services/art-and-culture/art-c-services'
import dynamic from 'next/dynamic'

const ArtCUpsert = dynamic(
  () => import('@components/art-and-culture/art-c/art-c-upsert'),
  { ssr: false }
)

export default function ArtCEditPages() {
  const router = useRouter()
  const { query } = router
  const { id } = query

  const { setMenuName } = useLayoutContext()
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState<IArtCTypeItem | null>(null)

  const fetchContent = async () => {
    if (!id) router.push('/art-and-culture/art-c')
    setIsLoading(true)

    await artCServices
      .get(`${id}`, 'all')
      .then((res) => {
        const { data } = res.data
        setContent(data)
      })
      .catch(() => {
        alert("Something went wrong, can't fetch content.")
        router.push('/art-and-culture/art-c')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setMenuName(`Edit Art & Culture Category`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchContent()
  }, [query])

  return (
    <>
      {!isLoading && content && (
        <ArtCUpsert type='update' artCTypeItem={content}></ArtCUpsert>
      )}
    </>
  )
}

ArtCEditPages.activePrime = true
export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }
  return ctx
}, {})
