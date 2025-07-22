import React from 'react'
import { Box } from '@chakra-ui/react'
import withGenericServer from '@hocs/server/generic'

export default function Request() {
  return <Box>Request</Box>
}

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    return ctx
  },
  {
    redirectPath: '/building/workrequest/request',
  }
)
