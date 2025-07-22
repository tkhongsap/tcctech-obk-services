import React, { useEffect, useRef, useState } from 'react'
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
  Grid,
  GridItem,
  VStack,
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
import { WorkRequestService } from '../../../../src/services/buildingservice/workrequest/DataServices'
import { Dialog } from 'primereact/dialog'
import router from 'next/router'
import { Tag } from 'primereact/tag'
import { FileUpload } from 'primereact/fileupload'
import { headerTemplate } from '@components/file-upload/headerTemplate'
import {
  emptyTemplate,
  itemTemplate,
} from '@components/file-upload/bodyTemplate'

const StyledButton = styled(Button)`
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
`
const sideMenus = [
  { id: '1', label: 'Detail', url: '#Request' },
  { id: '2', label: 'Assignment', url: '#' },
  { id: '3', label: 'Link to WO', url: '#' },
  { id: '4', label: 'Task', url: '#' },
  { id: '5', label: 'Recent Activites', url: '#' },
]

type WRequest = {
  id?: string
  name?: string
}

type ColumnMeta = {
  field: string
  header: string
}

export default function WorkOrderShow() {
  const [value, setValue] = useState('')
  const [selectedCity, setSelectedCity] = useState(null)
  const cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ]

  const [selectedLocation, setSelectedLocation] = useState(null)
  const locations = [
    { name: 'Tower 1', code: 't1' },
    { name: 'Tower 2', code: 't2' },
    { name: 'Tower 3', code: 't3' },
    { name: 'Tower 4', code: 't4' },
    { name: 'Tower 5', code: 't5' },
    { name: 'Signature Tower', code: 'st' },
  ]

  const columns: ColumnMeta[] = [{ field: 'name', header: 'Name' }]
  const fileUploadRef = useRef<FileUpload>(null)

  const [wrequests, setWrequests] = useState<WRequest[]>([])
  const [selectedWrequests, setSelectedWrequests] = useState<WRequest | null>(
    null
  )
  const [visibleCloseModal, setVisibleCloseModal] = useState(false)
  const [markAsDoneModal, setmarkAsDoneModal] = useState(false)
  const [deleteTaskModal, setdeleteTaskModal] = useState(false)

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
          Work Order #000069
        </Box>
        <Box>
          <Wrap spacing={3}>
            <StyledButton bg='black' color='white'>
              Acknowledge
            </StyledButton>
            <StyledButton
              color='black'
              borderColor='black'
              variant='outline'
              onClick={() => setVisibleCloseModal(true)}
            >
              Close
            </StyledButton>
            <StyledButton
              color='black'
              borderColor='black'
              variant='outline'
              onClick={() => setmarkAsDoneModal(true)}
            >
              Mark as Done
            </StyledButton>
          </Wrap>
        </Box>
      </HStack>

      <Flex>
        {/* Sidebar */}
        <VStack justify='space-between' me={5}>
          <Menu model={sideMenus} />
          <Box my={10}>
            <StyledButton bg='black' color='white'>
              Update
            </StyledButton>
          </Box>
        </VStack>
        <Box flex={2} mb='60px'>
          <Box bg={'porcelain'}>
            <Box>
              <SectionBlock>
                <Wrap justify={'space-between'} mb={5}>
                  <Box>
                    <Heading as='h3' color='biscay'>
                      Work order details
                    </Heading>
                  </Box>
                  <Flex gap={5} alignItems='end'>
                    <LabelValue label='status'>
                      <Tag
                        severity='info'
                        value='New'
                        pt={{
                          root: { style: { padding: '5px 20px' } },
                        }}
                      ></Tag>
                    </LabelValue>
                  </Flex>
                </Wrap>
                <SimpleGrid columns={2} spacingY='24px' spacingX='15px'>
                  <Box flex={1}>
                    <LabelValue label='ID'>
                      <InputText
                        className='w-full'
                        value='000000123'
                        disabled
                      ></InputText>
                    </LabelValue>
                  </Box>
                  <Box flex={1}>
                    <LabelValue label='Work Order Type'>
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
                <SimpleGrid columns={2} spacingX='15px' py='10px'>
                  <Box>
                    <LabelValue label='Create By'>
                      <InputText
                        className='w-full'
                        disabled
                        value='Joe Sutti'
                      ></InputText>
                    </LabelValue>
                  </Box>
                  <Box>
                    <LabelValue label='Location'>
                      <Dropdown
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.value)}
                        options={locations}
                        optionLabel='name'
                        placeholder='Please Select'
                        className='w-full'
                      />
                    </LabelValue>
                  </Box>
                </SimpleGrid>
                <SimpleGrid columns={2} spacingX='15px' py='10px'>
                  <Box>
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
                  </Box>
                  <Box>
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
                  </Box>
                </SimpleGrid>
                <SimpleGrid columns={2} spacingX='15px' py='10px'>
                  <Box>
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
                  <Box>
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
                <SimpleGrid spacingX='15px' py='10px'>
                  <LabelValue label='Error Code'>
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
                  <Box>
                    <LabelValue label='Remedy'>
                      <InputTextarea
                        className='w-full'
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        rows={5}
                      />
                    </LabelValue>
                  </Box>
                </SimpleGrid>
                <SimpleGrid columns={2} spacingX='15px' py='10px'>
                  <Box>
                    <LabelValue label='Subject'>
                      <InputText className='w-full' value='0000069'></InputText>
                    </LabelValue>
                  </Box>
                  <Box>
                    <LabelValue label='Order Reference'>
                      <InputText className='w-full' value='0000069'></InputText>
                    </LabelValue>
                  </Box>
                </SimpleGrid>
                <SimpleGrid py='10px'>
                  <Box>
                    <LabelValue label='Work Description'>
                      <InputTextarea
                        className='w-full'
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        rows={5}
                      />
                    </LabelValue>
                  </Box>
                </SimpleGrid>
                <SimpleGrid>
                  <Box>
                    <LabelValue label='Upload materials'>
                      <FileUpload
                        ref={fileUploadRef}
                        multiple
                        accept='image/*'
                        maxFileSize={10485760}
                        headerTemplate={headerTemplate}
                        itemTemplate={itemTemplate}
                        emptyTemplate={emptyTemplate}
                      />
                    </LabelValue>
                  </Box>
                </SimpleGrid>
              </SectionBlock>
            </Box>
          </Box>

          <Box my='20px' flex={1}>
            <SectionBlock>
              <Wrap justify='space-between'>
                <Heading as='h3' color='biscay'>
                  Assignment
                </Heading>
                <Box>
                  <Wrap gap={5}>
                    <StyledButton bg='black' color='white'>
                      Assign
                    </StyledButton>
                    <StyledButton
                      color='black'
                      borderColor='black'
                      variant='outline'
                    >
                      Remove
                    </StyledButton>
                  </Wrap>
                </Box>
              </Wrap>
              <SimpleGrid spacingX='15px' py='10px'>
                <LabelValue label='Service Provider'>
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
              <SimpleGrid columns={2} spacingX='15px' py='10px'>
                <Box flex={1}>
                  <LabelValue label='Superviser'>
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
                  <LabelValue label='Coordinator'>
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
              <SimpleGrid columns={2} spacingX='15px' py='10px'>
                <Box flex={1}>
                  <LabelValue label='Technichan'>
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
                  <LabelValue label='Supportive team'>
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
              <Box py='15px'></Box>
            </SectionBlock>
          </Box>

          <Wrap my='20px' flexWrap='wrap'>
            <Flex flex={1} alignSelf='stretch'>
              <SectionBlock>
                <Wrap justify='space-between'>
                  <WrapItem>
                    <Heading as='h3' color='biscay'>
                      Link to Work orders
                    </Heading>
                  </WrapItem>
                  <WrapItem>
                    <Box>
                      <Wrap gap={5}>
                        <StyledButton
                          bg='black'
                          color='white'
                          onClick={() => setVisibleCloseModal(true)}
                        >
                          Add Work Request
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
                        onClick={() => setdeleteTaskModal(true)}
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
                    <Column rowReorder style={{ width: '3rem' }} />
                    <Column
                      selectionMode='multiple'
                      headerStyle={{ width: '3rem' }}
                    ></Column>
                    {dynamicColumns}
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
          </Wrap>

          <Wrap my='20px' flexWrap='wrap'>
            <Box flex={1}>
              <SectionBlock>
                <Wrap justify='space-between'>
                  <Heading as='h3' color='biscay'>
                    Recent activities
                  </Heading>
                  <Box></Box>
                </Wrap>
                <Box py='15px'>
                  {Array.apply(null, Array(4)).map((_, i) => (
                    <Grid
                      key={i}
                      className='border-bottom-2'
                      templateRows='repeat(2, 1fr)'
                      templateColumns='repeat(5, 1fr)'
                    >
                      <GridItem rowSpan={2}>
                        <i
                          className='pi pi-image mt-3 p-5'
                          style={{
                            fontSize: '5em',
                            backgroundColor: 'var(--surface-b)',
                            color: 'var(--surface-d)',
                          }}
                        ></i>
                      </GridItem>
                      <GridItem className='flex align-items-end' colSpan={4}>
                        Supervice Report Number has been updated
                      </GridItem>
                      <GridItem colSpan={4}>2020-05-01 06:05:46</GridItem>
                    </Grid>
                  ))}
                </Box>
              </SectionBlock>
            </Box>
          </Wrap>
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
        visible={markAsDoneModal}
        style={{ width: '500px' }}
        onHide={() => {
          setmarkAsDoneModal(false)
        }}
      >
        <Box>Are you sure you want to set #000069 mark as done</Box>
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
              onClick={() => setmarkAsDoneModal(false)}
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
          setmarkAsDoneModal(false)
        }}
      >
        <Box>Are you sure you want to Close work order #0000069</Box>
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
        visible={deleteTaskModal}
        style={{ width: '500px' }}
        onHide={() => {
          setdeleteTaskModal(false)
        }}
      >
        <Box>Are you sure you want to delete task?</Box>
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
              onClick={() => setdeleteTaskModal(false)}
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
    redirectPath: '/users/all',
  }
)
