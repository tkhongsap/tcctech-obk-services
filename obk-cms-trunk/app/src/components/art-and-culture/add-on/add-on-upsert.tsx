/* eslint-disable @next/next/no-img-element */
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import {
  acceptImageFileTypes,
  AddOnContentData,
  IAddOnForm,
  IAddOnItem,
  IAddOnTranslation,
  IArtCultureContentUpload,
  IInputErrors,
  IPartnerItem,
  IPartnerTranslation,
  OptionItem,
} from '@src/services/art-and-culture/model'
import { useRouter } from 'next/router'
import * as Yup from 'yup'
import React, { useEffect, useRef, useState } from 'react'
import { AxiosResponse } from 'axios'
import {
  isObjectDeepEqual,
  mappingValidateErrorMessage,
} from '@src/utils/art-c'
import { Button } from 'primereact/button'
import dayjs from 'dayjs'
import { Panel } from 'primereact/panel'
import { MultiSelect } from 'primereact/multiselect'
import { Calendar } from 'primereact/calendar'
import { InputSwitch } from 'primereact/inputswitch'
import { Tab, TabList, Tabs } from '@chakra-ui/react'
import clsx from 'clsx'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { ProgressBar } from 'primereact/progressbar'
import { Message } from 'primereact/message'
import ImageButtonField from '@components/forms/components/image-button-field'
import { Chips } from 'primereact/chips'
import Image from 'next/image'
import { last } from 'lodash'
import { convertToBase64 } from '@src/utils/image'
import { artCGeneralServices } from '@src/services/art-and-culture/art-c-general-service'
import { artCAddOnServices } from '@src/services/art-and-culture/art-c-add-on-service'
import { artCPartnerServices } from '@src/services/art-and-culture/art-c-partner-services'
import { toast } from 'react-toastify'
import CustomEditor from '@components/input/customEditor'

interface IAddOnUpsert {
  type: string
  item?: IAddOnItem
}

interface IAddOnFormTransValue {
  th: IAddOnForm
  en: IAddOnForm
  zh: IAddOnForm
}

