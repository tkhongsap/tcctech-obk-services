import React from 'react'
import { Box } from '@chakra-ui/react'
import withGenericServer from '@hocs/server/generic'

export default function Dashboard() {
  return <Box>Dashboard</Box>
}

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    return ctx
  },
  {
    redirectPath: '/dashboard',
  }
)
