/* eslint-disable unused-imports/no-unused-vars-ts */
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import ImageButtonField from '@components/forms/components/image-button-field'
import {
  IHappeningData,
  IHappeningUpload,
} from '@src/services/marcom/what-happening/model'
import { happeningService } from '@src/services/marcom/what-happening/service'
import { KeyValue } from '@src/types/key-value'
import { convertToBase64 } from '@src/utils/image'
import { last } from 'lodash'
import { useRouter } from 'next/router'
import { ProgressBar } from 'primereact/progressbar'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Image } from 'primereact/image'
import { Message } from 'primereact/message'
import { Button } from 'primereact/button'
import DropdownField from '@components/forms/components/dropdown-field'
import CheckBoxField from '@components/forms/components/checkbox-field'
import { TabMenu } from 'primereact/tabmenu'
import TextAreaField from '@components/forms/components/text-area-field'
import TextField from '@components/forms/components/text-field'
import { confirmDialog } from 'primereact/confirmdialog'
import { toast } from 'react-toastify'
import { InputSwitch } from 'primereact/inputswitch'
import CalendarField from '@components/forms/components/calendar-field'
import { RadioButton } from 'primereact/radiobutton'
import ChipsField from '@components/forms/components/chips-field'
import EditorField from '@components/forms/components/editor-field'
import { Divider } from 'primereact/divider'
import ContentBuilder from '@components/sustainability/content-management/content'
import PreviewContent from './preview'
import { Dialog } from 'primereact/dialog'
import { artCProgramServices } from '@src/services/art-and-culture/art-c-program-service'

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
  file?: IHappeningData
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
  const {
    formData,
    defaultValue,
    contentData,
    formType,
    parent,
    isCategory = false,
  } = props

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

  const router = useRouter()
  const { query } = router

  const formRef = useRef<FormControllerRef<any>>(null)
  const [requiredLang, setRequiredLang] = useState<string[]>(['en'])
  const [activeLang, setActiveLang] = useState<Lang>(langItems[0])
  const [typeLink, setTypeLink] = useState<string>('A')
  const [typeLinkCate, setTypeLinkCate] = useState<string>('A')
  const [artType, setArtType] = useState<string>('A')

  const [isSubMenu, setIsSubMenu] = useState<boolean>(!isCategory)
  const [isShowRelate, setIsShowRelate] = useState<boolean>(false)
  const [isPin, setIsPin] = useState<boolean>(false)
  const [isAllTime, setIsAllTime] = useState<boolean>(false)
  const [isArtC, setIsArtC] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [isHasSub, setIsHasSub] = useState<boolean>(false)
  const [isSelect, setIsSelect] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isFormChange, setIsFormChange] = useState<boolean>(false)

  const [category, setCategory] = useState<any>('')
  const [categoryID, setCategoryID] = useState<any>('')

  const [lstCategory, setLstCategory] = useState<KeyValue[]>([])
  const [coverState, setCoverState] =
    useState<OverallFileState>(initialFileState)
  const [headerState, setHeaderState] =
    useState<OverallFileState>(initialFileState)

  const [minDate, setMinDate] = useState<any>(null)
  const [maxDate, setMaxDate] = useState<any>(null)

  const [minDateEvent, setMinDateEvent] = useState<any>(null)
  const [maxDateEvent, setMaxDateEvent] = useState<any>(null)

  const [textImage, setTextImage] = useState<any>({
    en: undefined,
    th: undefined,
    cn: undefined,
  })

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
      const uploadData: IHappeningUpload = {
        fileName: file.name,
        fileContentBase64: base64Data,
        contentType: file.type,
      }

      const res = await happeningService.upload(uploadData)
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
          rules={{ required: requiredLang.includes(mode) ? ' ' : undefined }}
          acceptTypes={acceptTypes.join(', ')}
          name={`imageFile_${mode}${header ? 'Header' : ''}`}
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
      )
    }

    return (
      <div className='flex flex-column mt-5 gap-2'>
        <span className='flex text-xl font-bold text-primary-800'>
          {header ? 'Head Image' : 'Thumbnail Image'}{' '}
          {requiredLang.includes(mode) && <span>*</span>}
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
          {header ? (
            <small className='text-xs text-primary-800'>
              Head image Allow file: jpg, jpeg, png Maximum 2MB (Recommend image
              ratio 16:9) (Min 800x450 px, Max 1600x900 px)
            </small>
          ) : (
            <small className='text-xs text-primary-800'>
              Thumbnail image Allow file: jpg, jpeg, png Maximum 2MB (Recommend
              image ratio 1:1) (Min 180x180 px, Max 540x540 px)
            </small>
          )}
        </div>
        {fileUploadContent}
      </div>
    )
  }

  const alphabetToNumber = (char: string): number | null => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'
    const lowerChar = char.toLowerCase()

    if (alphabet.includes(lowerChar)) {
      return alphabet.indexOf(lowerChar) + 1
    }
    return null
  }

  const numberToUppercaseAlphabet = (num: number): string | null => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    if (num >= 1 && num <= 26) {
      return alphabet[num - 1]
    }

    return null
  }

  const formatTime = (date: any) => {
    const d = new Date(date)
    return new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes()
    )
  }

  const mapData = (data: any) => {
    const { id } = query

    const startAt = new Date(data.start_at)
    const endAt = new Date(data.end_at)
    const startEvent = new Date(data.start_event)
    const endEvent = new Date(data.end_event)
    startEvent.setHours(7)
    startEvent.setMinutes(startAt.getMinutes())
    startEvent.setSeconds(startAt.getSeconds())
    startEvent.setMilliseconds(startAt.getMilliseconds())

    endEvent.setHours(7)
    endEvent.setMinutes(endAt.getMinutes())
    endEvent.setSeconds(endAt.getSeconds())
    endEvent.setMilliseconds(endAt.getMilliseconds())
    const result: any = {
      id: formType != 'create-sub' ? id : null,
      parent: data.category,
      status: data.status === '1',
      isSubMenu: isSubMenu,
      isCategory: isCategory || !isSubMenu,
      isShowRelate: isShowRelate,
      type: alphabetToNumber(typeLink),
      systemType: (alphabetToNumber(typeLinkCate) ?? 0) - 1,
      artType: typeLinkCate === 'A' ? alphabetToNumber(artType) : 1,
      isDelete: false,
      detail: {},
      isArtC: isArtC,
      linkToURL: data.link,
      isPin: isPin,
      start: data.start_at ? new Date(startAt).valueOf() : null,
      end: !data.alltime && data.end_at ? new Date(endAt).valueOf() : null,
      alltime: data.alltime,
      startEvent: data.start_event ? new Date(startEvent).valueOf() : null,
      endEvent: data.end_event ? new Date(endEvent).valueOf() : null,
      tag: data.tag ?? [],
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

    result.detail.en.text = textImage['en']
    result.detail.th.text = textImage['th']
    result.detail.cn.text = textImage['cn']

    if (isSubMenu) {
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
    }

    return result
  }

  const onBack = (isCancel: boolean, isChange = true) => {
    if ((formType == 'create-sub' || formType == 'edit') && isCancel) {
      if (categoryID && isChange) {
        router.push(`/marcom/happening/content/${categoryID}`)
      } else {
        router.back()
      }
    } else {
      router.push(`/marcom/happening`)
    }
  }

  const onSubmit = (data: any) => {
    const result = mapData(data)
    confirmDialog({
      message: `Are you sure you want to save ${
        !isSubMenu || isCategory ? 'Category' : 'Content'
      }?`,
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
                await toast.promise(happeningService.save(result), {
                  pending: 'Loading...',
                  success: `${
                    !isSubMenu || isCategory ? 'Category' : 'Content'
                  } save successfully!`,
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
                  onBack(true)
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
      id: id,
      isCategory: isCategory || !isSubMenu,
    }
    confirmDialog({
      message: `Are you sure you want to delete ${
        !isSubMenu || isCategory ? 'Category' : 'Content'
      }?`,
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
                await toast.promise(happeningService.delete(params), {
                  pending: 'Loading...',
                  success: `${
                    !isSubMenu || isCategory ? 'Category' : 'Content'
                  } delete successfully!`,
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
                  onBack(true)
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
    fetchCategory(parent)
    if (contentData) {
      setLoading(true)
      const reqLang = ['en']
      formRef.current?.setValue('status', contentData.status ? '1' : '0')
      formRef.current?.setValue('relate', contentData.isShowRelate)
      formRef.current?.setValue('tag', contentData.tag)
      formRef.current?.setValue('artc', contentData.isArtC)
      if (contentData.parent) {
        fetchCategory(contentData.parent)
      }
      formRef.current?.setValue('category', contentData.parent)
      const cate = lstCategory.find((f) => f.value === contentData.parent)
      const category = cate?.name ?? ''
      const selected = cate?.isSelectMenu ?? false
      setCategory(category)
      setIsSelect(selected)
      setTypeLink(numberToUppercaseAlphabet(contentData.type) ?? 'A')
      setTypeLinkCate(
        numberToUppercaseAlphabet(contentData.systemType + 1) ?? 'A'
      )
      setArtType(numberToUppercaseAlphabet(contentData.artType) ?? 'A')
      setIsShowRelate(contentData.isShowRelate)
      setIsArtC(contentData.isArtC)
      setIsSubMenu(!contentData.isCategory)
      setIsHasSub(contentData.isHasSub)
      setIsPin(contentData.isPin)

      formRef.current?.setValue('start_at', new Date(contentData.start))
      formRef.current?.setValue(
        'end_at',
        contentData.end ? new Date(contentData.end) : null
      )
      formRef.current?.setValue('alltime', contentData.alltime)
      setIsAllTime(contentData.alltime)

      formRef.current?.setValue('start_event', new Date(contentData.startEvent))
      formRef.current?.setValue('end_event', new Date(contentData.endEvent))
      formRef.current?.setValue('link', contentData.linkToURL)
      formRef.current?.setValue('tag', contentData.tag)

      formRef.current?.setValue('title_en', contentData.detail.en.title)
      formRef.current?.setValue('title_th', contentData.detail.th.title)
      formRef.current?.setValue('title_cn', contentData.detail.cn.title)

      formRef.current?.setValue('introduce_en', contentData.detail.en.introduce)
      formRef.current?.setValue('introduce_th', contentData.detail.th.introduce)
      formRef.current?.setValue('introduce_cn', contentData.detail.cn.introduce)

      formRef.current?.setValue('location_en', contentData.detail.en.location)
      formRef.current?.setValue('location_th', contentData.detail.th.location)
      formRef.current?.setValue('location_cn', contentData.detail.cn.location)

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

      setTextImage((prev: any) => ({
        ...prev,
        en: contentData.detail.en.text,
        th: contentData.detail.th.text,
        cn: contentData.detail.cn.text,
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

  useEffect(() => {
    if (parent) {
      formRef.current?.setValue('category', parent)

      const cate = lstCategory.find((f) => f.value === parent)
      const checked = cate?.isArtC ?? false
      const category = cate?.name ?? ''
      const selected = cate?.isSelectMenu ?? false
      setIsSelect(selected)
      setCategory(category)
      setIsHasSub(true)
      setIsSubMenu(true)
      setIsArtC(checked)
    }
  }, [parent, lstCategory])

  const getDataByLang = (data: any, lang: keyof OverallFileState) => ({
    intro: data[`introduce_${lang}`],
    title: data[`title_${lang}`],
    location: data[`location_${lang}`],
    related: data[`related_${lang}`],
    relatedSub: data[`relatedSub_${lang}`],
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

  const HtmlStringToString = (value: string) => {
    const myHTML = new DOMParser().parseFromString(value, 'text/html')
    return myHTML.body.textContent ?? ''
  }

  const isBasicFieldsEmpty = (
    location: string,
    intro: string,
    title: string,
    related: string,
    relatedSub: string,
    isShowRelate: boolean
  ) =>
    isEmptyString(title) &&
    isEmptyString(intro) &&
    isEmptyString(location) &&
    ((isShowRelate && isEmptyString(related) && isEmptyString(relatedSub)) ||
      !isShowRelate)

  const isSubMenuContentEmpty = (contents: any[], cover: any, head: any) =>
    (cover == null || cover === undefined) &&
    (head == null || head === undefined) &&
    contents.length === 1 &&
    isContentEmpty(contents[0])

  const isLangRequired = (
    lang: keyof OverallFileState,
    data: any,
    cover: any,
    head: any
  ) => {
    const { location, intro, title, contents, related, relatedSub } =
      getDataByLang(data, lang)

    if (!isSubMenu) {
      return isBasicFieldsEmpty(
        location,
        intro,
        title,
        related,
        relatedSub,
        false
      )
    }

    return (
      isBasicFieldsEmpty(
        location,
        intro,
        title,
        related,
        relatedSub,
        isShowRelate
      ) &&
      isSubMenuContentEmpty(contents, cover, head) &&
      isEmptyString(textImage[lang])
    )
  }

  const onCheckRequired = (lang: keyof OverallFileState) => {
    if (lang === 'en') return

    const data = formRef.current?.getValues()
    const { file: cover } = coverState[lang]
    const { file: head } = headerState[lang]

    if (isLangRequired(lang, data, cover, head)) {
      setRequiredLang((prevData) => prevData.filter((item) => item !== lang))
    }
  }

  useEffect(() => {
    onCheckRequired(activeLang.code)
  }, [coverState, headerState, textImage, activeLang])

  const fetchCategory = async (parentid: any) => {
    await happeningService
      .getOption({ happeningID: parentid })
      .then((res: any) => {
        setLstCategory(res?.data?.data ?? [])
        if (contentData) {
          const cate = res?.data?.data.find(
            (f: any) => f.value === contentData.parent
          )
          const category = cate?.name ?? ''
          const selected = cate?.isSelectMenu ?? false
          setCategory(category)
          setIsSelect(selected)
        }
      })
      .catch((err) => {
        console.error('', err)
      })
  }

  const onEditAnswer = (editorState: any, lang: any) => {
    setTextImage((prev: any) => ({
      ...prev,
      [lang]: editorState,
    }))
    const valueEditor = HtmlStringToString(editorState)
    if (valueEditor && valueEditor !== '') {
      setRequiredLang((prevData: any) => [...prevData, lang])
    } else {
      onCheckRequired(lang)
    }
  }

  const getProgram = async (id: any) => {
    setIsLoading(true)
    await artCProgramServices
      .get(`${id}`, 'all')
      .then((res) => {
        const { data } = res.data
        if (data) {
          formRef.current?.setValue(
            'start_at',
            data.periodAt ? new Date(data.periodAt) : null
          )
          formRef.current?.setValue(
            'start_event',
            data.periodAt ? new Date(data.periodAt) : null
          )
          formRef.current?.setValue(
            'end_at',
            data.periodEnd ? new Date(data.periodEnd) : null
          )
          formRef.current?.setValue(
            'end_event',
            data.periodEnd ? new Date(data.periodEnd) : null
          )
        }
      })
      .catch(() => {
        alert("Something went wrong, can't fetch program.")
      })
      .finally(() => {
        setIsLoading(false)
      })
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
                onBack(true, false)
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
      onBack(true)
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
          category={category}
          textImage={textImage}
        />
      </Dialog>
      <div className='flex flex-wrap flex-column md:flex-row align-items-center justify-content-between mb-5'>
        <div className='tw-max-w-inherit'>
          <div className='tw-px-[15px] lg:tw-px-0'>
            <div className='tw-text-[#2B3674] tw-text-[34px] tw-font-bold'>
              {"What's Happening"}
            </div>
          </div>
        </div>
        <div className='flex align-items-center justify-contents-end'>
          <div className='flex gap-3 justify-content-center md:justify-content-start'>
            {isSubMenu && !isCategory && (
              <Button
                disabled={loading}
                className={`px-5 ${
                  loading ? 'bg-disabled' : 'bg-primary-blue'
                }`}
                label='Preview'
                onClick={(e) => {
                  e.preventDefault()
                  setVisible(true)
                }}
              />
            )}

            <Button
              disabled={loading}
              className={`px-5 ${loading ? 'bg-disabled' : 'bg-primary-blue'}`}
              label='Publish'
              onClick={formRef.current?.handleSubmit(onSubmit, onInvalidSubmit)}
            />
            {formType === 'edit' && (!isHasSub || isSubMenu) && (
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
            {formType.includes('create') && (
              <h4 className='text-astronaut font-bold'>
                {formType === 'create'
                  ? 'Create new category'
                  : 'Create new content'}
              </h4>
            )}
            {formType === 'edit' && (
              <h4 className='text-astronaut font-bold'>
                {!isSubMenu ? 'Edit category' : 'Edit content'}
              </h4>
            )}

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

            <div className='flex w-full mt-5 flex-column'>
              {(!isSubMenu || isCategory) && (
                <div className='flex flex-column mt-5 gap-2'>
                  <div className='flex align-items-center mt-2'>
                    <RadioButton
                      inputId={`linkB`}
                      name={`linkB`}
                      onChange={() => {
                        setIsFormChange(true)
                        setTypeLinkCate('B')
                      }}
                      checked={typeLinkCate === 'B'}
                    />
                    <label
                      htmlFor={`linkB`}
                      className='ml-2 mr-5 text-primary-800 tw-text-sm'
                    >
                      Internal id link to Art & Culture
                    </label>

                    <RadioButton
                      inputId={`linkC`}
                      name={`linkC`}
                      onChange={() => {
                        setIsFormChange(true)
                        setTypeLinkCate('C')
                      }}
                      checked={typeLinkCate === 'C'}
                    />
                    <label
                      htmlFor={`linkC`}
                      className='ml-2 mr-5 text-primary-800 tw-text-sm'
                    >
                      Internal id link to Workplace
                    </label>

                    <RadioButton
                      inputId={`linkA`}
                      name={`linkA`}
                      onChange={() => {
                        setIsFormChange(true)
                        setTypeLinkCate('A')
                      }}
                      checked={typeLinkCate === 'A'}
                    />
                    <label
                      htmlFor={`linkA`}
                      className='ml-2 mr-5 text-primary-800 tw-text-sm'
                    >
                      Not has internal id link
                    </label>
                  </div>
                </div>
              )}
              {isSubMenu && !isCategory && (
                <>
                  <div className='flex flex-column mt-4 gap-1 tw-w-[65%]'>
                    <DropdownField
                      name={`category`}
                      label={'Category*'}
                      options={lstCategory}
                      optionLabel='name'
                      optionValue='value'
                      placeholder='Choose category'
                      rules={{ required: 'Please select category' }}
                      disabled={false}
                      showRequiredLabel={false}
                      onChange={(e) => {
                        setIsFormChange(true)
                        if (e.target.value) {
                          const cate = lstCategory.find(
                            (f) => f.value === e.target.value
                          )
                          const checked = cate?.isArtC ?? false
                          const category = cate?.name ?? ''
                          const selected = cate?.isSelectMenu ?? false
                          const value = cate?.value
                          setTypeLink(checked ? 'A' : 'B')
                          setIsArtC(checked)
                          setCategoryID(value)
                          setCategory(category)
                          setIsSelect(selected)
                        } else {
                          setIsArtC(false)
                          setCategoryID(null)
                          setCategory('')
                          setIsSelect(false)
                        }
                      }}
                    />
                  </div>
                  <div className='flex w-full mt-4'>
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
                </>
              )}
            </div>

            {isSubMenu && !isCategory && (
              <div className='flex w-full mt-5 flex-column'>
                {/* Pin */}
                <div className='flex flex-column gap-2 w-full lg:w-24rem'>
                  <span className='flex text-xl font-bold text-primary-800'>
                    Pin
                  </span>
                  <div className='flex flex-column gap-1 w-full'>
                    <InputSwitch
                      checked={isPin}
                      onChange={(e) => {
                        setIsPin(e.value)
                        setIsFormChange(true)
                      }}
                    />
                  </div>
                </div>
                <div className='flex flex-column mt-5 gap-2'>
                  <span className='flex text-xl font-bold text-primary-800'>
                    Type link*
                  </span>
                  <div className='flex flex-column gap-1 w-full'>
                    <small className='text-xs text-primary-800'>
                      Choose Type Link
                    </small>
                  </div>
                  <div className='flex align-items-center mt-2'>
                    {isArtC && (
                      <>
                        <RadioButton
                          inputId={`templateA`}
                          name={`templateA`}
                          onChange={() => {
                            setIsFormChange(true)
                            formRef.current?.setValue('link', '')
                            formRef.current?.clearErrors('link')
                            formRef.current?.setValue('start_at', null)
                            formRef.current?.setValue('end_at', null)
                            formRef.current?.setValue('start_event', null)
                            formRef.current?.setValue('end_event', null)
                            formRef.current?.setValue('alltime', false)
                            setIsAllTime(false)
                            setTypeLink('A')
                          }}
                          checked={typeLink === 'A'}
                        />
                        <label
                          htmlFor={`templateA`}
                          className='ml-2 mr-5 text-primary-800 tw-text-sm'
                        >
                          Internal Id Link
                        </label>
                      </>
                    )}

                    <RadioButton
                      inputId={`templateB`}
                      name={`templateB`}
                      onChange={() => {
                        setIsFormChange(true)
                        formRef.current?.setValue('link', '')
                        formRef.current?.clearErrors('link')
                        formRef.current?.setValue('start_at', null)
                        formRef.current?.setValue('end_at', null)
                        formRef.current?.setValue('start_event', null)
                        formRef.current?.setValue('end_event', null)
                        formRef.current?.setValue('alltime', false)
                        setIsAllTime(false)
                        setTypeLink('B')
                      }}
                      checked={typeLink === 'B'}
                    />
                    <label
                      htmlFor={`templateB`}
                      className='ml-2 mr-5 text-primary-800 tw-text-sm'
                    >
                      External Link
                    </label>

                    <RadioButton
                      inputId={`templateC`}
                      name={`templateC`}
                      onChange={() => {
                        setIsFormChange(true)
                        formRef.current?.setValue('link', '')
                        formRef.current?.clearErrors('link')
                        formRef.current?.setValue('start_at', null)
                        formRef.current?.setValue('end_at', null)
                        formRef.current?.setValue('start_event', null)
                        formRef.current?.setValue('end_event', null)
                        formRef.current?.setValue('alltime', false)
                        setIsAllTime(false)
                        setTypeLink('C')
                      }}
                      checked={typeLink === 'C'}
                    />
                    <label
                      htmlFor={`templateC`}
                      className='ml-2 mr-5 text-primary-800 tw-text-sm'
                    >
                      Not Show Link to
                    </label>
                  </div>
                </div>

                {typeLink === 'A' && isSelect && (
                  <div className='flex flex-column mt-5 gap-2'>
                    <span className='flex text-xl font-bold text-primary-800'>
                      Art & Culture Type*
                    </span>
                    <div className='flex flex-column gap-1 w-full'>
                      <small className='text-xs text-primary-800'>
                        Choose Art & Culture Type
                      </small>
                    </div>
                    <div className='flex align-items-center mt-2'>
                      <RadioButton
                        inputId={`artTypeA`}
                        name={`artTypeA`}
                        onChange={() => {
                          setIsFormChange(true)
                          setArtType('A')
                          const data = formRef.current?.getValues()
                          if (data.link) {
                            formRef.current?.setValue('alltime', false)
                            setIsAllTime(false)
                            getProgram(data.link)
                          } else {
                            formRef.current?.setValue('start_at', null)
                            formRef.current?.setValue('end_at', null)
                            formRef.current?.setValue('start_event', null)
                            formRef.current?.setValue('end_event', null)
                            formRef.current?.setValue('alltime', false)
                            setIsAllTime(false)
                          }
                        }}
                        checked={artType === 'A'}
                      />
                      <label
                        htmlFor={`artTypeA`}
                        className='ml-2 mr-5 text-primary-800 tw-text-sm'
                      >
                        Program
                      </label>

                      <RadioButton
                        inputId={`artTypeB`}
                        name={`artTypeB`}
                        onChange={() => {
                          setIsFormChange(true)
                          setArtType('B')
                          formRef.current?.setValue('start_at', null)
                          formRef.current?.setValue('end_at', null)
                          formRef.current?.setValue('start_event', null)
                          formRef.current?.setValue('end_event', null)
                          formRef.current?.setValue('alltime', false)
                          setIsAllTime(false)
                        }}
                        checked={artType === 'B'}
                      />
                      <label
                        htmlFor={`artTypeB`}
                        className='ml-2 mr-5 text-primary-800 tw-text-sm'
                      >
                        Add-on
                      </label>
                    </div>
                  </div>
                )}

                {typeLink !== 'C' && (
                  <div className='flex flex-column gap-1 w-full mt-2'>
                    <TextField
                      name={`link`}
                      rules={{
                        required: 'Link required',
                        pattern:
                          typeLink === 'B'
                            ? {
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
                              }
                            : undefined,
                      }}
                      onBlur={(e) => {
                        if (
                          typeLink === 'A' &&
                          e.target.value &&
                          artType === 'A'
                        ) {
                          formRef.current?.setValue('alltime', false)
                          setIsAllTime(false)
                          getProgram(e.target.value)
                        }
                      }}
                      showRequiredLabel={false}
                      placeholder='Text Here'
                      validate={typeLink === 'B' ? isValidLink : undefined}
                    />
                  </div>
                )}
                <div className='flex flex-column w-full mt-6 gap-2 tw-w-[35%]'>
                  <span className='flex text-xl font-bold text-primary-800'>
                    Show Time
                  </span>
                  <div className='tw-w-[35%] mt-2'>
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
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div
                  className='flex w-full gap-2 tw-w-[35%] mt-2'
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
                      disabled={isAllTime || isLoading}
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

                <span className='flex text-xl mt-6 font-bold text-primary-800'>
                  Event Time
                </span>

                <div className='flex w-full  gap-4 tw-w-[35%]'>
                  <div className='tw-w-[35%] mt-2'>
                    <CalendarField
                      label='Start Event'
                      name='start_event'
                      minDate={new Date()}
                      maxDate={maxDateEvent}
                      showTime={false}
                      rules={{
                        required: 'Start Event required',
                      }}
                      onChange={(e) => {
                        setIsFormChange(true)
                        if (e.target.value) {
                          setMinDateEvent(e.target.value)
                        } else {
                          setMinDateEvent(null)
                        }
                      }}
                      dateFormat='dd/mm/yy'
                      disabled={isLoading}
                    />
                  </div>

                  <div className='tw-w-[35%] mt-2'>
                    <CalendarField
                      label='End Event'
                      name='end_event'
                      minDate={minDateEvent}
                      showTime={false}
                      rules={{
                        required: 'End Event required',
                      }}
                      disabled={isLoading}
                      onChange={(e) => {
                        setIsFormChange(true)
                        if (e.target.value) {
                          setMaxDateEvent(e.target.value)
                        } else {
                          setMaxDateEvent(null)
                        }
                      }}
                      dateFormat='dd/mm/yy'
                    />
                  </div>
                </div>

                <div className='flex flex-column mt-5 gap-2'>
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
                          if (
                            !(data.tag.slice(0, -1) ?? []).includes(newChip)
                          ) {
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
                            <div className='flex flex-column'>
                              <span className='flex text-xl font-bold text-primary-800'>
                                {!isSubMenu || isCategory
                                  ? 'Category Name'
                                  : 'Title Name'}{' '}
                                {requiredLang.includes(lang.code) && (
                                  <span>*</span>
                                )}
                              </span>
                              <div className='flex flex-column gap-1 w-full'>
                                <small className='text-primary-800'>
                                  {!isSubMenu || isCategory
                                    ? 'Category Name'
                                    : 'Title Name'}{' '}
                                  ({lang.label}){' '}
                                </small>
                                <TextField
                                  name={`title_${lang.code}`}
                                  rules={
                                    requiredLang.includes(lang.code)
                                      ? {
                                          required:
                                            !isSubMenu || isCategory
                                              ? 'Category Name required'
                                              : 'Title Name required',
                                        }
                                      : { required: undefined }
                                  }
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
                            {isSubMenu &&
                              !isCategory &&
                              renderFileUploadSection(
                                lang.code,
                                coverState,
                                setCoverState
                              )}

                            <div className='flex flex-column mt-2 gap-2'>
                              <span className='flex text-xl font-bold text-primary-800'>
                                Introduce{' '}
                              </span>
                              <div className='flex flex-column gap-1 w-full'>
                                <small className='text-xs text-primary-800'>
                                  Message ({lang.label}){' '}
                                </small>
                                <TextAreaField
                                  name={`introduce_${lang.code}`}
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

                            {isSubMenu && !isCategory && (
                              <>
                                {renderFileUploadSection(
                                  lang.code,
                                  headerState,
                                  setHeaderState,
                                  true
                                )}

                                <div className='flex flex-column'>
                                  <span className='flex text-xl font-bold text-primary-800'>
                                    Text Image
                                  </span>
                                  <div className='flex flex-column gap-1 w-full'>
                                    <small className='text-primary-800'>
                                      Message ({lang.label}){' '}
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
                                        name={`image-text${lang.code}`}
                                        style={{ height: '320px' }}
                                        rules={{ required: undefined }}
                                        onTextChange={(e) => {
                                          setIsFormChange(true)
                                          onEditAnswer(e.htmlValue, lang.code)
                                        }}
                                        showRequiredLabel={false}
                                        value={textImage[lang.code]}
                                        isCustom
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className='flex flex-column mt-2 gap-2'>
                                  <span className='flex text-xl font-bold text-primary-800'>
                                    Location{' '}
                                  </span>
                                  <div className='flex flex-column gap-1 w-full'>
                                    <small className='text-xs text-primary-800'>
                                      Message ({lang.label}){' '}
                                    </small>
                                    <TextField
                                      name={`location_${lang.code}`}
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
                              </>
                            )}
                          </div>
                        </div>
                      </Fragment>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className='flex gap-3 justify-content-center md:justify-content-start'>
            {isSubMenu && !isCategory && (
              <Button
                disabled={loading}
                className={`px-5 ${
                  loading ? 'bg-disabled' : 'bg-primary-blue'
                }`}
                label='Preview'
                onClick={(e) => {
                  e.preventDefault()
                  setVisible(true)
                }}
              />
            )}
            <Button
              disabled={loading}
              className={`px-5 ${loading ? 'bg-disabled' : 'bg-primary-blue'}`}
              label='Publish'
              onClick={formRef.current?.handleSubmit(onSubmit, onInvalidSubmit)}
            />
            {formType === 'edit' && (!isHasSub || isSubMenu) && (
              <Button
                disabled={false}
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
