/* eslint-disable unused-imports/no-unused-vars-ts */
import DropdownField from '@components/forms/components/dropdown-field'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import TextField from '@components/forms/components/text-field'
import { useNavigation, useResource } from '@refinedev/core'
import { IHeroData, IHeroUpload } from '@src/services/marcom/hero-banner/model'
import { KeyValue } from '@src/types/key-value'
import { useRouter } from 'next/router'
import { Button } from 'primereact/button'
import { RadioButton } from 'primereact/radiobutton'
import React, { Fragment, useRef, useState, useEffect } from 'react'
import { TabMenu } from 'primereact/tabmenu'
import TextAreaField from '@components/forms/components/text-area-field'
import ContentBuilder from '@components/sustainability/content-management/content'
import { Message } from 'primereact/message'
import { Divider } from 'primereact/divider'
import ImageButtonField from '@components/forms/components/image-button-field'
import { ProgressBar } from 'primereact/progressbar'
import { last } from 'lodash'
import { convertToBase64 } from '@src/utils/image'
import { contentService } from '@src/services/sustainability/content-mangement/service'
import CalendarField from '@components/forms/components/calendar-field'
import CheckBoxField from '@components/forms/components/checkbox-field'
import moment from 'moment'
import { confirmDialog } from 'primereact/confirmdialog'
import { toast } from 'react-toastify'
import { heroService } from '@src/services/marcom/hero-banner/service'
import { Image } from 'primereact/image'
import { Dialog } from 'primereact/dialog'
import EditorField from '@components/forms/components/editor-field'
import PreviewBanner from './preview-banner'
import { FormProvider } from 'react-hook-form'

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

const videoTypes = [
  // Video types
  '.mp4',
  '.avi',
  '.mov',
  'video/mp4',
  'video/x-msvideo',
  'video/quicktime',
  'video/x-ms-wmv',
  'video/x-matroska',
  'video/x-flv',
  'video/avi',
]

interface InvalidFile {
  title: string
  message: string
}

interface FileState {
  file?: IHeroData
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
  const { formData, defaultValue, bannerData, formType } = props
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
  const [typeTemplate, setTypeTemplate] = useState<any>('A')
  const [heroMode, setHeroMode] = useState<any>({
    en: 'I',
    th: 'I',
    cn: 'I',
  })
  const [isShowRelate, setIsShowRelate] = useState<boolean>(false)
  const [isContent, setIsContent] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [isAllTime, setIsAllTime] = useState<boolean>(false)
  const [isFormChange, setIsFormChange] = useState<boolean>(false)

  const [minDate, setMinDate] = useState<any>(null)
  const [maxDate, setMaxDate] = useState<any>(null)

  const [textHero, setTextHero] = useState<any>({
    en: undefined,
    th: undefined,
    cn: undefined,
  })

  const [heroState, setHeroState] = useState<OverallFileState>(initialFileState)

  const [headerState, setHeaderState] =
    useState<OverallFileState>(initialFileState)

  const alphabetToNumber = (char: string): number | null => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'
    const lowerChar = char.toLowerCase()

