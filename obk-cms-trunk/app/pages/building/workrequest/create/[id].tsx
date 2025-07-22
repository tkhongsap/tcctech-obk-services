import React, { useEffect, useState } from 'react'
import LabelValue from '@components/forms/utils/label-field'
import styled from 'styled-components'
import {
  Box,
  HStack,
  SimpleGrid,
  Flex,
  Button,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'

import withGenericServer from '@hocs/server/generic'
import SectionBlock from '@components/display/section-block'
import Heading from '@components/typography/heading'
import { InputText } from 'primereact/inputtext'
import { Menu } from 'primereact/menu'
import { Dropdown } from 'primereact/dropdown'
import { InputTextarea } from 'primereact/inputtextarea'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { WorkRequestService } from '@src/services/buildingservice/workrequest/DataServices'
import { Dialog } from 'primereact/dialog'
import router from 'next/router'

const StyledButton = styled(Button)`
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
`
const sideMenus = [
  { id: '1', label: 'Request Details', url: '#Request' },
  { id: '2', label: 'Task', url: '#' },
  { id: '3', label: 'Files', url: '#' },
  { id: '4', label: 'Links to WO/WR', url: '#' },
  { id: '5', label: 'Rating', url: '#' },
  { id: '6', label: 'Ticket note', url: '#' },
]

type WRequest = {
  id?: string
  name?: string
}

type ColumnMeta = {
  field: string
  header: string
}

export default function FeedbackShow() {
  const [value, setValue] = useState('')
  const [selectedCity, setSelectedCity] = useState(null)
  const cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ]

  const columns: ColumnMeta[] = [{ field: 'name', header: 'Name' }]

  const [wrequests, setWrequests] = useState<WRequest[]>([])
  const [selectedWrequests, setSelectedWrequests] = useState<WRequest | null>(
    null
  )
  const [visibleCloseModal, setVisibleCloseModal] = useState(false)

  useEffect(() => {
    WorkRequestService.getWRequestMini().then((data) => setWrequests(data))
  }, [])

  const dynamicColumns = columns.map((col, i) => {
    return <Column key={i} field={col.field} header={col.header} />
  })

  const onMarkAsDoneClick = () => {
    router.push({
      pathname: '/building/workrequest',
    })
  }

  return (
    <>
      <HStack justify={'space-between'} mb={5} px={5}>
        <Box
          fontSize='34px'
          fontWeight='bold'
          lineHeight='42px'
          color='astronaut'
          alignItems='center'
        >
          Work Request #00001
        </Box>
        <Box>
          <Wrap spacing={3}>
            <StyledButton color='black' borderColor='black' variant='outline'>
              Reject as coordinator
            </StyledButton>
            <StyledButton bg='black' color='white'>
              Close Ticket
            </StyledButton>
            <StyledButton bg='black' color='white'>
              Acknowledge
            </StyledButton>
          </Wrap>
        </Box>
      </HStack>

      <Flex>
        {/* Sidebar */}
        <Box flex={0} bg='selago' me={5}>
          <Menu model={sideMenus} />
        </Box>
        <Box flex={2} mb='60px'>
          <Box bg={'porcelain'}>
            <Box>
              <SectionBlock>
                <Wrap justify={'space-between'} mb={5}>
                  <Box>
                    <Heading as='h3' color='biscay'>
                      Request Details
                    </Heading>
                  </Box>
                  <Flex gap={5} alignItems='end'>
                    <StyledButton bg='black' color='white' px={10} mb={1}>
                      Edit Detail
                    </StyledButton>
                    <LabelValue label='status'>
                      <InputText value='New' disabled></InputText>
                    </LabelValue>
                  </Flex>
                </Wrap>
                <SimpleGrid columns={2} spacingY='24px' spacingX='15px'>
                  <Box flex={1}>
                    <LabelValue label='Requested by'>
                      <InputText
                        className='w-full'
                        value='Cody Fisher'
                        disabled
                      ></InputText>
                    </LabelValue>
                  </Box>
                  <Box flex={1}>
                    <LabelValue label='Created date'>
                      <InputText
                        className='w-full'
                        value='2020-05-01 16:08:24'
                        disabled
                      ></InputText>
                    </LabelValue>
                  </Box>
                </SimpleGrid>
                <SimpleGrid py='10px'>
                  <Box>
                    <LabelValue label='Work Requested Title'>
                      <InputText className='w-full'></InputText>
                    </LabelValue>
                  </Box>
                </SimpleGrid>
                <SimpleGrid py='10px'>
                  <Box>
                    <LabelValue label='Work Requested Description'>
                      <InputTextarea
                        className='w-full'
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        rows={5}
                      />
                    </LabelValue>
                  </Box>
                </SimpleGrid>
                <SimpleGrid
                  columns={3}
                  spacingY='24px'
                  spacingX='15px'
                  py='10px'
                >
                  <LabelValue label='Location'>
                    <Dropdown
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.value)}
                      options={cities}
                      optionLabel='name'
                      placeholder='Please Select'
                      className='w-full'
                    />
                  </LabelValue>
                  <LabelValue label='Floor'>
                    <Dropdown
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.value)}
                      options={cities}
                      optionLabel='name'
                      placeholder='Please Select'
                      className='w-full'
                    />
                  </LabelValue>
                  <LabelValue label='Zone'>
                    <Dropdown
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.value)}
                      options={cities}
                      optionLabel='name'
                      placeholder='Please Select'
                      className='w-full'
                    />
                  </LabelValue>
                </SimpleGrid>
                <SimpleGrid py='10px'>
                  <LabelValue label='Service Category'>
                    <Dropdown
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.value)}
                      options={cities}
                      optionLabel='name'
                      placeholder='Please Select'
                      className='w-full'
                    />
                  </LabelValue>
                </SimpleGrid>
                <SimpleGrid py='10px'>
                  <LabelValue label='Issue'>
                    <Dropdown
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.value)}
                      options={cities}
                      optionLabel='name'
                      placeholder='Please Select'
                      className='w-full'
                    />
                  </LabelValue>
                </SimpleGrid>
                <SimpleGrid columns={2} spacingY='24px' spacingX='15px'>
                  <Box flex={1}>
                    <LabelValue label='Priority'>
                      <Dropdown
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.value)}
                        options={cities}
                        optionLabel='name'
                        placeholder='Please Select'
                        className='w-full'
                      />
                    </LabelValue>
                  </Box>
                  <Box flex={1}>
                    <LabelValue label='Asset'>
                      <Dropdown
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.value)}
                        options={cities}
                        optionLabel='name'
                        placeholder='Please Select'
                        className='w-full'
                      />
                    </LabelValue>
                  </Box>
                </SimpleGrid>
              </SectionBlock>
            </Box>
          </Box>

          <Wrap my='20px' flexWrap='wrap'>
            <Flex flex={1} alignSelf='stretch'>
              <SectionBlock>
                <Wrap justify='space-between'>
                  <Heading as='h3' color='biscay'>
                    Task
                  </Heading>
                  <Box>
                    <Wrap gap={5}>
                      <StyledButton
                        color='black'
                        borderColor='black'
                        variant='outline'
                        onClick={() => setVisibleCloseModal(true)}
                      >
                        Delete tasks
                      </StyledButton>
                      <StyledButton bg='black' color='white'>
                        Add task
                      </StyledButton>
                    </Wrap>
                  </Box>
                </Wrap>
                <Box py='15px'>
                  <DataTable
                    value={wrequests}
                    reorderableColumns
                    reorderableRows
                    onRowReorder={(e) => setWrequests(e.value)}
                    selection={selectedWrequests!}
                    onSelectionChange={(e) => setSelectedWrequests(e.value)}
                    dataKey='id'
                    tableStyle={{ minWidth: '10rem' }}
                  >
                    <Column
                      selectionMode='multiple'
                      headerStyle={{ width: '3rem' }}
                    ></Column>
                    {dynamicColumns}
                    <Column rowReorder style={{ width: '3rem' }} />
                  </DataTable>
                </Box>
                <Wrap gap={5}>
                  <Flex flex={1}>
                    <InputText
                      placeholder='Add task...'
                      className='w-full'
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                  </Flex>
                  <StyledButton bg='black' color='white'>
                    Submit
                  </StyledButton>
                </Wrap>
              </SectionBlock>
            </Flex>
            <Flex flex={1} alignSelf='stretch'>
              <SectionBlock>
                <Wrap justify='space-between'>
                  <WrapItem>
                    <Heading as='h3' color='biscay'>
                      Files
                    </Heading>
                  </WrapItem>
                  <WrapItem>
                    <Box>
                      <Wrap gap={5}>
                        <StyledButton
                          color='black'
                          borderColor='black'
                          variant='outline'
                          onClick={() => setVisibleCloseModal(true)}
                        >
                          Delete Files
                        </StyledButton>
                        <StyledButton bg='black' color='white'>
                          Upload File
                        </StyledButton>
                      </Wrap>
                    </Box>
                  </WrapItem>
                </Wrap>
                <Box py='15px'>
                  <DataTable
                    value={wrequests}
                    selection={selectedWrequests!}
                    onSelectionChange={(e) => setSelectedWrequests(e.value)}
                    dataKey='id'
                    tableStyle={{ minWidth: '10rem' }}
                  >
                    <Column
                      selectionMode='multiple'
                      headerStyle={{ width: '3rem' }}
                    ></Column>
                    {dynamicColumns}
                  </DataTable>
                </Box>
              </SectionBlock>
            </Flex>
          </Wrap>

          <Box flex={1}>
            <SectionBlock>
              <Wrap justify='space-between'>
                <Heading as='h3' color='biscay'>
                  Links to WR/WO
                </Heading>
                <Box>
                  <Wrap gap={5}>
                    <StyledButton
                      color='black'
                      borderColor='black'
                      variant='outline'
                    >
                      Delete Links
                    </StyledButton>
                    <StyledButton bg='black' color='white'>
                      App WR/WO
                    </StyledButton>
                  </Wrap>
                </Box>
              </Wrap>
              <Box py='15px'>
                <DataTable
                  value={wrequests}
                  selection={selectedWrequests!}
                  onSelectionChange={(e) => setSelectedWrequests(e.value)}
                  dataKey='id'
                  tableStyle={{ minWidth: '10rem' }}
                >
                  <Column
                    selectionMode='multiple'
                    headerStyle={{ width: '3rem' }}
                  ></Column>
                  {dynamicColumns}
                </DataTable>
              </Box>
            </SectionBlock>
          </Box>

          {/* 4 */}
          <HStack
            my={5}
            spacing={5}
            flexDirection={{ base: 'column', lg: 'row' }}
          >
            <Flex flex={1} alignSelf='stretch'>
              <SectionBlock>
                <Wrap justify='space-between'>
                  <Heading as='h3' color='biscay'>
                    Rating
                  </Heading>
                  <Box>
                    <Wrap gap={5}>
                      <StyledButton bg='black' color='white'>
                        Refresh
                      </StyledButton>
                    </Wrap>
                  </Box>
                </Wrap>
                <Box py='15px'></Box>
              </SectionBlock>
            </Flex>
            <Flex flex={1} alignSelf='stretch'>
              <SectionBlock>
                <Wrap justify='space-between'>
                  <WrapItem>
                    <Heading as='h3' color='biscay'>
                      Ticket note
                    </Heading>
                  </WrapItem>
                  <WrapItem>
                    <Box>
                      <Wrap gap={5}>
                        <StyledButton bg='black' color='white'>
                          Update
                        </StyledButton>
                      </Wrap>
                    </Box>
                  </WrapItem>
                </Wrap>
                <Flex direction='column' py='15px' gap={10}>
                  <Box>
                    <LabelValue label='Root Cause'>
                      <InputText className='w-full'></InputText>
                    </LabelValue>
                  </Box>
                  <Box>
                    <LabelValue label='Root Cause'>
                      <InputText className='w-full'></InputText>
                    </LabelValue>
                  </Box>
                </Flex>
              </SectionBlock>
            </Flex>
          </HStack>
          {/* 4 */}
        </Box>

        {/* Conversation */}
        <Box w='20%' h='100vh' bg='selago' mx='10px'>
          <SectionBlock>
            <Box flex={1}>
              <Heading as='h3' color='biscay'>
                Conversation
              </Heading>
            </Box>
          </SectionBlock>
        </Box>
      </Flex>

      <Dialog
        blockScroll={true}
        visible={visibleCloseModal}
        style={{ width: '500px' }}
        onHide={() => {
          setVisibleCloseModal(false)
        }}
      >
        <Box>Are you sure you want to delete selected file?</Box>
        <HStack spacing='24px' pt='15px'>
          <Box>
            <StyledButton bg='black' color='white' onClick={onMarkAsDoneClick}>
              Confirm
            </StyledButton>
          </Box>
          <Box>
            <StyledButton
              color='black'
              borderColor='black'
              variant='outline'
              onClick={() => setVisibleCloseModal(false)}
            >
              Cancel
            </StyledButton>
          </Box>
        </HStack>
      </Dialog>

      <Dialog
        blockScroll={true}
        visible={visibleCloseModal}
        style={{ width: '500px' }}
        onHide={() => {
          setVisibleCloseModal(false)
        }}
      >
        <Box>Are you sure you want to delete selected task?</Box>
        <HStack spacing='24px' pt='15px'>
          <Box>
            <StyledButton bg='black' color='white' onClick={onMarkAsDoneClick}>
              Confirm
            </StyledButton>
          </Box>
          <Box>
            <StyledButton
              color='black'
              borderColor='black'
              variant='outline'
              onClick={() => setVisibleCloseModal(false)}
            >
              Cancel
            </StyledButton>
          </Box>
        </HStack>
      </Dialog>
    </>
  )
}

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    return ctx
  },
  {
    redirectPath: 'building/workrequest',
  }
)
