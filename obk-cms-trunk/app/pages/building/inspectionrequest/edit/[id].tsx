import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import { Panel } from 'primereact/panel'
import { Dropdown } from 'primereact/dropdown'
import { Image } from 'primereact/image'
import TextAreaField from '@components/forms/components/text-area-field'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import { useRouter } from 'next/router'
import { Dialog } from 'primereact/dialog'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import { toast } from 'react-toastify'
import { defaultToastMessage } from '@src/utils/default-toast'
import { inspectionRequestService } from '@src/services/buildingservice/inspectionrequest/service'
import { GetInspectionRequest } from '@src/services/buildingservice/inspectionrequest/model'

type Props = {
  id: string
  data: GetInspectionRequest
}

export default function InspectionRequestEdit(props: Props) {
  const { id, data } = props
  const [visibleSubmitDialog, setVisibleSubmitDialog] = useState(false)
  const { setMenuName } = useLayoutContext()
  const router = useRouter()
  const formRef = useRef<FormControllerRef<any>>(null)
  const [selectedStatus, setStatus] = useState(data.status)
  const [comment, setComment] = useState(data.comment || '')

  const status = [
    { name: 'Pending', value: 'Pending' },
    { name: 'Submitted', value: 'submitted' },
    { name: 'In progress', value: 'in_progress' },
    { name: 'Done', value: 'done' },
  ]

  useEffect(() => {
    setMenuName('Urgent Service Request')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuName])

  const onSaveUpdate = async () => {
    setVisibleSubmitDialog(false)

    const sendData = {
      id,
      status: selectedStatus,
      comment: comment,
    }

    const promise = inspectionRequestService
      .editRequest(sendData)
      .then(() => {
        router.push({
          pathname: '/building/inspectionrequest',
        })
      })
      .catch((e) => {
        console.error('Error:', e)
      })
    toast.promise(promise, defaultToastMessage)
  }
  const OnDismiss = () => {
    setVisibleSubmitDialog(false)
    router.push({
      pathname: '/building/inspectionrequest',
    })
  }

  function formatDate(dateString: string | undefined) {
    if (!dateString) return ''

    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  return (
    <>
      <FormController
        defualtValue={comment}
        ref={formRef}
        onSubmit={() => setVisibleSubmitDialog(true)}
      >
        <Panel>
          <div className='flex flex-column md:flex-row flex-wrap align-items-baseline justify-content-between my-3 pl-1'>
            <div className='flex flex-1 ml-0'>
              <h4 className='font-bold'>Urgent Service Request</h4>
            </div>
            <div className='flex flex-1 justify-content-center md:justify-content-end'>
              <Dropdown
                value={selectedStatus}
                onChange={(e) => setStatus(e.value)}
                options={status}
                optionLabel='name'
                placeholder='Status'
                className='w-full md:w-6'
              />
            </div>
          </div>
          <div className='flex flex-wrap'>
            {[
              { label: 'Title', value: data?.title },
              { label: 'Description', value: data?.description },
              { label: 'Location', value: data?.location },
              { label: 'Event', value: data?.srEventNames || '-' },
              { label: 'Event Other', value: data?.srEventOther || '-' },
              { label: 'Problem', value: data?.srProblemNames || '-' },
              { label: 'Problem Other', value: data?.srProblemOther || '-' },
              { label: 'Picture', value: data?.image ? data.image : [] },
              { label: 'Created Date', value: formatDate(data?.createdDate) },
            ].map((item, index) => (
              <>
                <div key={index} className='col-12 md:col-2'>
                  <p className='font-bold'>{item.label}</p>
                </div>
                <div key={index + 1} className='col-12 md:col-10'>
                  {item.label === 'Description' &&
                  (!data?.description || data?.description.trim() === '') ? (
                    <span>-</span>
                  ) : item.label === 'Picture' &&
                    Array.isArray(item.value) &&
                    item.value.length > 0 ? (
                    <div className='flex flex-wrap gap-3'>
                      {item.value.map((img: string, idx: number) => (
                        <Image
                          key={idx}
                          imageClassName='max-w-max'
                          src={img}
                          alt={`Inspection picture ${idx + 1}`}
                          width='150'
                          preview
                        />
                      ))}
                    </div>
                  ) : item.label === 'Picture' ? (
                    <span>-</span>
                  ) : (
                    item.value
                  )}
                </div>
              </>
            ))}
            <div className='flex m-2 mt-5 w-full'>
              <TextAreaField
                className='flex w-full'
                name='comment'
                label='Comment'
                rows={5}
                cols={80}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setComment(e.target.value)
                }
                value={comment ?? ''}
              ></TextAreaField>
            </div>
          </div>

          <div className='flex flex-column md:flex-row gap-3 py-3 pl-2'>
            <Button type='submit' label='Confirm changes' />
            <Button
              type='button'
              className='bg-gray-50 border-gray-900 text-gray-600'
              label='Dismiss'
              onClick={OnDismiss}
            />
          </div>
        </Panel>
      </FormController>

      <Dialog
        draggable={false}
        blockScroll={true}
        visible={visibleSubmitDialog}
        style={{ minWidth: '30vw' }}
        onHide={() => setVisibleSubmitDialog(false)}
        modal
        content={({ hide }) => (
          <div className='flex flex-column bg-white p-5 border-round-lg'>
            <span className='font-bold'>
              Are you sure you want to save changes?
            </span>
            <div className='flex gap-3 mt-5'>
              <Button
                className='bg-primary-blue'
                label='Confirm'
                onClick={onSaveUpdate}
              />
              <Button
                className='text-primary-blue'
                onClick={(e) => hide(e)}
                label='Cancel'
                outlined
              />
            </div>
          </div>
        )}
      ></Dialog>
    </>
  )
}

InspectionRequestEdit.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const { id } = ctx.props.query
    const data = await inspectionRequestService.getById(id)
    ctx.props = { ...ctx.props, data, id }
    return ctx
  },
  {},
  {
    redirectPath: '/building/inspectionrequest',
    accessPage: PCODE.VIEWINSPECTIONREQUESTLISTANDDETAILS,
  }
)
