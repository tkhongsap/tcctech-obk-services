/* eslint-disable unused-imports/no-unused-vars-ts */
import {
  IExploreData,
  IExploreUpload,
} from '@src/services/marcom/explore-one-bangkok/model'
import { KeyValue } from '@src/types/key-value'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import { Message } from 'primereact/message'
import ImageButtonField from '@components/forms/components/image-button-field'
import { ProgressBar } from 'primereact/progressbar'
import { Image } from 'primereact/image'
import { last } from 'lodash'
import { convertToBase64 } from '@src/utils/image'
import { exploreService } from '@src/services/marcom/explore-one-bangkok/service'
import { useNavigation, useResource } from '@refinedev/core'
import { Button } from 'primereact/button'
import DropdownField from '@components/forms/components/dropdown-field'
import CheckBoxField from '@components/forms/components/checkbox-field'
import { TabMenu } from 'primereact/tabmenu'
import TextField from '@components/forms/components/text-field'
import ContentBuilder from '@components/sustainability/content-management/content'
import { Divider } from 'primereact/divider'
import ChipsField from '@components/forms/components/chips-field'
import { confirmDialog } from 'primereact/confirmdialog'
import { toast } from 'react-toastify'
import PreviewContent from './preview'
import { Dialog } from 'primereact/dialog'

type Lang = {
  label: string
  code: 'en' | 'th' | 'cn'
  disabled: boolean
}

const acceptTypes = ['image/png', 'image/jpg', 'image/jpeg']

const status: KeyValue[] = [
  { name: 'Active', value: '1' },
  { name: 'Inactive', value: '0' },
]

interface InvalidFile {
  title: string
  message: string
}

