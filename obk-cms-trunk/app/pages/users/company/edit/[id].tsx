import React from 'react'
import { useResource, useTranslate } from '@refinedev/core'
import Tag from '@components/tag'
import LabelValue from '@components/display/label-value'
import { Box, HStack, SimpleGrid, Button } from '@chakra-ui/react'

import GenericFilterPane from '@components/filter-pane/generic'
import { useTable } from '@refinedev/react-table'
import { ColumnDef } from '@tanstack/react-table'
import Table from '@components/list/table'
import StyledTitle from '@components/display/styled-title'
import StyledSubtitle from '@components/display/styled-subtitle'
import SectionBlock from '@components/display/section-block'
import StyledRemarks from '@components/display/styled-remark'
import { useRouter } from 'next/router'
import withGenericServer from '@hocs/server/generic'

export default function CompanyEdit() {
  const router = useRouter()
  const { id } = useResource()

  const translate = useTranslate()

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'id',
        header: translate('blog_posts.fields.id'),
        // className: 'col-sticky-start',
      },
      {
        id: 'firstName',
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        id: 'lastName',
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        id: 'email',
        accessorKey: 'email',
        header: 'Email',
      },
      {
        id: 'status',
        // accessorKey: 'content',
        header: 'status',
        cell: function render({}) {
          return (
            <Box>
              <HStack spacing={5} flexWrap='wrap'>
                <Tag color='#59B413'>
                  <Box px='8px'>Active</Box>
                </Tag>
                <Tag color='#CD1A1A'>
                  <Box px='8px'>Suspend</Box>
                </Tag>
              </HStack>
            </Box>
          )
        },
      },
      {
        id: 'actions',
        accessorKey: 'id',
        header: translate('table.actions'),
        cell: function render({ getValue }) {
          return (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '4px',
              }}
            >
              <button
                onClick={() => {
                  router.push(`/users/all/show/${getValue()}`)
                }}
              >
                View
              </button>
            </div>
          )
        },
        className: 'col-sticky-end',
      },
    ],
    [translate, router]
  )

  const tableProps = useTable({
    columns,
    refineCoreProps: {
      resource: 'users',
    },
  })

  const {
    refineCore: {
      tableQueryResult: { isLoading: tableIsLoading },
    },
  } = tableProps

  return (
    <Box maxW='inherit'>
      <Box
        fontSize='34px'
        fontWeight='bold'
        lineHeight='42px'
        color='astronaut'
      >
        Company information
      </Box>

      <Box py='60px'>
        <SectionBlock>
          <StyledTitle>Louis Vuitton</StyledTitle>
          <StyledRemarks
            pt='4px'
            fontSize='14px'
            lineHeight='24px'
            color='codGray'
          >
            Member since: 25 December 2022
          </StyledRemarks>
        </SectionBlock>

        <SectionBlock mt='24px'>
          <StyledSubtitle>Company information</StyledSubtitle>
          <SimpleGrid pt='32px' columns={2} spacing='32px'>
            <Box>
              <LabelValue label='Company ID'>000028</LabelValue>
            </Box>
            <Box>
              <LabelValue label='Company Name'>Louis Vuitton</LabelValue>
            </Box>
            <Box>
              <LabelValue label='Email'>manhhachkt08@gmail.com</LabelValue>
            </Box>
            <Box>
              <LabelValue label='Floor'>24-25</LabelValue>
            </Box>
            <Box>
              <LabelValue label='Contact person'>George Costanza</LabelValue>
            </Box>
            <Box>
              <LabelValue label='Status'>
                <Tag color='#59B413'>
                  <Box p='2px 8px'>Active</Box>
                </Tag>
              </LabelValue>
            </Box>
          </SimpleGrid>
        </SectionBlock>

        <SectionBlock mt='24px'>
          <Box>
            <HStack justifyContent='space-between'>
              <Box fontSize='24px' fontWeight={700} lineHeight='32px'>
                Employee list
              </Box>
              <Box>
                <GenericFilterPane />
                <Box>
                  <Button
                    bg='primaryBlue'
                    color='white'
                    onClick={() => {
                      router.push(`/users/company/create/${id}/employee`)
                    }}
                  >
                    Add new employee
                  </Button>
                </Box>
              </Box>
            </HStack>

            <Box>
              <Box maxH={{ _: '50vh', md: '80vh' }} overflow='auto' mt='38px'>
                {tableIsLoading ? (
                  'Loading...'
                ) : (
                  <Table columns={columns} tableProps={tableProps} />
                )}
              </Box>
            </Box>
          </Box>
        </SectionBlock>
      </Box>
    </Box>
  )
}

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    return ctx
  },
  {
    redirectPath: '/users/company',
  }
)
