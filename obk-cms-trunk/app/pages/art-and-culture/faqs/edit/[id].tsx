import React, { useEffect, useState } from 'react'
import FaqUpsert from '@components/art-and-culture/faq/faq-upsert'
import withGenericServer from '@hocs/server/generic'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { IFaqItem } from '@src/services/art-and-culture/model'
import { useRouter } from 'next/router'
import { artCFaqsServices } from '@src/services/art-and-culture/art-c-faqs-services'

export default function ArtCultureFaqEdit() {
  const router = useRouter()
  const { query } = router
  const { id } = query

  const { setMenuName } = useLayoutContext()
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState<IFaqItem | null>(null)

  useEffect(() => {
    setMenuName('Edit Faq')
  }, [setMenuName])

  const fetchContent = async () => {
    if (!id) router.push('/art-and-culture/faqs')
    setIsLoading(true)

    await artCFaqsServices
      .get(`${id}`, 'all')
      .then((res) => {
        const { data } = res.data
        setContent(data)
      })
      .catch(() => {
        alert("Something went wrong, can't fetch content.")
        router.push('/art-and-culture/faqs')
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
        <FaqUpsert type='update' faqItem={content}></FaqUpsert>
      )}
    </>
  )
}

ArtCultureFaqEdit.activePrime = true
export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }
  return ctx
}, {})
