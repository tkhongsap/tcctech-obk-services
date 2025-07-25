import { HeadlessCreateInferencer } from '@refinedev/inferencer/headless'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { authProvider } from 'src/authProvider'

export default function CategoryCreate() {
  return <HeadlessCreateInferencer />
}

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context)

  const translateProps = await serverSideTranslations(context.locale ?? 'en', [
    'common',
  ])

  if (!authenticated) {
    return {
      props: {
        ...translateProps,
      },
      redirect: {
        destination: `${redirectTo}?to=${encodeURIComponent('/categories')}`,
        permanent: false,
      },
    }
  }

  return {
    props: {
      ...translateProps,
    },
  }
}
