import React, { useState, useRef } from 'react'
import { Steps } from 'primereact/steps'
import withGenericServer from '@hocs/server/generic'
import { Button } from 'primereact/button'
import * as OBNOTISDK from 'ob-notification-sdk'
import router from 'next/router'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import TemplateStep from '@components/notifications/template/create/notification/template-step'
import MessageStep from '@components/notifications/template/create/notification/message-step'
import ButtonStep from '@components/notifications/template/create/notification/button-step'
import { KeyValue } from '@src/types/key-value'
import { confirmDialog } from 'primereact/confirmdialog'
import { toast } from 'react-toastify'
import {
  MappingMessageTemplateToTemplateUIModel,
  MappingTemplateUIModelToMessageTemplate,
  MessageTemplateModel,
} from '@components/notifications/template/types/template'
import { MenuItem } from 'primereact/menuitem'
import StepItemTemplate from '@components/notifications/components/step-item-template'
import { findIndex } from 'lodash'
import { defaultToastMessage } from '@src/utils/default-toast'

type Props = {
  categories: KeyValue[]
  tags: KeyValue[]
}

export default function NotificationCreate(props: Props) {
  OBNOTISDK.setBaseUrl(process.env.OB_NOTIFICATION_SDK_BASE_URL || '')

  const { categories, tags } = props
  const LangItems: Lang[] = [
    { label: 'English', code: 'en' },
    { label: 'Thai(ไทย)', code: 'th' },
    // { label: 'Simplify Chinese(简体中文)', code: 'zh' },
  ]

  const [activeIndex, setActiveIndex] = useState(0)
  const [activeLang, setActiveLang] = useState<Lang>(LangItems[0])
  const formRef = useRef<FormControllerRef<any>>(null)

  const formData = new MappingMessageTemplateToTemplateUIModel(undefined)

  const items: MenuItem[] = [
    {
      label: 'Template',
      template: () => StepItemTemplate({ activeIndex: activeIndex, index: 0 }),
    },
    {
      label: 'Message',
      template: () => StepItemTemplate({ activeIndex: activeIndex, index: 1 }),
    },
    {
      label: 'Button',
      template: () => StepItemTemplate({ activeIndex: activeIndex, index: 2 }),
    },
  ]

  const OnClose = () => {
    router.push({
      pathname: '/notifications/template',
    })
  }

  function onSubmitNext(rawData: MessageTemplateModel) {
    if (activeIndex >= items.length - 1) {
      confirmDialog({
        message: 'Are you sure you want to create this template?',
        closable: false,
        style: { width: '500px' },
        contentClassName: 'flex justify-content-center font-semibold text-lg',
        footer: (option) => (
          <div className='flex justify-content-center gap-3'>
            <Button
              type='submit'
              label='Confirm'
              className='bg-primary-blue'
              onClick={async () => {
                option.accept()

                const data = new MappingTemplateUIModelToMessageTemplate(
                  rawData
                )

                const promise = OBNOTISDK.client.messageTemplatesCreate(data)

                toast.promise(
                  promise.then((res) => {
                    router.push(
                      '/notifications/template/show/' + res.data.data!.id
                    )
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

      return
    }
    setActiveIndex((pre) => pre + 1)
  }

  function onBack() {
    if (activeIndex === 0) {
      return
    }
    setActiveIndex((pre) => pre - 1)
  }

  return (
    <div className=''>
      <div className='card'>
        <div className='bg-white mb-5'>
          <Steps
            model={items}
            activeIndex={activeIndex}
            onSelect={(e) => setActiveIndex(e.index)}
            readOnly={false}
          />
        </div>

        <FormController
          defualtValue={formData}
          ref={formRef}
          onSubmit={onSubmitNext}
        >
          {
            {
              0: (
                <TemplateStep disableCategory={false} categories={categories} />
              ),
              1: (
                <MessageStep
                  activeLang={activeLang}
                  setActiveLang={setActiveLang}
                  tags={tags}
                  langItems={LangItems}
                  onBackClick={onBack}
                  addBlockVisible={true}
                  tagsVisible={false}
                  requiredTitleAndMessage={true}
                />
              ),
              2: (
                <ButtonStep
                  activeLang={activeLang}
                  setActiveLang={setActiveLang}
                  langItems={LangItems}
                  onBackClick={onBack}
                  nextButtonLabel='Create new template'
                />
              ),
            }[activeIndex]
          }
        </FormController>
      </div>
      <div className='flex flex-wrap w-5 gap-5 my-5'>
        <Button
          type='button'
          className='px-5 text-primary-blue'
          label='Cancel'
          severity='secondary'
          onClick={OnClose}
          text
        />
      </div>
    </div>
  )
}
NotificationCreate.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    OBNOTISDK.setBaseUrl(process.env.OB_NOTIFICATION_SDK_BASE_URL || '')
    const tags = await OBNOTISDK.client.tagsIndex().then((res) => {
      const tagList = (res.data?.data as any)?.map((tag: any) => ({
        name: tag.name,
        value: tag.id,
      }))
      return tagList as KeyValue
    })
    const categories = await OBNOTISDK.client
      .messageCategoriesIndex()
      .then((res) => {
        const categoryList = (res.data?.data as any)?.map(
          (category: any) =>
            ({
              name: category.name,
              value: category.id,
            } as KeyValue)
        )
        return categoryList as KeyValue[]
      })

    const announcementIndex = findIndex(
      categories,
      (x) => x.name === 'Announcement'
    )
    categories.splice(announcementIndex, 1)

    ctx.props = { ...ctx.props, categories, tags }
    return ctx
  },
  {
    redirectPath: '/notifications/template/create-inapp',
  }
)