    if (alphabet.includes(lowerChar)) {
      return alphabet.indexOf(lowerChar) + 1
    }
    return null
  }

  const createObject = (banner: any): any => ({
    imageURL: banner.imageURL,
    fileName: banner.fileName,
    originalFileName: banner.originalFileName,
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

  const numberToUppercaseAlphabet = (num: number): string | null => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    if (num >= 1 && num <= 26) {
      return alphabet[num - 1]
    }

    return null
  }

  useEffect(() => {
    if (bannerData) {
      setLoading(true)
      const reqLang = ['en']
      formRef.current?.setValue('status', bannerData.status ? '1' : '0')
      formRef.current?.setValue('relate', bannerData.isShowRelatedLink)
      formRef.current?.setValue('banner', bannerData.bannerName)
      formRef.current?.setValue('link', bannerData.linkToURL)
      setIsShowRelate(bannerData.isShowRelatedLink)
      setTypeTemplate(numberToUppercaseAlphabet(bannerData.type))

      formRef.current?.setValue('start_at', new Date(bannerData.start))
      formRef.current?.setValue(
        'end_at',
        bannerData.end ? new Date(bannerData.end) : null
      )
      formRef.current?.setValue('alltime', bannerData.alltime)
      setIsAllTime(bannerData.alltime)

      formRef.current?.setValue('title_en', bannerData.detail.en.title)
      formRef.current?.setValue('title_th', bannerData.detail.th.title)
      formRef.current?.setValue('title_cn', bannerData.detail.cn.title)

      setTextHero((prev: any) => ({
        ...prev,
        en: bannerData.detail.en.text,
        th: bannerData.detail.th.text,
        cn: bannerData.detail.cn.text,
      }))

      setHeroMode((prev: any) => ({
        ...prev,
        en: bannerData.detail.en.type ? 'I' : 'V',
        th: bannerData.detail.th.type ? 'I' : 'V',
        cn: bannerData.detail.cn.type ? 'I' : 'V',
      }))

      const objBannerEN = createObject(bannerData.detail.en)
      const objBannerTH = createObject(bannerData.detail.th)
      const objBannerCN = createObject(bannerData.detail.cn)

      const objHeadEN = createHeaderObject(bannerData.detail.en)
      const objHeadTH = createHeaderObject(bannerData.detail.th)
      const objHeadCN = createHeaderObject(bannerData.detail.cn)

      if (
        bannerData.detail.th.imageURL &&
        bannerData.detail.th.imageURL !== ''
      ) {
        reqLang.push('th')
      }
      if (
        bannerData.detail.cn.imageURL &&
        bannerData.detail.cn.imageURL !== ''
      ) {
        reqLang.push('cn')
      }

      setRequiredLang(reqLang)

      setHeroState((prev) => ({
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

      setFormValues(objBannerEN, 'en')
      setFormValues(objBannerTH, 'th')
      setFormValues(objBannerCN, 'cn')

      setFormValues(objHeadEN, 'en', true)
      setFormValues(objHeadTH, 'th', true)
      setFormValues(objHeadCN, 'cn', true)

      if (bannerData.detail.en.cms.length > 0) {
        const contentEn = bannerData.detail.en.cms.map((f: any) => {
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

      if (bannerData.detail.th.cms.length > 0) {
        const contentTh = bannerData.detail.th.cms.map((f: any) => {
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

      if (bannerData.detail.cn.cms.length > 0) {
        const contentCn = bannerData.detail.cn.cms.map((f: any) => {
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
  }, [bannerData])

  const mapData = (data: any) => {
    const { id } = query

    const result: any = {
      id: id,
      bannerName: data.banner,
      linkToURL: data.link,
      status: data.status === '1',
      isShowRelatedLink: isShowRelate,
      type: alphabetToNumber(typeTemplate),
      isDelete: false,
      detail: {},
      start: moment(data.start_at).valueOf(),
      end: !data.alltime ? moment(data.end_at).valueOf() : null,
      alltime: data.alltime,
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

    result.detail.en.text = textHero['en']
    result.detail.th.text = textHero['th']
    result.detail.cn.text = textHero['cn']
    result.detail.en.type = heroMode['en'] === 'I'
    result.detail.th.type = heroMode['th'] === 'I'
    result.detail.cn.type = heroMode['cn'] === 'I'
    ;(['en', 'th', 'cn'] as Array<keyof OverallFileState>).forEach(
      (lang: keyof OverallFileState) => {
        const { file: cover } = heroState[lang]
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

  const onBack = () => list(resources?.identifier ?? '')

  const onSubmit = (data: any) => {
    const result = mapData(data)
    confirmDialog({
      message: 'Are you sure you want to save Hero Banner?',
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
                await toast.promise(heroService.save(result), {
                  pending: 'Loading...',
                  success: 'Hero banner save successfully!',
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
    lang: string,
    related: boolean = false
  ) => {
    setter((prev: any) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        invalidFile: {
          title: 'Missing field',
          message:
            heroMode[lang] === 'V' && !related
              ? 'Please upload video'
              : 'Please upload image',
        },
      },
    }))
  }

  const onInvalidSubmit = (err: any) => {
    const languages: any[] = ['en', 'th', 'cn']

    languages.forEach((lang) => {
      if (err[`imageFile_${lang}${heroMode[lang] === 'I' ? 'I' : 'V'}`]) {
        updateState(setHeroState, lang)
      }

      if (err[`imageFile_${lang}Header`]) {
        updateState(setHeaderState, lang)
      }
      if (err[`imageFile_${lang}Related`]) {
        updateState(setHeaderState, lang, true)
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

  const onDelete = () => {
    const { id } = query
    const params = {
      id,
    }
    confirmDialog({
      message: 'Are you sure you want to delete banner?',
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
                await toast.promise(heroService.delete(params), {
                  pending: 'Loading...',
                  success: 'Banner delete successfully!',
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

  function isValidLink(link: any) {
    const urlPattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol (optional)
        '((([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,})|' + // domain (e.g., google.com)
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IPv4 address (e.g., 192.168.0.1)
        '(\\:\\d+)?' + // port (optional)
        '(\\/[-a-zA-Z0-9%_.~+]*)*' + // path (optional)
        '(\\?[;&a-zA-Z0-9%_.~+=-]*)?' + // query string (optional)
        '(\\#[-a-zA-Z0-9_.~+=]*)?$' // fragment identifier (optional)
    )

    return !!urlPattern.test(link)
  }

  const HtmlStringToString = (value: string) => {
    const myHTML = new DOMParser().parseFromString(value, 'text/html')
    return myHTML.body.textContent ?? ''
  }

  const onEditAnswer = (editorState: any, lang: any) => {
    setTextHero((prev: any) => ({
      ...prev,
      [lang]: editorState,
    }))
    const valueEditor = HtmlStringToString(editorState)
    if (valueEditor && valueEditor !== '' && valueEditor !== 'null') {
      setRequiredLang((prevData: any) => [...prevData, lang])
    } else {
      onCheckRequired(lang)
    }
  }

  function isEmptyString(str: any) {
    return !str || str.trim() === ''
  }

  const getDataByLang = (data: any, lang: keyof OverallFileState) => ({
    title: data[`title_${lang}`],
    contents: data[`${lang}_contents`],
  })

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
      isEmptyString(title) &&
      isEmptyString(textHero[lang]) &&
      !heroState[lang].file &&
      !headerState[lang].file &&
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

  const handleFileUpload = async (
    file: File,
    mode: keyof OverallFileState,
    stateUpdater: React.Dispatch<React.SetStateAction<OverallFileState>>,
    header: boolean = false,
    related: boolean = false
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

      const typeupload = heroMode[mode]
      const base64Data = last(
        (await convertToBase64(file))?.toString().split('base64,')
      )!

      const uploadData: IHeroUpload = {
        fileName: file.name,
        fileContentBase64: base64Data,
        contentType: file.type,
      }

      const res =
        !header && typeupload === 'V'
          ? await heroService.uploadDoc(uploadData)
          : await contentService.upload(uploadData)

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
        `imageFile_${mode}${
          header ? (related ? 'Related' : 'Header') : heroMode[mode]
        }`,
        ''
      )
    } finally {
      stateUpdater((prev) => ({
        ...prev,
        [mode]: { ...prev[mode], uploading: false },
      }))
    }
  }

  const handleRemoveFile = (
    mode: keyof OverallFileState,
    stateUpdater: React.Dispatch<React.SetStateAction<OverallFileState>>,
    header: boolean = false,
    related: boolean = false
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
    formRef.current?.setValue(
      `imageFile_${mode}${
        header ? (related ? 'Related' : 'Header') : heroMode[mode]
      }`,
      ''
    )
    onCheckRequired(mode)
  }

  const renderFileUploadSection = (
    mode: keyof OverallFileState,
    state: OverallFileState,
    stateUpdater: React.Dispatch<React.SetStateAction<OverallFileState>>,
    header: boolean = false,
    related: boolean = false
  ) => {
    const { file, invalidFile, uploading } = state[mode]
    const typeupload = heroMode[mode]
    let fileType = ''
    if (file) {
      fileType = file.originalFileName.split('.').pop() ?? '' // Get the extension dynamically
    }

    let fileUploadContent
    if (uploading) {
      fileUploadContent = (
        <ProgressBar mode='indeterminate' style={{ height: '6px' }} />
      )
    } else if (
      file &&
      (header || typeupload === 'I') &&
      ['png', 'jpg', 'jpeg'].includes(fileType)
    ) {
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
            acceptTypes={
              !header && typeupload === 'V'
                ? videoTypes.join(', ')
                : acceptTypes.join(', ')
            }
            name={`imageFile_${mode}${
              header ? (related ? 'Related' : 'Header') : typeupload
            }`}
            outputType='file'
            mode='single'
            messageWrongFile={
              !header && typeupload === 'V'
                ? 'please upload file .mp4 .avi .mov'
                : 'please upload image .png .jpeg .jpg'
            }
            onError={(error: any) =>
              stateUpdater((prev) => ({
                ...prev,
                [mode]: { ...prev[mode], invalidFile: error },
              }))
            }
            onChange={(file: any) =>
              handleFileUpload(file, mode, stateUpdater, header, related)
            }
            title={
              !header && typeupload === 'V' ? 'Upload Video' : 'Upload Image'
            }
          />
        </div>
      )
    } else if (
      file &&
      !header &&
      typeupload === 'V' &&
      ['mp4', 'avi', 'mov'].includes(fileType)
    ) {
      fileUploadContent = (
        <Message
          content={
            <div className='w-full flex justify-content-between py-3'>
              <span>{file[`originalFileName`]}</span>
              <button
                className='pi pi-times cursor-pointer'
                onClick={() =>
                  handleRemoveFile(mode, stateUpdater, header, related)
                }
                aria-label='Remove file'
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                }}
              ></button>
            </div>
          }
        />
      )
    } else {
      fileUploadContent = (
        <ImageButtonField
          rules={
            requiredLang.includes(mode)
              ? { required: ' ' }
              : { required: undefined }
          }
          acceptTypes={
            !header && typeupload === 'V'
              ? videoTypes.join(', ')
              : acceptTypes.join(', ')
          }
          name={`imageFile_${mode}${
            header ? (related ? 'Related' : 'Header') : typeupload
          }`}
          outputType='file'
          mode='single'
          messageWrongFile={
            !header && typeupload === 'V'
              ? 'please upload file .mp4 .avi .mov'
              : 'please upload image .png .jpeg .jpg'
          }
          onError={(error: any) =>
            stateUpdater((prev) => ({
              ...prev,
              [mode]: { ...prev[mode], invalidFile: error },
            }))
          }
          onChange={(file: any) =>
            handleFileUpload(file, mode, stateUpdater, header, related)
          }
          title={
            !header && typeupload === 'V' ? 'Upload Video' : `Upload Image`
          }
        />
      )
    }

    return (
      <div className='flex flex-column mt-5 gap-2'>
        <div className='flex flex-column gap-1 w-full'>
          {header && !related && (
            <Divider align='center'>
              <span>Content</span>
            </Divider>
          )}
        </div>
        <span className='flex text-xl font-bold text-primary-800'>
          {header
            ? related
              ? 'Cover Related Image'
              : `Header Image`
            : 'Hero Image'}
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
              ? related
                ? 'Cover related image Allow file: jpg, jpeg, png Maximum 2MB (Recommend image ratio 1:1) (Min 180x180 px, Max 540x540 px)'
                : 'Header image Maximum 2MB (Recommend image ratio 9:16) (Min 360x640 px, Max 860x1527 px)'
              : 'Hero image Maximum 2MB (Recommend image ratio 13:8) (Min 390x240 px, Max 1170x720 px)'}
          </small>
          <div className='flex flex-column gap-1 w-full'>
            <small className='text-xs text-primary-800'>
              {heroMode[mode] === 'I' || header
                ? 'Allowed file types: .png, .jpeg, .jpg '
                : 'Allowed file types: .mp4, .avi, .mov'}
            </small>
          </div>

          {!header && (
            <div className='flex align-items-center mt-2'>
              <RadioButton
                inputId={`templateI_${mode}`}
                name={`templateI_${mode}`}
                onChange={() => {
                  // handleRemoveFile(mode, setHeroState, false, related)
                  setHeroMode((prev: any) => ({
                    ...prev,
                    [mode]: 'I',
                  }))
                  stateUpdater((prev) => ({
                    ...prev,
                    [mode]: { ...prev[mode], invalidFile: null },
                  }))
                }}
                checked={heroMode[mode] === 'I'}
              />
              <label
                htmlFor={`templateI_${mode}`}
                className='ml-2 mr-5 text-primary-800 tw-text-sm'
              >
                Image
              </label>

              <RadioButton
                inputId={`templateV_${mode}`}
                name={`templateV_${mode}`}
                onChange={() => {
                  // handleRemoveFile(mode, setHeroState, false, related)
                  setHeroMode((prev: any) => ({
                    ...prev,
                    [mode]: 'V',
                  }))
                  stateUpdater((prev) => ({
                    ...prev,
                    [mode]: { ...prev[mode], invalidFile: null },
                  }))
                }}
                checked={heroMode[mode] === 'V'}
              />
              <label
                htmlFor={`templateV_${mode}`}
                className='ml-2 mr-5 text-primary-800 tw-text-sm'
              >
                Video
              </label>
            </div>
          )}
        </div>
        {fileUploadContent}
      </div>
    )
  }

  useEffect(() => {
    onCheckRequired(activeLang.code)
  }, [heroState, headerState, activeLang])

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
    <FormProvider {...formData}>
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
          <PreviewBanner
            formData={formData}
            lang={activeLang.code}
            isContent={isContent}
            headerState={headerState}
            bannerState={heroState}
            textBanner={textHero}
            mode={heroMode[activeLang.code]}
            data={formRef.current?.getValues()}
          />
        </Dialog>
        <div className='flex flex-wrap flex-column md:flex-row align-items-center justify-content-between mb-5'>
          <div className='tw-max-w-inherit'>
            <div className='tw-px-[15px] lg:tw-px-0'>
              <div className='tw-text-[#2B3674] tw-text-[34px] tw-font-bold'>
                Hero Banner
              </div>
            </div>
          </div>

          <div className='flex align-items-center justify-contents-end'>
            <div className='flex gap-3 justify-content-center md:justify-content-start'>
              <Button
                disabled={loading}
                className={`px-5 ${
                  loading ? 'bg-disabled' : 'bg-primary-blue'
                }`}
                label='Publish'
                onClick={formRef.current?.handleSubmit(
                  onSubmit,
                  onInvalidSubmit
                )}
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
                  ? 'Create new Hero Banner'
                  : 'Edit Hero Banner'}
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
                <div className='flex flex-column'>
                  <span className='flex text-xl font-bold text-primary-800'>
                    Banner name*
                  </span>
                  <div className='flex flex-column gap-1 w-full'>
                    <small className='text-primary-800'>
                      Banner name (English)
                    </small>
                    <TextField
                      name={`banner`}
                      rules={{ required: 'Banner name required' }}
                      showRequiredLabel={false}
                      placeholder='Text here'
                      maxLength={50}
                      onChange={() => setIsFormChange(true)}
                    />
                  </div>
                </div>
                <div className='flex flex-column w-full gap-2 tw-w-[35%]'>
                  <span className='flex text-xl font-bold text-primary-800'>
                    Show Time
                  </span>
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
                <div className='flex flex-column mt-5 gap-2'>
                  <span className='flex text-xl font-bold text-primary-800'>
                    Template*
                  </span>
                  <div className='flex flex-column gap-1 w-full'>
                    <small className='text-xs text-primary-800'>
                      Choose Template
                    </small>
                  </div>
                  <div className='flex align-items-center mt-2'>
                    <RadioButton
                      inputId={`templateA`}
                      name={`templateA`}
                      onChange={() => {
                        setIsFormChange(true)
                        setTypeTemplate('A')
                        handleRemoveFile('en', setHeaderState, true, true)
                        handleRemoveFile('th', setHeaderState, true, true)
                        handleRemoveFile('cn', setHeaderState, true, true)
                      }}
                      checked={typeTemplate === 'A'}
                    />
                    <label
                      htmlFor={`templateA`}
                      className='ml-2 mr-5 text-primary-800 tw-text-sm'
                    >
                      Content
                    </label>

                    <RadioButton
                      inputId={`templateB`}
                      name={`templateB`}
                      onChange={() => {
                        setIsFormChange(true)
                        setTypeTemplate('B')
                        handleRemoveFile('en', setHeaderState, true, true)
                        handleRemoveFile('th', setHeaderState, true, true)
                        handleRemoveFile('cn', setHeaderState, true, true)
                      }}
                      checked={typeTemplate === 'B'}
                    />
                    <label
                      htmlFor={`templateB`}
                      className='ml-2 mr-5 text-primary-800 tw-text-sm'
                    >
                      Link to
                    </label>

                    <RadioButton
                      inputId={`templateC`}
                      name={`templateC`}
                      onChange={() => {
                        setIsFormChange(true)
                        setTypeTemplate('C')
                        handleRemoveFile('en', setHeaderState, true, true)
                        handleRemoveFile('th', setHeaderState, true, true)
                        handleRemoveFile('cn', setHeaderState, true, true)
                      }}
                      checked={typeTemplate === 'C'}
                    />
                    <label
                      htmlFor={`templateC`}
                      className='ml-2 mr-5 text-primary-800 tw-text-sm'
                    >
                      No Action
                    </label>
                  </div>
                  {typeTemplate === 'B' && (
                    <div className='flex flex-column gap-1 w-full'>
                      <TextField
                        name={`link`}
                        rules={{
                          required: 'Link required',
                          pattern: {
                            value: new RegExp(
                              '^(https?:\\/\\/)?' + // protocol (optional)
                                '((([a-zA-Z0-9\\-]+\\.)+[a-zA-Z]{2,})|' + // domain (e.g., google.com)
                                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IPv4 address (e.g., 192.168.0.1)
                                '(\\:\\d+)?' + // port (optional)
                                '(\\/[-a-zA-Z0-9%_.~+]*)*' + // path (optional)
                                '(\\?[;&a-zA-Z0-9%_.~+=-]*)?' + // query string (optional)
                                '(\\#[-a-zA-Z0-9_]*)?$' // fragment identifier (optional)
                            ),
                            message: 'Please enter a valid URL',
                          },
                        }}
                        showRequiredLabel={false}
                        placeholder='https://example.com/'
                        validate={isValidLink}
                      />
                    </div>
                  )}
                </div>

                {/* Hide Show Related Temporary */}
                {typeTemplate === 'A' && (
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
                )}

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
                                {renderFileUploadSection(
                                  lang.code,
                                  heroState,
                                  setHeroState
                                )}
                                <div className='flex flex-column'>
                                  <span className='flex text-xl font-bold text-primary-800'>
                                    Text Banner
                                  </span>
                                  <div className='flex flex-column gap-1 w-full'>
                                    <small className='text-primary-800'>
                                      Message ({lang.label}) (Recommend Wording
                                      Size : Heading 1 and White Color)
                                    </small>
                                    <div
                                      className='w-full'
                                      style={{
                                        padding: '24px',
                                        background: '#f6f6f6',
                                        borderRadius: '0.25rem',
                                        marginTop: '1rem',
                                      }}
                                    >
                                      <EditorField
                                        name={`banner-text${lang.code}`}
                                        style={{ height: '320px' }}
                                        rules={{ required: undefined }}
                                        onTextChange={(e) => {
                                          setIsFormChange(true)
                                          onEditAnswer(e.htmlValue, lang.code)
                                        }}
                                        showRequiredLabel={false}
                                        value={textHero[lang.code]}
                                        isCustom
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className='flex flex-column gap-1 tw-w-[20%]'>
                                  <Button
                                    disabled={false}
                                    className='px-5 bg-primary-blue'
                                    label='Preview Banner'
                                    onClick={(e) => {
                                      e.preventDefault()
                                      setIsContent(false)
                                      setVisible(true)
                                    }}
                                  />
                                </div>

                                {typeTemplate === 'B' &&
                                  heroMode[activeLang.code] === 'V' && (
                                    <Fragment>
                                      {renderFileUploadSection(
                                        lang.code,
                                        headerState,
                                        setHeaderState,
                                        true,
                                        true
                                      )}
                                    </Fragment>
                                  )}

                                {typeTemplate === 'A' && (
                                  <Fragment>
                                    {renderFileUploadSection(
                                      lang.code,
                                      headerState,
                                      setHeaderState,
                                      true
                                    )}

                                    <div className='flex flex-column mt-2 gap-2'>
                                      <span className='flex text-xl font-bold text-primary-800'>
                                        Title{' '}
                                        {requiredLang.includes(lang.code) && (
                                          <span>*</span>
                                        )}
                                      </span>
                                      <div className='flex flex-column gap-1 w-full'>
                                        <small className='text-xs text-primary-800'>
                                          title ({lang.label}){' '}
                                        </small>
                                        <TextAreaField
                                          name={`title_${lang.code}`}
                                          rules={{
                                            required: requiredLang.includes(
                                              lang.code
                                            )
                                              ? 'Title required'
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

                                    <ContentBuilder
                                      dataKey={`${lang.code}_contents`}
                                      locale={lang.code}
                                      formData={formData}
                                      setRequiredLang={setRequiredLang}
                                      onCheckRequired={onCheckRequired}
                                      setIsFormChange={setIsFormChange}
                                    />

                                    <div className='flex flex-column gap-1 tw-w-[20%]'>
                                      <Button
                                        disabled={false}
                                        className='px-5 bg-primary-blue'
                                        label='Preview Content'
                                        onClick={(e) => {
                                          e.preventDefault()
                                          setIsContent(true)
                                          setVisible(true)
                                        }}
                                      />
                                    </div>
                                  </Fragment>
                                )}
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
                className={`px-5 ${
                  loading ? 'bg-disabled' : 'bg-primary-blue'
                }`}
                label='Publish'
                onClick={formRef.current?.handleSubmit(
                  onSubmit,
                  onInvalidSubmit
                )}
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
    </FormProvider>
  )
}

export default Upsert
