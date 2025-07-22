import { HStack, Stack, Box, Flex } from '@chakra-ui/react'
import Table from '@components/list/table'
import GenericFilterPane from '@components/filter-pane-workorder/generic'
import ListPagination from '@components/list/pagination'
import { useNavigation, useResource } from '@refinedev/core'
import SectionTitle from '@components/display/section-title'
import RoundedButton from '@components/button/rounded'

const TableList = (props: any) => {
  const { tableProps, onFilter, paginationProps, sectionTitle } = props
  const {
    refineCore: {
      tableQueryResult: { isLoading },
    },
  } = tableProps
  const resources = useResource()
  const title = sectionTitle || resources?.resource?.meta?.label
  const { create } = useNavigation()
  return (
    <Box>
      <Stack
        justifyContent='space-between'
        alignItems={{ md: 'flex-start' }}
        direction={{ _: 'column', md: 'row' }}
        flexWrap='wrap'
      >
        <SectionTitle>{title}</SectionTitle>
        <Stack
          spacing={{ _: '15px', lg: '34px' }}
          direction={{ _: 'column', md: 'row' }}
          alignItems={{ md: 'center' }}
          px={{ _: '15px', md: 0 }}
        >
          {resources?.resource?.create && (
            <RoundedButton
              onClick={() => create(resources?.identifier || '')}
              color='white'
              bg='codGray'
              hoverOpacity={1}
            >
              Create work order
            </RoundedButton>
          )}
        </Stack>
      </Stack>

      <Box mt={{ _: '20px', md: '60px' }}>
        <Box borderRadius={{ lg: 10 }} bg='white' p={{ _: '15px', lg: '30px' }}>
          <Box>
            <HStack justifyContent='space-between'>
              <Box fontSize='24px' fontWeight={700} lineHeight='32px'>
                List
              </Box>
              <Box position='sticky' top={0}>
                <GenericFilterPane onFilter={onFilter} />
              </Box>
            </HStack>
            <Box maxH={{ _: '50vh', md: '80vh' }} overflow='auto' mt='38px'>
              {isLoading ? (
                'Loading...'
              ) : (
                <Table columns={tableProps.columns} tableProps={tableProps} />
              )}
            </Box>
          </Box>
        </Box>

        <Flex
          pt='35px'
          justifyContent={{ _: 'center', md: 'flex-end' }}
          px={{ _: '15px', lg: 0 }}
        >
          <ListPagination {...paginationProps} />
        </Flex>
      </Box>
    </Box>
  )
}

export default TableList
