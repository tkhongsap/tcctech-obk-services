import DropdownField from '@components/forms/components/dropdown-field'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import ImageButtonField from '@components/forms/components/image-button-field'
import TextAreaField from '@components/forms/components/text-area-field'
import TextField from '@components/forms/components/text-field'
import {
  IDigitalLibraryData,
  ILibraryUpload,
} from '@src/services/sustainability/digital-library/model'
import { libraryService } from '@src/services/sustainability/digital-library/service'
import { KeyValue } from '@src/types/key-value'
import { convertToBase64 } from '@src/utils/image'
import { last } from 'lodash'
import { Button } from 'primereact/button'
import { Message } from 'primereact/message'
import { ProgressBar } from 'primereact/progressbar'
import { TabMenu } from 'primereact/tabmenu'
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import Table from '@components/table'
import useTableTools from '@src/hooks/useTableTools'
import { useNavigation, useResource } from '@refinedev/core'
import { DeleteIcon } from '@chakra-ui/icons'
import ChangeOrder from '../content-management/change-order'
import { confirmDialog } from 'primereact/confirmdialog'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { Image } from 'primereact/image'

const status: KeyValue[] = [
  { name: 'Active', value: 'active' },
  { name: 'Inactive', value: 'inactive' },
]

interface MappedData {
  id: string | string[]
  status: boolean
  data: {
    [lang: string]: {
      [property: string]: any
    }
  }
}

type Lang = {
  label: string
  code: 'en' | 'th' | 'cn'
  disabled: boolean
}

const acceptTypes = ['image/png', 'image/jpg', 'image/jpeg']
const attachTypes = [
  '.doc',
  '.docx',
  '.xlsx',
  '.xls',
  '.ppt',
  '.pptx',
  '.pdf',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
]

interface InvalidFile {
  title: string
  message: string
}

interface FileState {
  file?: IDigitalLibraryData
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
  const { defaultValue, libData, formType } = props

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

  const { query } = useRouter()

  const resources = useResource()
  const { list } = useNavigation()

  const { sorting, setSorting } = useTableTools()
  const [requiredLang, setRequiredLang] = useState<string[]>(['en'])

  const formRef = useRef<FormControllerRef<any>>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [isFormChange, setIsFormChange] = useState<boolean>(false)

  const [activeLang, setActiveLang] = useState<Lang>(langItems[0])
  const [dataFile, setDataFile] = useState<any>({
    en: [],
    th: [],
    cn: [],
  })

  const [coverState, setCoverState] =
    useState<OverallFileState>(initialFileState)
  const [attachState, setAttachState] =
    useState<OverallFileState>(initialFileState)

