import withGenericServer from '@hocs/server/generic'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { artCProgramServices } from '@src/services/art-and-culture/art-c-program-service'
import { IProgram } from '@src/services/art-and-culture/model'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const ProgramUpsert = dynamic(
  () => import('@components/art-and-culture/program/program-upsert'),
  { ssr: false }
)

export default function ArtCultureProgramEditPage() {
  const router = useRouter()
  const { query } = router
  const { id } = query

  const { setMenuName } = useLayoutContext()
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState<IProgram | null>(null)

  useEffect(() => {
    setMenuName('Edit Programs')
  }, [setMenuName])

  const fetchContent = async () => {
    if (!id) router.push('/art-and-culture/programs')
    setIsLoading(true)

    await artCProgramServices
      .get(`${id}`, 'all')
      .then((res) => {
        const { data } = res.data
        setContent(data)
      })
      .catch(() => {
        alert("Something went wrong, can't fetch content.")
        router.push('/art-and-culture/programs')
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
      {!isLoading && content && <ProgramUpsert type='update' item={content} />}
    </>
  )
}

ArtCultureProgramEditPage.activePrime = true
export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }
  return ctx
}, {})