export default function AddOnUpsert({ type, item }: IAddOnUpsert) {
  const router = useRouter()
  const { locale } = router.query
  const { query } = router
  const { id } = query
  const formRef = useRef<FormControllerRef<IAddOnForm>>(null)

  const [isFormSubmitting, setIsFormSubmitting] = useState(false)
  const [formLocale, setFormLocale] = useState<string>('en')
  const [formValues, setFormValues] = useState<IAddOnForm>(
    new AddOnContentData()
  )
  const [formTransValues, setFormTransValues] = useState<IAddOnFormTransValue>({
    th: new AddOnContentData(),
    en: new AddOnContentData(),
    zh: new AddOnContentData(),
  })

  const [partnerItems, setPartnerItems] = useState<IPartnerItem[]>([])
  const [selectedPartners, setSelectedPartners] = useState<string[]>([])
  const [partnerOptions, setPartnerOptions] = useState<OptionItem[]>([])

  const addOnType = [
    {
      label: 'Story',
      value: 'story',
    },
    {
      label: 'Audio',
      value: 'audio',
    },
    {
      label: 'Video',
      value: 'video',
    },
  ]

  const initFormErrors: IInputErrors = {
    type: { status: false, message: '' },
    isPublished: { status: false, message: '' },
    publishedAt: { status: false, message: '' },
    title: { status: false, message: '' },
    desc: { status: false, message: '' },
    thumbnail: { status: false, message: '' },
    banner: { status: false, message: '' },
    audio: { status: false, message: '' },
    video: { status: false, message: '' },
    partners: { status: false, message: '' },
    tags: { status: false, message: '' },
  }

  const [errorForm, setErrorForm] = useState(initFormErrors)
  const [requestError, setRequestError] = useState({
    status: false,
    message: '',
  })

  const initialFormValues = (item: IAddOnItem | undefined) => {
    if (item && item.addOnTranslation.length > 0) {
      const value = { ...formTransValues }
      setSelectedPartners(item.partners.map((item) => `${item.id}`))

      item.addOnTranslation.forEach((itemTrans: IAddOnTranslation) => {
        if (itemTrans.locale === 'en') {
          value['en'] = {
            type: item.type,
            title: itemTrans.title,
            desc: itemTrans.desc,
            thumbnail: itemTrans.thumbnail,
            banner: itemTrans.banner,
            audio: itemTrans.audio,
            video: itemTrans.video,
            tags: itemTrans.tags,
            partners: item.partners,
            publishedAt: item.publishedAt,
            isPublished: item.isPublished ? true : false,
          }
        }

        if (itemTrans.locale === 'th') {
          value['th'] = {
            type: item.type,
            title: itemTrans.title,
            desc: itemTrans.desc,
            thumbnail: itemTrans.thumbnail,
            banner: itemTrans.banner,
            audio: itemTrans.audio,
            video: itemTrans.video,
            tags: itemTrans.tags,
            partners: item.partners,
            publishedAt: item.publishedAt,
            isPublished: item.isPublished ? true : false,
          }
        }

        if (itemTrans.locale === 'zh') {
          value['zh'] = {
            type: item.type,
            title: itemTrans.title,
            desc: itemTrans.desc,
            thumbnail: itemTrans.thumbnail,
            banner: itemTrans.banner,
            audio: itemTrans.audio,
            video: itemTrans.video,
            tags: itemTrans.tags,
            partners: item.partners,
            publishedAt: item.publishedAt,
            isPublished: item.isPublished ? true : false,
          }
        }
      })

      setFormTransValues(value)
      setFormValues({
        ...value[formLocale as keyof IAddOnFormTransValue],
        type: item.type,
        partners: item.partners,
        publishedAt: item.publishedAt,
        isPublished: item.isPublished ? true : false,
      })
    }
  }

  const handleFormLocaleChange = (locale: string) => {
    setErrorForm(initFormErrors)
    setRequestError({ status: false, message: '' })

    // save current form values to formTransValues (deep copy to avoid mutation)
    const tempFormTransValues = JSON.parse(JSON.stringify(formTransValues))
    tempFormTransValues[formLocale as keyof IAddOnFormTransValue] = formValues

    Object.keys(tempFormTransValues).forEach((key) => {
      if (key === formLocale) return
      tempFormTransValues[key as keyof IAddOnFormTransValue] = {
        ...tempFormTransValues[key as keyof IAddOnFormTransValue],
        type: formValues.type,
        partners: formValues.partners,
        publishedAt: formValues.publishedAt,
        isPublished: formValues.isPublished,
      }
    })

    // Use freshly updated tempFormTransValues to avoid stale data
    setFormLocale(locale)
    setFormTransValues(tempFormTransValues)

    const selectedLocaleValues =
      tempFormTransValues[locale as keyof IAddOnFormTransValue]
    setFormValues({
      ...selectedLocaleValues,
    })
  }

  const onEditContent = (editorState: any) => {
    if (formValues) {
      setFormValues({
        ...formValues,
        desc: editorState ? editorState : '',
      })

      setErrorForm({
        ...errorForm,
        desc: { status: false, message: '' },
      })
    }
  }

  const [uploadingThumbnailFile, setUploadingThumbnailFile] =
    useState<boolean>(false)
  const [invalidThumbnailFile, setInvalidThumbnailFile] = useState<{
    title: string
    message: string
  } | null>(null)

  const [uploadingBannerFile, setUploadingBannerFile] = useState<boolean>(false)
  const [invalidBannerFile, setInvalidBannerFile] = useState<{
    title: string
    message: string
  } | null>(null)

  const onFileChange = async (type: string, file: File) => {
    setInvalidThumbnailFile(null)
    setInvalidBannerFile(null)

    if (type === 'thumbnail') {
      setErrorForm({
        ...errorForm,
        thumbnail: {
          status: false,
          message: '',
        },
      })
    }

    if (type === 'banner') {
      setErrorForm({
        ...errorForm,
        banner: {
          status: false,
          message: '',
        },
      })
    }

    if (type === 'thumbnail') {
      setUploadingThumbnailFile(true)
    } else {
      setUploadingBannerFile(true)
    }

    const size = file.size / 1024 / 1024
    if (size > 2) {
      if (type === 'thumbnail') {
        setInvalidThumbnailFile({
          title: 'File size is too large',
          message: 'Please upload a file with size less than 2MB',
        })
      } else {
        setInvalidBannerFile({
          title: 'File size is too large',
          message: 'Please upload a file with size less than 2MB',
        })
      }

      setUploadingThumbnailFile(false)
      setUploadingBannerFile(false)

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
        const fileValue =
          type === 'thumbnail'
            ? { thumbnail: data.imageURL }
            : { banner: data.imageURL }
        setFormValues({ ...formValues, ...fileValue })
      } else {
        throw new Error('Something went wrong while uploading the file')
      }
    } catch (error) {
      if (type === 'thumbnail') {
        setErrorForm({
          ...errorForm,
          thumbnail: {
            status: true,
            message: 'Something went wrong while uploading the file',
          },
        })
      } else {
        setErrorForm({
          ...errorForm,
          banner: {
            status: true,
            message: 'Something went wrong while uploading the file',
          },
        })
      }
    }

    setUploadingThumbnailFile(false)
    setUploadingBannerFile(false)
  }

  const onRemoveFile = (type: string) => {
    const fileValue = type === 'thumbnail' ? { thumbnail: '' } : { banner: '' }
    setFormValues({ ...formValues, ...fileValue })

    if (type === 'thumbnail') {
      setErrorForm({
        ...errorForm,
        thumbnail: {
          status: false,
          message: '',
        },
      })
    }

    if (type === 'banner') {
      setErrorForm({
        ...errorForm,
        banner: {
          status: false,
          message: '',
        },
      })
    }
  }

  let validationSchema = Yup.object({
    type: Yup.string().required('Type is required'),
    title: Yup.string().required('Title is required'),
    desc: Yup.string().required('Content is required'),
    thumbnail: Yup.string().required('Thumbnail is required'),
    banner: Yup.string().required('Cover image is required'),
    audio: Yup.string().when('type', {
      is: () => formValues.type === 'audio',
      then: (schema) => schema.required('Audio is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    video: Yup.string().when('type', {
      is: () => formValues.type === 'video',
      then: (schema) => schema.required('Video is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
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
      prepareFormValues[formLocale as keyof IAddOnFormTransValue] = formValues
    }

    let isOtherLocaleValid = true
    for (const key in formTransValues) {
      if (isOtherLocaleValid) {
        const checkFormValues = {
          title: formTransValues[key as keyof IAddOnFormTransValue].title,
          desc: formTransValues[key as keyof IAddOnFormTransValue].desc,
          thumbnail:
            formTransValues[key as keyof IAddOnFormTransValue].thumbnail,
          banner: formTransValues[key as keyof IAddOnFormTransValue].banner,
          audio: formTransValues[key as keyof IAddOnFormTransValue].audio,
          video: formTransValues[key as keyof IAddOnFormTransValue].video,
          tags: formTransValues[key as keyof IAddOnFormTransValue].tags,
        }

        const defaultValue = new AddOnContentData()

        const initValues = {
          title: defaultValue.title,
          desc: defaultValue.desc,
          thumbnail: defaultValue.thumbnail,
          banner: defaultValue.banner,
          audio: defaultValue.audio,
          video: defaultValue.video,
          tags: defaultValue.tags,
        }

        if (!isObjectDeepEqual(checkFormValues, initValues)) {
          const result = await validationSchema
            .validate(
              { ...checkFormValues, type: formValues.type },
              { abortEarly: false }
            )
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
            prepareFormValues[key as keyof IAddOnFormTransValue].type =
              formValues.type
            prepareFormValues[key as keyof IAddOnFormTransValue].partners =
              formValues.partners
            prepareFormValues[key as keyof IAddOnFormTransValue].isPublished =
              formValues.isPublished
            prepareFormValues[key as keyof IAddOnFormTransValue].publishedAt =
              formValues.publishedAt
          }
        }
      }
    }

    if (!isOtherLocaleValid) {
      return
    }

    setIsFormSubmitting(true)

    let res = { id: item ? item.id : 0, status: false }
    for (const key in prepareFormValues) {
      if (formValuesItem.includes(key)) {
        const tempAnswer = document.createElement('div')
        tempAnswer.innerHTML =
          prepareFormValues[key as keyof IAddOnFormTransValue].desc
        tempAnswer.querySelectorAll('img').forEach((img) => {
          img.removeAttribute('style')
          img.removeAttribute('width')
          img.removeAttribute('height')
        })

        const saveValue = {
          ...prepareFormValues[key as keyof IAddOnFormTransValue],
          desc: tempAnswer.outerHTML,
        }

        res = await saveFormValues(
          res.id === 0 ? 0 : res.id,
          `${key}`,
          saveValue
        )
      }
    }

    if (res.status) {
      router.push(
        `/art-and-culture/add-on${
          type === 'create' ? '?status=createSuccess' : '?status=updateSuccess'
        }`
      )
    }

    setIsFormSubmitting(false)
  }

  const saveFormValues = async (
    id: number,
    saveLocale: string,
    values: IAddOnForm
  ): Promise<{ id: number; status: boolean }> => {
    try {
      let result: AxiosResponse | null = null

      if (type === 'create' && id === 0) {
        result = await artCAddOnServices.create(saveLocale, values)
      } else {
        result = await artCAddOnServices.edit(`${id}`, saveLocale, values)
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
    if (confirm('Are you sure you want to delete this add-on?')) {
      setIsFormSubmitting(true)

      await artCAddOnServices
        .delete(`${id}`)
        .then(() => {
          router.push('/art-and-culture/add-on')
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

  const onBack = () => router.push('/art-and-culture/add-on')
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
          label='Delete this add-on'
          severity='danger'
          outlined
          disabled={isFormSubmitting}
          onClick={() => deleteItem(item!.id)}
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

  const fetchPartners = async () => {
    await artCPartnerServices
      .getAll('all')
      .then((res) => {
        const { data } = res.data

        setPartnerItems(data)

        const selectedPartnersId: number[] = item
          ? item.partners.map((partner) => partner.id)
          : []

        const selectedOptions: string[] = []
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

            if (selectedPartnersId.includes(partner.id)) {
              selectedOptions.push(`${partner.id}`)
            }
          }
        })

        setSelectedPartners(selectedOptions)
        setPartnerOptions(options)
      })
      .catch(() => {
        setRequestError({
          status: true,
          message: 'Something went wrong, please try again.',
        })
      })
  }

  useEffect(() => {
    setTimeout(() => {
      initialFormValues(item)
      fetchPartners()
    }, 250)
  }, [item, locale])

  const fallbackCopyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea')
    textArea.value = text

    // Avoid scrolling to bottom of page when selecting text
    textArea.style.position = 'fixed'
    textArea.style.top = '0'
    textArea.style.left = '0'
    textArea.style.width = '2em'
    textArea.style.height = '2em'
    textArea.style.padding = '0'
    textArea.style.border = 'none'
    textArea.style.outline = 'none'
    textArea.style.boxShadow = 'none'
    textArea.style.background = 'transparent'

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      const successful = document.execCommand('copy')
      if (successful) {
        toast.success('Copy ID Successfully.')
      } else {
        toast.warning('Failed to copy ID.')
      }
    } catch (err) {
      toast.warning('Failed to copy ID.')
    }

    document.body.removeChild(textArea)
  }

  return (
    <>
      <div className='flex'>
        <div className='col-8'>
          <FormController
            ref={formRef}
            defualtValue={new AddOnContentData()}
            onSubmit={onSubmit}
          >
            <Panel className='mb-5'>
              {formValues && (
                <div className='p-2'>
                  <div>
                    <div className='flex tw-justify-between'>
                      <h4 className='text-astronaut font-bold'>Details</h4>
                      <div>
                        {type === 'update' && (
                          <Button
                            type='button'
                            label='Copy ID to Clipboard'
                            size='small'
                            style={{ marginRight: '1rem' }}
                            onClick={() =>
                              fallbackCopyToClipboard((id ?? '').toString())
                            }
                          />
                        )}
                      </div>
                    </div>

                    {type === 'update' && item && (
                      <small className='font-medium'>
                        Last update&nbsp;
                        <span className='font-bold'>
                          {dayjs(item.updatedAt).format('DD/MM/YYYY HH:mm')}
                          &nbsp;
                        </span>
                      </small>
                    )}
                  </div>

                  <div className='flex w-full -mx-2'>
                    <div className='w-6 flex-shrink-0 mt-5 px-2'>
                      <div className='text-primary-800 font-bold pb-2'>
                        Content Type <span className='text-red-700'>*</span>
                      </div>
                      <div>
                        <Dropdown
                          value={formValues.type}
                          onChange={(e) => {
                            setFormValues({ ...formValues, type: e.value })
                            setErrorForm({
                              ...errorForm,
                              type: { status: false, message: '' },
                            })
                          }}
                          options={addOnType}
                          placeholder='Select Content Type'
                          className='w-full'
                        />
                      </div>
                      {errorForm.type.status && (
                        <div className='pt-2 text-red-700 text-sm'>
                          {errorForm.type.message}
                        </div>
                      )}
                    </div>

                    <div className='w-6 flex-shrink-0 mt-5 px-2'>
                      <div className='text-primary-800 font-bold pb-2'>
                        Partners
                      </div>
                      <div className='multi-select-display-all'>
                        <MultiSelect
                          display='chip'
                          value={selectedPartners}
                          onChange={(e) => {
                            setSelectedPartners(e.value)

                            const partnersId: number[] = []
                            e.value.forEach((id: string) => {
                              partnersId.push(Number(id))
                            })

                            const partnersValue = partnerItems.filter(
                              (addOn) => partnersId.includes(addOn.id) && addOn
                            )
                            setFormValues({
                              ...formValues,
                              partners: partnersValue,
                            })
                          }}
                          options={partnerOptions}
                          optionLabel='label'
                          filter
                          placeholder='Select partners'
                          maxSelectedLabels={100}
                          className='w-full'
                        />
                      </div>
                    </div>
                  </div>

                  <div className='flex'>
                    <div className='field grid mt-5 pr-4'>
                      <div className='flex col-12 tw-items-center'>
                        <div className='flex items-center text-primary-800 font-bold pr-2'>
                          <div>Publish At</div>
                        </div>
                        <div>
                          <Calendar
                            id='calendar-24h'
                            value={
                              formValues?.publishedAt
                                ? dayjs(formValues?.publishedAt).toDate()
                                : null
                            }
                            onChange={(e) => {
                              if (e.value) {
                                setFormValues({
                                  ...formValues,
                                  publishedAt: e.value,
                                })
                              }
                            }}
                            dateFormat='dd/mm/yy '
                            showTime
                            hourFormat='24'
                            showIcon
                          />
                        </div>
                      </div>
                    </div>

                    <div className='field grid mt-5'>
                      <div className='flex col-12 tw-items-center'>
                        <div className='text-primary-800 font-bold pr-2'>
                          Publish Content
                        </div>
                        <InputSwitch
                          checked={formValues?.isPublished}
                          onChange={(e) =>
                            setFormValues({
                              ...formValues,
                              isPublished: e.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className='relative my-5'>
                    <div className='relative tw-w-full'>
                      {(uploadingThumbnailFile || uploadingBannerFile) && (
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

                  <div className='field grid'>
                    <div className='col-12'>
                      <div className='text-primary-800 font-bold pb-2'>
                        Title <span className='text-red-700'>*</span>
                      </div>
                      <InputText
                        key={`title-${formLocale}`}
                        className='w-full'
                        maxLength={255}
                        onChange={(e) => {
                          setFormValues({
                            ...formValues,
                            title: e.target.value || '',
                          })
                          setErrorForm({
                            ...errorForm,
                            title: { status: false, message: '' },
                          })
                        }}
                        value={formValues.title}
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
                      <div className='text-primary-800 font-bold pb-2'>
                        Content <span className='text-red-700'>*</span>
                      </div>
                      <CustomEditor
                        key={`desc-${formLocale}`}
                        onChange={onEditContent}
                        data={formValues.desc}
                      />
                      {errorForm.desc.status && (
                        <div className='pt-2 text-red-700 text-sm'>
                          {errorForm.desc.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='flex flex-column mt-5 gap-2'>
                    <div className='pb-2'>
                      <div className='text-primary-800 font-bold'>
                        Thumbnail image <span className='text-red-700'>*</span>
                      </div>
                      <small className='text-xs font-bold text-info'>
                        ( Recommend image size: Min 360x388px, Max 520x560)
                        (allow file type: jpg, jpeg, png)
                      </small>
                    </div>
                    {uploadingThumbnailFile ? (
                      <ProgressBar
                        mode='indeterminate'
                        style={{ height: '6px' }}
                      ></ProgressBar>
                    ) : formValues.thumbnail ? (
                      <Message
                        key={`thumbnail-${formLocale}`}
                        content={
                          <div className='w-full'>
                            <div className='w-full flex justify-content-between py-3'>
                              <span>{formValues.thumbnail}</span>
                              <i
                                className='pi pi-times cursor-pointer'
                                onClick={() => onRemoveFile('thumbnail')}
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
                            key={`thumbnail-btn-${formLocale}`}
                            rules={{ required: false }}
                            acceptTypes={acceptImageFileTypes.join(', ')}
                            name='coverImage'
                            outputType='file'
                            mode='single'
                            onError={setInvalidThumbnailFile}
                            onChange={(file) => onFileChange('thumbnail', file)}
                          />
                        </div>
                      </>
                    )}

                    {invalidThumbnailFile && (
                      <div className='pt-2 text-red-700 text-sm'>
                        <span className='text-danger'>
                          <span className='font-bold'>
                            {invalidThumbnailFile.title} :
                          </span>
                          {invalidThumbnailFile.message}
                        </span>
                      </div>
                    )}
                    {errorForm.thumbnail.status && (
                      <div className='pt-2 text-red-700 text-sm'>
                        {errorForm.thumbnail.message}
                      </div>
                    )}
                  </div>

                  <div className='flex flex-column mt-5 gap-2'>
                    <div className='pb-2'>
                      <div className='text-primary-800 font-bold'>
                        Cover image <span className='text-red-700'>*</span>
                      </div>
                      <small className='text-xs font-bold text-info'>
                        ( Recommend image size: Min 375x211px, Max 860x484)
                        (allow file type: jpg, jpeg, png)
                      </small>
                    </div>
                    {uploadingBannerFile ? (
                      <ProgressBar
                        mode='indeterminate'
                        style={{ height: '6px' }}
                      ></ProgressBar>
                    ) : formValues.banner ? (
                      <Message
                        key={`banner-${formLocale}`}
                        content={
                          <div className='w-full'>
                            <div className='w-full flex justify-content-between py-3'>
                              <span>{formValues.banner}</span>
                              <i
                                className='pi pi-times cursor-pointer'
                                onClick={() => onRemoveFile('banner')}
                              ></i>
                            </div>

                            <div
                              className='tw-rounded-lg overflow-hidden mb-2'
                              style={{ maxWidth: '200px', lineHeight: 0 }}
                            >
                              <img
                                src={formValues.banner}
                                alt='banner'
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
                            key={`banner-btn-${formLocale}`}
                            rules={{ required: false }}
                            acceptTypes={acceptImageFileTypes.join(', ')}
                            name='coverImage'
                            outputType='file'
                            mode='single'
                            onError={setInvalidBannerFile}
                            onChange={(file) => onFileChange('banner', file)}
                          />
                        </div>
                      </>
                    )}

                    {invalidBannerFile && (
                      <div className='pt-2 text-red-700 text-sm'>
                        <span className='text-danger'>
                          <span className='font-bold'>
                            {invalidBannerFile.title} :
                          </span>
                          {invalidBannerFile.message}
                        </span>
                      </div>
                    )}
                    {errorForm.banner.status && (
                      <div className='pt-2 text-red-700 text-sm'>
                        {errorForm.banner.message}
                      </div>
                    )}
                  </div>

                  <div className='flex -mx-2'>
                    <div className='w-6 mt-5 px-2'>
                      <div className='field grid'>
                        <div className='col-12'>
                          <div className='text-primary-800 font-bold pb-2'>
                            Audio
                          </div>
                          <InputText
                            key={`audio-${formLocale}`}
                            className='w-full'
                            maxLength={255}
                            disabled={formValues.type !== 'audio'}
                            onChange={(e) => {
                              setFormValues({
                                ...formValues,
                                audio:
                                  e.target.value.replace(/true/g, 'false') ||
                                  '',
                              })
                              setErrorForm({
                                ...errorForm,
                                audio: { status: false, message: '' },
                              })
                            }}
                            value={formValues.audio}
                          />
                          {errorForm.audio.status && (
                            <div className='pt-2 text-red-700 text-sm'>
                              {errorForm.audio.message}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className='w-6 mt-5 px-2'>
                      <div className='field grid'>
                        <div className='col-12'>
                          <div className='text-primary-800 font-bold pb-2'>
                            Video
                          </div>
                          <InputText
                            key={`video-${formLocale}`}
                            className='w-full'
                            maxLength={255}
                            disabled={formValues.type !== 'video'}
                            onChange={(e) => {
                              setFormValues({
                                ...formValues,
                                video: e.target.value || '',
                              })
                              setErrorForm({
                                ...errorForm,
                                video: { status: false, message: '' },
                              })
                            }}
                            value={formValues.video}
                          />
                          {errorForm.video.status && (
                            <div className='pt-2 text-red-700 text-sm'>
                              {errorForm.video.message}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='field grid mt-3'>
                    <div className='col-6'>
                      <div className='text-primary-800 font-bold pb-2'>
                        Tags
                      </div>
                      <Chips
                        key={`tags-${formLocale}`}
                        name='tags'
                        className='w-full'
                        value={formValues.tags}
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            tags: e.value || [],
                          })
                        }
                        separator=','
                      />
                      {errorForm.tags.status && (
                        <div className='pt-2 text-red-700 text-sm'>
                          {errorForm.tags.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Panel>
            {requestError.status && (
              <div className='pb-4 text-red-700 text-sm'>
                {requestError.message}
              </div>
            )}
            <div>{buttonActionTemplate}</div>
          </FormController>
        </div>

        <div className='pl-2' style={{ width: '480px' }}>
          <div className='card'>
            <h4 className='text-astronaut font-bold'>Preview</h4>
            <div className='card-body'>
              <div
                className='border-2 border-gray-600 w-full pb-8'
                style={{
                  height: '796px',
                  overflowX: 'hidden',
                  overflowY: 'auto',
                }}
              >
                <div
                  className='bg-cover bg-center'
                  style={{
                    backgroundImage: `url(${
                      formValues.banner
                        ? formValues.banner
                        : '/images/art-c/thumb-img-375-520.png'
                    })`,
                  }}
                >
                  <Image
                    src='/images/art-c/space-375-450.png'
                    className='w-full h-auto'
                    alt=''
                    width={375}
                    height={450}
                  />
                </div>

                <div className='pt-4 px-4'>
                  <div
                    className='text-sm capitalize'
                    style={{ color: '#DC7032' }}
                  >
                    <strong>{formValues.type || 'Selected Type'}</strong>
                  </div>
                  <h4 className='mt-2 mb-0'>
                    {formValues.title || 'Title go here'}
                  </h4>

                  <div
                    className='mt-2 preview-html-content'
                    dangerouslySetInnerHTML={{
                      __html: formValues.desc || 'Content go here',
                    }}
                  />

                  {formValues.type === 'video' && (
                    <div className='pt-4'>
                      <iframe
                        width='100%'
                        height='220'
                        src={formValues.video}
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                      ></iframe>
                    </div>
                  )}

                  {formValues.type === 'audio' && (
                    <div className='pt-4'>
                      <iframe width='100%' src={formValues.audio}></iframe>
                    </div>
                  )}

                  {formValues.partners && formValues.partners.length > 0 && (
                    <div className='pt-4'>
                      <div className='text-sm'>
                        <strong>In partnership with</strong>
                      </div>
                      <div className='flex -mx-1 pt-2'>
                        {formValues.partners.map((partner) => {
                          let translation: IPartnerTranslation | undefined
                          for (let item of ['en', 'th', 'zh']) {
                            translation = partner.partnerTranslation.find(
                              (tItem) => tItem.locale === item
                            )
                            if (translation) {
                              break
                            }
                          }

                          if (!translation) {
                            return null
                          }

                          return (
                            <div
                              key={`preview-partner-item-${partner.id}`}
                              className='px-1'
                            >
                              <div
                                className='bg-cover bg-center'
                                style={{
                                  backgroundImage: `url(${translation.thumbnail})`,
                                }}
                              >
                                <Image
                                  src='/images/art-c/dot.png'
                                  className='w-12 h-12'
                                  alt=''
                                  width={60}
                                  height={60}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {formValues.tags && formValues.tags.length > 0 && (
                    <div className='pt-4'>
                      <div className='text-sm pb-2'>
                        <strong>Tags</strong>
                      </div>
                      <div className='flex flex-wrap -mx-1'>
                        {formValues.tags.map((tag, index) => (
                          <div key={`tag-item-${index}`} className='px-1 pb-2'>
                            <div
                              className='px-3 py-1'
                              style={{
                                border: '1px solid #4F4F4F',
                                borderRadius: '16px',
                              }}
                            >
                              {tag}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className='mt-5'>
                    <div>
                      <div className='text-sm pb-2'>
                        <strong>Add on Material</strong>
                      </div>

                      <div className='flex pt-2 -mx-1'>
                        <div className='col-7 px-1 flex-shrink-0'>
                          <div className='bg-gray-400'>
                            <Image
                              src='/images/art-c/space-320-490.png'
                              className='w-full h-auto'
                              alt=''
                              width={320}
                              height={490}
                            />
                          </div>
                        </div>

                        <div className='col-7 px-1 flex-shrink-0'>
                          <div className='bg-gray-400'>
                            <Image
                              src='/images/art-c/space-320-490.png'
                              className='w-full h-auto'
                              alt=''
                              width={320}
                              height={490}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='mt-5'>
                    <div>
                      <div className='text-sm pb-2'>
                        <strong>Relate Programs</strong>
                      </div>

                      <div className='flex pt-2 -mx-1'>
                        <div className='col-7 px-1 flex-shrink-0'>
                          <div className='bg-gray-400'>
                            <Image
                              src='/images/art-c/space-320-490.png'
                              className='w-full h-auto'
                              alt=''
                              width={320}
                              height={490}
                            />
                          </div>
                        </div>

                        <div className='col-7 px-1 flex-shrink-0'>
                          <div className='bg-gray-400'>
                            <Image
                              src='/images/art-c/space-320-490.png'
                              className='w-full h-auto'
                              alt=''
                              width={320}
                              height={490}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
