import { HeadlessListInferencer } from '@refinedev/inferencer/headless'
import { GetServerSideProps } from 'next'
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
// import { authProvider } from 'src/authProvider'
import { accessControlProvider } from '../../src/accessControlProvider'

export default function CategoryList() {
  return <HeadlessListInferencer />
}

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  // const { authenticated, redirectTo } = await authProvider.check(context)

  // const translateProps = await serverSideTranslations(context.locale ?? 'en', [
  //   'common',
  // ])

  const { can } = await accessControlProvider.can({
    resource: 'categories',
    action: 'list',
  })

  if (!can) {
    context.res.statusCode = 403
    context.res.end()
  }

  return {
    props: {
      can,
    },
  }
}
