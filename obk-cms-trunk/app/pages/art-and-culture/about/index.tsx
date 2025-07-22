import { Tab, TabList, Tabs } from '@chakra-ui/react'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import { axiosInstance } from '@refinedev/simple-rest'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import {
  AboutUsContentData,
  IAboutUs,
  IAboutUsForm,
  IInputErrors,
  IPartnerItem,
  IAboutUsTranslation,
  IPartnerTranslation,
  OptionItem,
} from '@src/services/art-and-culture/model'
import { mappingValidateErrorMessage } from '@src/utils/art-c'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { Button } from 'primereact/button'
import { Editor } from 'primereact/editor'
import { MultiSelect } from 'primereact/multiselect'
import { Panel } from 'primereact/panel'
import * as Yup from 'yup'
import { useEffect, useRef, useState } from 'react'
import withGenericServer from '@hocs/server/generic'

export default function AboutPages() {
  const router = useRouter()
  const { locale } = router

  const formRef = useRef<FormControllerRef<IAboutUsForm>>(null)

  const { setMenuName, setMenuAction } = useLayoutContext()
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState<IAboutUs | null>(null)
  const [partnerOptions, setPartnerOptions] = useState<OptionItem[]>([])

  const defaultValue = new AboutUsContentData()
  const [formLocale, setFormLocale] = useState<string>('en')
  const [aboutUsForm, setAboutUsForm] = useState<IAboutUsForm>()

  const initFormErrors: IInputErrors = {
    content: { status: false, message: '' },
    partners: { status: false, message: '' },
  }
  const [errorForm, setErrorForm] = useState(initFormErrors)

  const [requestError, setRequestError] = useState({
    status: false,
    message: '',
  })

  useEffect(() => {
    setMenuName(`About Us Content`)
    fetchContent()
    fetchPartners()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuAction])

  useEffect(() => {
    if (locale) {
      handleFormLocaleChange(locale as string)
    }
  }, [locale])

  const fetchContent = () => {
    setIsLoading(true)

    axiosInstance
      .get(`/api/art-and-culture/about?l=all`)
      .then((res) => {
        const { data } = res.data
        setContent(data)

        const translation = data?.aboutTranslation.find(
          (item: IAboutUsTranslation) => item.locale === formLocale
        )

        const partnersItems: OptionItem[] = []
        data.partners.forEach((partner: IPartnerItem) => {
          let translation: IPartnerTranslation | undefined
          for (let item of ['en', 'th', 'zh']) {
            translation = partner.partnerTranslation.find(
              (tItem) => tItem.locale === item
            )
            if (translation) {
              break
            }
          }

          partnersItems.push({
            label: translation?.title || '',
            value: `${partner.id}`,
          })
        })

        setAboutUsForm({
          content: translation?.content || '',
          partnersItems: partnersItems.map((item) => item.value),
        })
      })
      .catch(() => {
        setRequestError({
          status: true,
          message: 'Something went wrong, please try again.',
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const fetchPartners = () => {
    setIsLoading(true)

    axiosInstance
      .get(`/api/art-and-culture/partners?l=all`)
      .then((res) => {
        const { data } = res.data

        const options: OptionItem[] = []
        data.forEach((partner: IPartnerItem) => {
          let translation: IPartnerTranslation | undefined
          for (let item of ['en', 'th', 'zh']) {
            translation = partner.partnerTranslation.find(
              (tItem) => tItem.locale === item
            )
            if (translation) {
              break
            }
          }
          if (translation) {
            options.push({ label: translation.title, value: `${partner.id}` })
          }
        })

        setPartnerOptions(options)
      })
      .catch(() => {
        setRequestError({
          status: true,
          message: 'Something went wrong, please try again.',
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleFormLocaleChange = (locale: string) => {
    setFormLocale(locale)
    setErrorForm(initFormErrors)
    setRequestError({ status: false, message: '' })

    const translation = content?.aboutTranslation.find(
      (item: IAboutUsTranslation) => item.locale === locale
    )

    setAboutUsForm({
      content: translation?.content || '',
      partnersItems:
        content && content.partners
          ? content.partners.map((partner: IPartnerItem) => `${partner.id}`)
          : [],
    })
  }

  const onEditContent = (editorState: any) => {
    setAboutUsForm({
      content: editorState.htmlValue,
      partnersItems: aboutUsForm?.partnersItems || [],
    })
  }

  let validationSchema = Yup.object({
    content: Yup.string().required('Content is required'),
  })
  const onSubmit = async () => {
    if (!aboutUsForm) return

    let errors = initFormErrors
    const validationResult = await validationSchema
      .validate(aboutUsForm, { abortEarly: false })
      .catch(async (err) => {
        errors = mappingValidateErrorMessage(errors, err.inner)
        return false
      })

    setRequestError({ status: false, message: '' })
    setErrorForm(errors)
    setIsLoading(true)
    if (validationResult) {
      setErrorForm(initFormErrors)

      await axiosInstance
        .put(`/api/art-and-culture/about?l=${formLocale}`, {
          content: aboutUsForm.content,
          partners: aboutUsForm.partnersItems.map((item) => {
            return { id: parseInt(item) }
          }),
        })
        .then(() => {
          fetchContent()
        })
        .catch(() => {
          setRequestError({
            status: true,
            message: 'Something went wrong, please try again.',
          })
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }

  const onBack = () => router.push('/art-and-culture/art-c')
  const buttonActionTemplate = (
    <div className='flex gap-3 justify-content-center md:justify-content-start'>
      <Button
        disabled={isLoading}
        className='px-5 bg-primary-blue'
        label='Publish'
        onClick={formRef.current?.handleSubmit(onSubmit)}
      />

      <Button
        type='button'
        disabled={isLoading}
        className='px-5 text-primary-blue'
        label='Close'
        text
        onClick={onBack}
      />
    </div>
  )

  return (
    <>
      {content && (
        <FormController
          ref={formRef}
          defualtValue={defaultValue}
          onSubmit={onSubmit}
        >
          {aboutUsForm && (
            <Panel className='mb-5'>
              <div className='p-2'>
                <>
                  <h4 className='text-astronaut font-bold'>Details</h4>
                  <small className='font-medium'>
                    Last update&nbsp;
                    <span className='font-bold'>
                      {dayjs(content.updatedAt).format('DD/MM/YYYY HH:mm')}
                    </span>
                  </small>
                </>

                <div className='relative mt-5'>
                  <div className='tw-w-full'>
                    <Tabs className='locale-tabs'>
                      <TabList className='tabs-list'>
                        <Tab
                          className={clsx([
                            'tab',
                            formLocale === 'en' && 'active',
                          ])}
                          onClick={() => handleFormLocaleChange('en')}
                        >
                          English
                        </Tab>
                        <Tab
                          className={clsx([
                            'tab',
                            formLocale === 'th' && 'active',
                          ])}
                          onClick={() => handleFormLocaleChange('th')}
                        >
                          Thai
                        </Tab>
                        <Tab
                          className={clsx([
                            'tab',
                            formLocale === 'zh' && 'active',
                          ])}
                          onClick={() => handleFormLocaleChange('zh')}
                        >
                          Chinese
                        </Tab>
                      </TabList>
                    </Tabs>
                  </div>
                </div>

                <div className='field grid mt-5'>
                  <div className='col-12'>
                    <div className='text-primary-800 font-bold pb-2'>
                      Content <span className='text-red-700'>*</span>
                    </div>
                    <Editor
                      value={aboutUsForm.content}
                      onTextChange={onEditContent}
                      style={{ height: '160px' }}
                    />
                    {errorForm.content.status && (
                      <div className='pt-2 text-red-700 text-sm'>
                        {errorForm.content.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className='field grid mt-5'>
                  <div className='col-12'>
                    <div className='text-primary-800 font-bold pb-2'>
                      Partner
                    </div>
                    <MultiSelect
                      display='chip'
                      value={aboutUsForm.partnersItems}
                      onChange={(e) => {
                        setAboutUsForm({
                          ...aboutUsForm,
                          partnersItems: e.value,
                        })
                      }}
                      options={partnerOptions}
                      optionLabel='label'
                      filter
                      placeholder='Select partners'
                      maxSelectedLabels={100}
                      className='w-full'
                    />
                    {errorForm.partners.status && (
                      <div className='pt-2 text-red-700 text-sm'>
                        {errorForm.partners.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Panel>
          )}

          {requestError.status && (
            <div className='pb-4 text-red-700 text-sm'>
              {requestError.message}
            </div>
          )}

          <div>{buttonActionTemplate}</div>
        </FormController>
      )}
    </>
  )
}

AboutPages.activePrime = true
export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }

  return ctx
}, {})
