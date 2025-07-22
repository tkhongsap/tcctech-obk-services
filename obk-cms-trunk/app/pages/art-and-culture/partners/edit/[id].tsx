import PartnerUpsert from '@components/art-and-culture/partner/partner-upsert'
import withGenericServer from '@hocs/server/generic'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { artCPartnerServices } from '@src/services/art-and-culture/art-c-partner-services'
import { IPartnerItem } from '@src/services/art-and-culture/model'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function ArtCulturePartnerEdit() {
  const router = useRouter()
  const { query } = router
  const { id } = query

  const { setMenuName } = useLayoutContext()
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState<IPartnerItem | null>(null)

  useEffect(() => {
    setMenuName('Edit Partner')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchContent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const fetchContent = async () => {
    if (!id) router.push('/art-and-culture/partners')
    setIsLoading(true)

    await artCPartnerServices
      .get(`${id}`, 'all')
      .then((res) => {
        const { data } = res.data
        setContent(data)
      })
      .catch(() => {
        alert("Something went wrong, can't fetch content.")
        router.push('/art-and-culture/partners')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <>
      {!isLoading && content && (
        <PartnerUpsert type='update' partnerItem={content}></PartnerUpsert>
      )}
    </>
  )
}

ArtCulturePartnerEdit.activePrime = true
export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }

  return ctx
}, {})
