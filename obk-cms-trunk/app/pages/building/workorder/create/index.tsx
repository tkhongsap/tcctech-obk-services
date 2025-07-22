import LabelValue from '@components/forms/utils/label-field'
import {
  Box,
  HStack,
  SimpleGrid,
  Flex,
  Wrap,
  WrapItem,
  Grid,
  GridItem,
} from '@chakra-ui/react'

import withGenericServer from '@hocs/server/generic'
import SectionBlock from '@components/display/section-block'
import Heading from '@components/typography/heading'
import { InputText } from 'primereact/inputtext'
import { Menu } from 'primereact/menu'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { WorkRequestService } from '../../../../src/services/buildingservice/workrequest/DataServices'
import { Dialog } from 'primereact/dialog'
import router from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { StyledButton } from '@components/button/styledButton'
import { FileUpload } from 'primereact/fileupload'
import { headerTemplate } from '@components/file-upload/headerTemplate'
import {
  emptyTemplate,
  itemTemplate,
} from '@components/file-upload/bodyTemplate'
import { Badge } from 'primereact/badge'
import { FormController } from '@components/forms/components/form-controller'
import TextField from '@components/forms/components/text-field'
import DropdownField from '@components/forms/components/dropdown-field'
import TextAreaField from '@components/forms/components/text-area-field'

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

const defaultValues = {
  id: '000000123',
  workOrderType: '',
  createBy: 'Joe Sutti',
  location: '',
  serviceCategory: '',
  issue: '',
  priority: '',
  asset: '',
  errorCode: '',
  remedy: '',
  subject: '',
  orderReference: '',
  wordDescription: '',
  serviceProvider: '',
  superviser: '',
  coordinator: '',
  technician: '',
  supportiveTeam: '',
}

