import AddOnUpsert from '@components/art-and-culture/add-on/add-on-upsert'
import withGenericServer from '@hocs/server/generic'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { artCAddOnServices } from '@src/services/art-and-culture/art-c-add-on-service'
import { IAddOnItem } from '@src/services/art-and-culture/model'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function ArtCultureAddOnEditPage() {
  const router = useRouter()
  const { query } = router
  const { id } = query

  const { setMenuName } = useLayoutContext()
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState<IAddOnItem | null>(null)

  useEffect(() => {
    setMenuName(`Edit Add-On`)
  }, [setMenuName])

  const fetchContent = async () => {
    if (!id) router.push('/art-and-culture/add-on')
    setIsLoading(true)

    await artCAddOnServices
      .get(`${id}`, 'all')
      .then((res) => {
        const { data } = res.data
        setContent(data)
      })
      .catch(() => {
        alert("Something went wrong, can't fetch content.")
        router.push('/art-and-culture/add-on')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchContent()
  }, [])

  return (
    <>{!isLoading && content && <AddOnUpsert type='update' item={content} />}</>
  )
}

ArtCultureAddOnEditPage.activePrime = true
export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }
  return ctx
}, {})
