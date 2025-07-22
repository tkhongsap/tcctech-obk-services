import React, { useEffect, useRef, useState } from 'react'
import LabelValue from '@components/forms/utils/label-field'

import withGenericServer from '@hocs/server/generic'
import Heading from '@components/typography/heading'
import { InputText } from 'primereact/inputtext'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { WorkRequestService } from '../../../../src/services/buildingservice/workrequest/DataServices'
import { Dialog } from 'primereact/dialog'
import router from 'next/router'
import { FileUpload } from 'primereact/fileupload'
import { headerTemplate } from '@components/file-upload/headerTemplate'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { Button } from 'primereact/button'
import { FormController } from '@components/forms/components/form-controller'
import TextField from '@components/forms/components/text-field'
import DropdownField from '@components/forms/components/dropdown-field'
import TextAreaField from '@components/forms/components/text-area-field'
import { Tag } from 'primereact/tag'
import {
  emptyTemplate,
  itemTemplate,
} from '@components/file-upload/bodyTemplate'

type WRequest = {
  id?: string
  name?: string
}

type ColumnMeta = {
  field: string
  header: string
}

export default function WorkOrderShow() {
  const { setMenuName, setMenuAction } = useLayoutContext()
  const [value, setValue] = useState('')
  const cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ]

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
    setMenuName('Work Order #000069')
    setMenuAction(buttonAction)
    WorkRequestService.getWRequestMini().then((data) => setWrequests(data))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuName])

  const dynamicColumns = columns.map((col, i) => {
    return <Column key={i} field={col.field} header={col.header} />
  })

  const onMarkAsDoneClick = () => {
    router.push({
      pathname: '/building/workrequest',
    })
  }

  const buttonAction = (
    <div className='flex flex-column lg:flex-row justify-content-end w-full mb-5'>
      <div className='flex'>
        <div className='mx-1'>
          <Button
            className='bg-gray-900 border-gray-900 text-gray-50'
            label='Acknowledge'
            onClick={() => {
              setVisibleCloseModal(true)
            }}
          />
        </div>
        <div className='mx-1'>
          <Button
            className='bg-gray-50 border-gray-900 text-gray-600'
            label='Close'
            onClick={() => setmarkAsDoneModal(true)}
          />
        </div>
        <div className='mx-1'>
          <Button
            className='bg-gray-50 border-gray-900 text-gray-600'
            label='Mark as Done'
            onClick={() => setmarkAsDoneModal(true)}
          />
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div>
        <FormController defualtValue={{}} onSubmit={() => {}}>
          <div className='grid'>
            <div className='card col-12'>
              <div className='flex flex-column lg:flex-row justify-content-between w-full mb-5'>
                <div>
                  <Heading as='h3' color='biscay'>
                    Work order details
                  </Heading>
                </div>
                <div>
                  <LabelValue label='status'>
                    <Tag severity='info' value='New'></Tag>
                  </LabelValue>
                </div>
              </div>
              <div className='grid'>
                <div className='col-12 md:col-6'>
                  <TextField name='id' label='ID' disabled />
                </div>
                <div className='col-12 md:col-6'>
                  <DropdownField
                    name='id'
                    label='Work Order Type'
                    placeholder='Please Select'
                    disabled
                    options={cities}
                  />
                </div>
                <div className='col-12 md:col-6'>
                  <TextField name='createdBy' label='Create By' disabled />
                </div>
                <div className='col-12 md:col-6'>
                  <DropdownField
                    name='location'
                    label='Location'
                    placeholder='Please Select'
                    disabled
                    optionLabel='name'
                    optionValue='code'
                    options={locations}
                  />
                </div>
                <div className='col-12 md:col-6'>
                  <DropdownField
                    name='category'
                    label='Service Category'
                    placeholder='Please Select'
                    disabled
                    options={cities}
                  />
                </div>
                <div className='col-12 md:col-6'>
                  <DropdownField
                    name='issue'
                    label='Issue'
                    placeholder='Please Select'
                    disabled
                    options={cities}
                  />
                </div>
                <div className='col-12 md:col-6'>
                  <DropdownField
                    name='priority'
                    label='Priority'
                    placeholder='Please Select'
                    disabled
                    options={cities}
                  />
                </div>
                <div className='col-12 md:col-6'>
                  <DropdownField
                    name='asset'
                    label='Asset'
                    placeholder='Please Select'
                    disabled
                    options={cities}
                  />
                </div>
                <div className='col-12 md:col-6'>
                  <DropdownField
                    name='errorCode'
                    label='Error Code'
                    placeholder='Please Select'
                    disabled
                    options={cities}
                  />
                </div>
                <div className='col-12 md:col-6'>
                  <DropdownField
                    name='remedy'
                    label='Remedy'
                    placeholder='Please Select'
                    disabled
                    options={cities}
                  />
                </div>
                <div className='col-12 md:col-6'>
                  <TextField name='subject' label='Subject' disabled />
                </div>
                <div className='col-12 md:col-6'>
                  <TextField
                    name='orderReference'
                    label='Order Reference'
                    disabled
                  />
                </div>
                <div className='col-12'>
                  <TextAreaField
                    name='description'
                    label='Work Description'
                    disabled
                  />
                </div>
                <div className='col-12'>
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
                </div>
              </div>
            </div>

            <div className='card col-12'>
              <div className='flex justify-content-between'>
                <Heading as='h3' color='biscay'>
                  Assignment
                </Heading>
                <div className='flex gap-3'>
                  <Button
                    className='bg-gray-900 border-gray-900 text-gray-50'
                    label='Assign'
                  />
                  <Button
                    className='bg-gray-50 border-gray-900 text-gray-600'
                    label='Remove'
                  />
                </div>
              </div>
              <div className='grid'>
                <div className='col-12'>
                  <DropdownField
                    name='serviceProvider'
                    label='Service Provider'
                    placeholder='Please Select'
                    disabled
                    options={cities}
                  />
                </div>
                <div className='col-12 md:col-6'>
                  <DropdownField
                    name='superviser'
                    label='Superviser'
                    placeholder='Please Select'
                    disabled
                    options={cities}
                  />
                </div>
                <div className='col-12 md:col-6'>
                  <DropdownField
                    name='coordinator'
                    label='Coordinator'
                    placeholder='Please Select'
                    disabled
                    options={cities}
                  />
                </div>
                <div className='col-12 md:col-6'>
                  <DropdownField
                    name='technichan'
                    label='Technichan'
                    placeholder='Please Select'
                    disabled
                    options={cities}
                  />
                </div>
                <div className='col-12 md:col-6'>
                  <DropdownField
                    name='supportiveTeam'
                    label='Supportive team'
                    placeholder='Please Select'
                    disabled
                    options={cities}
                  />
                </div>
              </div>
            </div>

            <div className='col-12 flex gap-3 mb-3'>
              <div className='card w-full h-full'>
                <div className='flex justify-content-between'>
                  <Heading as='h3' color='biscay'>
                    Link to Work orders
                  </Heading>
                  <div className='flex gap-3'>
                    <Button
                      className='bg-gray-900 border-gray-900 text-gray-50'
                      label='Add Work Request'
                    />
                    <Button
                      className='bg-gray-50 border-gray-900 text-gray-600'
                      label='Remove'
                    />
                  </div>
                </div>
                <div>
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
              <div className='card w-full h-full'>
                <div className='flex justify-content-between'>
                  <Heading as='h3' color='biscay'>
                    Task
                  </Heading>
                  <div className='flex gap-3'>
                    <Button
                      className='bg-gray-900 border-gray-900 text-gray-50'
                      label='Delete tasks'
                    />
                    <Button
                      className='bg-gray-50 border-gray-900 text-gray-600'
                      label='Add task'
                    />
                  </div>
                </div>
                <div>
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
                </div>
                <div>
                  <InputText
                    placeholder='Add task...'
                    className='w-full'
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                  <Button
                    className='bg-gray-900 border-gray-900 text-gray-50'
                    label='Submit'
                  />
                </div>
              </div>
            </div>

            <div className='card col-12'>
              <div className='flex justify-content-between'>
                <Heading as='h3' color='biscay'>
                  Recent activities
                </Heading>
              </div>
              <div>
                {Array.apply(null, Array(4)).map((_, i) => (
                  <div key={i} className='grid border-bottom-2'>
                    <div className='col-2'>
                      <i
                        className='pi pi-image mt-3 p-5'
                        style={{
                          fontSize: '5em',
                          backgroundColor: 'var(--surface-b)',
                          color: 'var(--surface-d)',
                        }}
                      ></i>
                    </div>
                    <div className='col flex align-items-center'>
                      <div className=''>
                        <div className=''>
                          Supervice Report Number has been updated
                        </div>
                        <div>2020-05-01 06:05:46</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FormController>
      </div>

      <Dialog
        blockScroll={true}
        visible={markAsDoneModal}
        style={{ width: '500px' }}
        onHide={() => {
          setmarkAsDoneModal(false)
        }}
      >
        <div>Are you sure you want to set #000069 mark as done</div>
        <div className='flex gap-3'>
          <Button
            className='bg-gray-900 border-gray-900 text-gray-50'
            label='Confirm'
            onClick={onMarkAsDoneClick}
          />
          <Button
            className='bg-gray-50 border-gray-900 text-gray-600'
            label='Cancel'
          />
        </div>
      </Dialog>

      <Dialog
        blockScroll={true}
        visible={visibleCloseModal}
        style={{ width: '500px' }}
        onHide={() => {
          setmarkAsDoneModal(false)
        }}
      >
        <div>Are you sure you want to Close work order #0000069</div>
        <div className='flex gap-3'>
          <Button
            className='bg-gray-900 border-gray-900 text-gray-50'
            label='Confirm'
          />
          <Button
            className='bg-gray-50 border-gray-900 text-gray-600'
            label='Cancel'
          />
        </div>
      </Dialog>

      <Dialog
        blockScroll={true}
        visible={deleteTaskModal}
        style={{ width: '500px' }}
        onHide={() => {
          setdeleteTaskModal(false)
        }}
      >
        <div>Are you sure you want to delete task?</div>
        <div className='flex gap-3'>
          <Button
            className='bg-gray-900 border-gray-900 text-gray-50'
            label='Confirm'
          />
          <Button
            className='bg-gray-50 border-gray-900 text-gray-600'
            label='Cancel'
          />
        </div>
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
