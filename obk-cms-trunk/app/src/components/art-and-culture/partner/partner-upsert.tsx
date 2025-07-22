/* eslint-disable @next/next/no-img-element */
import { Tab, TabList, Tabs } from '@chakra-ui/react'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import {
  IInputErrors,
  PartnerContentData,
  IPartnerForm,
  IPartnerItem,
  IPartnerTranslation,
  IArtCultureContentUpload,
} from '@src/services/art-and-culture/model'
import {
  isObjectDeepEqual,
  mappingValidateErrorMessage,
} from '@src/utils/art-c'
import { AxiosResponse } from 'axios'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Panel } from 'primereact/panel'
import { Message } from 'primereact/message'
import { ProgressBar } from 'primereact/progressbar'
import ImageButtonField from '@components/forms/components/image-button-field'
import { useEffect, useRef, useState } from 'react'
import * as Yup from 'yup'
import dayjs from 'dayjs'
import { last } from 'lodash'
import { convertToBase64 } from '@src/utils/image'
import { artCGeneralServices } from '@src/services/art-and-culture/art-c-general-service'
import { artCPartnerServices } from '@src/services/art-and-culture/art-c-partner-services'

interface IPartnerUpsert {
  type: string
  partnerItem?: IPartnerItem
}

interface IPartnerFormTransValue {
  th: IPartnerForm
  en: IPartnerForm
  zh: IPartnerForm
}

const acceptTypes = ['image/png', 'image/jpg', 'image/jpeg']

