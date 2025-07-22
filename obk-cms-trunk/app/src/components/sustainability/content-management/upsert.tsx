import CheckBoxField from '@components/forms/components/checkbox-field'
import DropdownField from '@components/forms/components/dropdown-field'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import ImageButtonField from '@components/forms/components/image-button-field'
import TextAreaField from '@components/forms/components/text-area-field'
import TextField from '@components/forms/components/text-field'
import {
  IContentManagementData,
  IContentUpload,
} from '@src/services/sustainability/content-mangement/model'
import { contentService } from '@src/services/sustainability/content-mangement/service'
import { KeyValue } from '@src/types/key-value'
import { convertToBase64 } from '@src/utils/image'
import { last } from 'lodash'
import { Button } from 'primereact/button'
import { Message } from 'primereact/message'
import { Image } from 'primereact/image'
import { RadioButton } from 'primereact/radiobutton'
import { TabMenu } from 'primereact/tabmenu'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import ContentBuilder from './content'
import { Dialog } from 'primereact/dialog'
import PreviewContent from './preview'
import { confirmDialog } from 'primereact/confirmdialog'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { ProgressBar } from 'primereact/progressbar'

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
  file?: IContentManagementData
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
  const { formData, defaultValue, contentData, formType, parent } = props

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
  const [typeTemplate, setTypeTemplate] = useState<any>('A')
  const [mainMenu, setMainMenu] = useState<any>('')
  const [isSubMenu, setIsSubMenu] = useState<boolean>(false)
  const [isShowRelate, setIsShowRelate] = useState<boolean>(false)
  const [isHasSub, setIsHasSub] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [isSub, setIsSub] = useState<boolean>(false)
  const [isFormChange, setIsFormChange] = useState<boolean>(false)

  const [lstMenu, setLstMenu] = useState<KeyValue[]>([])
  const [coverState, setCoverState] =
    useState<OverallFileState>(initialFileState)
  const [headerState, setHeaderState] =
    useState<OverallFileState>(initialFileState)

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
      const uploadData: IContentUpload = {
        fileName: file.name,
        fileContentBase64: base64Data,
        contentType: file.type,
      }

      const res = await contentService.upload(uploadData)
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

    const getImageDetails = () => {
      switch (typeTemplate) {
        case 'A':
          return {
            imageRatio: '1:1',
            minSize: '180 x 180px',
          }
        case 'B':
          return { imageRatio: '3:5', minSize: '115 x 200px' }
        default:
          return {
            imageRatio: '1:1',
            minSize: '75 x 75px',
          }
      }
    }

    const { imageRatio, minSize } = getImageDetails()

    return (
      <div className='flex flex-column mt-5 gap-2'>
        <span className='flex text-xl font-bold text-primary-800'>
          {header ? 'Head Image' : 'Cover Image'}{' '}
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
              Head image (Recommend image ratio 16:9) (Min 400 x 225 px)
            </small>
          ) : (
            <small className='text-xs font-bold text-info'>
              Cover image for main menu ( Recommend image ratio {imageRatio} ) (
              Min {minSize} )
            </small>
          )}
        </div>
        {fileUploadContent}
      </div>
    )
  }

  const fetchMenu = async () => {
    await contentService
      .getOption()
      .then((res: any) => {
        setLstMenu(res?.data?.data ?? [])
      })
      .catch((err) => {
        console.log('', err)
      })
  }

  const createObject = (cover: any): any => ({
    imageURL: cover.coverImageURL,
    fileName: cover.coverFileName,
    originalFileName: cover.coverOriginalFileName,
    message: '',
  })

  const createHeaderObject = (head: any): any => ({
    imageURL: head.headImageURL,
    fileName: head.headFileName,
    originalFileName: head.headOriginalFileName,
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
    if (parent) {
      formRef.current?.setValue('submenu', true)
      formRef.current?.setValue('menu', parent)
      const main = lstMenu.find((f) => f.value === parent)?.name
      setIsHasSub(true)
      setIsSubMenu(true)
      setIsSub(true)
      setMainMenu(main)
    }
  }, [parent])

  useEffect(() => {
    fetchMenu()
    if (contentData) {
      setLoading(true)
      const reqLang = ['en']
      formRef.current?.setValue('status', contentData.status ? '1' : '0')
      formRef.current?.setValue('submenu', contentData.isSubMenu)
      formRef.current?.setValue('relate', contentData.isShowRelatedLink)
      formRef.current?.setValue('menu', contentData.parentId)
      const main = lstMenu.find((f) => f.value === contentData.parentId)?.name
      setMainMenu(main)
      setIsSubMenu(contentData.isSubMenu)
      setIsSub(contentData.isSubMenu)
      setIsHasSub(contentData.isDisabled)
      setIsShowRelate(contentData.isShowRelatedLink)
      if (!contentData.isSubMenu) {
        setTypeTemplate(numberToUppercaseAlphabet(contentData.layoutType))
      }
      formRef.current?.setValue('menu_en', contentData.detail.en.menu)
      formRef.current?.setValue('menu_th', contentData.detail.th.menu)
      formRef.current?.setValue('menu_cn', contentData.detail.cn.menu)
      formRef.current?.setValue('introduce_en', contentData.detail.en.introduce)
      formRef.current?.setValue('introduce_th', contentData.detail.th.introduce)
      formRef.current?.setValue('introduce_cn', contentData.detail.cn.introduce)

      if (contentData.detail.th.menu && contentData.detail.th.menu !== '') {
        reqLang.push('th')
      }

      if (contentData.detail.cn.menu && contentData.detail.cn.menu !== '') {
        reqLang.push('cn')
      }
      setRequiredLang(reqLang)

      formRef.current?.setValue(
        'titleRelated_en',
        contentData.detail.en.titleRelated
      )
      formRef.current?.setValue(
        'titleRelated_th',
        contentData.detail.th.titleRelated
      )
      formRef.current?.setValue(
        'titleRelated_cn',
        contentData.detail.cn.titleRelated
      )

      const objCoverEN = createObject(contentData.detail.en)
      const objCoverTH = createObject(contentData.detail.th)
      const objCoverCN = createObject(contentData.detail.cn)

      const objHeadEN = createHeaderObject(contentData.detail.en)
      const objHeadTH = createHeaderObject(contentData.detail.th)
      const objHeadCN = createHeaderObject(contentData.detail.cn)

      setCoverState((prev) => ({
        ...prev,
        en: {
          file: objCoverEN.imageURL ? objCoverEN : undefined,
          invalidFile: null,
          uploading: false,
        },
        th: {
          file: objCoverTH.imageURL ? objCoverTH : undefined,
          invalidFile: null,
          uploading: false,
        },
        cn: {
          file: objCoverCN.imageURL ? objCoverCN : undefined,
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

      setFormValues(objCoverEN, 'en')
      setFormValues(objCoverTH, 'th')
      setFormValues(objCoverCN, 'cn')

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

  const mapData = (data: any) => {
    const { id } = query
    const result: any = {
      id: formType != 'create-sub' ? id : null,
      parentId: data.menu,
      status: data.status === '1',
      isSubMenu: isSubMenu,
      isShowRelatedLink: isShowRelate,
      LayoutType: alphabetToNumber(typeTemplate),
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

    if (isSubMenu) {
      ;(['en', 'th', 'cn'] as Array<keyof OverallFileState>).forEach(
        (lang: keyof OverallFileState) => {
          const { file: cover } = coverState[lang]
          const { file: head } = headerState[lang]
          if (cover) {
            result.detail[lang] = result.detail[lang] || {}
            result.detail[lang].coverImageURL = cover.imageURL
            result.detail[lang].coverOriginalFileName = cover.originalFileName
            result.detail[lang].coverFileName = cover.fileName
          }
          if (head) {
            result.detail[lang] = result.detail[lang] || {}
            result.detail[lang].headImageURL = head.imageURL
            result.detail[lang].headOriginalFileName = head.originalFileName
            result.detail[lang].headFileName = head.fileName
          }
        }
      )
    }

    return result
  }

  const onBack = () => {
    router.push(`/sustainability/all`)
  }

  const onSubmit = (data: any) => {
    const result = mapData(data)
    confirmDialog({
      message: 'Are you sure you want to save content?',
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
                await toast.promise(contentService.save(result), {
                  pending: 'Loading...',
                  success: 'Content save successfully!',
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
      message: 'Are you sure you want to delete content?',
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
                await toast.promise(contentService.delete(params), {
                  pending: 'Loading...',
                  success: 'Content delete successfully!',
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
                  onBack()
                  setLoading(false)
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

  const getDataByLang = (data: any, lang: keyof OverallFileState) => ({
    menu: data[`menu_${lang}`],
    intro: data[`introduce_${lang}`],
    title: data[`titleRelated_${lang}`],
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
    menu: string,
    intro: string,
    title: string,
    isShowRelate: boolean
  ) =>
    isEmptyString(menu) &&
    isEmptyString(intro) &&
    ((isShowRelate && isEmptyString(title)) || !isShowRelate)

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
    const { menu, intro, title, contents } = getDataByLang(data, lang)

    if (!isSubMenu) {
      return isBasicFieldsEmpty(menu, intro, title, isShowRelate)
    }

    return (
      isBasicFieldsEmpty(menu, intro, title, false) &&
      isSubMenuContentEmpty(contents, cover, head)
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
  }, [coverState, headerState, activeLang])

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
        contentStyle={isSubMenu ? { padding: 0 } : {}}
        contentClassName='dialog-preview'
      >
        <PreviewContent
          type={typeTemplate}
          formData={formData}
          lang={activeLang.code}
          isSubMenu={isSubMenu}
          headerState={headerState}
          mainMenu={mainMenu}
          data={formRef.current?.getValues()}
        />
      </Dialog>
      <div className='flex flex-wrap flex-column md:flex-row align-items-center justify-content-between mb-5'>
        <div className='tw-max-w-inherit'>
          <div className='tw-px-[15px] lg:tw-px-0'>
            <div className='tw-text-[#2B3674] tw-text-[34px] tw-font-bold'>
              Content Management
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
                  ? 'Create new content'
                  : 'Create new sub content'}
              </h4>
            )}
            {formType === 'edit' && (
              <h4 className='text-astronaut font-bold'>
                {!isSub ? 'Edit content' : 'Edit sub content'}
              </h4>
            )}

            <div className='flex flex-column w-full mt-2 p-5 lg:p-2'>
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
              <div className='flex w-full mt-5'>
                <div className='flex flex-column gap-1 tw-w-[35%]'>
                  <div className='flex w-full'>
                    <div className='flex gap-1 tw-align-middle'>
                      <CheckBoxField
                        name={`submenu`}
                        rules={{ required: undefined }}
                        onChange={(e: boolean) => {
                          setIsSubMenu(e)
                          formRef.current?.setValue(`relate`, false)
                          setIsShowRelate(false)
                          setTypeTemplate('A')
                          setIsFormChange(true)
                        }}
                        showRequiredLabel={false}
                        disabled={isHasSub}
                      />
                      <span
                        className='flex text-base font-bold text-primary-800 p-2 tw-mt-1 cursor-pointer'
                        style={{ userSelect: 'none' }}
                        onClick={() => {
                          formRef.current?.setValue(`submenu`, !isSubMenu)
                          setIsSubMenu((prev) => !prev)
                          formRef.current?.setValue(`relate`, false)
                          setIsShowRelate(false)
                          setTypeTemplate('A')
                          setIsFormChange(true)
                        }}
                      >
                        Sub menu
                      </span>
                    </div>
                  </div>

                  {!isSubMenu && (
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
                </div>

                <div className='flex flex-column gap-1 tw-w-[65%]'>
                  {isSubMenu && (
                    <DropdownField
                      name={`menu`}
                      options={lstMenu}
                      optionLabel='name'
                      optionValue='value'
                      placeholder='Choose menu'
                      rules={{ required: 'Please select menu' }}
                      disabled={false}
                      showRequiredLabel={false}
                      onChange={(e) => {
                        setIsFormChange(true)
                        if (e.target.value) {
                          const main = lstMenu.find(
                            (f) => f.value === e.target.value
                          )?.name
                          setMainMenu(main)
                        } else {
                          setMainMenu('')
                        }
                      }}
                    />
                  )}
                </div>
              </div>
              {!isSubMenu && (
                <div className='flex flex-column mt-5 gap-2'>
                  <span className='flex text-xl font-bold text-primary-800'>
                    Template
                  </span>
                  <div className='flex flex-column gap-1 w-full'>
                    <small className='text-xs text-primary-800'>
                      Choose Template (for sub menu, if main menu) *
                    </small>
                  </div>
                  <div className='flex align-items-center mt-2'>
                    <RadioButton
                      inputId={`templateA`}
                      name={`templateA`}
                      onChange={() => {
                        setIsFormChange(true)
                        setTypeTemplate('A')
                      }}
                      checked={typeTemplate === 'A'}
                    />
                    <label
                      htmlFor={`templateA`}
                      className='ml-2 mr-5 text-primary-800 tw-text-sm'
                    >
                      Type A
                    </label>

                    <RadioButton
                      inputId={`templateB`}
                      name={`templateB`}
                      onChange={() => {
                        setIsFormChange(true)
                        setTypeTemplate('B')
                      }}
                      checked={typeTemplate === 'B'}
                    />
                    <label
                      htmlFor={`templateB`}
                      className='ml-2 mr-5 text-primary-800 tw-text-sm'
                    >
                      Type B
                    </label>

                    <RadioButton
                      inputId={`templateC`}
                      name={`templateC`}
                      onChange={() => {
                        setIsFormChange(true)
                        setTypeTemplate('C')
                      }}
                      checked={typeTemplate === 'C'}
                    />
                    <label
                      htmlFor={`templateC`}
                      className='ml-2 mr-5 text-primary-800 tw-text-sm'
                    >
                      Type C
                    </label>
                  </div>
                </div>
              )}
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
                            <div className='flex flex-column'>
                              <span className='flex text-xl font-bold text-primary-800'>
                                Menu name{' '}
                                {requiredLang.includes(lang.code) && (
                                  <span>*</span>
                                )}
                              </span>
                              <div className='flex flex-column gap-1 w-full'>
                                <small className='text-primary-800'>
                                  Menu ({lang.label}){' '}
                                </small>
                                <TextField
                                  name={`menu_${lang.code}`}
                                  rules={
                                    requiredLang.includes(lang.code)
                                      ? { required: 'Menu required' }
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

                            {isSubMenu && (
                              <>
                                {renderFileUploadSection(
                                  lang.code,
                                  coverState,
                                  setCoverState,
                                  false
                                )}
                              </>
                            )}

                            <div className='flex flex-column mt-2 gap-2'>
                              <span className='flex text-xl font-bold text-primary-800'>
                                Introduce{' '}
                                {requiredLang.includes(lang.code) &&
                                  !isSubMenu && <span>*</span>}
                              </span>
                              <div className='flex flex-column gap-1 w-full'>
                                <small className='text-xs text-primary-800'>
                                  Message ({lang.label}){' '}
                                </small>
                                <TextAreaField
                                  name={`introduce_${lang.code}`}
                                  rules={{
                                    required:
                                      !isSubMenu &&
                                      requiredLang.includes(lang.code)
                                        ? 'Introduce required'
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
                                  maxLength={250}
                                />
                              </div>
                            </div>

                            {isShowRelate && (
                              <div className='flex flex-column mt-2 gap-2'>
                                <span className='flex text-xl font-bold text-primary-800'>
                                  Relate title{' '}
                                  {requiredLang.includes(lang.code) && (
                                    <span>*</span>
                                  )}
                                </span>
                                <div className='flex flex-column gap-1 w-full'>
                                  <small className='text-xs text-primary-800'>
                                    title ({lang.label}){' '}
                                  </small>
                                  <TextAreaField
                                    name={`titleRelated_${lang.code}`}
                                    rules={{
                                      required:
                                        requiredLang.includes(lang.code) &&
                                        isShowRelate
                                          ? 'Relate title required'
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
                            )}

                            {isSubMenu && (
                              <>
                                {renderFileUploadSection(
                                  lang.code,
                                  headerState,
                                  setHeaderState,
                                  true
                                )}

                                <div className='flex flex-column mt-2 gap-2'>
                                  <span className='flex text-xl font-bold text-primary-800'>
                                    Content
                                  </span>
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

        <div className='flex'>
          <div className='card w-full'>
            <h4 className='text-primary-800 font-bold'>
              Template for show cover image
            </h4>
            <div className='flex flex-column gap-1 w-full mt-5'>
              <small className='text-sm text-primary-800 font-bold'>
                Type A
              </small>
            </div>
            <div
              className='relative flex flex-column justify-content-center overflow-hidden mt-2'
              style={{ width: '360px' }}
            >
              <div className='flex tw-justify-between gap-1'>
                <div
                  className='tw-rounded flex align-items-center justify-content-center tw-text-sm'
                  style={{
                    width: '48%',
                    background: '#ebebeb',
                    height: '150px',
                    color: '#cfcfcf',
                  }}
                >
                  Sub menu 1
                </div>
                <div
                  className='tw-rounded flex align-items-center justify-content-center tw-text-sm'
                  style={{
                    width: '48%',
                    background: '#ebebeb',
                    height: '150px',
                    color: '#cfcfcf',
                  }}
                >
                  Sub menu 2
                </div>
              </div>
              <div className='flex tw-justify-between gap-1 mt-2'>
                <div
                  className='tw-rounded flex align-items-center justify-content-center tw-text-sm'
                  style={{
                    width: '48%',
                    background: '#ebebeb',
                    height: '150px',
                    color: '#cfcfcf',
                  }}
                >
                  Sub menu 3
                </div>
                <div
                  className='tw-rounded flex align-items-center justify-content-center tw-text-sm'
                  style={{
                    width: '48%',
                    background: '#ebebeb',
                    height: '150px',
                    color: '#cfcfcf',
                  }}
                >
                  Sub menu 4
                </div>
              </div>
            </div>
            <div className='flex flex-column gap-1 w-full mt-5'>
              <small className='text-sm text-primary-800 font-bold'>
                Type B
              </small>
            </div>
            <div
              className='relative flex flex-column justify-content-center overflow-hidden mt-2'
              style={{ width: '360px' }}
            >
              <div className='flex tw-justify-between gap-1'>
                <div
                  className='tw-rounded flex align-items-center justify-content-center tw-text-sm'
                  style={{
                    width: '31%',
                    background: '#ebebeb',
                    height: '170px',
                    color: '#cfcfcf',
                  }}
                >
                  Sub menu 1
                </div>
                <div
                  className='tw-rounded flex align-items-center justify-content-center tw-text-sm'
                  style={{
                    width: '31%',
                    background: '#ebebeb',
                    height: '170px',
                    color: '#cfcfcf',
                  }}
                >
                  Sub menu 2
                </div>
                <div
                  className='tw-rounded flex align-items-center justify-content-center tw-text-sm'
                  style={{
                    width: '31%',
                    background: '#ebebeb',
                    height: '170px',
                    color: '#cfcfcf',
                  }}
                >
                  Sub menu 3
                </div>
              </div>
            </div>
            <div className='flex flex-column gap-1 w-full mt-5'>
              <small className='text-sm text-primary-800 font-bold'>
                Type C
              </small>
            </div>
            <div
              className='relative flex flex-column justify-content-center overflow-hidden mt-2'
              style={{ width: '360px' }}
            >
              <div className='flex tw-justify-between gap-1'>
                <div
                  className='tw-rounded flex align-items-center justify-content-center tw-text-sm'
                  style={{
                    width: '100%',
                    background: '#ebebeb',
                    height: '80px',
                    color: '#cfcfcf',
                  }}
                >
                  Sub menu 1
                </div>
              </div>
              <div className='flex tw-justify-between gap-1 mt-2'>
                <div
                  className='tw-rounded flex align-items-center justify-content-center tw-text-sm'
                  style={{
                    width: '100%',
                    background: '#ebebeb',
                    height: '80px',
                    color: '#cfcfcf',
                  }}
                >
                  Sub menu 2
                </div>
              </div>
              <div className='flex tw-justify-between gap-1 mt-2'>
                <div
                  className='tw-rounded flex align-items-center justify-content-center tw-text-sm'
                  style={{
                    width: '100%',
                    background: '#ebebeb',
                    height: '80px',
                    color: '#cfcfcf',
                  }}
                >
                  Sub menu 3
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormController>
  )
}

export default Upsert
