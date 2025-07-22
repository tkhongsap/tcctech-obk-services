import { NavigateToResource } from '@refinedev/nextjs-router'

export default function Home() {
  return <NavigateToResource resource='account_info' />
}

Home.noLayout = true
