import React, { useEffect, useState } from 'react'
import LabelValue from '@components/forms/utils/label-field'

import Heading from '@components/typography/heading'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { WorkRequestService } from '@src/services/buildingservice/workrequest/DataServices'
import { Button } from 'primereact/button'
import { Panel } from 'primereact/panel'
import { ScrollPanel } from 'primereact/scrollpanel'
import { Tag } from 'primereact/tag'
import { FormController } from '@components/forms/components/form-controller'
import { IWorkRequest } from '@src/services/buildingservice/workrequest/model'
import TextField from '@components/forms/components/text-field'
import CalendarField from '@components/forms/components/calendar-field'
import TextAreaField from '@components/forms/components/text-area-field'
import DropdownField from '@components/forms/components/dropdown-field'
import withGenericServer from '@hocs/server/generic'

type Props = {
  workReqeust: IWorkRequest
}

export default function WorkRequestShow({ workReqeust }: Props) {
  type WRequest = {
    id?: string
    name?: string
  }

  type ColumnMeta = {
    field: string
    header: string
  }

  const columns: ColumnMeta[] = [{ field: 'name', header: 'Name' }]

  const [wrequests, setWrequests] = useState<WRequest[]>([])
  const [selectedWrequests, setSelectedWrequests] = useState<WRequest | null>(
    null
  )

  useEffect(() => {
    WorkRequestService.getWRequestMini().then((data) => setWrequests(data))
  }, [])

  const dynamicColumns = columns.map((col, i) => {
    return <Column key={i} field={col.field} header={col.header} />
  })
  return (
    <>
      <div className='flex flex-column lg:flex-row justify-content-end w-full mb-5'>
        <div className='flex'>
          <div className='mx-1'>
            <Button
              className='bg-gray-900 border-gray-900 text-gray-50'
              label='Create a work order'
            />
          </div>
          <div className='mx-1'>
            <Button
              className='bg-gray-50 border-gray-900 text-gray-600'
              label='Close this feedback'
            />
          </div>
          <div className='mx-1'>
            <Button
              className='bg-gray-50 border-gray-900 text-gray-600'
              label='Done'
            />
          </div>
        </div>
      </div>
      <div className='grid'>
        <div className='col-12 md:col-6 lg:col-2'>
          <div>
            <a href=''>Request Details</a>
            <div>
              <a href=''>Task</a>{' '}
            </div>
            <div>
              <a href=''>Files</a>
            </div>
            <div>
              <a href=''>Link To WO/WR</a>
            </div>
            <div>
              <a href=''>Rating</a>
            </div>
            <div>
              <a href=''>Ticket note</a>
            </div>
          </div>
        </div>
        <div className='col-12 md:col-6 lg:col-7'>
          <div className='card'>
            <Heading as='h3' color='biscay'>
              Request Details
            </Heading>
            <FormController defualtValue={workReqeust} onSubmit={() => {}}>
              <div className='grid'>
                <div className='col-12 md:col-6'>
                  <TextField name='authorName' disabled label='Requested by' />
                </div>
                <div className='col-12 md:col-6'>
                  <CalendarField
                    label='Created date'
                    name='datetime'
                    disabled
                  />
                </div>
                <div className='col-12'>
                  <TextField
                    name='issue'
                    disabled
                    label='Work Requested Title'
                  />
                </div>
                <div className='col-12'>
                  <TextAreaField
                    name='description'
                    disabled
                    label='Work Requested Description'
                    rows={5}
                  />
                </div>
                <div className='col-12 md:col-4'>
                  <DropdownField
                    name='location'
                    label='Location'
                    placeholder='Please Select'
                    options={[]}
                    disabled
                  />
                </div>
                <div className='col-12 md:col-4'>
                  <DropdownField
                    name='floor'
                    label='Floor'
                    placeholder='Please Select'
                    options={[]}
                    disabled
                  />
                </div>
                <div className='col-12 md:col-4'>
                  <DropdownField
                    name='zone'
                    label='Zone'
                    placeholder='Please Select'
                    options={[]}
                    disabled
                  />
                </div>
                <div className='col-12'>
                  <DropdownField
                    name='category'
                    label='Service Category'
                    placeholder='Please Select'
                    options={[]}
                    disabled
                  />
                </div>
                <div className='col-12'>
                  <DropdownField
                    name='issue'
                    label='Issue'
                    placeholder='Please Select'
                    options={[]}
                    disabled
                  />
                </div>
                <div className='col-6'>
                  <DropdownField
                    name='priority'
                    label='Priority'
                    placeholder='Please Select'
                    options={[]}
                    disabled
                  />
                </div>
                <div className='col-6'>
                  <DropdownField
                    name='asset'
                    label='Asset'
                    placeholder='Please Select'
                    options={[]}
                    disabled
                  />
                </div>
              </div>
            </FormController>
          </div>
          <div className='grid'>
            <div className='col-6'>
              <div className='card'>
                <div className='col-12'>
                  <div className='flex flex-column lg:flex-row justify-content-end w-full mb-5'>
                    <div className='flex justify-content-start'>
                      <Heading as='h3' color='biscay'>
                        Tasks
                      </Heading>
                    </div>
                    <div className='flex'>
                      <div className='mx-1'>
                        <Button
                          className='bg-gray-50 border-gray-900 text-gray-600'
                          label='Delete Tasks'
                        />
                      </div>
                      <div className='mx-1'>
                        <Button
                          className='bg-gray-900 border-gray-900 text-gray-50'
                          label='Add Task '
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-12'>
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
                </div>
              </div>
            </div>
            <div className='col-6'>
              <div className='card'>
                <div className='col-12'>
                  <div className='flex flex-column lg:flex-row justify-content-end w-full mb-5'>
                    <div className='flex'>
                      <Heading as='h3' color='biscay'>
                        Files
                      </Heading>
                    </div>
                    <div className='flex'>
                      <div className='mx-1'>
                        <Button
                          className='bg-gray-50 border-gray-900 text-gray-600'
                          label='Delete Tasks'
                        />
                      </div>
                      <div className='mx-1'>
                        <Button
                          className='bg-gray-900 border-gray-900 text-gray-50'
                          label='Add Task '
                        />
                      </div>
                    </div>
                  </div>
                </div>
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
              </div>
            </div>
          </div>
          <div className='grid'>
            <div className='col-6'>
              <div className='card'>
                <div className='col-12'>
                  <div className='flex flex-column lg:flex-row justify-content-end w-full mb-5'>
                    <div className='flex justify-content-start'>
                      <Heading as='h3' color='biscay'>
                        Rating
                      </Heading>
                    </div>
                    <div className='flex'>
                      <div className='mx-1'>
                        <Button
                          className='bg-gray-900 border-gray-900 text-gray-50'
                          label='Refresh'
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-12'>
                  <div className='col-12'></div>
                </div>
              </div>
            </div>
            <div className='col-6'>
              <div className='card'>
                <div className='col-12'>
                  <div className='flex flex-column lg:flex-row justify-content-end w-full mb-5'>
                    <div className='flex'>
                      <Heading as='h3' color='biscay'>
                        Ticket Note
                      </Heading>
                    </div>
                    <div className='flex'>
                      <div className='mx-1'>
                        <Button
                          className='bg-gray-900 border-gray-900 text-gray-50'
                          label='Update'
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-12'>
                  <LabelValue label='Root Cause'>
                    <InputText
                      className='w-full'
                      value="It could be the result of the sun's radiation"
                      disabled
                    ></InputText>
                  </LabelValue>
                </div>
                <div className='col-12'>
                  <LabelValue label='Root Cause'>
                    <InputText
                      className='w-full'
                      value="It could be the result of the sun's radiation"
                      disabled
                    ></InputText>
                  </LabelValue>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-12 md:col-6 lg:col-3'>
          <Panel header='Conversation'>
            <ScrollPanel
              style={{ width: '100%', height: '400px' }}
              className='mb-5'
            >
              <div className='mb-3'>
                <div className='mb-1'>
                  <Tag value='OP'></Tag> <b>Zoe Maxwell</b> <b>11:58 PM</b>
                </div>
                <div>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Laborum cumque quae esse. Sapiente natus enim accusantium amet
                  quis, expedita sit dicta aperiam iusto quisquam quibusdam
                  omnis, eos beatae, deserunt inventore?
                </div>
              </div>
              <div className='mb-3'>
                <div className='mb-1'>
                  <Tag value='OP'></Tag> <b>Zoe Maxwell</b> <b>11:58 PM</b>
                </div>
                <div>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Laborum cumque quae esse. Sapiente natus enim accusantium amet
                  quis, expedita sit dicta aperiam iusto quisquam quibusdam
                  omnis, eos beatae, deserunt inventore?
                </div>
              </div>
              <div className='mb-3'>
                <div className='mb-1'>
                  {' '}
                  <Tag value='OP'></Tag> <b>Zoe Maxwell</b> <b>11:58 PM</b>
                </div>
                <div>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Laborum cumque quae esse. Sapiente natus enim accusantium amet
                  quis, expedita sit dicta aperiam iusto quisquam quibusdam
                  omnis, eos beatae, deserunt inventore?
                </div>
              </div>
            </ScrollPanel>
            <div>
              <InputTextarea autoResize rows={5} cols={30} className='w-full' />
              <Button
                className='bg-gray-900 border-gray-900 text-gray-50 w-full'
                label='Send'
              />
            </div>
          </Panel>
        </div>
      </div>
    </>
  )
}
export const getServerSideProps = withGenericServer(async (ctx: any) => {
  return ctx
})
