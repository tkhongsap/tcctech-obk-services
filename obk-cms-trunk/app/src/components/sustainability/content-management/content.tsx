import { VStack } from '@chakra-ui/react'
import DndWrapper from '@components/content-builder/dnd-wrapper'
import { isEmpty, last, map } from 'lodash'
import { FormProvider, useFieldArray } from 'react-hook-form'
import SvgClose from '@assets/svg/close.svg'
import { useCallback } from 'react'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import RadioGroupField from '@components/forms/components/radio-group-field'
import { Button } from 'primereact/button'
import { convertToBase64 } from '@src/utils/image'
import { IContentUpload } from '@src/services/sustainability/content-mangement/model'
import { contentService } from '@src/services/sustainability/content-mangement/service'
import { Message } from 'primereact/message'
import ImageButtonField from '@components/forms/components/image-button-field'
import { ProgressBar } from 'primereact/progressbar'
import TextField from '@components/forms/components/text-field'
import SvgHamburger from '@assets/svg/hamburger.svg'
import { Image } from 'primereact/image'
import EditorField from '@components/forms/components/editor-field'

const acceptTypes = ['image/png', 'image/jpg', 'image/jpeg']

const ContentBuilder = (props: any) => {
  const {
    dataKey,
    locale,
    formData,
    onCheckRequired,
    setRequiredLang,
    setIsFormChange,
  } = props

  const { control, register, setValue, watch } = formData

  const { fields, append, swap, remove } = useFieldArray({
    name: dataKey,
    control,
  })

  if (isEmpty(fields)) append({})

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      swap(hoverIndex, dragIndex)
    },
    [swap]
  )

  const handleFileUpload = async (file: File, key: number) => {
    setValue(`${dataKey}.${key}.uploading`, true)
    try {
      setIsFormChange(true)
      //Validate file size 2MB
      const size = file.size / 1024 / 1024
      if (size > 2) {
        setValue(`${dataKey}.${key}.invalidFile`, {
          title: 'Warning',
          message: ' Please upload a file with size less than 2MB',
        })

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

      const res: any = await contentService.upload(uploadData)
      if (res.data) {
        const updatedData = {
          ...res.data,
          [`${dataKey}.${key}.fileName`]: res.data.fileName,
          [`${dataKey}.${key}.imageURL`]: res.data.imageURL,
          [`${dataKey}.${key}.originalFileName`]: res.data.originalFileName,
        }

        setValue(
          `${dataKey}.${key}.fileName`,
          updatedData[`${dataKey}.${key}.fileName`]
        )
        setValue(
          `${dataKey}.${key}.originalFileName`,
          updatedData[`${dataKey}.${key}.originalFileName`]
        )
        setValue(
          `${dataKey}.${key}.imageURL`,
          updatedData[`${dataKey}.${key}.imageURL`]
        )
        setValue(`${dataKey}.${key}.invalidFile`, null)

        setValue(`${dataKey}.${key}.uploading`, false)

        setRequiredLang((prevData: any) => [...prevData, locale])
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? ' ' + error.message : 'Something went wrong'

      setValue(`${dataKey}.${key}.invalidFile`, {
        title: 'Warning',
        message: errorMessage,
      })
      setValue(`${dataKey}.${key}.fileName`, null)
      setValue(`${dataKey}.${key}.originalFileName`, null)
      setValue(`${dataKey}.${key}.imageURL`, null)

      setValue(`${dataKey}.${key}.uploading`, false)
    } finally {
      setValue(`${dataKey}.${key}.uploading`, false)
    }
  }

  const handleRemoveFile = (key: number) => {
    setValue(`${dataKey}.${key}.fileName`, null)
    setValue(`${dataKey}.${key}.originalFileName`, null)
    setValue(`${dataKey}.${key}.imageURL`, null)

    setValue(`${dataKey}.${key}.uploading`, false)

    onCheckRequired(locale)
  }

  const renderFileUploadSection = (
    key: number,
    fileName: string,
    invalidFile: any,
    uploading: boolean,
    urlValue: string
  ) => {
    let fileUploadContent
    if (uploading) {
      fileUploadContent = (
        <ProgressBar mode='indeterminate' style={{ height: '6px' }} />
      )
    } else if (fileName) {
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
                src={decodeURIComponent(urlValue.toString())}
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
                  handleRemoveFile(key)
                }}
              >
                <i className='pi pi-times m-auto text-primary-blue'></i>
              </div>
            </div>
          </div>
          <ImageButtonField
            rules={{ required: undefined }}
            acceptTypes={acceptTypes.join(', ')}
            name={`imageFile_${locale + key}`}
            outputType='file'
            mode='single'
            onError={(error) => {
              setValue(`${dataKey}.${key}.invalidFile`, error)
            }}
            onChange={(file) => handleFileUpload(file, key)}
          />
        </div>
      )
    } else {
      fileUploadContent = (
        <ImageButtonField
          rules={{ required: ' ' }}
          acceptTypes={acceptTypes.join(', ')}
          name={`imageFile_${locale + key}`}
          outputType='file'
          mode='single'
          onError={(error) => {
            setValue(`${dataKey}.${key}.invalidFile`, error)
          }}
          onChange={(file) => handleFileUpload(file, key)}
        />
      )
    }

    return (
      <div className='flex flex-column mt-5 gap-2'>
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
        {fileUploadContent}
      </div>
    )
  }

  const HtmlStringToString = (value: string) => {
    const myHTML = new DOMParser().parseFromString(value, 'text/html')
    return myHTML.body.textContent ?? ''
  }

  const blockList = map(fields, (item: any, key: number) => {
    if (fields.length > 0) {
      fields.forEach((f: any) => {
        if (f.type == null || f.type == undefined) {
          f.type = 1
        }
      })
    }
    const removeBlock = () => {
      setValue(`${dataKey}.${key}.type`, 1)
      remove(key)
    }

    register(`${dataKey}.${key}.answer`)

    const onEditAnswer = (editorState: any) => {
      setIsFormChange(true)
      setValue(`${dataKey}.${key}.answer`, editorState)
      const valueEditor = HtmlStringToString(editorState)
      if (valueEditor && valueEditor !== '' && valueEditor !== 'null') {
        setRequiredLang((prevData: any) => [...prevData, locale])
      } else {
        onCheckRequired(locale)
      }
    }

    const answerValue = watch(`${dataKey}.${key}.answer`)
    const typeValue = watch(`${dataKey}.${key}.type`)
    const originalFileNameValue = watch(`${dataKey}.${key}.originalFileName`)
    const urlValue = watch(`${dataKey}.${key}.imageURL`)
    const invalidFileValue = watch(`${dataKey}.${key}.invalidFile`)
    const uploadingValue = watch(`${dataKey}.${key}.uploading`)

    const validateYouTubeUrl = (value: string) => {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[^&]+/
      const result = youtubeRegex.test(value)
      return result
    }

    return (
      <DndWrapper
        key={item.id}
        index={key}
        id={key}
        moveCard={moveCard}
        padding={'24px'}
        border='none'
        bg={'#f6f6f6'}
      >
        <div className='tw-flex tw-space-x-6'>
          {fields.length > 1 && <SvgHamburger className='mt-2' />}
          <div className='tw-w-full relative'>
            <RadioGroupField
              name={`${dataKey}.${key}.type`}
              rules={{ required: undefined }}
              showRequiredLabel={false}
              items={[
                {
                  value: 1,
                  name: 'Text',
                },
                {
                  value: 2,
                  name: 'Image',
                },
                {
                  value: 3,
                  name: 'Youtube',
                },
              ]}
              defaultValue={item.type ?? 1}
              onCustomChange={(e) => {
                setValue(`${dataKey}.${key}.type`, e.value)
              }}
            />

            <VStack w='100%' spacing='22px' pt={'24px'}>
              {(typeValue === undefined || typeValue === 1) && (
                <div className='tw-w-full'>
                  <EditorField
                    name={`${dataKey}.${key}.answer`}
                    style={{ height: '320px' }}
                    rules={{ required: undefined }}
                    onTextChange={(e) => {
                      onEditAnswer(e.htmlValue)
                    }}
                    defaultValue={answerValue}
                    showRequiredLabel={false}
                    isCustom
                  />
                </div>
              )}
              {typeValue === 2 && (
                <div className='tw-w-full'>
                  <div className='tw-text-[#2B3674] tw-text-sm mb-3 tw-font-medium'>
                    Content image (Recommend size Min width 400 px)
                  </div>
                  {renderFileUploadSection(
                    key,
                    originalFileNameValue,
                    invalidFileValue,
                    uploadingValue,
                    urlValue
                  )}
                </div>
              )}
              {typeValue === 3 && (
                <div className='tw-w-full'>
                  <div className='tw-text-[#2B3674] tw-text-sm mb-3 tw-font-medium'>
                    URL Link ( Example URL :{' '}
                    {'https://www.youtube.com/watch?v=ysxdSLmPl-Y'} )
                  </div>
                  <TextField
                    draggable
                    onDragStart={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    name={`${dataKey}.${key}.youtube`}
                    rules={{
                      required: 'Youtube required',
                      pattern: {
                        value:
                          /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[^&]+/,
                        message: 'Please enter a valid URL',
                      },
                    }}
                    onChange={(e) => {
                      setIsFormChange(true)
                      const text = e.target.value
                      if (text && text !== '') {
                        setValue(`${dataKey}.${key}.youtube`, text)
                        setRequiredLang((prevData: any) => [
                          ...prevData,
                          locale,
                        ])
                      } else {
                        setValue(`${dataKey}.${key}.youtube`, null)
                        onCheckRequired(locale)
                      }
                    }}
                    defaultValue={item.youtube}
                    showRequiredLabel={false}
                    placeholder='Text here'
                    validate={validateYouTubeUrl}
                  />
                </div>
              )}
            </VStack>
          </div>
          {fields.length > 1 && (
            <SvgClose
              className='tw-mt-2 tw-w-5 tw-h-5 svg-fill-red tw-cursor-pointer'
              onClick={removeBlock}
            />
          )}
        </div>
      </DndWrapper>
    )
  })

  const onCreateBlock = (e: any) => {
    e.preventDefault()
    append({})
  }

  return (
    <FormProvider {...formData}>
      <VStack w='100%' spacing='32px' alignItems='flex-start'>
        <DndProvider backend={HTML5Backend}>
          <VStack spacing='32px' w='100%'>
            {blockList}
          </VStack>
        </DndProvider>
        <div className='tw-w-full tw-flex justify-content-center'>
          <Button
            disabled={false}
            type='button'
            className='px-5 text-primary-blue w-full'
            label='+ Add new content'
            text
            onClick={(e) => onCreateBlock(e)}
          />
        </div>
      </VStack>
    </FormProvider>
  )
}

export default ContentBuilder
