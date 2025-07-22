import React from 'react'
import { ColumnDef, flexRender } from '@tanstack/react-table'

import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Box,
  VStack,
  HStack,
} from '@chakra-ui/react'
import SvgTriangle from '@assets/svg/triangle.svg'
import styled, { css } from 'styled-components'

const SortIconBase = styled(SvgTriangle)`
  ${(props) =>
    props.active === 'y' &&
    css`
      path {
        fill: ${(props: any) => props.theme.colors.bayofMany};
      }
    `}
`
const SortIconDesc = styled(SortIconBase)`
  transform: rotate(180deg);
`

interface ListTableProps {
  columns?: ColumnDef<any>[]
  tableProps: any
}

export default function ListTable(props: ListTableProps) {
  const { tableProps } = props
  const { getHeaderGroups, getRowModel, setOptions } = tableProps

  setOptions((prev: any) => ({
    ...prev,
    meta: {
      ...prev.meta,
    },
  }))

  return (
    <TableContainer
      color='kimberly'
      fontSize='14px'
      fontWeight={500}
      lineHeight='24px'
    >
      <Table>
        <Thead>
          {getHeaderGroups().map((headerGroup: any) => {
            return (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => {
                  const className = header?.column?.columnDef?.className
                  const sortable = !!header?.column?.columnDef?.sortable

                  const toggleSorting = () => {
                    if (sortable) return header.column.getToggleSortingHandler()
                  }
                  const sortOrder = header.column.getIsSorted()

                  return (
                    <Th
                      key={header.id}
                      className={className}
                      color='astronaut'
                      fontWeight={500}
                      cursor={sortable ? 'pointer' : 'default'}
                      onClick={toggleSorting()}
                    >
                      <HStack alignItems='center'>
                        <Box>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </Box>
                        {sortable && (
                          <VStack spacing='1px' pl='5px'>
                            <Box>
                              <SortIconBase
                                active={sortOrder === 'asc' ? 'y' : 'n'}
                              />
                            </Box>
                            <Box>
                              <SortIconDesc
                                active={sortOrder === 'desc' ? 'y' : 'n'}
                              />
                            </Box>
                          </VStack>
                        )}
                      </HStack>
                    </Th>
                  )
                })}
              </Tr>
            )
          })}
        </Thead>
        <Tbody fontWeight={700}>
          {getRowModel().rows.map((row: any) => (
            <Tr
              key={row.id}
              bg='porcelain'
              _hover={{ bg: 'selago', color: 'astronaut' }}
            >
              {row.getVisibleCells().map((cell: any) => {
                const className = cell?.column?.columnDef?.className || ''
                return (
                  <Td key={cell.id} className={className} border='none'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                )
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