export default function CreateWorkOrder() {
  const [value, setValue] = useState('')
  const cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ]

  const columns: ColumnMeta[] = [{ field: 'name', header: 'Name' }]
  const fileUploadRef = useRef<FileUpload>(null)

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
          Work Order #000069
        </Box>
        <Box>
          <Wrap spacing={3}>
            <StyledButton bg='black' color='white'>
              Acknowledge
            </StyledButton>
            <StyledButton color='black' borderColor='black' variant='outline'>
              Close
            </StyledButton>
            <StyledButton color='black' borderColor='black' variant='outline'>
              Mark as Done
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
          <FormController
            defualtValue={defaultValues}
            onSubmit={(data) => console.log(data)}
          >
            <Box bg={'porcelain'}>
              <SectionBlock>
                <Wrap justify={'space-between'} mb={5}>
                  <Box>
                    <Heading as='h3' color='biscay'>
                      Work order details
                    </Heading>
                  </Box>
                  <Flex gap={5} alignItems='end'>
                    <LabelValue label='status'>
                      <Badge value={'New'} severity={'info'}></Badge>
                    </LabelValue>
                  </Flex>
                </Wrap>
                <SimpleGrid columns={2} spacingY='24px' spacingX='15px'>
                  <Box flex={1}>
                    <TextField
                      name='id'
                      disabled={true}
                      label='id'
                      rules={{ required: 'id is required.' }}
                    />
                  </Box>
                  <Box flex={1}>
                    <DropdownField
                      name='workOrderType'
                      label='Work Order Type'
                      placeholder='Please Select'
                      options={cities}
                      rules={{ required: 'Work Order Type is required.' }}
                    />
                  </Box>
                </SimpleGrid>
                <SimpleGrid columns={2} spacingX='15px' py='10px'>
                  <Box>
                    <TextField
                      name='createBy'
                      disabled={true}
                      label='Created By'
                      rules={{ required: 'Create By is required.' }}
                    />
                  </Box>
                  <Box>
                    <DropdownField
                      name='location'
                      label='Location'
                      placeholder='Please Select'
                      options={cities}
                      rules={{ required: 'Location is required.' }}
                    />
                  </Box>
                </SimpleGrid>
                <SimpleGrid columns={2} spacingX='15px' py='10px'>
                  <Box>
                    <DropdownField
                      name='serviceCategory'
                      label='Service Category'
                      placeholder='Please Select'
                      options={cities}
                      rules={{ required: 'Service Category is required.' }}
                    />
                  </Box>
                  <Box>
                    <DropdownField
                      name='issue'
                      label='Issue'
                      placeholder='Please Select'
                      options={cities}
                      rules={{ required: 'Issue is required.' }}
                    />
                  </Box>
                </SimpleGrid>
                <SimpleGrid columns={2} spacingX='15px' py='10px'>
                  <Box>
                    <DropdownField
                      name='priority'
                      label='Priority'
                      placeholder='Please Select'
                      options={cities}
                      rules={{ required: 'Priority is required.' }}
                    />
                  </Box>
                  <Box>
                    <DropdownField
                      name='asset'
                      label='Asset'
                      placeholder='Please Select'
                      options={cities}
                      rules={{ required: 'Asset is required.' }}
                    />
                  </Box>
                </SimpleGrid>
                <SimpleGrid spacingX='15px' py='10px'>
                  <DropdownField
                    name='errorCode'
                    label='Error Code'
                    placeholder='Please Select'
                    options={cities}
                    rules={{ required: 'Error Code is required.' }}
                  />
                </SimpleGrid>
                <SimpleGrid py='10px'>
                  <Box>
                    <TextField
                      name='remedy'
                      label='Remedy'
                      rules={{ required: 'Remedy is required.' }}
                    />
                  </Box>
                </SimpleGrid>
                <SimpleGrid columns={2} spacingX='15px' py='10px'>
                  <Box>
                    <TextField
                      name='subject'
                      label='Subject'
                      rules={{ required: 'Subject is required.' }}
                    />
                  </Box>
                  <Box>
                    <TextField
                      name='orderReference'
                      label='Order Reference'
                      rules={{ required: 'Order Reference is required.' }}
                    />
                  </Box>
                </SimpleGrid>
                <SimpleGrid py='10px'>
                  <Box>
                    <TextAreaField
                      name='orderReference'
                      label='Work Description'
                      rows={5}
                      rules={{ required: 'Work Description is required.' }}
                    />
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

            <Wrap my='20px' flexWrap='wrap'>
              <Box flex={1}>
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
                  <Box py='15px'>
                    <Box flex={1}>
                      <DropdownField
                        name='serviceProvider'
                        label='Service Provider'
                        placeholder='Please Select'
                        options={cities}
                        rules={{ required: 'Service Provider is required.' }}
                      />
                    </Box>
                    <SimpleGrid columns={2} spacingX='15px' py='10px'>
                      <Box>
                        <DropdownField
                          name='superviser'
                          label='Superviser'
                          placeholder='Please Select'
                          options={cities}
                          rules={{ required: 'Superviser is required.' }}
                        />
                      </Box>
                      <Box>
                        <DropdownField
                          name='coordinator'
                          label='Coordinator'
                          placeholder='Please Select'
                          options={cities}
                          rules={{ required: 'Coordinator is required.' }}
                        />
                      </Box>
                    </SimpleGrid>
                    <SimpleGrid columns={2} spacingX='15px' py='10px'>
                      <Box>
                        <DropdownField
                          name='technician'
                          label='Technician'
                          placeholder='Please Select'
                          options={cities}
                          rules={{ required: 'Technician is required.' }}
                        />
                      </Box>
                      <Box>
                        <DropdownField
                          name='supportiveTeam'
                          label='Supportive team'
                          placeholder='Please Select'
                          options={cities}
                          rules={{ required: 'Supportive team is required.' }}
                        />
                      </Box>
                    </SimpleGrid>
                  </Box>
                </SectionBlock>
              </Box>
            </Wrap>

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
          </FormController>
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
    redirectPath: '/users/all',
  }
)
