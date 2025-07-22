import SectionBlock from '@components/display/section-block'
import Heading from '@components/typography/heading'
import { ICategoryCmsResponse } from '@src/types/document'
import { IAccessLocalInformationFormProps } from 'pages/support/access-information/edit/[id]'
import { classNames } from 'primereact/utils'
import { useEffect, useState } from 'react'
import {
  Control,
  Controller,
  FormState,
  UseFormHandleSubmit,
  UseFormSetValue,
} from 'react-hook-form'
import { TabMenu } from 'primereact/tabmenu'
import { InputText } from 'primereact/inputtext'
import LabelField from '@components/forms/utils/label-field'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { confirmDialog } from 'primereact/confirmdialog'
import * as OB_DOCUMENT_SDK from 'ob-document-sdk'
import { htmlToMarkdown, markdownToHtml } from 'utils/markdown'
import { useTranslate } from '@refinedev/core'
import { Button } from 'primereact/button'
import CustomEditor from '@components/input/customEditor'

interface UpsertProps {
  loading: boolean
  control: Control<IAccessLocalInformationFormProps, any>
  handleSubmit: UseFormHandleSubmit<IAccessLocalInformationFormProps, undefined>
  setValue: UseFormSetValue<IAccessLocalInformationFormProps>
  formState: FormState<IAccessLocalInformationFormProps>
  documentData: ICategoryCmsResponse
}

const langItems: Lang[] = [
  { label: 'English', code: 'en' },
  { label: 'Thai', code: 'th' },
]

export default function Upsert({
  control,
  handleSubmit,
  setValue,
  formState,
  documentData,
}: UpsertProps) {
  const translate = useTranslate()
  const { errors } = formState
  const [activeLang, setActiveLang] = useState(langItems[0])

  const [disabled, setDisabled] = useState(false)
  const router = useRouter()
  const displayDate = dayjs(documentData?.updated_at as string)
    .format('YYYY-MM-DD HH:mm')
    .toString()

  useEffect(() => {
    if (!documentData) return

    const title = JSON.parse(documentData.title as string)
    if (title && title?.url === null) {
      setDisabled(true)
      setValue('url', null)
    }

    if (documentData.list.length > 0) {
      const listData = documentData.list[0]
      listData.body?.contentEn &&
        setValue(
          'contentEn',
          markdownToHtml(listData.body?.contentEn as string)
        )
      listData.body?.contentTh &&
        setValue(
          'contentTh',
          markdownToHtml(listData.body?.contentTh as string)
        )
      listData.body?.url && setValue('url', listData.body?.url as string)
    }
  }, [documentData, setValue])

  const onCancel = () => {
    router.push({
      pathname: '/support/access-information',
    })
  }

  const onSubmit = async (data: IAccessLocalInformationFormProps) => {
    const title = JSON.parse(documentData.title)
    const payload = {
      type_id: documentData.type.id,
      title: {
        ...title,
      },
      active: true,
      document: [
        {
          title: {
            ...title,
          },
          body: {
            contentEn: htmlToMarkdown(data.contentEn),
            ...(data.contentTh && {
              contentTh: htmlToMarkdown(data.contentTh),
            }),
            ...(data.url && { url: data.url }),
          },
        },
      ],
    }

    confirmDialog({
      message: 'Are you sure you want to publish the changes?',
      closable: false,
      style: { width: '500px' },
      contentClassName: 'flex justify-content-center font-semibold text-lg',
      footer: ({ accept, reject }) => (
        <div className='flex justify-content-start gap-3'>
          <Button
            type='submit'
            label='Confirm'
            className='bg-primary-blue'
            onClick={async () => {
              await OB_DOCUMENT_SDK.client
                .categoryCmsUpdate(documentData.id, payload)
                .then((res) => console.log('Update successfully :', res))
                .catch((err) => console.log('Update error :', err))
              accept()
              router.back()
            }}
          />
          <Button
            className='text-primary-blue'
            label='Cancel'
            text
            onClick={reject}
          />
        </div>
      ),
    })
  }

  const mapLang = {
    en: { content: 'contentEn' },
    th: { content: 'contentTh' },
    zh: { content: 'contentZh' },
  }

  const title = JSON.parse(documentData?.title as string)
  const fieldContent = mapLang[activeLang.code]
    .content as keyof IAccessLocalInformationFormProps
  const error = errors[fieldContent]?.message

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={classNames('flex flex-col gap-[32px]')}
    >
      <div className='tw-w-full md:tw-flex tw-justify-between'>
        <div className='tw-flex-1'>
          <SectionBlock style={{ backgroundColor: 'white' }}>
            <div className='tw-flex tw-justify-between tw-items-center'>
              <div className='flex-1'>
                <Heading as='h3' color='biscay'>
                  {title?.en}
                </Heading>

                <div className='flex tw-items-center'>
                  <div>
                    {translate('general.lastUpdated')}
                    <span className='tw-pl-1 tw-font-bold'>
                      {displayDate}
                    </span>{' '}
                    {translate('general.updatedBy')}
                    <span className='tw-pl-1 tw-font-bold'>
                      {documentData.updated_by_name ?? '-'}
                    </span>
                  </div>
                </div>
              </div>
              <div className='tw-flex tw-flex-wrap gap-2'>
                <Button
                  type='submit'
                  className='px-4'
                  label='Publish'
                  onClick={() => handleSubmit(onSubmit)}
                />
                <Button
                  type='button'
                  className='px-4'
                  label='Cancel'
                  severity='secondary'
                  outlined
                  onClick={onCancel}
                />
              </div>
            </div>
            <div className='tw-w-full'>
              <TabMenu
                model={langItems}
                activeIndex={langItems.findIndex(
                  (x) => x.code === activeLang.code
                )}
                onTabChange={(e) => setActiveLang(langItems[e.index])}
              />

              <div key={fieldContent} className='pb-4'>
                <div className='pt-4'>
                  <Controller
                    name={fieldContent}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                      <CustomEditor data={value} onChange={onChange} />
                    )}
                  />
                  {['contentEn', 'contentTh', 'contentZh'].some((key) =>
                    Object.keys(errors).includes(key)
                  ) && (
                    <p className='pt-2 text-red-700 font-semibold text-xs'>
                      {error || (errors && 'Please enter all required fields')}
                    </p>
                  )}
                </div>
              </div>
              {!disabled && (
                <Controller
                  name='url'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <LabelField
                      htmlFor='access-url'
                      label='URL'
                      isRequired={true}
                      className='relative'
                    >
                      <InputText
                        value={value || ''}
                        onChange={onChange}
                        className='tw-w-full'
                        invalid={Boolean(errors.url)}
                      />
                      <p className='pt-2 text-red-700 font-semibold text-xs'>
                        {errors.url?.message}
                      </p>
                    </LabelField>
                  )}
                />
              )}
            </div>
          </SectionBlock>
          <div className='flex flex-wrap gap-3 pt-6'>
            <Button
              type='submit'
              className='px-5'
              label='Publish'
              onClick={() => handleSubmit(onSubmit)}
            />
            <Button
              type='button'
              className='px-5'
              label='Cancel'
              severity='secondary'
              outlined
              onClick={onCancel}
            />
          </div>
        </div>
      </div>
    </form>
  )
}
