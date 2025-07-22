import React, { useEffect, useState } from 'react'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { useRouter } from 'next/router'
import { IArtCCategoryItem } from '@src/services/art-and-culture/model'
import withGenericServer from '@hocs/server/generic'
import { artCCategoryServices } from '@src/services/art-and-culture/art-c-category-services'
import dynamic from 'next/dynamic'

const ArtCCategoryUpsert = dynamic(
  () => import('@components/art-and-culture/art-c/art-c-category-upsert'),
  { ssr: false }
)

export default function ArtCCategoryEditPages() {
  const router = useRouter()
  const { query } = router
  const { typeId, id } = query

  const { setMenuName } = useLayoutContext()
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState<IArtCCategoryItem | null>(null)

  const fetchContent = async () => {
    if (!typeId) router.push('/art-and-culture/art-c')
    if (!id) router.push(`/art-and-culture/art-c/category/${typeId}`)
    setIsLoading(true)

    await artCCategoryServices
      .get(`${typeId}`, `${id}`, 'all')
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
    setMenuName(`Edit Art & Culture Sub Category`)
  }, [setMenuName])

  useEffect(() => {
    fetchContent()
  }, [])

  return (
    <>
      {!isLoading && content && (
        <ArtCCategoryUpsert
          type='update'
          artCCategoryItem={content}
        ></ArtCCategoryUpsert>
      )}
    </>
  )
}

ArtCCategoryEditPages.activePrime = true
export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }
  return ctx
}, {})
