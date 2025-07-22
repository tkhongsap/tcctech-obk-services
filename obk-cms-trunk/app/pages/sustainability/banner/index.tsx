import React, { Fragment, useEffect, useRef, useState } from 'react'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import ImageButtonField from '@components/forms/components/image-button-field'
import TextField from '@components/forms/components/text-field'
import {
  ISustainabilityContentUpload,
  ISustainabilityData,
  SustainabilityData,
} from '@src/services/sustainability/model'
import { Button } from 'primereact/button'
import { Message } from 'primereact/message'
import { Image } from 'primereact/image'
import { convertToBase64 } from '@src/utils/image'
import { last } from 'lodash'
import { sustainabilityContentService } from '@src/services/sustainability/service'
import { confirmDialog } from 'primereact/confirmdialog'
import { toast } from 'react-toastify'
import { defaultToastMessage } from '@src/utils/default-toast'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import { ProgressBar } from 'primereact/progressbar'
import { TabMenu } from 'primereact/tabmenu'

const acceptTypes = ['image/png', 'image/jpg', 'image/jpeg']

interface InvalidFile {
  title: string
  message: string
}

interface FileState {
  file?: ISustainabilityData
  invalidFile: InvalidFile | null
  uploading: boolean
  changed: boolean
  type: number
}

interface OverallFileState {
  Sustainability: FileState
  Library: FileState
  Certifications: FileState
}

interface UpdateState {
  UpdateBy: string
  UpdateDate: string
}

interface OverallUpdateState {
  Sustainability: UpdateState
  Library: UpdateState
  Certifications: UpdateState
}

type Lang = {
  label: string
  code: 'en' | 'th' | 'cn'
}

