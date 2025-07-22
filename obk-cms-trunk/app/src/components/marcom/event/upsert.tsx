/* eslint-disable unused-imports/no-unused-vars-ts */
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import { useNavigation, useResource } from '@refinedev/core'
import { KeyValue } from '@src/types/key-value'
import { useRouter } from 'next/router'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import DropdownField from '@components/forms/components/dropdown-field'
import CheckBoxField from '@components/forms/components/checkbox-field'
import CalendarField from '@components/forms/components/calendar-field'
import { TabMenu } from 'primereact/tabmenu'
import TextField from '@components/forms/components/text-field'
import { ProgressBar } from 'primereact/progressbar'
import { Image } from 'primereact/image'
import ImageButtonField from '@components/forms/components/image-button-field'
import { last } from 'lodash'
import { convertToBase64 } from '@src/utils/image'
import {
  IEventData,
  IEventUpload,
} from '@src/services/marcom/special-event/model'
import { eventService } from '@src/services/marcom/special-event/service'
import { Message } from 'primereact/message'
import moment from 'moment'
import { confirmDialog } from 'primereact/confirmdialog'
import { toast } from 'react-toastify'
import { Dialog } from 'primereact/dialog'
import PreviewEvent from './preview-event'

const status: KeyValue[] = [
  { name: 'Active', value: '1' },
  { name: 'Inactive', value: '0' },
]

type Lang = {
  label: string
  code: 'en' | 'th' | 'cn'
  disabled: boolean
}

const acceptTypes = ['image/png', 'image/jpg', 'image/jpeg']

interface InvalidFile {
  title: string
  message: string
}

interface FileState {
  file?: IEventData
  invalidFile: InvalidFile | null
  uploading: boolean
}

interface OverallFileState {
  en: FileState
  th: FileState
  cn: FileState
}

const initialFileState: OverallFileState = {
  en: { file: undefined, invalidFile: null, uploading: false },
  th: { file: undefined, invalidFile: null, uploading: false },
  cn: { file: undefined, invalidFile: null, uploading: false },
}

