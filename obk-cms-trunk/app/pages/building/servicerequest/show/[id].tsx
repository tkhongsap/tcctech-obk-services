import { Dropdown } from 'primereact/dropdown'
import { Panel } from 'primereact/panel'
import { useRef, useState } from 'react'
import withGenericServer from '@hocs/server/generic'
import { Image } from 'primereact/image'
import { Button } from 'primereact/button'
import * as OBBMSSDK from 'ob-bms-sdk'
import { useRouter } from 'next/router'
import { Toast } from 'primereact/toast'
import TextAreaField from '@components/forms/components/text-area-field'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import { WrappedOneResponseServiceRequestData } from 'ob-bms-sdk/api/api'
import { PCODE } from '@src/data/constants/privilege'

type Props = {
  RequestData: WrappedOneResponseServiceRequestData
}

export default function ServiceRequestView(props: Props) {
  const { RequestData } = props
  const toast = useRef<Toast>(null)
  const [selectedStatus, setStatus] = useState(RequestData.data.status)
  const router = useRouter()
  const [internalRemark, setInternalRemark] = useState(
    RequestData.data.internal_remark
  )
  const formRef = useRef<FormControllerRef<any>>(null)

  const status = [
    { name: 'Submitted', value: 'submitted' },
    { name: 'In progress', value: 'in_progress' },
    { name: 'Done', value: 'done' },
  ]

  const OnDismiss = () => {
    router.push({
      pathname: '/building/servicerequest',
    })
  }

  const show = () => {
    toast.current?.show({
      severity: 'info',
      summary: 'Info',
      detail: 'Message Content',
    })
  }

  const handleSubmit = async () => {
    if (selectedStatus !== 'submitted') {
      await OBBMSSDK.client
        .serviceRequestsUpdate(RequestData?.data.id || '', {
          status: selectedStatus,
          internal_remark: internalRemark ?? '',
        })
        .then((res) => {
          console.log(res.data.data)
        })
        .catch((ex) => {
          console.log(ex)
        })
      router.back()

      // } else {
      //   setStatus(serviceRequestData?.data.status || '')
      //   toast.current?.show({
      //     severity: 'warn',
      //     summary: 'Warning',
      //     detail: 'Service requst can not set status back to submitted.',
      //     life: 3000,
      //   })
    }
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
        defualtValue={internalRemark}
        ref={formRef}
        onSubmit={handleSubmit}
      >
        <Panel>
          <div className='flex flex-column md:flex-row flex-wrap align-items-baseline justify-content-between my-3 pl-1'>
            <div className='flex flex-1 ml-0'>
              <h4 className='font-bold'>
                Service request {RequestData?.data.references}
              </h4>
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
              { label: 'Ticket ID', value: RequestData?.data.references },
              {
                label: 'Tenant name',
                value: RequestData.data.requester.tenant_members
                  ?.map(
                    (x) => (x.tenant.display_name! as { nameEn: string }).nameEn
                  )
                  .join(','),
              },
              { label: 'Building', value: RequestData?.data.tower?.name },
              { label: 'Floor', value: RequestData?.data.floor?.name },
              {
                label: 'Issue type',
                value: RequestData?.data.issue_type?.name,
              },
              { label: 'Title', value: RequestData?.data.title },
              {
                label: 'Description',
                value: RequestData?.data.description,
              },
              { label: 'Picture', value: RequestData?.data.image_url },
              {
                label: 'Created Date',
                value: formatDate(RequestData?.data.created_at),
              },
            ].map((item, index) => (
              <>
                <div key={index} className='col-12 md:col-2'>
                  <p className='font-bold'>{item.label}</p>
                </div>
                <div key={index + 1} className='col-12 md:col-10'>
                  {item.label === 'Description' &&
                  (!RequestData?.data.description ||
                    RequestData?.data.description.trim() === '') ? (
                    <span>-</span>
                  ) : item.label === 'Picture' &&
                    Array.isArray(item.value) &&
                    item.value[0] ? (
                    <Image
                      imageClassName='max-w-max'
                      src={item.value[0]}
                      alt='Building picture'
                      width='100%'
                    />
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
                name='internal_remark'
                label='Internal remark'
                rows={5}
                cols={80}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setInternalRemark(e.target.value)
                }
                value={internalRemark ?? ''}
              ></TextAreaField>
            </div>
          </div>

          <div className='flex flex-column md:flex-row gap-3 py-3 pl-2'>
            <Button
              type='submit'
              label='Confirm changes'
              // onClick={handleSubmit}
            />
            <Button
              className='bg-gray-50 border-gray-900 text-gray-600'
              label='Dismiss'
              onClick={OnDismiss}
            />
          </div>
        </Panel>
      </FormController>
      <Toast ref={show} position='bottom-center' />
    </>
  )
}

ServiceRequestView.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const { id } = ctx.props.query
    OBBMSSDK.setBaseUrl(process.env.BMS_BASEURL || '')
    const res = await OBBMSSDK.client.serviceRequestsShow(id)
    const RequestData = res.data
    ctx.props = {
      ...ctx.props,
      RequestData,
    }
    return ctx
  },
  {},
  {
    redirectPath: '/',
    accessPage: PCODE.VIEWSERVICEREQUESTLISTANDDETAILS,
  }
)
