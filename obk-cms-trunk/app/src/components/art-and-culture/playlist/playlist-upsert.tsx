/* eslint-disable @next/next/no-img-element */
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import {
  IArtCultureContentUpload,
  IInputErrors,
  IPlaylist,
  IPlaylistForm,
  IPlaylistTranslation,
  PlaylistContentData,
} from '@src/services/art-and-culture/model'
import * as Yup from 'yup'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import { Panel } from 'primereact/panel'
import dayjs from 'dayjs'
import { Calendar } from 'primereact/calendar'
import { InputSwitch } from 'primereact/inputswitch'
import { Tab, TabList, Tabs } from '@chakra-ui/react'
import { clsx } from 'clsx'
import { ProgressBar } from 'primereact/progressbar'
import { Message } from 'primereact/message'
import ImageButtonField from '@components/forms/components/image-button-field'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import {
  isObjectDeepEqual,
  mappingValidateErrorMessage,
} from '@src/utils/art-c'
import { AxiosResponse } from 'axios'
import { last } from 'lodash'
import { convertToBase64 } from '@src/utils/image'
import { artCGeneralServices } from '@src/services/art-and-culture/art-c-general-service'
import { artCPlaylistServices } from '@src/services/art-and-culture/art-c-playlist-services'

interface IPlaylistUpsert {
  type: string
  playlistItem?: IPlaylist
}

interface IPlaylistFormTransValue {
  th: IPlaylistForm
  en: IPlaylistForm
  zh: IPlaylistForm
}

const acceptTypes = ['image/png', 'image/jpg', 'image/jpeg']

