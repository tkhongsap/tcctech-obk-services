import { Dropdown } from 'primereact/dropdown'
import { Panel } from 'primereact/panel'
import { useRef, useState } from 'react'
import withGenericServer from '@hocs/server/generic'
import { Button } from 'primereact/button'
import { useRouter } from 'next/router'
import * as OBBMSSDK from 'ob-bms-sdk'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import TextAreaField from '@components/forms/components/text-area-field'
import { Dialog } from 'primereact/dialog'
import { WrappedOneResponseACRequestResponse } from 'ob-bms-sdk/api/api'
import { PCODE } from '@src/data/constants/privilege'

type Props = {
  acRequestData: WrappedOneResponseACRequestResponse
}

export default function ACRequestView(props: Props) {
  const { acRequestData } = props
  const [selectedStatus, setStatus] = useState(acRequestData.data.status)
  const [internalRemark, setInternalRemark] = useState(
    acRequestData.data.internal_remark
  )
  const [rejectedReason, setRejectedReason] = useState(
    acRequestData.data.reason
  )
  const formRef = useRef<FormControllerRef<any>>(null)
  const [visibleRejectedDialog, setVisibleRejectedtDialog] =
    useState<boolean>(false)
  const router = useRouter()
  // const { id } = router.query

  const status = [
    { name: 'Submitted', value: 'submitted' },
    { name: 'Approved', value: 'approved' },
    { name: 'Rejected', value: 'rejected' },
  ]

  const OnDismiss = () => {
    router.push({
      pathname: '/building/acrequest',
    })
  }

  function handleSubmit() {
    if (selectedStatus !== 'submitted') {
      OBBMSSDK.client.acRequestUpdate(acRequestData?.data.id || '', {
        status: selectedStatus,
        internal_remark: internalRemark ?? '',
        reason: rejectedReason ?? '',
      })
      router.push({
        pathname: '/building/acrequest',
      })
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

  function handleCancelDialog() {
    setVisibleRejectedtDialog(false)
    setStatus(acRequestData.data.status)
  }

  const handleStatusChange = (e: any) => {
    if (e.target.value === 'rejected') {
      setVisibleRejectedtDialog(true)
    } else {
      setVisibleRejectedtDialog(false)
    }
    setStatus(e.target.value)
  }

  function handleChangedToRejected() {
    setRejectedReason(rejectedReason)
    setVisibleRejectedtDialog(false)
  }
  return (
    <>
      <Panel>
        <div className='flex flex-column md:flex-row flex-wrap justify-content-between my-3 pl-1'>
          <div className='flex flex-1'>
            <h4 className='font-bold'>
              AC request {acRequestData?.data.references}
            </h4>
          </div>
          <div className='flex flex-1 align-items-baseline justify-content-center md:justify-content-end'>
            <Dropdown
              value={selectedStatus}
              onChange={handleStatusChange}
              options={status}
              optionLabel='name'
              placeholder='Status'
              className='w-full md:w-6'
              defaultValue={'0'}
              disabled={acRequestData.data.status === 'rejected'}
            />
          </div>
        </div>

        <div className='flex flex-wrap'>
          {[
            { label: 'Ticket ID', value: acRequestData?.data.references },
            {
              label: 'Tenant name',
              value: acRequestData?.data.requester.tenant_members
                ? Array.isArray(acRequestData.data.requester.tenant_members)
                  ? acRequestData.data.requester.tenant_members
                      .map((requester) => requester.tenant.name)
                      .join(', ')
                  : '-'
                : '-',
            },
            { label: 'Building', value: acRequestData?.data.tower.name },
            { label: 'Floor', value: acRequestData?.data.floor.name },
            {
              label: 'Zone',
              value: acRequestData?.data.ac_zone
                ? Array.isArray(acRequestData.data.ac_zone)
                  ? acRequestData.data.ac_zone
                      .map((zone) => zone.ac_zone.name)
                      .join(', ')
                  : '-'
                : '-',
            },
            {
              label: 'From',
              value: acRequestData?.data.from,
            },
            {
              label: 'To',
              value: acRequestData?.data.to,
            },
            {
              label: 'Duration',
              value: acRequestData?.data.duration_hour + ' Hours',
            },
            {
              label: 'Cost',
              value: acRequestData?.data.estimated_cost + ' Baht',
            },
            {
              label: 'Created data',
              value: formatDate(acRequestData?.data.created_at),
            },
          ].map((item, index) => (
            <>
              <div key={index} className='col-12 md:col-2'>
                <p className='font-bold'>{item.label}</p>
              </div>
              <div key={index + 1} className='col-12 md:col-10'>
                {item.value}
              </div>
            </>
          ))}
          <div className='flex m-2 mt-5 w-full'>
            <FormController
              defualtValue={internalRemark}
              ref={formRef}
              onSubmit={handleSubmit}
            >
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
            </FormController>
          </div>
        </div>

        <div className='flex flex-column md:flex-row gap-3 mt-5 mb-3 justify-content-between'>
          <div className='flex flex-column md:flex-row gap-3 pl-2'>
            <Button label='Confirm changes' onClick={handleSubmit} />
            <Button
              className='bg-gray-50 border-gray-900 text-gray-600'
              label='Dismiss'
              onClick={OnDismiss}
            />
          </div>
          <div className='flex flex-column md:flex-row mt-5 md:mt-0'>
            <Button
              label='Download Excel??'
              severity='success'
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </Panel>

      <Dialog
        draggable={false}
        blockScroll={true}
        visible={visibleRejectedDialog}
        style={{ minWidth: '600px' }}
        onHide={handleCancelDialog}
        modal
        content={({ hide }) => (
          <div className='flex flex-column bg-white p-5 border-round-lg'>
            <span className='font-bold my-3'>
              Are you sure you want to deny this request?
              <br />
              Please provide the reason for the rejection.
            </span>
            <FormController
              defualtValue={rejectedReason}
              ref={formRef}
              onSubmit={handleChangedToRejected}
            >
              <TextAreaField
                className='flex w-full'
                name='reason'
                label=''
                rows={5}
                cols={30}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setRejectedReason(e.target.value)
                }
                value={rejectedReason ?? ''}
              ></TextAreaField>
              <div className='flex gap-3 mt-1'>
                <Button type='submit' label='Confirm' />
                <Button
                  type='button'
                  className='bg-gray-50 border-gray-900 text-gray-600'
                  onClick={(e) => hide(e)}
                  label='Cancel'
                />
              </div>
            </FormController>
          </div>
        )}
      ></Dialog>
    </>
  )
}
ACRequestView.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const { id } = ctx.props.query
    OBBMSSDK.setBaseUrl(process.env.BMS_BASEURL || '')
    const res = await OBBMSSDK.client.acRequestShow(id)
    const acRequestData = res.data

    ctx.props = {
      ...ctx.props,
      acRequestData,
    }
    return ctx
  },
  {},
  {
    redirectPath: '/',
    accessPage: PCODE.VIEWAIRCONDITIONERREQUESTLISTANDDETAILS,
  }
)
