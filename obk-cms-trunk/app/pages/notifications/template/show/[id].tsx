import React, { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { TabMenu } from 'primereact/tabmenu'
import { Image } from 'primereact/image'
import Link from 'next/link'
import { Dialog } from 'primereact/dialog'
import withGenericServer from '@hocs/server/generic'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import router from 'next/router'
import * as OBNOTISDK from 'ob-notification-sdk'
import { WrappedResponseMessageTemplateDataData } from 'ob-notification-sdk/dist/api'
import parse from 'html-react-parser'
import { confirmDialog } from 'primereact/confirmdialog'
import { toast } from 'react-toastify'
import { defaultToastMessage } from '@src/utils/default-toast'
import { NotificationMessageBlock } from '@components/notifications/types/notification'

type Props = {
  data: WrappedResponseMessageTemplateDataData
}

export default function NotificationTemplateView(props: Props) {
  OBNOTISDK.setBaseUrl(process.env.OB_NOTIFICATION_SDK_BASE_URL || '')
  const langItems: Lang[] = [
    { label: 'English', code: 'en' },
    { label: 'Thai(ไทย)', code: 'th' },
    // { label: 'Simplify Chinese(简体中文)', code: 'zh' },
  ]
  const [activeLang, setActiveLang] = useState<Lang>(langItems[0])
  const [visibleDeleteDialog, setVisibleDeleteDialog] = useState<boolean>(false)
  const { setMenuName, setMenuAction } = useLayoutContext()
  const { data } = props
  const isAnnouncement = data.message_category?.name === 'Announcement'

  useEffect(() => {
    if (data.message_category?.name === 'Announcement') {
      setMenuName('View announcement template')
    } else {
      setMenuName('View in-app notification template')
    }
    setMenuAction(buttonAction)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuName])

  const onEditAnnouncement = () => {
    if (isAnnouncement) {
      router.push({
        pathname: '/notifications/template/edit-announcement/' + data.id,
      })
    } else {
      router.push({
        pathname: '/notifications/template/edit/' + data.id,
      })
    }
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

  const onDelete = async () => {
    confirmDialog({
      message: 'Are you sure you want to delete this template?',
      closable: false,
      style: { width: '500px' },
      contentClassName: 'flex justify-content-center font-semibold text-lg',
      footer: (option) => (
        <div className='flex justify-content-center gap-3'>
          <Button
            type='submit'
            label='Confirm'
            severity='danger'
            onClick={async () => {
              option.accept()
              const id = data.id
              if (id) {
                const singleId = Array.isArray(id) ? id[0] : id
                const promise =
                  OBNOTISDK.client.messageTemplatesDelete(singleId)

                toast.promise(
                  promise.then(() => {
                    router.back()
                  }),
                  defaultToastMessage
                )
              } else {
                console.error('Invalid or missing ID for deletion')
              }
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

  const onBack = () => {
    router.push('/notifications/template')
  }

  const onUseTemplate = () => {
    if (isAnnouncement) {
      router.push(
        `/notifications/inapp/create-announcement/template/${data.id}`
      )
    } else {
      router.push(`/notifications/inapp/create-inapp/template/${data.id}`)
    }
  }

  const buttonAction = (
    <div className='flex flex-column xl:flex-row mt-3 mb-5 justify-content-between align-items-center'>
      <div className='flex gap-3 px-3'>
        <Button
          className='bg-primary-blue'
          label='Use template'
          onClick={onUseTemplate}
        />
        <Button
          className='text-primary-blue'
          label='Edit Template'
          severity='info'
          outlined
          onClick={onEditAnnouncement}
        />
        <Button
          label='Delete template'
          severity='danger'
          outlined
          onClick={onDelete}
        />
        <Button
          className='text-primary-blue'
          label='Close'
          severity='secondary'
          onClick={onBack}
          text
        />
      </div>
    </div>
  )

  return (
    <>
      <div className='card mb-5'>
        <div className='p-2'>
          <span className='flex text-xl font-bold text-astronaut'>
            Template
          </span>
          <div className='flex flex-column md:flex-row flex-wrap'>
            <div className='flex col-12 md:col-6 p-0'>
              <div className='flex flex-column gap-1 my-5'>
                <span className='font-bold text-info'>Template ID</span>
                <span>{data.id}</span>
              </div>
            </div>
            <div className='flex col-12 md:col-6 p-0'>
              <div className='flex flex-column gap-1 my-5'>
                <span className='font-bold text-info'>
                  Notification category
                </span>
                <span>{data.message_category?.name}</span>
              </div>
            </div>
          </div>

          <div className='flex flex-column md:flex-row flex-wrap justify-content-between'>
            <div className='flex flex-column gap-1 my-5'>
              <span className='font-bold text-info'>Template name</span>
              <span>{data.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Target audience */}
      {/* {!isAnnouncement && (
        <div className='card mb-5'>
          <div className='p-2'>
            <span className='flex text-xl font-bold text-astronaut'>
              Target audience
            </span>
            <div className='flex flex-column gap-1 my-5'>
              <span className='font-bold text-info'>Recipients</span>
              <span>All office workers</span>
            </div>
          </div>
        </div>
      )} */}

      {/* Notification details */}
      <div className='card mb-5'>
        <div className='p-2'>
          <div>
            <span className='flex text-xl font-bold text-astronaut'>
              Notification details
            </span>
            <TabMenu
              model={langItems}
              activeIndex={langItems.findIndex(
                (x) => x.code === activeLang.code
              )}
              onTabChange={(e) => setActiveLang(langItems[e.index])}
            />
          </div>

          {langItems.map(
            (lang, langIndex) =>
              lang.code === activeLang.code && (
                <React.Fragment key={langIndex}>
                  {/* Hero Image */}
                  <div className='py-2 mt-3 flex flex-column gap-3 mt-3'>
                    <span className='font-bold text-info'>Hero Image</span>
                    {data.thumbnail ? (
                      <Image src={data.thumbnail} alt='Image' width='500' />
                    ) : (
                      <span>No image</span>
                    )}
                  </div>

                  {/* Title */}
                  <div className='py-2 mt-3'>
                    <span className='flex text-lg font-bold text-info'>
                      Title
                    </span>
                    <div className='flex flex-column gap-1 my-2'>
                      <span className='text-info'>Title ({lang.label})</span>
                      <span>{data.title[lang.code]}</span>
                    </div>
                  </div>

                  {/* Message */}
                  <div className='py-2'>
                    <span className='flex text-lg font-bold text-info'>
                      Message
                    </span>
                    <div className='flex my-2'>
                      {data.sub_title &&
                        parse((data.sub_title[lang.code] as any) ?? '')}
                    </div>
                  </div>

                  <div className='flex flex-column gap-3 my-2'>
                    {data?.data?.map((block, blockIndex) => (
                      <div className='flex' key={blockIndex}>
                        {getBlockData(block as any, lang.code)}
                      </div>
                    ))}
                  </div>
                  {/* <div className='flex flex-column gap-2'>
                    <span>Click here</span>
                    <span>
                      {
                        "Feel free to leave the button empty if you don't have a specific destination for the notification. However, if you do, please entering the link url of you destination"
                      }
                    </span>
                  </div> */}

                  {/* Tag */}
                  {/* <div className='flex flex-column gap-2 my-5'>
                    <span className='flex text-lg font-bold text-info'>
                      Tag
                    </span>
                    <div className='flex flex-wrap gap-1'>
                      <Tag severity='info' value='App'></Tag>
                      <Tag severity='info' value='Promotion'></Tag>
                    </div>
                  </div> */}

                  {/* Button */}
                  {!isAnnouncement && (
                    <div className='flex flex-column gap-3 my-5'>
                      <span className='flex text-lg font-bold text-info'>
                        Button
                      </span>
                      <div className='flex flex-column'>
                        <span className='text-info'>Button link URL</span>
                        {data.deeplink ? (
                          <Link href={data.deeplink}>{data.deeplink}</Link>
                        ) : (
                          '-'
                        )}
                      </div>
                      <div className='flex flex-column'>
                        <span className='text-info'>Button name (English)</span>
                        <span>
                          {data.deeplink_display_name &&
                          data.deeplink_display_name[lang.code]
                            ? data.deeplink_display_name[lang.code]
                            : '-'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Push notification */}
                  {/* <div className='flex flex-column gap-3 my-5'>
                    <span className='flex text-lg font-bold text-info'>
                      Push notification
                    </span>
                    <div className='flex flex-column'>
                      <span className='text-info'>Title (English)</span>
                      <span></span>
                    </div>
                    <div className='flex flex-column'>
                      <span className='text-info'>Message (English)</span>
                      <span>
                        {
                          "Feel free to leave the button empty if you don't have a specific destination for the notification. However, if you do, please entering the link url of you destination"
                        }
                      </span>
                    </div>
                  </div> */}
                </React.Fragment>
              )
          )}
        </div>
      </div>

      {/* Footer Button  */}
      {buttonAction}

      <Dialog
        draggable={false}
        blockScroll={true}
        visible={visibleDeleteDialog}
        style={{ minWidth: '30vw' }}
        onHide={() => {
          setVisibleDeleteDialog(false)
        }}
        modal
        content={({ hide }) => (
          <div className='flex flex-column bg-white p-5 border-round-lg'>
            <span className='font-bold'>
              Are you sure you want to delete this template?
            </span>
            <div className='flex gap-3 mt-5'>
              <Button label='Delete' severity='danger' />
              <Button
                className='bg-gray-50 border-gray-900 text-gray-600'
                onClick={(e) => hide(e)}
                label='Cancel'
              />
            </div>
          </div>
        )}
      ></Dialog>
    </>
  )
}

NotificationTemplateView.activePrime = true

export const getServerSideProps = withGenericServer(async (ctx: any) => {
  OBNOTISDK.setBaseUrl(process.env.OB_NOTIFICATION_SDK_BASE_URL || '')
  const { id } = ctx.props.query
  const data = await OBNOTISDK.client
    .messageTemplatesShow(id)
    .then((res) => res.data.data)
  ctx.props = { ...ctx.props, data }
  return ctx
})
