import React, { Fragment, useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { Tag } from 'primereact/tag'
import { TabMenu } from 'primereact/tabmenu'
import { Image } from 'primereact/image'
import Link from 'next/link'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import withGenericServer from '@hocs/server/generic'
import { useRouter } from 'next/router'
import {
  CampaignData,
  CampaignsRejectRequest,
  EnumsCampaignStatus,
} from 'ob-notification-sdk/api/api'
import * as OBNOTISDK from 'ob-notification-sdk'
import { Dialog } from 'primereact/dialog'
import parse from 'html-react-parser'
import { confirmDialog } from 'primereact/confirmdialog'
import { toast } from 'react-toastify'
import { defaultToastMessage } from '@src/utils/default-toast'
import { usePermission } from '@src/hooks/permissionProvider'
import { PCODE } from '@src/data/constants/privilege'
import { Divider } from 'primereact/divider'
import { FormController } from '@components/forms/components/form-controller'
import TextAreaField from '@components/forms/components/text-area-field'
import { NotificationMessageBlock } from '@components/notifications/types/notification'
type Props = {
  data: CampaignData
}
export default function NotificationView(props: Props) {
  OBNOTISDK.setBaseUrl(process.env.OB_NOTIFICATION_SDK_BASE_URL || '')
  const langItems: Lang[] = [
    { label: 'English', code: 'en' },
    { label: 'Thai(ไทย)', code: 'th' },
    { label: 'Simplify Chinese(简体中文)', code: 'zh' },
  ]
  const [activeLang, setActiveLang] = useState(langItems[0])
  const { setMenuName, setMenuAction } = useLayoutContext()
  const [visibleDeleteDialog, setVisibleDeleteDialog] = useState(false)
  const [visibleRejectDialog, setVisibleRejectDialog] = useState(false)

  const router = useRouter()
  const { id } = router.query
  const { checkAccess } = usePermission()
  // const [status, setStatus] = useState<EnumsCampaignStatus | undefined>()

  const { data } = props
  const isAnnouncement =
    data.message_template?.message_category?.name === 'Announcement'
  const status = data.status as EnumsCampaignStatus | undefined

  let severity: 'info' | 'warning' | 'success' | 'danger' | null | undefined =
    null
  let displayText = ''

  switch (status) {
    case 'WATING_FOR_APPROVAL':
      severity = 'warning'
      displayText = 'Waiting for approval'
      break
    case 'APPROVED_SCHEDULED':
      severity = 'success'
      displayText = 'Approved (Scheduled)'
      break
    case 'APPROVED_SENT':
      severity = 'success'
      displayText = 'Approved (Sent)'
      break
    case 'REJECTED':
      severity = 'danger'
      displayText = 'Rejected'
      break
    case 'DRAFT':
      severity = 'info'
      displayText = 'Draft'
      break
  }

  function formatDate(dateString: any) {
    const date = new Date(dateString)
      .toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      .replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+)/, '$3-$1-$2 $4:$5')

    return date
  }

  const getBlockData = (data: NotificationMessageBlock, lang: string) => {
    switch (data.type) {
      case 'image':
        return (
          <div className='relative flex justify-content-start align-items-center gap-3 border-dashed border-gray-300 p-2'>
            {data.data.map((d, i) => (
              <div
                key={i}
                className='relative flex justify-content-center align-items-center overflow-hidden'
                style={{
                  height: '240px',
                  width: '426px',
                  backgroundPosition: 'center center',
                }}
              >
                <Image
                  className='absolute'
                  alt={decodeURIComponent(d)}
                  src={d}
                  width={'426'}
                  style={{
                    objectPosition: 'center',
                    objectFit: 'none',
                  }}
                />
              </div>
            ))}
          </div>
        )
      case 'hyperlink':
        return (
          <div className='flex flex-column gap-2'>
            <span>{(data.data.message as any)[lang]}</span>
            <a target='_blank' href={data.data.url}>
              {data.data.url}
            </a>
          </div>
        )
      default:
        return <span>{parse((data.data as any)[lang])}</span>
    }
  }

  const deleteNotification = async () => {
    await OBNOTISDK.client.campaignsDelete(id.toString())
    router.push({
      pathname: '/notifications/inapp',
    })
  }

  const onApproveNotification = () => {
    confirmDialog({
      message: `Are you sure you want to approve this notification?`,
      closable: false,
      style: { width: '500px' },
      contentClassName: 'flex justify-content-center font-semibold text-lg',
      footer: (option) => (
        <div className='flex justify-content-center gap-3'>
          <Button
            type='submit'
            label='Approve'
            className='bg-primary-blue'
            onClick={async () => {
              option.accept()
              const promise = OBNOTISDK.client.campaignsApprove(id as string)
              toast.promise(
                promise.then(() => {
                  router.back()
                }),
                defaultToastMessage
              )
            }}
          />
          <Button
            className='text-primary-blue'
            label='Cancel'
            text
            onClick={option.reject}
          />
        </div>
      ),
    })
  }

  const onEdit = () => {
    if (isAnnouncement) {
      router.push('/notifications/inapp/edit-announcement/' + data.id)
    } else {
      router.push('/notifications/inapp/edit/' + data.id)
    }
  }

  // const onDuplicate = () => {
  //   if (isAnnouncement) {
  //     router.push(
  //       '/notifications/inapp/create-announcement/duplicate/' + data.id
  //     )
  //   } else {
  //     router.push('/notifications/inapp/create-inapp/duplicate/' + data.id)
  //   }
  // }

  const onSaveNewTemplate = () => {
    if (isAnnouncement) {
      router.push(
        '/notifications/template/create-announcement/campaign/' + data.id
      )
    } else {
      router.push('/notifications/template/create-inapp/campaign/' + data.id)
    }
  }

  const onRejectNotification = (data: { comment: string }) => {
    let _rejectReason: CampaignsRejectRequest = { note: data.comment }
    const promise = OBNOTISDK.client.campaignsReject(
      id as string,
      _rejectReason
    )
    toast.promise(
      promise.then(() => {
        router.back()
      }),
      defaultToastMessage
    )
    return true
  }
  useEffect(() => {
    if (isAnnouncement) {
      setMenuName('View announcement')
    } else {
      setMenuName('View in-app notification')
    }
    setMenuAction(buttonAction)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuAction])

  const buttonAction = (
    <div className='flex flex-column md:flex-row mt-3 mb-5 justify-content-between align-items-center'>
      {(status === 'WATING_FOR_APPROVAL' || status === 'REJECTED') && (
        <div className='flex gap-3'>
          <Button
            className='bg-primary-blue'
            label={
              checkAccess(PCODE.APPROVEORREJECTEDTHESUBMITTEDNOTIFICATION)
                ? 'Edit and approve'
                : 'Edit and resubmit'
            }
            onClick={onEdit}
          />
          <Button
            className=''
            label='Delete notification'
            severity='danger'
            outlined
            onClick={() => setVisibleDeleteDialog(true)}
          />
          <Button
            className='text-primary-blue'
            label='Close'
            severity='secondary'
            onClick={router.back}
            text
          />
        </div>
      )}

      {status === 'APPROVED_SCHEDULED' && (
        <div className='flex gap-3 px-3'>
          <Button
            className='bg-primary-blue'
            label='Save as new template'
            onClick={onSaveNewTemplate}
          />
          <Button
            className='text-primary-blue'
            label={
              checkAccess(PCODE.APPROVEORREJECTEDTHESUBMITTEDNOTIFICATION)
                ? 'Edit and approve'
                : 'Edit and resubmit'
            }
            onClick={onEdit}
            outlined
          />
          {/* <Button
            className='text-primary-blue'
            label='Duplicate'
            onClick={onDuplicate}
            outlined
          /> */}
          <Button
            className=''
            label='Delete notification'
            severity='danger'
            outlined
            onClick={() => setVisibleDeleteDialog(true)}
          />
          <Button
            className='text-primary-blue'
            label='Close'
            severity='secondary'
            onClick={router.back}
            text
          />
        </div>
      )}

      {status === 'APPROVED_SENT' && (
        <div className='flex gap-3 px-3'>
          <Button
            className='bg-primary-blue'
            label='Save as new template'
            onClick={onSaveNewTemplate}
          />
          {/* <Button
            className=''
            label='Duplicate'
            severity='secondary'
            onClick={() =>
              router.push(
                `/notifications/inapp/create-inapp/duplicate/${data.id}`
              )
            }
            outlined
          /> */}
          <Button
            className='text-primary-blue'
            label='Close'
            severity='secondary'
            onClick={router.back}
            text
          />
        </div>
      )}
    </div>
  )

  // const OnClose = () => {
  //   router.push({
  //     pathname: '/notifications/inapp',
  //   })
  // }

  return (
    <>
      {/* Approval Status */}
      <div className='card mb-5'>
        <div className='p-2'>
          <span className='flex text-xl font-bold text-astronaut'>
            Approval Status
          </span>
          <div className='flex flex-column md:flex-row flex-wrap justify-content-between'>
            <div className='flex flex-1'>
              <div className='flex flex-column gap-1 my-5'>
                <span className='font-bold text-info'>Current status</span>
                <Tag severity={severity} value={displayText}></Tag>
              </div>
            </div>
            <div className='flex flex-1'>
              <div className='flex flex-column gap-1 my-5'>
                <span className='font-bold text-info'>Date submitted</span>
                <span>{formatDate(data?.created_at)}</span>
              </div>
            </div>
            <div className='flex flex-1'>
              <div className='flex flex-column gap-1 my-5'>
                <span className='font-bold text-info'>Submitted by</span>
                <span>{data?.submitted_by_name ?? '-'}</span>
              </div>
            </div>
          </div>

          {/* TODO: SHOW If status rejected */}
          {status === 'REJECTED' && (
            <>
              <div className='flex flex-column md:flex-row flex-wrap justify-content-between'>
                <div className='flex flex-1'>{/* Empty */}</div>
                <div className='flex flex-1'>
                  <div className='flex flex-column gap-1 my-5'>
                    <span className='font-bold text-info'>Date rejected</span>
                    <span>{formatDate(data?.updated_at)}</span>
                  </div>
                </div>
                <div className='flex flex-1'>
                  <div className='flex flex-column gap-1 my-5'>
                    <span className='font-bold text-info'>Rejected by</span>
                    <span>{data?.updated_by_name}</span>
                  </div>
                </div>
              </div>
              <div className='flex flex-column'>
                <span className='font-bold text-info'>Comment</span>
                <span>{data.note ? data.note : '-'}</span>
              </div>
            </>
          )}

          {/* TODO: SHOW If status Approved */}
          {status === 'APPROVED_SCHEDULED' ||
            (status === 'APPROVED_SENT' && (
              <>
                <div className='flex flex-column md:flex-row flex-wrap justify-content-between'>
                  <div className='flex flex-1'>{/* Empty */}</div>
                  <div className='flex flex-1'>
                    <div className='flex flex-column gap-1 my-5'>
                      <span className='font-bold text-info'>Date approved</span>
                      <span>01 January 2024 09:30</span>
                    </div>
                  </div>
                  <div className='flex flex-1'>
                    <div className='flex flex-column gap-1 my-5'>
                      <span className='font-bold text-info'>Approved by</span>
                      <span>{data?.updated_by_name}</span>
                    </div>
                  </div>
                </div>
              </>
            ))}
        </div>
        {status === 'WATING_FOR_APPROVAL' &&
          checkAccess(PCODE.APPROVEORREJECTEDTHESUBMITTEDNOTIFICATION) && (
            <>
              <Divider type='solid' />
              <div className='flex flex-column md:flex-row mt-3 mb-5 justify-content-between align-items-center'>
                <div className='flex gap-3'>
                  <Button
                    className='bg-primary-blue'
                    label='Approve'
                    onClick={onApproveNotification}
                  />
                  <Button
                    className=''
                    label='Reject'
                    severity='danger'
                    outlined
                    onClick={() => setVisibleRejectDialog(true)}
                  />
                </div>
              </div>
            </>
          )}
      </div>

      {/* Notification schedule */}
      <div className='card mb-5'>
        <div className='p-2'>
          <span className='flex text-xl font-bold text-astronaut'>
            Notification schedule
          </span>
          <div className='flex flex-column md:flex-row flex-wrap justify-content-between'>
            <div className='flex flex-1'>
              <div className='flex flex-column gap-1 my-5'>
                <span className='font-bold text-info'>Notification ID</span>
                <span>{data?.id}</span>
              </div>
            </div>
            <div className='flex flex-1'>
              <div className='flex flex-column gap-1 my-5'>
                <span className='font-bold text-info'>
                  Notification category
                </span>
                <span>{data?.message_template?.message_category?.name}</span>
              </div>
            </div>
            <div className='flex flex-1'>
              <div className='flex flex-column gap-1 my-5'>
                <span className='font-bold text-info'>
                  Schedule date and time
                </span>
                <span>{formatDate(data?.scheduled_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Target audience */}
      {data.message_template?.message_category?.name !== 'Announcement' && (
        <div className='card mb-5'>
          <div className='p-2'>
            <span className='flex text-xl font-bold text-astronaut'>
              Target audience
            </span>
            <div className='flex flex-column gap-1 my-5'>
              <span className='font-bold text-info'>Recipients</span>
              {Array.isArray(data?.target_groups) &&
              data.target_groups.length > 0 ? (
                <div>
                  {data.target_groups.map((group: any, index: number) => (
                    //render all group
                    <span key={index}>{group.name}</span>
                  ))}
                </div>
              ) : (
                // render this when no group
                <span>All</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notification details */}
      <div className='card mb-5'>
        <div className='p-2'>
          <span className='flex text-xl font-bold text-astronaut'>
            Notification details
          </span>
          <TabMenu
            model={langItems}
            activeIndex={langItems.findIndex((x) => x.code === activeLang.code)}
            onTabChange={(e) => setActiveLang(langItems[e.index])}
          />
        </div>
        {/* Hero Image */}
        <div className='flex flex-column gap-3 mt-3 p-2'>
          <span className='font-bold text-info'>Hero Image</span>
          {data?.message_template?.thumbnail ? (
            <div
              className='relative flex justify-content-center align-items-center gap-3 p-2 overflow-hidden'
              style={{ height: '360px', backgroundPosition: 'center center' }}
            >
              <Image
                className='absolute'
                alt=''
                src={decodeURIComponent(
                  data?.message_template?.thumbnail.toString()
                )}
                width={'640'}
                style={{ objectPosition: 'center', objectFit: 'none' }}
                // height={'360'}
              />
            </div>
          ) : (
            '-'
          )}
        </div>

        {langItems.map((lang, langIndex) => (
          <Fragment key={langIndex}>
            {lang.code === activeLang.code && (
              <>
                {/* Message  */}
                <div className='p-2 mt-3'>
                  <span className='flex text-lg font-bold text-info'>
                    Title
                  </span>
                  <div className='flex flex-column gap-1 my-2'>
                    <span>{(data?.message_template as any)?.title.en}</span>
                  </div>
                  <span className='flex text-lg font-bold text-info'>
                    Message
                  </span>
                  <div className='flex my-2'>
                    <span>
                      {data?.message_template?.sub_title &&
                        parse(
                          data?.message_template?.sub_title[lang.code] ?? '-'
                        )}
                    </span>
                  </div>
                  <div className='flex flex-column gap-3 my-2'>
                    {data?.message_template?.data?.map((m: any, i: number) => (
                      <div className='flex ' key={i}>
                        {getBlockData(m, lang.code)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tag */}
                <div className='flex flex-column gap-2 my-5 p-2'>
                  <span className='flex text-lg font-bold text-info'>Tag</span>
                  <div className='flex flex-wrap gap-1'>
                    {data?.tags.map((tag) => (
                      <Tag key={tag.id} severity='info' value={tag.name}></Tag>
                    ))}
                  </div>
                </div>

                {/* Button */}
                {!isAnnouncement && (
                  <div className='flex flex-column gap-3 my-5 p-2'>
                    <span className='flex text-lg font-bold text-info'>
                      Button
                    </span>
                    {data?.message_template?.deeplink ? (
                      <>
                        <div className='flex flex-column'>
                          <span className='text-blue-800'>Button link URL</span>
                          <Link href=''>
                            {data?.message_template?.deeplink}
                          </Link>
                        </div>
                        <div className='flex flex-column'>
                          <span className='text-blue-800'>
                            Button name (English)
                          </span>
                          <span>
                            {data?.message_template?.deeplink_display_name?.en
                              ? (
                                  data?.message_template
                                    ?.deeplink_display_name as any
                                )[lang.code]
                              : '-'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                )}

                {/* Push notification */}
                <div className='flex flex-column gap-3 my-5 p-2'>
                  <span className='flex text-lg font-bold text-info'>
                    Push notification
                  </span>
                  <div className='flex flex-column'>
                    <span className='text-blue-800'>Title (English)</span>
                    <span>
                      {(data?.push_notification_data as any)?.title[
                        lang.code
                      ] ?? '-'}
                    </span>
                  </div>
                  <div className='flex flex-column'>
                    <span className='text-blue-800'>Message (English)</span>
                    <span>
                      {(data?.push_notification_data as any)?.message[
                        lang.code
                      ] ?? '-'}
                    </span>
                  </div>
                </div>
              </>
            )}
          </Fragment>
        ))}
      </div>

      {/* Footer Button  */}
      {/* <div className='flex gap-3 my-5'>
        <Button
          className='px-4 bg-primary-blue'
          label='Edit and resubmit'
          onClick={handleEdit}
        />
        <Button
          className='px-4'
          label='Delete notification'
          severity='danger'
          outlined
          onClick={() => setVisibleDeleteDialog(true)}
        />
        <Button
          className='px-5 text-primary-blue'
          label='Close'
          severity='secondary'
          text
          onClick={OnClose}
        />
      </div> */}
      {buttonAction}
      <Dialog
        draggable={false}
        blockScroll={true}
        visible={visibleDeleteDialog}
        style={{ minWidth: '35vw' }}
        onHide={() => {
          setVisibleDeleteDialog(false)
        }}
        modal
        content={({ hide }) => (
          <div className='flex flex-column bg-white p-5 border-round-lg'>
            <span className='font-bold'>
              Are you sure you want to delete this notification?
            </span>
            <div className='flex gap-3 mt-5'>
              {/* Event SaveDraft */}
              <Button
                type='button'
                onClick={deleteNotification}
                severity='danger'
                label='Delete'
              />
              <Button
                type='button'
                className='bg-gray-50 border-gray-900 text-gray-600'
                onClick={(e) => hide(e)}
                label='Cancel'
              />
            </div>
          </div>
        )}
      ></Dialog>

      <Dialog
        draggable={false}
        blockScroll={true}
        visible={visibleRejectDialog}
        style={{ minWidth: '35vw' }}
        onHide={() => {
          setVisibleRejectDialog(false)
        }}
        modal
        content={({ hide }) => (
          <FormController
            defualtValue={{ comment: '' }}
            onSubmit={onRejectNotification}
          >
            <div className='flex flex-column bg-white p-5 border-round-lg'>
              <span className='font-bold'>
                Comments on rejected notifications
              </span>
              <div>
                <TextAreaField
                  rules={{ required: 'comment is required' }}
                  name='comment'
                ></TextAreaField>
              </div>
              <div className='flex gap-3 mt-5'>
                <Button
                  type='submit'
                  className='bg-primary-blue'
                  label='Save and send'
                />
                <Button
                  type='button'
                  className='bg-gray-50 border-gray-900 text-gray-600'
                  onClick={(e) => hide(e)}
                  label='Cancel'
                />
              </div>
            </div>
          </FormController>
        )}
      ></Dialog>
    </>
  )
}

NotificationView.activePrime = true

export const getServerSideProps = withGenericServer(async (ctx: any) => {
  OBNOTISDK.setBaseUrl(process.env.OB_NOTIFICATION_SDK_BASE_URL || '')

  const { id } = ctx.props.query
  const campaignData = await OBNOTISDK.client.campaignsShow(id)
  const data = campaignData.data.data
  ctx.props = { ...ctx.props, data }
  return ctx
})