const PartnerUpsert = ({ type, partnerItem }: IPartnerUpsert) => {
  const router = useRouter()
  const { locale } = router.query
  const formRef = useRef<FormControllerRef<IPartnerForm>>(null)

  const defaultValue = new PartnerContentData()
  const [isFormSubmitting, setIsFormSubmitting] = useState(false)

  const [formValues, setFormValues] = useState<IPartnerForm>(defaultValue)
  const [formTransValues, setFormTransValues] =
    useState<IPartnerFormTransValue>({
      th: defaultValue,
      en: defaultValue,
      zh: defaultValue,
    })

  const [formLocale, setFormLocale] = useState<string>('en')

  const [uploadingFile, setUploadingFile] = useState<boolean>(false)
  const [invalidFile, setInvalidFile] = useState<{
    title: string
    message: string
  } | null>(null)

  const initFormErrors: IInputErrors = {
    title: { status: false, message: '' },
    link: { status: false, message: '' },
    thumbnail: { status: false, message: '' },
  }

  const [errorForm, setErrorForm] = useState(initFormErrors)
  const [requestError, setRequestError] = useState({
    status: false,
    message: '',
  })

  const initialFormValues = (item: IPartnerItem | undefined) => {
    if (item && item.partnerTranslation.length > 0) {
      const value = formTransValues

      item.partnerTranslation.forEach((itemTrans: IPartnerTranslation) => {
        if (itemTrans.locale === 'en') {
          value['en'] = {
            title: itemTrans.title,
            thumbnail: itemTrans.thumbnail,
            link: itemTrans.link,
          }
        }

        if (itemTrans.locale === 'th') {
          value['th'] = {
            title: itemTrans.title,
            thumbnail: itemTrans.thumbnail,
            link: itemTrans.link,
          }
        }

        if (itemTrans.locale === 'zh') {
          value['zh'] = {
            title: itemTrans.title,
            thumbnail: itemTrans.thumbnail,
            link: itemTrans.link,
          }
        }
      })

      setFormTransValues(value)
      setFormValues(value[formLocale as keyof IPartnerFormTransValue])
    }
  }

  const handleFormLocaleChange = (locale: string) => {
    setErrorForm(initFormErrors)
    setRequestError({ status: false, message: '' })

    // save current form values to formTransValues
    const tempFormTransValues = formTransValues
    tempFormTransValues[formLocale as keyof IPartnerFormTransValue] = formValues

    Object.keys(tempFormTransValues).forEach((key) => {
      if (key === formLocale) return
      tempFormTransValues[key as keyof IPartnerFormTransValue] = {
        ...tempFormTransValues[key as keyof IPartnerFormTransValue],
      }
    })

    setFormTransValues(tempFormTransValues)

    // set form locale and form values
    setFormLocale(locale)
    setFormValues(tempFormTransValues[locale as keyof IPartnerFormTransValue])
  }

  const onFileChange = async (file: File) => {
    setUploadingFile(true)
    setErrorForm({
      ...errorForm,
      thumbnail: {
        status: false,
        message: '',
      },
    })

    const size = file.size / 1024 / 1024
    if (size > 2) {
      setInvalidFile({
        title: 'File size is too large',
        message: 'Please upload a file with size less than 2MB',
      })
      setUploadingFile(false)
      return
    }

    try {
      const base64Data = last(
        (await convertToBase64(file))?.toString().split('base64,')
      )!
      const uploadData: IArtCultureContentUpload = {
        fileName: file.name,
        fileContentBase64: base64Data,
        contentType: file.type,
      }

      const res = await artCGeneralServices.uploadImage(uploadData)
      const { status, data } = res

      if (data && status === 200) {
        setFormValues({
          ...formValues,
          thumbnail: data.imageURL,
          title: formValues?.title || '',
          link: formValues?.link || '',
        })
      } else {
        throw new Error('Something went wrong while uploading the file')
      }
    } catch (error) {
      setErrorForm({
        ...errorForm,
        thumbnail: {
          status: true,
          message: 'Something went wrong while uploading the file',
        },
      })
    }

    setUploadingFile(false)
  }

  const onRemoveFile = () => {
    setFormValues({ ...formValues, thumbnail: undefined })
    setErrorForm({
      ...errorForm,
      thumbnail: {
        status: false,
        message: '',
      },
    })
  }

  let validationSchema = Yup.object({
    title: Yup.string()
      .max(255, 'Title should be less than 255 characters')
      .required('Title is required'),
    thumbnail: Yup.string().required('Thumbnail is required'),
    link: Yup.string().url('Link format is invalid').nullable(),
  })
  const onSubmit = async () => {
    if (!formValues) return

    const prepareFormValues = formTransValues
    const formValuesItem: string[] = []
    let errors = initFormErrors
    const validationResult = await validationSchema
      .validate(formValues, { abortEarly: false })
      .catch(async (err) => {
        errors = mappingValidateErrorMessage(errors, err.inner)
        return false
      })

    if (!validationResult) {
      setRequestError({ status: false, message: '' })
      setErrorForm(errors)
      setIsFormSubmitting(false)
      return
    } else {
      formValuesItem.push(formLocale)
      prepareFormValues[formLocale as keyof IPartnerFormTransValue] = formValues
    }

    let isOtherLocaleValid = true
    for (const key in formTransValues) {
      if (isOtherLocaleValid) {
        const checkFormValues = {
          title: formTransValues[key as keyof IPartnerFormTransValue].title,
          thumbnail:
            formTransValues[key as keyof IPartnerFormTransValue].thumbnail,
          link: formTransValues[key as keyof IPartnerFormTransValue].link,
        }

        const initValues = {
          title: defaultValue.title,
          thumbnail: defaultValue.thumbnail,
          link: defaultValue.link,
        }

        if (!isObjectDeepEqual(checkFormValues, initValues)) {
          const result = await validationSchema
            .validate(checkFormValues, { abortEarly: false })
            .catch(async (err) => {
              errors = mappingValidateErrorMessage(errors, err.inner)
              return false
            })

          if (!result) {
            setRequestError({ status: false, message: '' })
            setErrorForm(errors)
            setIsFormSubmitting(false)
            handleFormLocaleChange(key)
            isOtherLocaleValid = false
          } else {
            formValuesItem.push(key)
          }
        }
      }
    }

    if (!isOtherLocaleValid) {
      return
    }

    setIsFormSubmitting(true)

    let res = { id: partnerItem ? partnerItem.id : 0, status: false }
    for (const key in prepareFormValues) {
      if (formValuesItem.includes(key)) {
        res = await saveFormValues(
          res.id === 0 ? 0 : res.id,
          `${key}`,
          prepareFormValues[key as keyof IPartnerFormTransValue]
        )
      }
    }

    if (res.status) {
      router.push(
        `/art-and-culture/partners${
          type === 'create' ? '?status=createSuccess' : '?status=updateSuccess'
        }`
      )
    }

    setIsFormSubmitting(false)
  }

  const saveFormValues = async (
    id: number,
    saveLocale: string,
    values: IPartnerForm
  ): Promise<{ id: number; status: boolean }> => {
    try {
      let result: AxiosResponse | null = null

      if (type === 'create' && id === 0) {
        result = await artCPartnerServices.create(saveLocale, values)
      } else {
        result = await artCPartnerServices.edit(`${id}`, saveLocale, values)
      }

      if (!result) return { id: 0, status: false }

      if (result.status == 200) {
        const { id } = result.data.data
        return { id: id, status: true }
      } else {
        setRequestError({ status: true, message: result.data.message })
        return { id: 0, status: false }
      }
    } catch (error) {
      setRequestError({
        status: true,
        message: 'Something went wrong. Please try again later.',
      })
      return { id: 0, status: false }
    }
  }

  const deleteItem = async (id: number) => {
    if (confirm('Are you sure you want to delete this partner?')) {
      setIsFormSubmitting(true)

      await artCPartnerServices
        .delete(`${id}`)
        .then(() => {
          router.push('/art-and-culture/partners')
        })
        .catch((error) => {
          setRequestError({
            status: true,
            message: error.response.data.message,
          })
        })
        .finally(() => {
          setIsFormSubmitting(false)
        })
    }
  }

  const onBack = () => router.push('/art-and-culture/partners')
  const buttonActionTemplate = (
    <div className='flex gap-3 justify-content-center md:justify-content-start'>
      <Button
        disabled={isFormSubmitting}
        className='px-5 py-3 bg-primary-blue text-white'
        label='Publish'
        onClick={formRef.current?.handleSubmit(onSubmit)}
      />
      {type === 'update' && (
        <Button
          type='button'
          className='px-5 text-red-600 border-2 border-red-600'
          label='Delete this partner'
          severity='danger'
          outlined
          disabled={isFormSubmitting}
          onClick={() => deleteItem(partnerItem!.id)}
        />
      )}
      <Button
        type='button'
        disabled={isFormSubmitting}
        className='px-5 text-primary-blue'
        label='Close'
        text
        onClick={onBack}
      />
    </div>
  )

  useEffect(() => {
    initialFormValues(partnerItem)
  }, [partnerItem, locale])

  return (
    <>
      {formValues && (
        <FormController
          ref={formRef}
          defualtValue={defaultValue}
          onSubmit={onSubmit}
        >
          <Panel className='mb-5'>
            <div className='p-2'>
              <div className='mb-5'>
                <h4 className='text-astronaut font-bold'>Details</h4>
                {type === 'update' && partnerItem && (
                  <small className='font-medium'>
                    Last update&nbsp;
                    <span className='font-bold'>
                      {dayjs(partnerItem.updatedAt).format('DD/MM/YYYY HH:mm')}
                      &nbsp;
                    </span>
                  </small>
                )}
              </div>

              <div className='relative my-5'>
                <div className='relative tw-w-full'>
                  {uploadingFile && (
                    <div
                      className='absolute w-full h-full'
                      style={{
                        zIndex: 50,
                        backgroundColor: 'rgba(255,255,255,0.5)',
                      }}
                    />
                  )}
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

              <div className='flex flex-column mt-5 mb-3 gap-2'>
                <div className='pb-2'>
                  <div className='text-primary-800 font-bold'>
                    Thumbnail image <span className='text-red-700'>*</span>
                  </div>
                  <small className='text-xs font-bold text-info'>
                    ( Recommend image size: Min 160x160px, Max 480x480) (allow
                    file type: jpg, jpeg, png)
                  </small>
                </div>
                {uploadingFile ? (
                  <ProgressBar
                    mode='indeterminate'
                    style={{ height: '6px' }}
                  ></ProgressBar>
                ) : formValues.thumbnail ? (
                  <Message
                    content={
                      <div className='w-full'>
                        <div className='w-full flex justify-content-between py-3'>
                          <span>{formValues.thumbnail}</span>
                          <i
                            className='pi pi-times cursor-pointer'
                            onClick={() => onRemoveFile()}
                          ></i>
                        </div>

                        <div
                          className='tw-rounded-lg overflow-hidden mb-2'
                          style={{ maxWidth: '200px', lineHeight: 0 }}
                        >
                          <img
                            src={formValues.thumbnail}
                            alt='thumbnail'
                            className='w-full h-auto'
                          />
                        </div>
                      </div>
                    }
                  />
                ) : (
                  <>
                    <div className='w-full'>
                      <ImageButtonField
                        rules={{ required: false }}
                        acceptTypes={acceptTypes.join(', ')}
                        name='coverImage'
                        outputType='file'
                        mode='single'
                        onError={setInvalidFile}
                        onChange={onFileChange}
                      />
                    </div>
                  </>
                )}
                {invalidFile && (
                  <Message
                    severity='error'
                    content={
                      <div className='w-full flex justify-content-between py-3'>
                        <span className='text-danger'>
                          <span className='font-bold'>
                            {invalidFile.title} :
                          </span>
                          {invalidFile.message}
                        </span>
                      </div>
                    }
                  />
                )}
                {errorForm.thumbnail.status && (
                  <div className='pt-2 text-red-700 text-sm'>
                    {errorForm.thumbnail.message}
                  </div>
                )}
              </div>

              <div className='field grid'>
                <div className='col-12'>
                  <div className='text-primary-800 font-bold pb-2'>
                    Title <span className='text-red-700'>*</span>
                  </div>
                  <InputText
                    className='w-full'
                    maxLength={255}
                    onChange={(e) => {
                      setFormValues(
                        formValues
                          ? { ...formValues, title: e.target.value || '' }
                          : defaultValue
                      )
                      setErrorForm({
                        ...errorForm,
                        title: {
                          status: false,
                          message: '',
                        },
                      })
                    }}
                    value={formValues?.title}
                  />
                  {errorForm.title.status && (
                    <div className='pt-2 text-red-700 text-sm'>
                      {errorForm.title.message}
                    </div>
                  )}
                </div>
              </div>

              <div className='field grid'>
                <div className='col-12'>
                  <div className='text-primary-800 font-bold pb-2'>Link</div>
                  <InputText
                    className='w-full'
                    maxLength={255}
                    onChange={(e) => {
                      setFormValues(
                        formValues
                          ? { ...formValues, link: e.target.value || '' }
                          : defaultValue
                      )
                      setErrorForm({
                        ...errorForm,
                        link: {
                          status: false,
                          message: '',
                        },
                      })
                    }}
                    value={formValues?.link}
                  />
                  {errorForm.link.status && (
                    <div className='pt-2 text-red-700 text-sm'>
                      {errorForm.link.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Panel>

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

export default PartnerUpsert