const BannerManagement = () => {
  const langItems: Lang[] = [
    {
      code: 'en',
      label: 'English',
    },
    {
      code: 'th',
      label: 'Thai',
    },
    {
      code: 'cn',
      label: 'Chinese',
    },
  ]

  const formRef = useRef<FormControllerRef<any>>(null)
  const defaultValue = new SustainabilityData(undefined)

  const [fileState, setFileState] = useState<OverallFileState>({
    Sustainability: {
      file: undefined,
      invalidFile: null,
      uploading: false,
      changed: false,
      type: 1,
    },
    Library: {
      file: undefined,
      invalidFile: null,
      uploading: false,
      changed: false,
      type: 2,
    },
    Certifications: {
      file: undefined,
      invalidFile: null,
      uploading: false,
      changed: false,
      type: 3,
    },
  })

  const [updateState, setUpdateState] = useState<OverallUpdateState>({
    Sustainability: {
      UpdateBy: '',
      UpdateDate: '',
    },
    Library: {
      UpdateBy: '',
      UpdateDate: '',
    },
    Certifications: {
      UpdateBy: '',
      UpdateDate: '',
    },
  })
  const [activeLang, setActiveLang] = useState({
    Sustainability: langItems[0],
    Library: langItems[0],
    Certifications: langItems[0],
  })
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setFormValues = (banner: any, prefix: string) => {
    formRef.current?.setValue(`fileName${prefix}`, banner.fileName)
    formRef.current?.setValue(
      `originalFileName${prefix}`,
      banner.originalFileName
    )
    formRef.current?.setValue(`image${prefix}URL`, banner.imageURL)

    formRef.current?.setValue(`name1_${prefix}en`, banner.labelLevel1 ?? '')
    formRef.current?.setValue(`name2_${prefix}en`, banner.labelLevel2 ?? '')
    formRef.current?.setValue(`name1_${prefix}th`, banner.labelLevel1TH ?? '')
    formRef.current?.setValue(`name2_${prefix}th`, banner.labelLevel2TH ?? '')
    formRef.current?.setValue(`name1_${prefix}cn`, banner.labelLevel1CN ?? '')
    formRef.current?.setValue(`name2_${prefix}cn`, banner.labelLevel2CN ?? '')
    formRef.current?.setValue(`introduce_${prefix}en`, banner.labelIntroduce)
    formRef.current?.setValue(`introduce_${prefix}th`, banner.labelIntroduceTH)
    formRef.current?.setValue(`introduce_${prefix}cn`, banner.labelIntroduceCN)
  }

  const createObject = (banner: any): any => ({
    id: banner.id,
    imageURL: banner.imageURL,
    fileName: banner.fileName,
    originalFileName: banner.originalFileName,
    message: '',
  })

  const fetchData = async () => {
    setLoading(true)

    try {
      const res = await sustainabilityContentService.get()
      const banners: any[] = res.data.banners || []

      const sustain = banners.find((f) => f.type === 1)
      const library = banners.find((f) => f.type === 2)
      const certifications = banners.find((f) => f.type === 3)

      if (sustain && library && certifications) {
        const objSustain = createObject(sustain)
        const objLibrary = createObject(library)
        const objCertifications = createObject(certifications)

        setUpdateState((prev) => ({
          ...prev,
          Sustainability: {
            UpdateBy: sustain.updatedByName,
            UpdateDate: sustain.updatedDate,
          },
          Library: {
            UpdateBy: library.updatedByName,
            UpdateDate: library.updatedDate,
          },
          Certifications: {
            UpdateBy: certifications.updatedByName,
            UpdateDate: certifications.updatedDate,
          },
        }))

        setFileState((prev) => ({
          ...prev,
          Sustainability: {
            file: objSustain,
            invalidFile: null,
            uploading: false,
            changed: false,
            type: 1,
          },
          Library: {
            file: objLibrary,
            invalidFile: null,
            uploading: false,
            changed: false,
            type: 2,
          },
          Certifications: {
            file: objCertifications,
            invalidFile: null,
            uploading: false,
            changed: false,
            type: 3,
          },
        }))

        setFormValues(sustain, 'Sustainability')
        setFormValues(library, 'Library')
        setFormValues(certifications, 'Certifications')
      }
    } catch (err) {
      console.error('Fetch history category detail error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = async (file: File, mode: keyof typeof fileState) => {
    setFileState((prev) => ({
      ...prev,
      [mode]: { ...prev[mode], uploading: true, changed: true },
    }))

    try {
      //Validate file size 2MB
      const size = file.size / 1024 / 1024
      if (size > 2) {
        setFileState((prev) => ({
          ...prev,
          [mode]: {
            ...prev[mode],
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
      const uploadData: ISustainabilityContentUpload = {
        fileName: file.name,
        fileContentBase64: base64Data,
        contentType: file.type,
      }

      const res = await sustainabilityContentService.upload(uploadData)

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

        setFileState((prev) => ({
          ...prev,
          [mode]: {
            file: updatedData,
            invalidFile: null,
            uploading: false,
            changed: true,
          },
        }))
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? ' ' + error.message : 'Something went wrong'

      setFileState((prev) => ({
        ...prev,
        [mode]: {
          ...prev[mode],
          invalidFile: {
            title: 'Warning',
            message: errorMessage,
          },
          uploading: false,
        },
      }))
    } finally {
      setFileState((prev) => ({
        ...prev,
        [mode]: { ...prev[mode], uploading: false, changed: true },
      }))
    }
  }

  const handleRemoveFile = (mode: keyof typeof fileState) => {
    setFileState((prev) => ({
      ...prev,
      [mode]: {
        file: undefined,
        invalidFile: null,
        uploading: false,
        changed: true,
      },
    }))

    formRef.current?.setValue(`fileName${mode}`, '')
    formRef.current?.setValue(`originalFileName${mode}`, '')
    formRef.current?.setValue(`image${mode}URL`, '')
    formRef.current?.setValue(`imageFile_${mode}`, '')
  }

  const renderFileUploadSection = (
    mode: keyof typeof fileState,
    title: string
  ) => {
    const { file, invalidFile, uploading } = fileState[mode]
    const { UpdateBy, UpdateDate } = updateState[mode]
    const currentLang = activeLang[mode]

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
            onChange={(file) => handleFileChange(file, mode)}
          />
        </div>
      )
    } else {
      fileUploadContent = (
        <ImageButtonField
          rules={{ required: ' ' }}
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
          onChange={(file) => handleFileChange(file, mode)}
        />
      )
    }

    const getImageDetails = (mode: any) => {
      switch (mode) {
        case 'Banner':
          return {
            imageRatio: '1:1',
            minSize: '400 x 400px',
          }
        case 'Certifications':
          return { imageRatio: '14:9', minSize: '390 x 250px' }
        default:
          return {
            imageRatio: '5:2',
            minSize: '180 x 80px',
          }
      }
    }

    const { imageRatio, minSize } = getImageDetails(mode)

    return (
      <div className='card'>
        <h4 className='text-astronaut font-bold'>{title}</h4>
        <small className='font-medium'>
          Last update <span className='font-bold'>{UpdateDate}</span> Update by{' '}
          <span className='font-bold'>{UpdateBy}</span>
        </small>

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
          <small className='text-xs font-bold text-info'>
            Hero image ( Recommend image ratio {imageRatio} ) ( Min {minSize} )
          </small>
          {fileUploadContent}
        </div>
        {mode !== 'Certifications' && (
          <div className='tw-flex tw-flex-col tw-justify-between tw-items-center tw-w-full tw-gap-8 tw-pt-8'>
            <div className='w-full'>
              <TabMenu
                model={langItems}
                activeIndex={langItems.findIndex(
                  (x) => x.code === currentLang.code
                )}
                onTabChange={(e) =>
                  setActiveLang((prev) => ({
                    ...prev,
                    [mode]: langItems[e.index],
                  }))
                }
              />
              <div>
                {activeLang &&
                  langItems.map((lang) => (
                    <Fragment key={lang.code}>
                      <div hidden={currentLang.code !== lang.code}>
                        <div className='flex'>
                          <div className='flex flex-column gap-1 w-full my-5'>
                            <TextField
                              label='Name (Level 1)'
                              aria-describedby='name1'
                              name={`name1_${mode}${lang.code}`}
                              placeholder='text here'
                              maxLength={20}
                            />
                          </div>
                        </div>
                        <div className='flex'>
                          <div className='flex flex-column gap-1 w-full'>
                            <TextField
                              label='Name (Level 2)'
                              aria-describedby='name2'
                              name={`name2_${mode}${lang.code}`}
                              placeholder='text here'
                              maxLength={20}
                            />
                          </div>
                        </div>
                        {mode === 'Library' && (
                          <div className='flex'>
                            <div className='flex flex-column gap-1 w-full mt-5'>
                              <TextField
                                label='Introduce'
                                aria-describedby='introduce'
                                name={`introduce_${mode}${lang.code}`}
                                placeholder='text here'
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </Fragment>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const onInvalidSubmit = (err: any) => {
    if (err.imageFile_Sustainability) {
      setFileState((prev) => ({
        ...prev,
        Sustainability: {
          ...prev['Sustainability'],
          invalidFile: {
            title: 'Missing field',
            message: 'please upload image',
          },
        },
      }))
    }
    if (err.imageFile_Library) {
      setFileState((prev) => ({
        ...prev,
        Library: {
          ...prev['Library'],
          invalidFile: {
            title: 'Missing field',
            message: 'please upload image',
          },
        },
      }))
    }
    if (err.imageFile_Certifications) {
      setFileState((prev) => ({
        ...prev,
        Certifications: {
          ...prev['Certifications'],
          invalidFile: {
            title: 'Missing field',
            message: 'please upload image',
          },
        },
      }))
    }
  }

  const createFileObject = (
    file: any,
    data: any,
    type: number,
    name1Key: any,
    name2Key: any,
    introduceKey: any,
    changed: boolean
  ) => {
    if (!file) return null

    return {
      id: file.id,
      type,
      imageURL: file.imageURL,
      fileName: file.fileName,
      originalFileName: file.originalFileName,
      labelLevel1: data[name1Key + 'en'],
      labelLevel2: data[name2Key + 'en'],
      labelLevel1TH: data[name1Key + 'th'],
      labelLevel2TH: data[name2Key + 'th'],
      labelLevel1CN: data[name1Key + 'cn'],
      labelLevel2CN: data[name2Key + 'cn'],
      labelIntroduce: data[introduceKey + 'en'],
      labelIntroduceTH: data[introduceKey + 'th'],
      labelIntroduceCN: data[introduceKey + 'cn'],
      isDelete: false,
      isChanged: changed,
    }
  }

  const onSubmit = (data: any) => {
    const lstFile = [
      createFileObject(
        fileState['Sustainability']?.file,
        data,
        1,
        'name1_Sustainability',
        'name2_Sustainability',
        'introduce_Sustainability',
        fileState['Sustainability']?.changed ?? true
      ),
      createFileObject(
        fileState['Library']?.file,
        data,
        2,
        'name1_Library',
        'name2_Library',
        'introduce_Library',
        fileState['Library']?.changed ?? true
      ),
      createFileObject(
        fileState['Certifications']?.file,
        data,
        3,
        'name1_Certifications',
        'name2_Certifications',
        'introduce_Certifications',
        fileState['Certifications']?.changed ?? true
      ),
    ].filter(Boolean)

    confirmDialog({
      message: 'Are you sure you want to change banner sustainability?',
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
              const promise = sustainabilityContentService
                .publish({ lstBanner: lstFile })
                .then(() => {
                  fetchData()
                })
              toast.promise(promise, defaultToastMessage)
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

  // const onCancelChange = () => {
  //   confirmDialog({
  //     message: 'Are you sure you want to cancel change ?',
  //     closable: false,
  //     style: { width: '500px' },
  //     contentClassName: 'flex justify-content-center font-semibold text-lg',
  //     footer: ({ accept, reject }) => (
  //       <div className='flex justify-content-start gap-3'>
  //         <Button
  //           type='submit'
  //           label='Confirm'
  //           className='bg-primary-blue'
  //           onClick={async () => {
  //             accept()
  //             fetchData()
  //           }}
  //         />
  //         <Button
  //           className='text-primary-blue'
  //           label='Cancel'
  //           text
  //           onClick={reject}
  //         />
  //       </div>
  //     ),
  //   })
  // }

  return (
    <FormController
      ref={formRef}
      defualtValue={defaultValue}
      onSubmit={onSubmit}
      onInvalid={onInvalidSubmit}
    >
      <div className='flex flex-wrap flex-column md:flex-row align-items-center justify-content-between mb-5'>
        <div className='tw-max-w-inherit'>
          <div className='tw-px-[15px] lg:tw-px-0'>
            <div className='tw-text-[#707EAE] tw-text-sm tw-font-medium'>
              Sustainability
            </div>
            <div className='tw-text-[#2B3674] tw-text-[34px] tw-font-bold'>
              Banner Management
            </div>
          </div>
        </div>
        <div className='flex align-items-center justify-contents-end'>
          <div className='flex gap-3 justify-content-center md:justify-content-start'>
            <Button
              disabled={loading}
              className='px-5 bg-primary-blue'
              label='Publish'
              onClick={formRef.current?.handleSubmit(onSubmit, onInvalidSubmit)}
            />
            {/* <Button
              disabled={loading}
              type='button'
              className='px-5 text-primary-blue'
              label='Cancel change'
              text
              onClick={() => onCancelChange()}
            /> */}
          </div>
        </div>
      </div>

      <div className='flex gap-3'>
        <div className='flex flex-1 flex-column'>
          {renderFileUploadSection('Sustainability', 'Banner B1*')}
          {renderFileUploadSection('Library', 'Banner B2*')}
          {renderFileUploadSection('Certifications', 'Banner Template Type C*')}

          <div className='flex gap-3 justify-content-center md:justify-content-start'>
            <Button
              disabled={loading}
              className='px-5 bg-primary-blue'
              label='Publish'
              onClick={formRef.current?.handleSubmit(onSubmit, onInvalidSubmit)}
            />
            {/* <Button
              disabled={loading}
              type='button'
              className='px-5 text-primary-blue'
              label='Cancel change'
              text
              onClick={() => onCancelChange()}
            /> */}
          </div>
        </div>

        {/* <div className='flex'>
          <div className='card w-full'>
            <h4>Preview</h4>
            <div
              className='relative flex flex-column justify-content-center overflow-hidden tw-shadow-[rgba(0,0,0,0.1)_0px_4px_12px]'
              style={{ width: '360px', height: '830px' }}
            >
              {fileState.Banner.file?.imageBannerURL ? (
                <Image
                  alt={fileState.Banner.file?.originalFileNameBanner}
                  src={fileState.Banner.file?.imageBannerURL}
                  height={'540'}
                />
              ) : (
                <div
                  className='surface-300 text-white flex flex-column align-items-center justify-content-center'
                  style={{ height: '540px' }}
                >
                  <span>Artwork Size (Banner)</span>
                  <span>360x640</span>
                </div>
              )}

              <div
                className='text-white flex align-items-center tw-justify-around'
                style={{ height: '130px', marginTop: '-4px' }}
              >
                {fileState.Sustainability.file?.imageSustainabilityURL ? (
                  <Image
                    alt={
                      fileState.Sustainability.file
                        ?.originalFileNameSustainability
                    }
                    className='tw-rounded'
                    src={fileState.Sustainability.file?.imageSustainabilityURL}
                    height={'90'}
                    width='100%'
                    style={{ width: '45%' }}
                  />
                ) : (
                  <div
                    className='bg-red-200 overflow-hidden tw-rounded text-white flex flex-column align-items-center justify-content-center'
                    style={{ height: '90px', width: '45%' }}
                  >
                    <span>Artwork Size</span>
                    <span>180x90</span>
                  </div>
                )}

                {fileState.Library.file?.imageLibraryURL ? (
                  <Image
                    alt={fileState.Library.file?.originalFileNameLibrary}
                    className='tw-rounded'
                    src={fileState.Library.file?.imageLibraryURL}
                    height={'90'}
                    width='100%'
                    style={{ width: '45%' }}
                  />
                ) : (
                  <div
                    className='bg-red-200 overflow-hidden tw-rounded text-white flex flex-column align-items-center justify-content-center'
                    style={{ height: '90px', width: '45%' }}
                  >
                    <span>Artwork Size</span>
                    <span>180x90</span>
                  </div>
                )}
              </div>
              <div
                className='flex flex-column p-2'
                style={{ height: '160px', background: '#fff' }}
              >
                <p className='tw-text-1xl tw-text-[#1B2559] tw-font-bold tw-m-0'>
                  Health & Wellbeing
                </p>
                <p className='tw-text-sm tw-text-[#b9b9b9]'>
                  Promoting a healthy lifestyle and environment through
                  sustainable practices
                </p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </FormController>
  )
}

export default BannerManagement

BannerManagement.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/sustainability/banner',
    accessPage: PCODE.EDITBANNER,
  }
)
