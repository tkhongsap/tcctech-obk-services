import SectionBlock from '@components/display/section-block'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Heading from '@components/typography/heading'
import { FormProvider } from 'react-hook-form'
import InputText from '@components/label-input/text'
import InputSelect from '@components/label-input/select'
import map from 'lodash/map'
import QuestionBuilder from '@components/support/document/question'
import UpsertPane from '@components/action-pane/upsert'
import { useEffect } from 'react'
import { IDocument } from '@src/types/document'
import * as OB_DOCUMENT_SDK from 'ob-document-sdk'
import { useRouter } from 'next/router'
import { useGetLocale } from '@refinedev/core'
import dayjs from 'dayjs'
import { htmlToMarkdown } from 'utils/markdown'

const tabProps = {
  color: 'rockBlue',
  fontSize: { md: '20px' },
  fontWeight: 700,
  _selected: {
    color: 'astronaut',
    borderColor: 'astronaut',
  },
}

const tabItems = [
  {
    key: 'en',
    label: 'English',
  },
  {
    key: 'th',
    label: 'Thai',
  },
  {
    key: 'cn',
    label: 'Chinese',
  },
]

const FaqCategoryUpsert = (props: any) => {
  const { form, data, formType, addabled, submitMsg } = props
  const { register, watch, handleSubmit, setValue, formState } = form
  const { errors } = formState
  const router = useRouter()
  const locale = useGetLocale()
  const currentLocale = locale()
  const documentData = Array.isArray(data) ? data[0] : data
  watch()

  const isLegalDoc = documentData?.type?.type === 'legal'

  useEffect(() => {
    if (!documentData) return
    const enDocument = documentData?.list?.map((doc: IDocument) => {
      return {
        question: doc.title?.en,
        answer: doc.body?.en,
      }
    })
    const thDocument = documentData?.list?.map((doc: IDocument) => {
      return {
        question: doc.title?.th,
        answer: doc.body?.th,
      }
    })
    const cnDocument = documentData?.list?.map((doc: IDocument) => {
      return {
        question: doc.title?.cn,
        answer: doc.body?.cn,
      }
    })
    const documentTitle =
      typeof documentData.title === 'string'
        ? JSON.parse(documentData.title)
        : documentData.title

    setValue('categoryId', documentData.id)
    setValue('status', documentData.active ? 'active' : 'inactive')
    setValue('nameEn', documentTitle?.en)
    setValue('nameTh', documentTitle?.th)
    setValue('nameCn', documentTitle?.cn)
    setValue('en.contents', enDocument)
    setValue('th.contents', thDocument)
    setValue('cn.contents', cnDocument)
  }, [data])

  const tabList = map(tabItems, (item) => (
    <Tab key={item.key} {...tabProps}>
      {item.label}
    </Tab>
  ))

  const tabPanelList = map(tabItems, (item): any => {
    const key = `${item.key}.contents`
    return (
      <TabPanel key={item.key} pt='40px' px='0' w='100%'>
        <QuestionBuilder
          dataKey={key}
          locale={item.key}
          addabled={addabled}
          minimized={isLegalDoc}
        />
      </TabPanel>
    )
  })

  const fetchType = async () => {
    const result = await OB_DOCUMENT_SDK.client.typeShow('faq')
    return result?.data?.data as unknown as any[]
  }

  const onSubmit = async (data: any) => {
    const type = (await fetchType())[0].id || ''
    const payload = {
      type_id: type,
      title: {
        en: data.nameEn,
        th: data.nameTh,
        cn: data.nameCn,
      },
      active: data.status === 'active',
      document: data.en.contents?.map((_: any, index: number) => {
        return {
          title: isLegalDoc
            ? {
                en: data.nameEn,
                th: data.nameTh,
                cn: data.nameCn,
              }
            : {
                en: data.en.contents[index]?.question,
                th: data.th.contents[index]?.question,
                cn: data.cn.contents[index]?.question,
              },
          body: {
            en: htmlToMarkdown(data.en.contents[index]?.answer),
            th: htmlToMarkdown(data.th.contents[index]?.answer),
            cn: htmlToMarkdown(data.cn.contents[index]?.answer),
          },
          slug: documentData?.list[index]?.slug || '',
          id: documentData?.list[index]?.id,
          published: true,
        }
      }),
    }

    if (formType === 'edit') {
      await OB_DOCUMENT_SDK.client
        .categoryCmsUpdate(documentData?.id || '', payload)
        .then((res) => {
          console.log('update category successfully!!: ', res)
        })
        .catch((err) => {
          console.log('update category error: ', err)
        })
        .finally(() => {
          router.back()
        })
    }

    if (formType === 'create') {
      await OB_DOCUMENT_SDK.client
        .categoryCmsCreate(payload)
        .then((res) => {
          console.log('create category successfully!!: ', res)
        })
        .catch((err) => {
          console.log('create category error: ', err)
        })
        .finally(() => {
          router.back()
        })
    }
  }

  const onCancel = () => {}

  const onDelete = async () => {
    if (!data) return
    await OB_DOCUMENT_SDK.client
      .categoryDestroy(data[0].id)
      .then((res) => {
        console.log('delete category successfully!!: ', res)
        router.push('/support/faqs')
      })
      .catch((err) => {
        console.log('delete category error: ', err)
      })
  }

  // eslint-disable-next-line unused-imports/no-unused-vars-ts
  const fullName = `${
    documentData?.updated_by?.account?.profile?.first_name || ''
  } ${documentData?.updated_by?.account?.profile?.middle_name || ''} ${
    documentData?.updated_by?.account?.profile?.last_name || ''
  }`

  const defaultModalLabel =
    formType === 'create'
      ? 'Are you sure you want to create a new FAQs category?'
      : 'Are you sure you want to publish changes?'

  const modalLabel = submitMsg || defaultModalLabel

  return (
    <div>
      <FormProvider {...form} onSubmit={handleSubmit(onSubmit)}>
        <div className='md:tw-flex tw-justify-between'>
          <div className='tw-flex-1'>
            <SectionBlock>
              <div>
                <div className='tw-flex tw-justify-between tw-items-center'>
                  <div>
                    <Heading as='h3' color='biscay'>
                      {isLegalDoc
                        ? documentData?.title[currentLocale ?? 'en']
                        : 'Details'}
                    </Heading>
                    {formType === 'edit' && (
                      <div className='flex tw-items-center'>
                        <div>
                          Last update{' '}
                          <span className='tw-font-bold'>
                            {documentData?.updated_at
                              ? dayjs(documentData.updated_at).format(
                                  'YYYY-MM-DD HH:mm'
                                )
                              : '-'}
                          </span>{' '}
                          Updated By{' '}
                          <span className='tw-font-bold'>
                            {documentData?.updated_by
                              ? documentData?.updated_by_name
                              : '-'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <UpsertPane
                    submitLabel='Publish'
                    onSubmit={handleSubmit(onSubmit)}
                    submitMsg={modalLabel}
                    onCancel={onCancel}
                    onDelete={onDelete}
                    types={
                      isLegalDoc
                        ? ['submit', 'cancel']
                        : ['submit', 'delete', 'cancel']
                    }
                  />
                </div>

                <div className='tw-flex tw-flex-col tw-justify-between tw-items-center tw-w-full tw-gap-8 tw-pt-8'>
                  {!isLegalDoc && (
                    <>
                      <div className='tw-grid tw-grid-cols-3 tw-w-full tw-gap-6'>
                        <div>
                          <InputSelect
                            label='Status'
                            register={register('status', { required: true })}
                            error={errors['status']}
                            items={[
                              {
                                label: 'Active',
                                value: 'active',
                              },
                              {
                                label: 'Inactive',
                                value: 'inactive',
                              },
                            ]}
                          />
                        </div>
                      </div>

                      <div className='tw-grid tw-grid-cols-3 tw-w-full tw-gap-6'>
                        <div>
                          <InputText
                            label='Category name (EN)'
                            register={register('nameEn', { required: true })}
                            placeholder='Type name'
                            error={errors['nameEn']}
                          />
                        </div>
                        <div>
                          <InputText
                            label='Category name (THAI)'
                            register={register('nameTh', { required: true })}
                            placeholder='กรอกชื่อ'
                            error={errors['nameTh']}
                          />
                        </div>
                        <div>
                          <InputText
                            label='Category name (CN)'
                            register={register('nameCn', { required: true })}
                            placeholder='池袋'
                            error={errors['nameCn']}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className='tw-w-full'>
                    <Tabs isFitted>
                      <TabList>{tabList}</TabList>
                      <TabPanels>{tabPanelList}</TabPanels>
                    </Tabs>
                  </div>
                </div>
              </div>
            </SectionBlock>

            <div className='tw-py-6'>
              <UpsertPane
                submitLabel='Publish'
                onSubmit={handleSubmit(onSubmit)}
                submitMsg={modalLabel}
                onCancel={onCancel}
                onDelete={onDelete}
                types={
                  isLegalDoc
                    ? ['submit', 'cancel']
                    : ['submit', 'delete', 'cancel']
                }
              />
            </div>
          </div>
        </div>
      </FormProvider>
    </div>
  )
}

export default FaqCategoryUpsert
