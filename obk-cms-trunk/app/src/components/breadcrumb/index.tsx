import { useBreadcrumb } from '@refinedev/core'
import Link from 'next/link'
import map from 'lodash/map'
import { Box } from '@chakra-ui/react'
import styled from 'styled-components'
const SyledSeperator = styled(Box)`
  &: after {
    content: '/';
    display: inline;
    padding: 0 5px;
  }
`

export const Breadcrumb = () => {
  const { breadcrumbs } = useBreadcrumb()
  const list = map(breadcrumbs, (breadcrumb, key) => {
    return (
      <Box key={`breadcrumb-${breadcrumb.label}-${key}`} display='flex'>
        <SyledSeperator />
        {breadcrumb.href ? (
          <Link href={breadcrumb.href}>
            <Box>{breadcrumb.label}</Box>
          </Link>
        ) : (
          <Box>{breadcrumb.label}</Box>
        )}
      </Box>
    )
  })
  return (
    <Box
      fontSize='14px'
      fontWeight={500}
      lineHeight='24px'
      color='wildBlueYonder'
      display='flex'
      alignItems='center'
    >
      <Box>
        <Link href='/dashboard'>
          <Box>Dashboard</Box>
        </Link>
      </Box>

      {list}
    </Box>
  )
}