const Upsert = (props: any) => {
  const { defaultValue, eventData, formType } = props
  const formRef = useRef<FormControllerRef<any>>(null)

  const langItems: Lang[] = [
    {
      code: 'en',
      label: 'English',
      disabled: false,
    },
    {
      code: 'th',
      label: 'Thai',
      disabled: false,
    },
    {
      code: 'cn',
      label: 'Chinese',
      disabled: false,
    },
  ]

  const resources = useResource()
  const { list } = useNavigation()

  const { query } = useRouter()

  const [activeLang, setActiveLang] = useState<Lang>(langItems[0])
  const [requiredLang, setRequiredLang] = useState<string[]>(['en'])

  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [isAllTime, setIsAllTime] = useState<boolean>(false)
  const [isShowMessage, setIsShowMessage] = useState<boolean>(false)
  const [isFormChange, setIsFormChange] = useState<boolean>(false)

  const [minDate, setMinDate] = useState<any>(null)
  const [maxDate, setMaxDate] = useState<any>(null)

  const [fileState, setFileState] = useState<OverallFileState>(initialFileState)

  const isLangRequired = (lang: keyof OverallFileState) => {
    return !fileState[lang].file
  }

  const onCheckRequired = (lang: any) => {
    if (lang === 'en') return

    if (isLangRequired(lang)) {
      setRequiredLang((prevData) => prevData.filter((item) => item !== lang))
    }
  }

  const onBack = () => list(resources?.identifier ?? '')

  const mapData = (data: any) => {
    const { id } = query

    const result: any = {
      id: id,
      eventName: data.event,
      status: data.status === '1',
      isDontShowAgain: isShowMessage,
      isDelete: false,
      start: moment(data.start_at).valueOf(),
      end: !data.alltime ? moment(data.end_at).valueOf() : null,
      alltime: data.alltime,
      detail: {
        en: {},
        th: {},
        cn: {},
      },
    }

    Object.keys(data).forEach((key) => {
      if (key !== 'status') {
        const [property, lang] = key.split('_')
        if (lang && lang.length == 2) {
          if (!result.detail[lang]) {
            result.detail[lang] = {}
          }
          result.detail[lang][property] = data[key]
        }
      }
    })
    ;(['en', 'th', 'cn'] as Array<keyof OverallFileState>).forEach(
      (lang: keyof OverallFileState) => {
        const { file: cover } = fileState[lang]
        if (cover) {
          result.detail[lang] = result.detail[lang] || {}
          result.detail[lang].imageURL = cover.imageURL
          result.detail[lang].originalFileName = cover.originalFileName
          result.detail[lang].fileName = cover.fileName
        }
      }
    )

    return result
  }

  const onSubmit = (data: any) => {
    const result = mapData(data)
    confirmDialog({
      message: 'Are you sure you want to save Event?',
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
              accept()
              setLoading(true)
              try {
                await toast.promise(eventService.save(result), {
                  pending: 'Loading...',
                  success: 'Event save successfully!',
                  error: {
                    render(err: any) {
                      const message =
                        err.data?.response?.data?.messages?.[0] ??
                        'Something went wrong.'
                      setLoading(false)
                      return `Error: ${message}`
                    },
                  },
                })
                setTimeout(() => {
                  setLoading(false)
                  onBack()
                }, 500)
              } catch (_error) {}
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

  const updateState = (
    setter: React.Dispatch<React.SetStateAction<any>>,
    lang: string
  ) => {
    setter((prev: any) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        invalidFile: {
          title: 'Missing field',
          message: 'Please upload image',
        },
      },
    }))
  }

  const onInvalidSubmit = (err: any) => {
    const languages: any[] = ['en', 'th', 'cn']

    languages.forEach((lang) => {
      if (err[`imageFile_${lang}`]) {
        updateState(setFileState, lang)
      }
    })

    const activeLangKey = languages.find((lang) =>
      Object.keys(err).some(
        (key) => key.includes(`_${lang}`) || key.includes(`${lang}_`)
      )
    )

    if (activeLangKey) {
      let activeLangLabel: string

      if (activeLangKey === 'en') {
        activeLangLabel = 'English'
      } else if (activeLangKey === 'th') {
        activeLangLabel = 'Thai'
      } else {
        activeLangLabel = 'Chinese'
      }
      setActiveLang({
        code: activeLangKey,
        label: activeLangLabel,
        disabled: false,
      })
    }
  }

  const createObject = (banner: any): any => ({
    imageURL: banner.imageURL,
    fileName: banner.fileName,
    originalFileName: banner.originalFileName,
    message: '',
  })

  const setFormValues = (file: any, prefix: string) => {
    formRef.current?.setValue(`fileName${prefix}`, file.fileName)
    formRef.current?.setValue(
      `originalFileName${prefix}`,
      file.originalFileName
    )
    formRef.current?.setValue(`image${prefix}URL`, file.imageURL)
  }

  useEffect(() => {
    if (eventData) {
      setLoading(true)
      const reqLang = ['en']
      formRef.current?.setValue('status', eventData.status ? '1' : '0')
      formRef.current?.setValue('show', eventData.isDontShowAgain)
      formRef.current?.setValue('event', eventData.eventName)
      formRef.current?.setValue('start_at', new Date(eventData.start))
      formRef.current?.setValue(
        'end_at',
        eventData.end ? new Date(eventData.end) : null
      )
      formRef.current?.setValue('alltime', eventData.alltime)
      setIsAllTime(eventData.alltime)
      setIsShowMessage(eventData.isDontShowAgain)

      const objBannerEN = createObject(eventData.detail.en)
      const objBannerTH = createObject(eventData.detail.th)
      const objBannerCN = createObject(eventData.detail.cn)

      if (eventData.detail.th.imageURL && eventData.detail.th.imageURL !== '') {
        reqLang.push('th')
      }
      if (eventData.detail.cn.imageURL && eventData.detail.cn.imageURL !== '') {
        reqLang.push('cn')
      }

      setRequiredLang(reqLang)

      setFileState((prev) => ({
        ...prev,
        en: {
          file: objBannerEN.imageURL ? objBannerEN : undefined,
          invalidFile: null,
          uploading: false,
        },
        th: {
          file: objBannerTH.imageURL ? objBannerTH : undefined,
          invalidFile: null,
          uploading: false,
        },
        cn: {
          file: objBannerCN.imageURL ? objBannerCN : undefined,
          invalidFile: null,
          uploading: false,
        },
      }))

      setFormValues(objBannerEN, 'en')
      setFormValues(objBannerTH, 'th')
      setFormValues(objBannerCN, 'cn')

      setLoading(false)
    }
  }, [eventData])

  const onDelete = () => {
    const { id } = query
    const params = {
      id,
    }
    confirmDialog({
      message: 'Are you sure you want to delete event?',
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
              accept()
              setLoading(true)
              try {
                await toast.promise(eventService.delete(params), {
                  pending: 'Loading...',
                  success: 'Event delete successfully!',
                  error: {
                    render(err: any) {
                      const message =
                        err.data?.response?.data?.messages?.[0] ??
                        'Something went wrong.'
                      setLoading(false)
                      return `Error: ${message}`
                    },
                  },
                })

                setTimeout(() => {
                  setLoading(false)
                  onBack()
                }, 500)
              } catch (_error) {}
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

  const handleRemoveFile = (mode: keyof OverallFileState) => {
    setFileState((prev) => ({
      ...prev,
      [mode]: { file: undefined, invalidFile: null, uploading: false },
    }))

    formRef.current?.setValue(`fileName${mode}`, '')
    formRef.current?.setValue(`originalFileName${mode}`, '')
    formRef.current?.setValue(`image${mode}URL`, '')
    formRef.current?.setValue(`imageFile_${mode}`, '')
    onCheckRequired(mode)
  }

  const handleFileUpload = async (file: File, mode: keyof OverallFileState) => {
    setIsFormChange(true)
    setFileState((prev) => ({
      ...prev,
      [mode]: { ...prev[mode], uploading: true },
    }))

    try {
      //Validate file size 2MB
      const size = file.size / 1024 / 1024
      if (size > 2) {
        setFileState((prev) => ({
          ...prev,
          [mode]: {
            ...prev[mode],
            file: undefined,
            invalidFile: {
              title: 'Warning',
              message: ' Please upload a file with size less than 2MB',
            },
            uploading: false,
          },
        }))

        return
      }

      const base64Data = last(
        (await convertToBase64(file))?.toString().split('base64,')
      )!

      const uploadData: IEventUpload = {
        fileName: file.name,
        fileContentBase64: base64Data,
        contentType: file.type,
      }

      const res = await eventService.upload(uploadData)

      if (res.data) {
        const updatedData = {
          ...res.data,
          [`fileName${mode}`]: res.data.fileName,
          [`image${mode}URL`]: res.data.imageURL,
          [`originalFileName${mode}`]: res.data.originalFileName,
        }

        formRef.current?.setValue(
          `fileName${mode}`,
          updatedData[`fileName${mode}`]
        )
        formRef.current?.setValue(
          `originalFileName${mode}`,
          updatedData[`originalFileName${mode}`]
        )
        formRef.current?.setValue(
          `image${mode}URL`,
          updatedData[`image${mode}URL`]
        )

        setRequiredLang((prevData) => [...prevData, mode])

        setFileState((prev) => ({
          ...prev,
          [mode]: { file: updatedData, invalidFile: null, uploading: false },
        }))
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? ' ' + error.message : 'Something went wrong'

      setFileState((prev) => ({
        ...prev,
        [mode]: {
          ...prev[mode],
          file: undefined,
          invalidFile: {
            title: 'Warning',
            message: errorMessage,
          },
          uploading: false,
        },
      }))
      formRef.current?.setValue(`fileName${mode}`, '')
      formRef.current?.setValue(`originalFileName${mode}`, '')
      formRef.current?.setValue(`image${mode}URL`, '')
      formRef.current?.setValue(`imageFile_${mode}`, '')
    } finally {
      setFileState((prev) => ({
        ...prev,
        [mode]: { ...prev[mode], uploading: false },
      }))
    }
  }

  const renderFileUploadSection = (mode: keyof OverallFileState) => {
    const { file, invalidFile, uploading } = fileState[mode]

    let fileUploadContent
    if (uploading) {
      fileUploadContent = (
        <ProgressBar mode='indeterminate' style={{ height: '6px' }} />
      )
    } else if (file) {
      fileUploadContent = (
        <div className='flex w-full flex-column'>
          <div className='relative flex justify-content-start align-items-center gap-3 border-dashed border-gray-300 p-2 overflow-hidden'>
            <div
              className='relative flex justify-content-center align-items-center overflow-hidden'
              style={{
                minHeight: '240px',
                minWidth: '450px',
                backgroundPosition: 'center center',
              }}
            >
              <Image
                className='relative'
                src={decodeURIComponent(file.imageURL.toString())}
                width={'450'}
                alt=''
              />
              <div
                className='absolute border-circle bg-gray-100 flex cursor-pointer'
                style={{
                  top: '5px',
                  right: '10px',
                  width: '30px',
                  height: '30px',
                }}
                onClick={() => {
                  handleRemoveFile(mode)
                }}
              >
                <i className='pi pi-times m-auto text-primary-blue'></i>
              </div>
            </div>
          </div>
          <ImageButtonField
            rules={{ required: undefined }}
            acceptTypes={acceptTypes.join(', ')}
            name={`imageFile_${mode}`}
            outputType='file'
            mode='single'
            onError={(error) =>
              setFileState((prev) => ({
                ...prev,
                [mode]: { ...prev[mode], invalidFile: error },
              }))
            }
            onChange={(file) => handleFileUpload(file, mode)}
          />
        </div>
      )
    } else {
      fileUploadContent = (
        <ImageButtonField
          rules={
            requiredLang.includes(mode)
              ? { required: ' ' }
              : { required: undefined }
          }
          acceptTypes={acceptTypes.join(', ')}
          name={`imageFile_${mode}`}
          outputType='file'
          mode='single'
          onError={(error: any) =>
            setFileState((prev) => ({
              ...prev,
              [mode]: { ...prev[mode], invalidFile: error },
            }))
          }
          onChange={(file: any) => handleFileUpload(file, mode)}
          title={'Upload Image'}
        />
      )
    }

    return (
      <div className='flex flex-column mt-5 gap-2'>
        <span className='flex text-xl font-bold text-primary-800'>
          Special Event Image
          {requiredLang.includes(mode) ? '*' : ''}
        </span>
        {invalidFile && (
          <Message
            severity='error'
            content={
              <div className='w-full flex justify-content-between py-3'>
                <span className='text-danger'>
                  <span className='font-bold'>{invalidFile.title} :</span>
                  {invalidFile.message}
                </span>
              </div>
            }
          />
        )}
        <div className='flex flex-column gap-1 w-full'>
          <small className='text-xs text-primary-800'>
            Hero image Allow file: jpg, jpeg, png Maximum 2MB (Recommend image
            ratio 30:37) (Min 600x740 px, Max 1200 x 1480 px)
          </small>
        </div>
        {fileUploadContent}
      </div>
    )
  }

  const onCancelChange = () => {
    if (isFormChange) {
      confirmDialog({
        message: 'Are you sure you want to cancel change ?',
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
                accept()
                onBack()
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
    } else {
      onBack()
    }
  }

  return (
    <FormController
      defualtValue={defaultValue}
      ref={formRef}
      onSubmit={onSubmit}
      onInvalid={onInvalidSubmit}
    >
      <Dialog
        header=''
        visible={visible}
        style={{ width: '360px', height: '680px', marginRight: '3rem' }}
        position='bottom-right'
        onHide={() => {
          if (!visible) return
          setVisible(false)
        }}
        contentStyle={{ padding: 0 }}
        contentClassName='dialog-preview'
      >
        <PreviewEvent lang={activeLang.code} eventState={fileState} />
      </Dialog>
      <div className='flex flex-wrap flex-column md:flex-row align-items-center justify-content-between mb-5'>
        <div className='tw-max-w-inherit'>
          <div className='tw-px-[15px] lg:tw-px-0'>
            <div className='tw-text-[#2B3674] tw-text-[34px] tw-font-bold'>
              Special Event
            </div>
          </div>
        </div>

        <div className='flex align-items-center justify-contents-end'>
          <div className='flex gap-3 justify-content-center md:justify-content-start'>
            <Button
              disabled={loading}
              className={`px-5 ${loading ? 'bg-disabled' : 'bg-primary-blue'}`}
              label='Preview'
              onClick={(e) => {
                e.preventDefault()
                setVisible(true)
              }}
            />
            <Button
              disabled={loading}
              className={`px-5 ${loading ? 'bg-disabled' : 'bg-primary-blue'}`}
              label='Publish'
              onClick={formRef.current?.handleSubmit(onSubmit, onInvalidSubmit)}
            />
            {formType === 'edit' && (
              <Button
                disabled={loading}
                type='button'
                className='px-5 tw-text-[#CD1A1A]'
                label='delete'
                text
                onClick={() => onDelete()}
              />
            )}
            <Button
              disabled={false}
              type='button'
              className='px-5 text-primary-blue'
              label='Cancel change'
              text
              onClick={() => onCancelChange()}
            />
          </div>
        </div>
      </div>

      <div className='flex gap-3'>
        <div className='flex flex-1 flex-column'>
          <div className='card'>
            <h4 className='text-astronaut font-bold'>
              {formType === 'create'
                ? 'Create new Special Event'
                : 'Edit Special Event'}
            </h4>
            <div className='flex flex-column w-full mt-2 p-5 lg:p-0'>
              <div className='flex flex-column gap-4 w-full lg:w-24rem'>
                <div className='flex flex-column gap-1 w-full'>
                  <DropdownField
                    name='status'
                    label='Status*'
                    options={status}
                    optionLabel='name'
                    optionValue='value'
                    placeholder='Choose status'
                    rules={{ required: 'Please select status' }}
                    disabled={false}
                    showRequiredLabel={false}
                    onChange={() => setIsFormChange(true)}
                  />
                </div>
              </div>
            </div>
            <div className='flex flex-column mt-4'>
              <span className='flex text-xl font-bold text-primary-800'>
                Special Event name *
              </span>
              <div className='flex flex-column gap-1 w-full'>
                <small className='text-primary-800'>Special Event name</small>
                <TextField
                  name={`event`}
                  rules={{
                    required: 'Special Event name required',
                  }}
                  showRequiredLabel={false}
                  placeholder='Text here'
                  maxLength={50}
                  onChange={() => setIsFormChange(true)}
                />
              </div>
            </div>
            <div className='flex flex-column gap-5 p-5 lg:p-0 my-5'>
              <div className='flex w-full gap-2 tw-w-[35%]'>
                <div className='tw-w-[35%]'>
                  <CalendarField
                    label='Start date and time'
                    name='start_at'
                    minDate={new Date()}
                    maxDate={maxDate}
                    showTime
                    rules={{
                      required: 'start date and time is required.',
                    }}
                    onChange={(e) => {
                      setIsFormChange(true)
                      if (e.target.value) {
                        setMinDate(e.target.value)
                      } else {
                        setMinDate(null)
                      }
                    }}
                    dateFormat='dd/mm/yy'
                  />
                </div>
              </div>
              <div
                className='flex w-full gap-2 tw-w-[35%]'
                style={{ alignItems: 'center' }}
              >
                <div className='tw-w-[35%]'>
                  <CalendarField
                    label='End date and time'
                    name='end_at'
                    minDate={minDate}
                    showTime
                    rules={{
                      required: isAllTime
                        ? undefined
                        : 'End date and time is required.',
                    }}
                    disabled={isAllTime}
                    onChange={(e) => {
                      setIsFormChange(true)
                      if (e.target.value) {
                        setMaxDate(e.target.value)
                      } else {
                        setMaxDate(null)
                      }
                    }}
                    dateFormat='dd/mm/yy'
                  />
                </div>
                <div className='flex'>
                  <div
                    className='flex gap-1 tw-align-middle'
                    style={{ alignItems: 'center', marginTop: '0.35rem' }}
                  >
                    <CheckBoxField
                      name={`alltime`}
                      rules={{ required: undefined }}
                      onChange={(e: boolean) => {
                        setIsFormChange(true)
                        setIsAllTime(e)
                        formRef.current?.setValue('end_at', null)
                        formRef.current?.clearErrors('end_at')
                      }}
                      showRequiredLabel={false}
                      disabled={false}
                    />
                    <span
                      className='flex text-base font-bold text-primary-800 p-2 cursor-pointer'
                      style={{ userSelect: 'none', marginTop: '0.6rem' }}
                      onClick={() => {
                        setIsFormChange(true)
                        formRef.current?.setValue('alltime', !isAllTime)
                        setIsAllTime((prev) => !prev)
                        formRef.current?.setValue('end_at', null)
                        formRef.current?.clearErrors('end_at')
                      }}
                    >
                      Not specified
                    </span>
                  </div>
                </div>
              </div>
              {/* <div className='flex w-full mt-5'>
                <div className='flex flex-column gap-1 tw-w-[35%]'>
                  <div className='flex w-full'>
                    <div className='flex gap-1 tw-align-middle'>
                      <CheckBoxField
                        name={`show`}
                        rules={{ required: undefined }}
                        onChange={(e: boolean) => {
                          setIsShowMessage(e)
                        }}
                        showRequiredLabel={false}
                        disabled={false}
                      />
                      <span
                        className='flex text-base font-bold text-primary-800 p-2 tw-mt-1 cursor-pointer'
                        style={{ userSelect: 'none' }}
                        onClick={() => {
                          formRef.current?.setValue(`show`, !isShowMessage)
                          setIsShowMessage((prev) => !prev)
                        }}
                      >
                        Show Message &quot;Do not show this again&quot;
                      </span>
                    </div>
                  </div>
                </div>
              </div> */}
              <div className='tw-flex tw-flex-col tw-justify-between tw-items-center tw-w-full tw-gap-8 tw-pt-8'>
                <div className='w-full'>
                  <TabMenu
                    model={langItems}
                    activeIndex={langItems.findIndex(
                      (x) => x.code === activeLang.code
                    )}
                    onTabChange={(e) => setActiveLang(langItems[e.index])}
                  />
                  <div>
                    {activeLang &&
                      langItems.map((lang) => (
                        <Fragment key={lang.code}>
                          <div hidden={activeLang.code !== lang.code}>
                            <div className='flex flex-column gap-5 p-5 lg:p-0 my-5'>
                              {renderFileUploadSection(lang.code)}
                            </div>
                          </div>
                        </Fragment>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='flex gap-3 justify-content-center md:justify-content-start'>
            <Button
              disabled={loading}
              className={`px-5 ${loading ? 'bg-disabled' : 'bg-primary-blue'}`}
              label='Preview'
              onClick={(e) => {
                e.preventDefault()
                setVisible(true)
              }}
            />
            <Button
              disabled={loading}
              className={`px-5 ${loading ? 'bg-disabled' : 'bg-primary-blue'}`}
              label='Publish'
              onClick={formRef.current?.handleSubmit(onSubmit, onInvalidSubmit)}
            />
            {formType === 'edit' && (
              <Button
                disabled={loading}
                type='button'
                className='px-5 tw-text-[#CD1A1A]'
                label='delete'
                text
                onClick={() => onDelete()}
              />
            )}
            <Button
              disabled={false}
              type='button'
              className='px-5 text-primary-blue'
              label='Cancel change'
              text
              onClick={() => onCancelChange()}
            />
          </div>
        </div>
      </div>
    </FormController>
  )
}

export default Upsert
