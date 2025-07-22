import { useRouter } from 'next/router'

import RootLayout from './layout'

import ConsentPage from '../Consent/ConsentPage'

import { LOGIN_ROUTE } from '@/src/config/route'

const HomePage = () => {
  const router = useRouter()
  const { query } = useRouter()

  return (
    <RootLayout>
      <ConsentPage
        onClick={() => router.push({ pathname: LOGIN_ROUTE, query })}
      />
    </RootLayout>
  )
}

export default HomePage