  const handleFileUpload = async (
    file: File,
    mode: keyof OverallFileState,
    stateUpdater: React.Dispatch<React.SetStateAction<OverallFileState>>,
    attach: boolean = false
  ) => {
    setIsFormChange(true)
    stateUpdater((prev) => ({
      ...prev,
      [mode]: { ...prev[mode], uploading: true },
    }))

    try {
      //Validate file size 2MB
      const size = file.size / 1024 / 1024

      //File Image
      if (!attach && size > 2) {
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
      const uploadData: ILibraryUpload = {
        fileName: file.name,
        fileContentBase64: base64Data,
        contentType: file.type,
      }

      const res = attach
        ? await libraryService.uploadDoc(uploadData)
        : await libraryService.upload(uploadData)
      if (res.data) {
        const updatedData = {
          ...res.data,
          [`fileName${mode}${attach ? 'Attach' : ''}`]: res.data.fileName,
          [`image${mode}URL${attach ? 'Attach' : ''}`]: res.data.imageURL,
          [`originalFileName${mode}${attach ? 'Attach' : ''}`]:
            res.data.originalFileName,
        }

        formRef.current?.setValue(
          `fileName${mode}${attach ? 'Attach' : ''}`,
          updatedData[`fileName${mode}${attach ? 'Attach' : ''}`]
        )
        formRef.current?.setValue(
          `originalFileName${mode}${attach ? 'Attach' : ''}`,
          updatedData[`originalFileName${mode}${attach ? 'Attach' : ''}`]
        )
        formRef.current?.setValue(
          `image${mode}URL${attach ? 'Attach' : ''}`,
          updatedData[`image${mode}URL${attach ? 'Attach' : ''}`]
        )

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
      formRef.current?.setValue(`fileName${mode}${attach ? 'Attach' : ''}`, '')
      formRef.current?.setValue(
        `originalFileName${mode}${attach ? 'Attach' : ''}`,
        ''
      )
      formRef.current?.setValue(`image${mode}URL${attach ? 'Attach' : ''}`, '')
      formRef.current?.setValue(
        `imageFile_${mode}${attach ? 'Attach' : ''}`,
        ''
      )
    } finally {
      stateUpdater((prev) => ({
        ...prev,
        [mode]: { ...prev[mode], uploading: false },
      }))
    }
  }

  useEffect(() => {
    if (libData) {
      setLoading(true)
      const arrRequired = ['en']
      formRef.current?.setValue(
        'status',
        libData.status ? 'active' : 'inactive'
      )
      formRef.current?.setValue('topic_en', libData.data.en.topic)
      formRef.current?.setValue('topic_th', libData.data.th.topic)
      formRef.current?.setValue('topic_cn', libData.data.cn.topic)
      formRef.current?.setValue('introduce_en', libData.data.en.introduce)
      formRef.current?.setValue('introduce_th', libData.data.th.introduce)
      formRef.current?.setValue('introduce_cn', libData.data.cn.introduce)
      if (libData.data.th.topic) {
        arrRequired.push('th')
      }
      if (libData.data.cn.topic) {
        arrRequired.push('cn')
      }
      setRequiredLang(arrRequired)
      libData.data.en.listFile.forEach((obj: any) => {
        obj.configOrder = {
          ...obj.configOrder,
          id: obj.id,
        }
      })
      libData.data.th.listFile.forEach((obj: any) => {
        obj.configOrder = {
          ...obj.configOrder,
          id: obj.id,
        }
      })
      libData.data.cn.listFile.forEach((obj: any) => {
        obj.configOrder = {
          ...obj.configOrder,
          id: obj.id,
        }
      })
      setDataFile({
        en: libData.data.en.listFile,
        th: libData.data.th.listFile,
        cn: libData.data.cn.listFile,
      })
      setLoading(false)
    }
  }, [libData])

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

  const handleRemoveFile = (
    mode: keyof OverallFileState,
    stateUpdater: React.Dispatch<React.SetStateAction<OverallFileState>>,
    attach: boolean = false
  ) => {
    stateUpdater((prev) => ({
      ...prev,
      [mode]: { file: undefined, invalidFile: null, uploading: false },
    }))

    formRef.current?.setValue(`fileName${mode}${attach ? 'Attach' : ''}`, '')
    formRef.current?.setValue(
      `originalFileName${mode}${attach ? 'Attach' : ''}`,
      ''
    )
    formRef.current?.setValue(`image${mode}URL${attach ? 'Attach' : ''}`, '')
    formRef.current?.setValue(`imageFile_${mode}${attach ? 'Attach' : ''}`, '')
  }

  const renderFileUploadSection = (
    mode: keyof OverallFileState,
    state: OverallFileState,
    stateUpdater: React.Dispatch<React.SetStateAction<OverallFileState>>,
    attach: boolean = false
  ) => {
    const { file, invalidFile, uploading } = state[mode]

    let fileUploadContent
    if (uploading) {
      fileUploadContent = (
        <ProgressBar mode='indeterminate' style={{ height: '6px' }} />
      )
    } else if (file && attach) {
      fileUploadContent = (
        <Message
          content={
            <div className='w-full flex justify-content-between py-3'>
              <span>
                {file[`originalFileName${mode}${attach ? 'Attach' : ''}`]}
              </span>
              <button
                className='pi pi-times cursor-pointer'
                onClick={() => handleRemoveFile(mode, stateUpdater, attach)}
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
    } else if (file && !attach) {
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
                  handleRemoveFile(mode, stateUpdater, attach)
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
              handleFileUpload(file, mode, stateUpdater, attach)
            }
          />
        </div>
      )
    } else {
      fileUploadContent = (
        <ImageButtonField
          rules={{ required: undefined }}
          acceptTypes={attach ? attachTypes.join(', ') : acceptTypes.join(', ')}
          name={`imageFile_${mode}${attach ? 'Attach' : ''}`}
          outputType='file'
          mode='single'
          messageWrongFile={
            attach
              ? 'please upload file .doc .docx .xlsx .xls .ppt .pptx .pdf'
              : 'please upload image .png .jpeg .jpg'
          }
          onError={(error) =>
            stateUpdater((prev) => ({
              ...prev,
              [mode]: { ...prev[mode], invalidFile: error },
            }))
          }
          onChange={(file) =>
            handleFileUpload(file, mode, stateUpdater, attach)
          }
          title={attach ? 'Upload FIle' : 'Upload Image'}
        />
      )
    }

    return (
      <div className='flex flex-column mt-5 gap-2'>
        <span className='flex text-xl font-bold text-primary-800'>
          {attach ? 'Attach file*' : 'Cover Image'}
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
            {attach
              ? 'Allowed file types: .doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf'
              : 'Head image (Recommend image ratio 1.414:1) (Min 141x100 px)'}
          </small>
        </div>
        {fileUploadContent}
      </div>
    )
  }

  const onBack = () => list(resources?.identifier ?? '')

  const mapData = (data: Record<string, any>): MappedData => {
    const { id } = query
    const result: MappedData = {
      id,
      status: data.status === 'active',
      data: {},
    }

    for (const [key, value] of Object.entries(data)) {
      if (key !== 'status') {
        const [property, lang] = key.split('_')
        if (lang && lang.length === 2) {
          result.data[lang] = result.data[lang] || {}
          result.data[lang][property] = value
        }
      }
    }

    ;['en', 'th', 'cn'].forEach((lang) => {
      if (dataFile[lang]) {
        dataFile[lang].forEach((obj: any) => {
          if (typeof obj.id === 'number') {
            obj.id = null
          }
        })
        result.data[lang] = result.data[lang] || {}
        result.data[lang].listFile = dataFile[lang]
      }
    })

    return result
  }

  const notifyWarning = () =>
    toast.warning('Please add file at least one file.')

  const findMissingLanguages = () => {
    return [
      {
        code: 'en',
        label: 'English',
        disabled: false,
      },
      {
        code: 'th',
        label: 'Thailand',
        disabled: false,
      },
      {
        code: 'cn',
        label: 'Chinese',
        disabled: false,
      },
    ].filter(
      (lang) =>
        requiredLang.includes(lang.code) && dataFile[lang.code]?.length === 0
    )
  }

  const onSubmit = (data: any) => {
    const missingLanguages: any = findMissingLanguages()

    if (missingLanguages.length > 0) {
      setActiveLang(missingLanguages[0])
      notifyWarning()
      return false
    }
    const result = mapData(data)
    confirmDialog({
      message: 'Are you sure you want to save library?',
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
                await toast.promise(libraryService.save(result), {
                  pending: 'Loading...',
                  success: 'Library save successfully!',
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
      message: 'Are you sure you want to delete library?',
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
                await toast.promise(libraryService.delete(params), {
                  pending: 'Loading...',
                  success: 'Library delete successfully!',
                  error: {
                    render(err: any) {
                      setLoading(false)
                      const message =
                        err.data?.response?.data?.messages?.[0] ??
                        'Something went wrong.'
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

  const handleChangeOrder = (o: any, n: any, i: any, l: any) => {
    setDataFile((prevData: any) => {
      return {
        ...prevData,
        [activeLang.code]: [],
      }
    })
    setTimeout(() => {
      let objSelf = l.find((f: any) => f.id === i)
      if (n > o) {
        let arrChange = l.filter(
          (f: any) => f.configOrder.current > o && f.configOrder.current <= n
        )
        arrChange.forEach((f: any) => {
          f.configOrder.current--
        })
      } else {
        let arrChange = l.filter(
          (f: any) => f.configOrder.current < o && f.configOrder.current >= n
        )
        arrChange.forEach((f: any) => {
          f.configOrder.current++
        })
      }
      ;(objSelf.order = n),
        (objSelf.configOrder = {
          ...objSelf.configOrder,
          current: n,
        })

      setDataFile((prevData: any) => {
        return {
          ...prevData,
          [activeLang.code]: l,
        }
      })
    }, 100)
  }

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: 'order',
        accessorKey: 'configOrder',
        header: 'Order',
        sortable: false,
        className: 'tw-w-[130px] tw-truncate',
        cell: ({ getValue }) => {
          const value: any = getValue()
          let arrOpt = []
          for (let i = 1; i <= (value?.max ?? 1); i++) {
            arrOpt.push({ name: `${i}`, value: i })
          }
          return (
            <ChangeOrder
              order={value?.current ?? 1}
              onChangeOrder={handleChangeOrder}
              optOrder={arrOpt}
              id={value?.id ?? ''}
              lstData={dataFile[activeLang.code]}
            />
          )
        },
      },
      {
        id: 'cover_name',
        accessorKey: 'originalFileName',
        header: 'Cover Image',
        sortable: false,
        className: 'tw-max-w-[120px] tw-truncate',
      },
      {
        id: 'attach_name',
        accessorKey: 'originalAttachFileName',
        header: 'Attach file',
        sortable: false,
        className: 'tw-max-w-[120px] tw-truncate',
      },
      {
        id: 'delete',
        accessorKey: 'id',
        header: '',
        sortable: false,
        className: 'tw-max-w-[120px] tw-w-[100px] tw-truncate',
        cell: ({ getValue }) => (
          <DeleteIcon
            className='cursor-pointer'
            style={{ color: 'red', fontSize: '1rem' }}
            onClick={() =>
              onDelLibraryFile(activeLang.code, getValue() as number)
            }
          />
        ),
      },
    ],
    [dataFile]
  )

  const onDelLibraryFile = (lang: keyof OverallFileState, id: number) => {
    setDataFile((prevData: any) => {
      const updatedEnData = prevData[lang]
        .filter((item: any) => item.id !== id)
        .map((item: any, index: any) => ({
          ...item,
          order: index + 1,
          configOrder: {
            current: index + 1,
            max: prevData[lang].length,
            id: item.id,
          },
        }))

      if (updatedEnData.length === 0) {
        onCheckRequired(lang)
      }

      return {
        ...prevData,
        [lang]: updatedEnData,
      }
    })
  }

  function getFileType(fileName: any) {
    const fileExtension = fileName.split('.').pop().toLowerCase()
    let fileType = ''

    switch (fileExtension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        fileType = 'image'
        break
      case 'mp4':
      case 'mkv':
      case 'avi':
        fileType = 'video'
        break
      case 'mp3':
      case 'wav':
      case 'flac':
        fileType = 'audio'
        break
      case 'pdf':
        fileType = 'document'
        break
      case 'txt':
      case 'md':
        fileType = 'text'
        break
      case 'zip':
      case 'rar':
        fileType = 'archive'
        break
      default:
        fileType = 'unknown'
    }

    return fileType
  }

  function getFileExtension(filename: any) {
    return filename.split('.').pop().toLowerCase()
  }

  function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      }
    )
  }

  const onAddLibraryFile = (e: any, mode: keyof OverallFileState) => {
    e.preventDefault()
    const { file: cover } = coverState[mode]
    const { file: attach } = attachState[mode]
    let IsPass = true
    if (attach == null) {
      setAttachState((prev) => ({
        ...prev,
        [mode]: {
          ...prev[mode],
          invalidFile: {
            title: 'Missing field',
            message: 'please upload file',
          },
        },
      }))
      IsPass = false
    }
    if (!IsPass) {
      return
    }

    const objData = formRef.current?.getValues()
    let arrData: any = [...dataFile[mode]]
    let nMaxData =
      arrData.length > 0
        ? Math.max(...arrData.map((o: any) => o.configOrder.max)) + 1
        : 1
    let newData = {
      id: generateGUID(),
      fileName: cover?.fileName ?? '',
      originalFileName: cover?.originalFileName ?? '-',
      imageURL: cover?.imageURL ?? '',
      attachFileName: attach?.fileName,
      originalAttachFileName: objData[`filename_${mode}`]
        ? objData[`filename_${mode}`] +
          '.' +
          getFileExtension(attach?.originalFileName ?? '')
        : attach?.originalFileName,
      attachFileURL: attach?.originalFileName,
      attachFileType: getFileType(attach?.originalFileName),
      attachFileSize: '5MB',
      order: nMaxData,
      isDelete: false,
    }
    setDataFile((prevData: any) => {
      const updatedEnData = [...prevData[mode], newData].map((item, index) => ({
        ...item,
        order: index + 1,
        configOrder: {
          current: index + 1,
          max: prevData[mode].length + 1,
          id: item.id,
        },
      }))

      return {
        ...prevData,
        [mode]: updatedEnData,
      }
    })
    formRef.current?.setValue(`filename_${mode}`, '')
    setRequiredLang((prevData) => [...prevData, mode])
    handleRemoveFile(mode, setCoverState, false)
    handleRemoveFile(mode, setAttachState, true)
  }

  const getDataByLang = (data: any, lang: keyof OverallFileState) => ({
    menu: data[`menu_${lang}`],
    intro: data[`introduce_${lang}`],
  })

  function isEmptyString(str: any) {
    return !str || str.trim() === ''
  }

  const isBasicFieldsEmpty = (menu: string, intro: string) =>
    isEmptyString(menu) && isEmptyString(intro)

  const isLangRequired = (lang: keyof OverallFileState, data: any) => {
    const { menu, intro } = getDataByLang(data, lang)

    return isBasicFieldsEmpty(menu, intro) && dataFile[lang].length === 0
  }

  const onCheckRequired = (lang: keyof OverallFileState) => {
    if (lang === 'en') return

    const data = formRef.current?.getValues()

    if (isLangRequired(lang, data)) {
      setRequiredLang((prevData) => prevData.filter((item) => item !== lang))
    }
  }

  useEffect(() => {
    onCheckRequired(activeLang.code)
  }, [dataFile, activeLang])

  const onInvalidSubmit = (err: any) => {
    const keyWithEn = Object.keys(err).find(
      (key) => key.includes('_en') || key.includes('en_')
    )
    const keyWithTh = Object.keys(err).find(
      (key) => key.includes('_th') || key.includes('th_')
    )
    const keyWithCn = Object.keys(err).find(
      (key) => key.includes('_cn') || key.includes('cn_')
    )

    if (keyWithEn) {
      setActiveLang({
        code: 'en',
        label: 'English',
        disabled: false,
      })
    } else if (keyWithTh) {
      setActiveLang({
        code: 'th',
        label: 'Thai',
        disabled: false,
      })
    } else if (keyWithCn) {
      setActiveLang({
        code: 'cn',
        label: 'Chinese',
        disabled: false,
      })
    }
  }

  return (
    <FormController
      defualtValue={defaultValue}
      ref={formRef}
      onSubmit={onSubmit}
      onInvalid={onInvalidSubmit}
    >
      <div className='flex flex-wrap flex-column md:flex-row align-items-center justify-content-between mb-5'>
        <div className='tw-max-w-inherit'>
          <div className='tw-px-[15px] lg:tw-px-0'>
            <div className='tw-text-[#2B3674] tw-text-[34px] tw-font-bold'>
              Digital Library
            </div>
          </div>
        </div>
        <div className='flex align-items-center justify-contents-end'>
          <div className='flex gap-3 justify-content-center md:justify-content-start'>
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
                ? 'Create new digital library'
                : 'Edit digital library'}
            </h4>
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
                                Topic{' '}
                                {requiredLang.includes(lang.code) && (
                                  <span>*</span>
                                )}
                              </span>
                              <div className='flex flex-column gap-1 w-full'>
                                <small className='text-primary-800'>
                                  Topic ({lang.label}){' '}
                                </small>
                                <TextField
                                  name={`topic_${lang.code}`}
                                  rules={
                                    requiredLang.includes(lang.code)
                                      ? { required: 'Topic required' }
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

                            <div className='flex flex-column mt-2 gap-2'>
                              <span className='flex text-xl font-bold text-primary-800'>
                                Introduce
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

                            {renderFileUploadSection(
                              lang.code,
                              coverState,
                              setCoverState,
                              false
                            )}

                            {renderFileUploadSection(
                              lang.code,
                              attachState,
                              setAttachState,
                              true
                            )}

                            <div className='flex flex-column'>
                              <span className='flex text-xl font-bold text-primary-800'>
                                Attach File Name
                              </span>
                              <div className='flex flex-column gap-1 w-full'>
                                <TextField
                                  name={`filename_${lang.code}`}
                                  rules={{ required: undefined }}
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

                            <div className='flex flex-column mt-2 gap-2'>
                              <Button
                                disabled={false}
                                className='px-5 bg-primary-blue'
                                label='Add'
                                onClick={(e) => onAddLibraryFile(e, lang.code)}
                              />
                            </div>

                            {dataFile[lang.code].length > 0 && (
                              <Table
                                columns={columns}
                                data={dataFile[lang.code].sort(
                                  (a: any, b: any) =>
                                    a.configOrder.current -
                                    b.configOrder.current
                                )}
                                sortingProps={{ sorting, setSorting }}
                                title=''
                              />
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