interface FileState {
  file?: IExploreData
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

function isEmptyString(str: any) {
  return !str || str.trim() === '' || str === undefined
}

const Upsert = (props: any) => {
  const { formData, defaultValue, contentData, formType } = props

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

  const router = useRouter()
  const { query } = router

  const formRef = useRef<FormControllerRef<any>>(null)
  const [requiredLang, setRequiredLang] = useState<string[]>(['en'])
  const [activeLang, setActiveLang] = useState<Lang>(langItems[0])
  const [isShowRelate, setIsShowRelate] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [isFormChange, setIsFormChange] = useState<boolean>(false)

  const [coverState, setCoverState] =
    useState<OverallFileState>(initialFileState)
  const [headerState, setHeaderState] =
    useState<OverallFileState>(initialFileState)

  const handleRemoveFile = (
    mode: keyof OverallFileState,
    stateUpdater: React.Dispatch<React.SetStateAction<OverallFileState>>,
    header: boolean = false
  ) => {
    stateUpdater((prev) => ({
      ...prev,
      [mode]: { file: undefined, invalidFile: null, uploading: false },
    }))

    formRef.current?.setValue(`fileName${mode}${header ? 'Header' : ''}`, '')
    formRef.current?.setValue(
      `originalFileName${mode}${header ? 'Header' : ''}`,
      ''
    )
    formRef.current?.setValue(`image${mode}URL${header ? 'Header' : ''}`, '')
    formRef.current?.setValue(`imageFile_${mode}${header ? 'Header' : ''}`, '')
    onCheckRequired(mode)
  }

  const handleFileUpload = async (
    file: File,
    mode: keyof OverallFileState,
    stateUpdater: React.Dispatch<React.SetStateAction<OverallFileState>>,
    header: boolean = false
  ) => {
    setIsFormChange(true)
    stateUpdater((prev) => ({
      ...prev,
      [mode]: { ...prev[mode], uploading: true },
    }))

    try {
      //Validate file size 2MB
      const size = file.size / 1024 / 1024
      if (size > 2) {
        stateUpdater((prev) => ({
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

      const uploadData: IExploreUpload = {
        fileName: file.name,
        fileContentBase64: base64Data,
        contentType: file.type,
      }

      const res = await exploreService.upload(uploadData)

      if (res.data) {
        const updatedData = {
          ...res.data,
          [`fileName${mode}${header ? 'Header' : ''}`]: res.data.fileName,
          [`image${mode}URL${header ? 'Header' : ''}`]: res.data.imageURL,
          [`originalFileName${mode}${header ? 'Header' : ''}`]:
            res.data.originalFileName,
        }

        formRef.current?.setValue(
          `fileName${mode}${header ? 'Header' : ''}`,
          updatedData[`fileName${mode}${header ? 'Header' : ''}`]
        )
        formRef.current?.setValue(
          `originalFileName${mode}${header ? 'Header' : ''}`,
          updatedData[`originalFileName${mode}${header ? 'Header' : ''}`]
        )
        formRef.current?.setValue(
          `image${mode}URL${header ? 'Header' : ''}`,
          updatedData[`image${mode}URL${header ? 'Header' : ''}`]
        )

        setRequiredLang((prevData) => [...prevData, mode])

        stateUpdater((prev) => ({
          ...prev,
          [mode]: { file: updatedData, invalidFile: null, uploading: false },
        }))
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? ' ' + error.message : 'Something went wrong'

      stateUpdater((prev) => ({
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
      formRef.current?.setValue(`fileName${mode}${header ? 'Header' : ''}`, '')
      formRef.current?.setValue(
        `originalFileName${mode}${header ? 'Header' : ''}`,
        ''
      )
      formRef.current?.setValue(`image${mode}URL${header ? 'Header' : ''}`, '')
      formRef.current?.setValue(
        `imageFile_${mode}${header ? 'Header' : ''}`,
        ''
      )
    } finally {
      stateUpdater((prev) => ({
        ...prev,
        [mode]: { ...prev[mode], uploading: false },
      }))
    }
  }

  const renderFileUploadSection = (
    mode: keyof OverallFileState,
    state: OverallFileState,
    stateUpdater: React.Dispatch<React.SetStateAction<OverallFileState>>,
    header: boolean = false
  ) => {
    const { file, invalidFile, uploading } = state[mode]

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
                height: '240px',
                width: '426px',
                backgroundPosition: 'center center',
              }}
            >
              <Image
                className='absolute'
                src={decodeURIComponent(file.imageURL.toString())}
                style={{
                  objectPosition: 'center',
                  objectFit: 'none',
                }}
                width={'426'}
                alt=''
              />
              <div
                className='absolute border-circle bg-gray-100 flex cursor-pointer'
                style={{
                  top: '5px',
                  right: '5px',
                  width: '30px',
                  height: '30px',
                }}
                onClick={() => {
                  handleRemoveFile(mode, stateUpdater, header)
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
              stateUpdater((prev) => ({
                ...prev,
                [mode]: { ...prev[mode], invalidFile: error },
              }))
            }
            onChange={(file) =>
              handleFileUpload(file, mode, stateUpdater, header)
            }
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
          name={`imageFile_${mode}${header ? 'Header' : ''}`}
          outputType='file'
          mode='single'
          onError={(error: any) =>
            stateUpdater((prev) => ({
              ...prev,
              [mode]: { ...prev[mode], invalidFile: error },
            }))
          }
          onChange={(file: any) =>
            handleFileUpload(file, mode, stateUpdater, header)
          }
          title={'Upload Image'}
        />
      )
    }

    return (
      <div className='flex flex-column mt-5 gap-2'>
        <span className='flex text-xl font-bold text-primary-800'>
          {header ? `Head Image` : 'Cover Image'}
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
            {header
              ? 'Head image Allow file: jpg, jpeg, png Maximum 2MB (Recommend image ratio 16:9) (Min 800x450 px, Max 1600x900 px)'
              : 'Cover image Allow file: jpg, jpeg, png Maximum 2MB (Recommend image ratio 1:1) (Min 200x200 px, Max 600x600 px)'}
          </small>
        </div>
        {fileUploadContent}
      </div>
    )
  }

  const createObject = (explore: any): any => ({
    imageURL: explore.imageURL,
    fileName: explore.fileName,
    originalFileName: explore.originalFileName,
    message: '',
  })

  const createHeaderObject = (head: any): any => ({
    imageURL: head.headerImageURL,
    fileName: head.headerFileName,
    originalFileName: head.headerOriginalFileName,
    message: '',
  })

  const setFormValues = (file: any, prefix: string, header = false) => {
    formRef.current?.setValue(
      `fileName${prefix}${header ? 'Header' : ''}`,
      file.fileName
    )
    formRef.current?.setValue(
      `originalFileName${prefix}${header ? 'Header' : ''}`,
      file.originalFileName
    )
    formRef.current?.setValue(
      `image${prefix}URL${header ? 'Header' : ''}`,
      file.imageURL
    )
  }

  useEffect(() => {
    if (contentData) {
      setLoading(true)
      const reqLang = ['en']
      formRef.current?.setValue('status', contentData.status ? '1' : '0')
      formRef.current?.setValue('relate', contentData.isShowRelate)
      formRef.current?.setValue('tag', contentData.tag)
      setIsShowRelate(contentData.isShowRelate)

      formRef.current?.setValue('title_en', contentData.detail.en.title)
      formRef.current?.setValue('title_th', contentData.detail.th.title)
      formRef.current?.setValue('title_cn', contentData.detail.cn.title)

      formRef.current?.setValue('related_en', contentData.detail.en.related)
      formRef.current?.setValue('related_th', contentData.detail.th.related)
      formRef.current?.setValue('related_cn', contentData.detail.cn.related)

      formRef.current?.setValue(
        'relatedSub_en',
        contentData.detail.en.relatedSub
      )
      formRef.current?.setValue(
        'relatedSub_th',
        contentData.detail.th.relatedSub
      )
      formRef.current?.setValue(
        'relatedSub_cn',
        contentData.detail.cn.relatedSub
      )

      const objExploreEN = createObject(contentData.detail.en)
      const objExploreTH = createObject(contentData.detail.th)
      const objExploreCN = createObject(contentData.detail.cn)

      const objHeadEN = createHeaderObject(contentData.detail.en)
      const objHeadTH = createHeaderObject(contentData.detail.th)
      const objHeadCN = createHeaderObject(contentData.detail.cn)

      if (contentData.detail.th.title && contentData.detail.th.title !== '') {
        reqLang.push('th')
      }
      if (contentData.detail.cn.title && contentData.detail.cn.title !== '') {
        reqLang.push('cn')
      }

      setRequiredLang(reqLang)

      setCoverState((prev) => ({
        ...prev,
        en: {
          file: objExploreEN.imageURL ? objExploreEN : undefined,
          invalidFile: null,
          uploading: false,
        },
        th: {
          file: objExploreTH.imageURL ? objExploreTH : undefined,
          invalidFile: null,
          uploading: false,
        },
        cn: {
          file: objExploreCN.imageURL ? objExploreCN : undefined,
          invalidFile: null,
          uploading: false,
        },
      }))

      setHeaderState((prev) => ({
        ...prev,
        en: {
          file: objHeadEN.imageURL ? objHeadEN : undefined,
          invalidFile: null,
          uploading: false,
        },
        th: {
          file: objHeadTH.imageURL ? objHeadTH : undefined,
          invalidFile: null,
          uploading: false,
        },
        cn: {
          file: objHeadCN.imageURL ? objHeadCN : undefined,
          invalidFile: null,
          uploading: false,
        },
      }))

      setFormValues(objExploreEN, 'en')
      setFormValues(objExploreTH, 'th')
      setFormValues(objExploreCN, 'cn')

      setFormValues(objHeadEN, 'en', true)
      setFormValues(objHeadTH, 'th', true)
      setFormValues(objHeadCN, 'cn', true)

      if (contentData.detail.en.cms.length > 0) {
        const contentEn = contentData.detail.en.cms.map((f: any) => {
          return {
            answer: f.text,
            type: f.contentType,
            fileName: f.fileName,
            imageURL: f.imageURL,
            originalFileName: f.originalFileName,
            youtube: f.youtubeURL,
          }
        })
        formRef.current?.setValue('en_contents', contentEn)
      }

      if (contentData.detail.th.cms.length > 0) {
        const contentTh = contentData.detail.th.cms.map((f: any) => {
          return {
            answer: f.text,
            type: f.contentType,
            fileName: f.fileName,
            imageURL: f.imageURL,
            originalFileName: f.originalFileName,
            youtube: f.youtubeURL,
          }
        })
        formRef.current?.setValue('th_contents', contentTh)
      }

      if (contentData.detail.cn.cms.length > 0) {
        const contentCn = contentData.detail.cn.cms.map((f: any) => {
          return {
            answer: f.text,
            type: f.contentType,
            fileName: f.fileName,
            imageURL: f.imageURL,
            originalFileName: f.originalFileName,
            youtube: f.youtubeURL,
          }
        })
        formRef.current?.setValue('cn_contents', contentCn)
      }
      setLoading(false)
    }
  }, [contentData])

  const getDataByLang = (data: any, lang: keyof OverallFileState) => ({
    title: data[`title_${lang}`],
    contents: data[`${lang}_contents`],
  })

  const HtmlStringToString = (value: string) => {
    const myHTML = new DOMParser().parseFromString(value, 'text/html')
    return myHTML.body.textContent ?? ''
  }

  const isContentEmpty = (content: any) => {
    if (content.type === undefined || content.type === 1) {
      return (
        !content.answer || isEmptyString(HtmlStringToString(content.answer))
      )
    }
    if (content.type === 2) {
      return isEmptyString(content.imageURL)
    }
    if (content.type === 3) {
      return isEmptyString(content.youtube)
    }
    return false
  }

  const isSubMenuContentEmpty = (contents: any[]) =>
    contents.length === 1 && isContentEmpty(contents[0])

  const isLangRequired = (lang: keyof OverallFileState, data: any) => {
    const { title, contents } = getDataByLang(data, lang)
    return (
      !coverState[lang].file &&
      !headerState[lang].file &&
      isEmptyString(title) &&
      isSubMenuContentEmpty(contents)
    )
  }

  const onCheckRequired = (lang: any) => {
    if (lang === 'en') return
    const data = formRef.current?.getValues()
    if (isLangRequired(lang, data)) {
      setRequiredLang((prevData) => prevData.filter((item) => item !== lang))
    }
  }

  useEffect(() => {
    onCheckRequired(activeLang.code)
  }, [coverState, headerState, activeLang])

  const onBack = () => list(resources?.identifier ?? '')

  const mapData = (data: any) => {
    const { id } = query

    const result: any = {
      id: id,
      status: data.status === '1',
      isShowRelate: isShowRelate,
      tag: data.tag ?? [],
      isDelete: false,
      detail: {},
    }

    Object.keys(data).forEach((key) => {
      if (key !== 'status') {
        const [property, lang] = key.split('_')
        if (lang && lang.length == 2) {
          if (!result.detail[lang]) {
            result.detail[lang] = {}
          }
          result.detail[lang][property] = data[key]
        } else if (lang?.includes('content')) {
          const content = formData.getValues(key)
          const arrContent: any[] = []
          content.forEach((item: any, index: number) => {
            const objData = {
              language: property === 'cn' ? 'zh' : property,
              contentType: item.type ? item.type : 1,
              order: index + 1,
              text: item.answer,
              imageURL: item?.imageURL,
              originalFileName: item?.originalFileName,
              fileName: item?.fileName,
              youtubeURL: item?.youtube,
              isActive: true,
              isDelete: false,
            }
            arrContent.push(objData)
          })
          result.detail[property] = result.detail[property] || {}
          result.detail[property].cms = arrContent
        }
      }
    })
    ;(['en', 'th', 'cn'] as Array<keyof OverallFileState>).forEach(
      (lang: keyof OverallFileState) => {
        const { file: cover } = coverState[lang]
        const { file: head } = headerState[lang]
        if (cover) {
          result.detail[lang] = result.detail[lang] || {}
          result.detail[lang].imageURL = cover.imageURL
          result.detail[lang].originalFileName = cover.originalFileName
          result.detail[lang].fileName = cover.fileName
        }
        if (head) {
          result.detail[lang] = result.detail[lang] || {}
          result.detail[lang].headerImageURL = head.imageURL
          result.detail[lang].headerOriginalFileName = head.originalFileName
          result.detail[lang].headerFileName = head.fileName
        }
      }
    )

    return result
  }

  const onSubmit = (data: any) => {
    const result = mapData(data)
    confirmDialog({
      message: 'Are you sure you want to save Explore?',
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
                await toast.promise(exploreService.save(result), {
                  pending: 'Loading...',
                  success: 'Explore save successfully!',
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

  const onDelete = () => {
    const { id } = query
    const params = {
      id,
    }
    confirmDialog({
      message: 'Are you sure you want to delete explore?',
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
                await toast.promise(exploreService.delete(params), {
                  pending: 'Loading...',
                  success: 'Explore delete successfully!',
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
        updateState(setCoverState, lang)
      }
      if (err[`imageFile_${lang}Header`]) {
        updateState(setHeaderState, lang)
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
        style={{ width: '400px', height: '800px', marginRight: '3rem' }}
        position='bottom-right'
        onHide={() => {
          if (!visible) return
          setVisible(false)
        }}
        contentStyle={{ padding: 0 }}
        contentClassName='dialog-preview'
      >
        <PreviewContent
          formData={formData}
          lang={activeLang.code}
          headerState={headerState}
          data={formRef.current?.getValues()}
        />
      </Dialog>
      <div className='flex flex-wrap flex-column md:flex-row align-items-center justify-content-between mb-5'>
        <div className='tw-max-w-inherit'>
          <div className='tw-px-[15px] lg:tw-px-0'>
            <div className='tw-text-[#2B3674] tw-text-[34px] tw-font-bold'>
              Explore One Bangkok
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
              onClick={() => {
                onCancelChange()
              }}
            />
          </div>
        </div>
      </div>

      <div className='flex gap-3'>
        <div className='flex flex-1 flex-column'>
          <div className='card'>
            <h4 className='text-astronaut font-bold'>
              {formType === 'create'
                ? 'Create new Explore One Bangkok'
                : 'Edit Explore One Bangkok'}
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
            <div className='flex flex-column gap-5 p-5 lg:p-0 my-5'>
              <div className='flex w-full'>
                <div className='flex gap-1 tw-align-middle'>
                  <CheckBoxField
                    name={`relate`}
                    rules={{ required: undefined }}
                    onChange={(e: boolean) => {
                      setIsShowRelate(e)
                      setIsFormChange(true)
                    }}
                    showRequiredLabel={false}
                  />
                  <span
                    className='flex text-base font-bold text-primary-800 p-2 tw-mt-1 cursor-pointer'
                    style={{ userSelect: 'none' }}
                    onClick={() => {
                      formRef.current?.setValue(`relate`, !isShowRelate)
                      setIsShowRelate((prev) => !prev)
                      setIsFormChange(true)
                    }}
                  >
                    Show relate link
                  </span>
                </div>
              </div>

              <div className='flex flex-column'>
                <span className='flex text-xl font-bold text-primary-800'>
                  Tag
                </span>
                <div className='flex flex-column gap-1 w-full'>
                  <ChipsField
                    name={`tag`}
                    rules={{ required: undefined }}
                    showRequiredLabel={false}
                    placeholder='Text here'
                    onChange={(e) => {
                      setIsFormChange(true)
                      const data = formRef.current?.getValues()
                      const value = e.value
                      if (value && value.length > 0) {
                        const newChip = value[value.length - 1].trim()
                        if (!(data.tag.slice(0, -1) ?? []).includes(newChip)) {
                          formRef.current?.setValue('tag', value)
                        } else {
                          formRef.current?.setValue('tag', value.slice(0, -1))
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
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
                            <div className='flex flex-column mt-2 gap-2'>
                              <span className='flex text-xl font-bold text-primary-800'>
                                Title name{' '}
                                {requiredLang.includes(lang.code) && (
                                  <span>*</span>
                                )}
                              </span>
                              <div className='flex flex-column gap-1 w-full'>
                                <small className='text-xs text-primary-800'>
                                  Title name ({lang.label}){' '}
                                </small>
                                <TextField
                                  name={`title_${lang.code}`}
                                  rules={{
                                    required: requiredLang.includes(lang.code)
                                      ? 'Title name required'
                                      : undefined,
                                  }}
                                  onChange={(e) => {
                                    setIsFormChange(true)
                                    const text = e.target.value
                                    if (text && text !== '') {
                                      setRequiredLang((prevData) => [
                                        ...prevData,
                                        lang.code,
                                      ])
                                    } else {
                                      onCheckRequired(lang.code)
                                    }
                                  }}
                                  showRequiredLabel={false}
                                  placeholder='Text here'
                                  maxLength={50}
                                />
                              </div>
                            </div>

                            {renderFileUploadSection(
                              lang.code,
                              coverState,
                              setCoverState
                            )}
                            {renderFileUploadSection(
                              lang.code,
                              headerState,
                              setHeaderState,
                              true
                            )}
                            {isShowRelate && (
                              <>
                                <div className='flex flex-column mt-2 gap-2'>
                                  <span className='flex text-xl font-bold text-primary-800'>
                                    Related Title{' '}
                                  </span>
                                  <div className='flex flex-column gap-1 w-full'>
                                    <small className='text-xs text-primary-800'>
                                      Message ({lang.label}){' '}
                                    </small>
                                    <TextField
                                      name={`related_${lang.code}`}
                                      rules={{
                                        required: undefined,
                                      }}
                                      onChange={(e) => {
                                        setIsFormChange(true)
                                        const text = e.target.value
                                        if (text && text !== '') {
                                          setRequiredLang((prevData) => [
                                            ...prevData,
                                            lang.code,
                                          ])
                                        } else {
                                          onCheckRequired(lang.code)
                                        }
                                      }}
                                      showRequiredLabel={false}
                                      placeholder='Text here'
                                      maxLength={250}
                                    />
                                  </div>
                                </div>

                                <div className='flex flex-column mt-2 gap-2'>
                                  <span className='flex text-xl font-bold text-primary-800'>
                                    Sub Related Title{' '}
                                  </span>
                                  <div className='flex flex-column gap-1 w-full'>
                                    <small className='text-xs text-primary-800'>
                                      Message ({lang.label}){' '}
                                    </small>
                                    <TextField
                                      name={`relatedSub_${lang.code}`}
                                      rules={{
                                        required: undefined,
                                      }}
                                      onChange={(e) => {
                                        setIsFormChange(true)
                                        const text = e.target.value
                                        if (text && text !== '') {
                                          setRequiredLang((prevData) => [
                                            ...prevData,
                                            lang.code,
                                          ])
                                        } else {
                                          onCheckRequired(lang.code)
                                        }
                                      }}
                                      showRequiredLabel={false}
                                      placeholder='Text here'
                                      maxLength={250}
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                            <div className='flex flex-column gap-1 w-full'>
                              <Divider align='center'>
                                <span>Content</span>
                              </Divider>
                            </div>
                            <ContentBuilder
                              dataKey={`${lang.code}_contents`}
                              locale={lang.code}
                              formData={formData}
                              setRequiredLang={setRequiredLang}
                              onCheckRequired={onCheckRequired}
                              setIsFormChange={setIsFormChange}
                            />
                          </div>
                        </div>
                      </Fragment>
                    ))}
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
              onClick={() => {
                onCancelChange()
              }}
            />
          </div>
        </div>
      </div>
    </FormController>
  )
}

export default Upsert