const PlaylistUpsert = ({ type, playlistItem }: IPlaylistUpsert) => {
  const router = useRouter()
  const { locale } = router.query
  const formRef = useRef<FormControllerRef<IPlaylistForm>>(null)

  const [isFormSubmitting, setIsFormSubmitting] = useState(false)

  const [formValues, setFormValues] = useState<IPlaylistForm>(
    new PlaylistContentData()
  )
  const [formTransValues, setFormTransValues] =
    useState<IPlaylistFormTransValue>({
      th: new PlaylistContentData(),
      en: new PlaylistContentData(),
      zh: new PlaylistContentData(),
    })

  const [formLocale, setFormLocale] = useState<string>('en')

  const initFormErrors: IInputErrors = {
    isPublished: { status: false, message: '' },
    publishedAt: { status: false, message: '' },
    title: { status: false, message: '' },
    desc: { status: false, message: '' },
    author: { status: false, message: '' },
    thumbnail: { status: false, message: '' },
    durations: { status: false, message: '' },
    link: { status: false, message: '' },
  }

  const [errorForm, setErrorForm] = useState(initFormErrors)
  const [requestError, setRequestError] = useState({
    status: false,
    message: '',
  })

  const [uploadingFile, setUploadingFile] = useState<boolean>(false)
  const [invalidFile, setInvalidFile] = useState<{
    title: string
    message: string
  } | null>(null)

  const initialFormValues = (item: IPlaylist | undefined) => {
    if (item && item.playlistTranslation.length > 0) {
      const value = { ...formTransValues }

      item.playlistTranslation.forEach((itemTrans: IPlaylistTranslation) => {
        if (itemTrans.locale === 'en') {
          value['en'] = {
            title: itemTrans.title,
            desc: itemTrans.desc,
            author: itemTrans.author,
            thumbnail: itemTrans.thumbnail,
            durations: itemTrans.durations,
            link: itemTrans.link,
            publishedAt: item.publishedAt,
            isPublished: item.isPublished ? true : false,
          }
        }

        if (itemTrans.locale === 'th') {
          value['th'] = {
            title: itemTrans.title,
            desc: itemTrans.desc,
            author: itemTrans.author,
            thumbnail: itemTrans.thumbnail,
            durations: itemTrans.durations,
            link: itemTrans.link,
            publishedAt: item.publishedAt,
            isPublished: item.isPublished ? true : false,
          }
        }

        if (itemTrans.locale === 'zh') {
          value['zh'] = {
            title: itemTrans.title,
            desc: itemTrans.desc,
            author: itemTrans.author,
            thumbnail: itemTrans.thumbnail,
            durations: itemTrans.durations,
            link: itemTrans.link,
            publishedAt: item.publishedAt,
            isPublished: item.isPublished ? true : false,
          }
        }
      })

      setFormTransValues(value)
      setFormValues({
        ...value[formLocale as keyof IPlaylistFormTransValue],
        publishedAt: item.publishedAt,
        isPublished: item.isPublished ? true : false,
      })
    }
  }

  const handleFormLocaleChange = (locale: string) => {
    setErrorForm(initFormErrors)
    setRequestError({ status: false, message: '' })

    // save current form values to formTransValues
    const tempFormTransValues = JSON.parse(JSON.stringify(formTransValues))
    tempFormTransValues[formLocale as keyof IPlaylistFormTransValue] =
      formValues

    Object.keys(tempFormTransValues).forEach((key) => {
      if (key === formLocale) return
      tempFormTransValues[key as keyof IPlaylistFormTransValue] = {
        ...tempFormTransValues[key as keyof IPlaylistFormTransValue],
        publishedAt: formValues.publishedAt,
        isPublished: formValues.isPublished,
      }
    })

    // Use freshly updated tempFormTransValues to avoid stale data
    setFormLocale(locale)
    setFormTransValues(tempFormTransValues)

    const selectedLocaleValues =
      tempFormTransValues[locale as keyof IPlaylistFormTransValue]
    setFormValues({
      ...selectedLocaleValues,
    })
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
        const fileValue = { thumbnail: data.imageURL }
        setFormValues({ ...formValues, ...fileValue })
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
    setFormValues({ ...formValues, thumbnail: '' })
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
      .max(255, 'Title must be less than 255 characters')
      .required('Title is required'),
    desc: Yup.string().required('Content is required'),
    author: Yup.string()
      .max(255, 'Author must be less than 255 characters')
      .required('Author is required'),
    thumbnail: Yup.string().required('Thumbnail is required'),
    durations: Yup.number()
      .required('Durations is required')
      .moreThan(-1, 'Durations must greater than 0')
      .integer('Durations must be a number'),
    link: Yup.string()
      .max(255, 'Link must be less than 255 characters')
      .url('Link must be a valid URL')
      .required('Link is required'),
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
      prepareFormValues[formLocale as keyof IPlaylistFormTransValue] =
        formValues
    }

    let isOtherLocaleValid = true
    for (const key in formTransValues) {
      if (isOtherLocaleValid) {
        const checkFormValues = {
          title: formTransValues[key as keyof IPlaylistFormTransValue].title,
          desc: formTransValues[key as keyof IPlaylistFormTransValue].desc,
          author: formTransValues[key as keyof IPlaylistFormTransValue].author,
          thumbnail:
            formTransValues[key as keyof IPlaylistFormTransValue].thumbnail,
          durations:
            formTransValues[key as keyof IPlaylistFormTransValue].durations,
          link: formTransValues[key as keyof IPlaylistFormTransValue].link,
        }

        const defaultValue = new PlaylistContentData()
        const initValues = {
          title: defaultValue.title,
          desc: defaultValue.desc,
          author: defaultValue.author,
          thumbnail: defaultValue.thumbnail,
          durations: defaultValue.durations,
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
            prepareFormValues[
              key as keyof IPlaylistFormTransValue
            ].isPublished = formValues.isPublished
            prepareFormValues[
              key as keyof IPlaylistFormTransValue
            ].publishedAt = formValues.publishedAt
          }
        }
      }
    }

    if (!isOtherLocaleValid) {
      return
    }

    setIsFormSubmitting(true)

    let res = { id: playlistItem ? playlistItem.id : 0, status: false }
    for (const key in prepareFormValues) {
      if (formValuesItem.includes(key)) {
        res = await saveFormValues(
          res.id === 0 ? 0 : res.id,
          `${key}`,
          prepareFormValues[key as keyof IPlaylistFormTransValue]
        )
      }
    }

    if (res.status) {
      router.push(
        `/art-and-culture/playlist${
          type === 'create' ? '?status=createSuccess' : '?status=updateSuccess'
        }`
      )
    }

    setIsFormSubmitting(false)
  }

  const saveFormValues = async (
    id: number,
    saveLocale: string,
    values: IPlaylistForm
  ): Promise<{ id: number; status: boolean }> => {
    try {
      let result: AxiosResponse | null = null

      if (type === 'create' && id === 0) {
        result = await artCPlaylistServices.create(saveLocale, values)
      } else {
        result = await artCPlaylistServices.edit(`${id}`, saveLocale, values)
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
    if (confirm('Are you sure you want to delete this playlist?')) {
      setIsFormSubmitting(true)

      await artCPlaylistServices
        .delete(`${id}`)
        .then(() => {
          router.push('/art-and-culture/playlist')
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

  const onBack = () => router.push('/art-and-culture/playlist')
  const buttonActionTemplate = (
    <div className='flex gap-3 justify-content-center md:justify-content-start'>
      <Button
        disabled={isFormSubmitting}
        className='px-5 py-3 bg-primary-blue text-white'
        label='Publish'
        onClick={formRef.current?.handleSubmit(onSubmit)}
      />
      {type === 'update' && playlistItem && (
        <Button
          type='button'
          className='px-5 text-red-600 border-2 border-red-600'
          label='Delete this playlist'
          severity='danger'
          outlined
          disabled={isFormSubmitting}
          onClick={() => deleteItem(playlistItem.id)}
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
    setTimeout(() => {
      initialFormValues(playlistItem)
      // handleFormLocaleChange(playlistItem, locale ? locale.toString() : 'en')
    }, 250)
  }, [playlistItem, locale])

  return (
    <>
      <FormController
        ref={formRef}
        defualtValue={new PlaylistContentData()}
        onSubmit={onSubmit}
      >
        <Panel className='mb-5'>
          {formValues && (
            <div className='p-2'>
              <div className='mb-5'>
                <h4 className='text-astronaut font-bold'>Details</h4>
                {type === 'update' && playlistItem && (
                  <small className='font-medium'>
                    Last update&nbsp;
                    <span className='font-bold'>
                      {dayjs(playlistItem.updatedAt).format('DD/MM/YYYY HH:mm')}
                      &nbsp;
                    </span>
                  </small>
                )}
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
                        setFormValues({ ...formValues, isPublished: e.value })
                      }
                    />
                  </div>
                </div>
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

              <div className='field grid'>
                <div className='col-12'>
                  <div className='text-primary-800 font-bold pb-2'>
                    Title <span className='text-red-700'>*</span>
                  </div>
                  <InputText
                    key={`title-${formLocale}`}
                    className='w-full'
                    maxLength={255}
                    onChange={(e: any) => {
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
                    Desc <span className='text-red-700'>*</span>
                  </div>
                  <InputText
                    key={`desc-${formLocale}`}
                    className='w-full'
                    maxLength={255}
                    onChange={(e: any) => {
                      setFormValues({
                        ...formValues,
                        desc: e.target.value || '',
                      })
                      setErrorForm({
                        ...errorForm,
                        desc: { status: false, message: '' },
                      })
                    }}
                    value={formValues.desc}
                  />
                  {errorForm.desc.status && (
                    <div className='pt-2 text-red-700 text-sm'>
                      {errorForm.desc.message}
                    </div>
                  )}
                </div>
              </div>

              <div className='field grid'>
                <div className='col-12'>
                  <div className='text-primary-800 font-bold pb-2'>
                    Author <span className='text-red-700'>*</span>
                  </div>
                  <InputText
                    key={`author-${formLocale}`}
                    className='w-full'
                    maxLength={255}
                    onChange={(e: any) => {
                      setFormValues({
                        ...formValues,
                        author: e.target.value || '',
                      })
                      setErrorForm({
                        ...errorForm,
                        author: { status: false, message: '' },
                      })
                    }}
                    value={formValues.author}
                  />
                  {errorForm.author.status && (
                    <div className='pt-2 text-red-700 text-sm'>
                      {errorForm.author.message}
                    </div>
                  )}
                </div>
              </div>

              <div className='flex flex-column mt-4 mb-3 gap-2'>
                <div className='text-primary-800 font-bold pb-2'>
                  Thumbnail image <span className='text-red-700'>*</span>{' '}
                  <small className='text-xs font-bold text-info'>
                    ( Recommend image ratio 1:1 ) (Min 160x160px, Max 480x480)
                    (allow file type: jpg, jpeg, png)
                  </small>
                </div>

                {uploadingFile ? (
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
                        key={`thumbnail-btn-${formLocale}`}
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

              <div className='flex w-full mt-2 -mx-2'>
                <div className='w-6 px-2'>
                  <div className='field grid'>
                    <div className='col-12'>
                      <div className='text-primary-800 font-bold pb-2'>
                        Duration in Minutes{' '}
                        <span className='text-red-700'>*</span>
                      </div>
                      <InputNumber
                        key={`durations-${formLocale}`}
                        name='productPrice'
                        className='w-full'
                        value={formValues.durations || 0}
                        onValueChange={(e) => {
                          setFormValues({
                            ...formValues,
                            durations: e.value || 0,
                          })
                          setErrorForm({
                            ...errorForm,
                            durations: { status: false, message: '' },
                          })
                        }}
                        minFractionDigits={0}
                        maxFractionDigits={2}
                      />
                      {errorForm.durations.status && (
                        <div className='pt-2 text-red-700 text-sm'>
                          {errorForm.durations.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className='w-6 px-2'>
                  <div className='field grid'>
                    <div className='col-12'>
                      <div className='text-primary-800 font-bold pb-2'>
                        Link <span className='text-red-700'>*</span>
                      </div>
                      <InputText
                        key={`link-${formLocale}`}
                        className='w-full'
                        maxLength={255}
                        onChange={(e: any) => {
                          setFormValues({
                            ...formValues,
                            link: e.target.value || '',
                          })
                          setErrorForm({
                            ...errorForm,
                            link: { status: false, message: '' },
                          })
                        }}
                        value={formValues.link}
                      />
                      {errorForm.link.status && (
                        <div className='pt-2 text-red-700 text-sm'>
                          {errorForm.link.message}
                        </div>
                      )}
                    </div>
                  </div>
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
    </>
  )
}

export default PlaylistUpsert
