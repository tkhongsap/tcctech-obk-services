import { useMemo } from 'react'
import { Box, HStack } from '@chakra-ui/react'
import Tag from '@components/tag'

import { useNavigation, useTranslate } from '@refinedev/core'
import { useTable } from '@refinedev/react-table'
import { ColumnDef } from '@tanstack/react-table'
import WithList from '@src/hocs/withList'
import { useState } from 'react'
import List from '@components/list'
import withGenericServer from '@hocs/server/generic'

export default WithList(function Company(props: any) {
  const { currentPage, setCurrentPage } = props
  const translate = useTranslate()
  const { edit, show } = useNavigation()
  const [filters, setFilters] = useState([]) as any

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'id',
        header: translate('blog_posts.fields.id'),
        sortable: true,
      },
      {
        id: 'title',
        accessorKey: 'title',
        header: translate('blog_posts.fields.title'),
        sortable: true,
      },
      {
        id: 'status',
        // accessorKey: 'content',
        header: 'status',
        cell: function render() {
          return (
            <Box>
              <HStack spacing={5} flexWrap='wrap'>
                <Tag color='#E0AF00'>
                  <Box px='8px'>Waiting for approval</Box>
                </Tag>
                <Tag color='#CD1A1A'>
                  <Box px='8px'>Rejected</Box>
                </Tag>
                <Tag color='#4318FF'>
                  <Box px='8px'>Approved (Sent)</Box>
                </Tag>
                <Tag color='#59B413'>
                  <Box px='8px'>Approved (Scheduled)</Box>
                </Tag>
              </HStack>
            </Box>
          )
        },
      },
      {
        id: 'createdAt',
        accessorKey: 'createdAt',
        header: translate('blog_posts.fields.createdAt'),
        cell: function render({ getValue }) {
          return new Date(getValue<any>()).toLocaleString(undefined, {
            timeZone: 'UTC',
          })
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
                  show('inapp_notification', getValue() as string)
                }}
              >
                {translate('buttons.show')}
              </button>
              <button
                onClick={() => {
                  edit('inapp_notification', getValue() as string)
                }}
              >
                {translate('buttons.edit')}
              </button>
            </div>
          )
        },
        className: 'col-sticky-end',
      },
    ],
    [translate, edit, show]
  )

  const tableProps = useTable({
    columns,
    refineCoreProps: {
      resource: 'blog_posts',
      filters: {
        permanent: filters,
      },
    },
  })

  const {
    refineCore: { setCurrent },
  } = tableProps

  const pageOnChange = (page: any) => {
    setCurrentPage(page)
    setCurrent(page)
  }

  const paginationProps = {
    currentPage,
    totalPage: 10,
    pageOnChange,
  }

  const onFilter = (items: any) => {
    setFilters(items)
  }

  return (
    <Box maxW='inherit' pb='60px'>
      <List
        paginationProps={paginationProps}
        onFilter={onFilter}
        tableProps={tableProps}
      />
    </Box>
  )
})

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    return ctx
  },
  {
    redirectPath: '/users/company',
  }
)
