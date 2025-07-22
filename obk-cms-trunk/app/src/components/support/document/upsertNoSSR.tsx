import dynamic from 'next/dynamic'

const UpsertNoSSR = dynamic(
  () => import('@components/support/document/upsert'),
  {
    ssr: false,
  }
)

export default UpsertNoSSR
