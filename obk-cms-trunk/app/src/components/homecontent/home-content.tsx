import DropdownField from '@components/forms/components/dropdown-field'
import {
  FormControllerRef,
  FormController,
} from '@components/forms/components/form-controller'
import ImageButtonField from '@components/forms/components/image-button-field'
import TextField from '@components/forms/components/text-field'
import LabelField from '@components/forms/utils/label-field'
import { useNavigation } from '@refinedev/core'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import {
  HomeContentData,
  IHomeContentUpload,
  IHomeContentData,
  ILastVersion,
} from '@src/services/homecontent/history/model'
import { homeContentService } from '@src/services/homecontent/history/service'
import { defaultToastMessage } from '@src/utils/default-toast'
import { convertToBase64 } from '@src/utils/image'
import { last } from 'lodash'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { Image } from 'primereact/image'
import { Message } from 'primereact/message'
import { ProgressBar } from 'primereact/progressbar'
import { useState, useRef, useEffect } from 'react'
import { toast } from 'react-toastify'

const announcementType = [
  { name: 'Invisible', value: 0 },
  { name: 'Visible', value: 1 },
]

const acceptTypes = ['image/png', 'image/jpg', 'image/jpeg']

type Props = {
  data?: IHomeContentData
  lastVersion?: ILastVersion
}

export default function HomeContent(props: Props) {
  const mode: 'SHOW' | 'CREATE' = props.data ? 'SHOW' : 'CREATE'
  const router = useNavigation()
  const { setMenuAction } = useLayoutContext()
  const [fileUploaded, setFileUploaded] = useState<
    IHomeContentData | undefined
  >(props.data)
  const [uploadingFile, setUploadingFile] = useState<boolean>(false)
  const [invalidFile, setInvalidFile] = useState<{
    title: string
    message: string
  } | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const formRef = useRef<FormControllerRef<HomeContentData>>(null)
  const defaultValue = new HomeContentData(props.data)

  const setFileFormData = (data?: IHomeContentData) => {
    formRef.current?.setValue('fileName', data?.fileName ?? '')
    formRef.current?.setValue('originalFileName', data?.originalFileName ?? '')
    formRef.current?.setValue('message', data?.message ?? '')
    formRef.current?.setValue('imageURL', data?.imageURL ?? '')
  }

  const onFileChange = async (file: File) => {
    setUploadingFile(true)
    convertToBase64(file)
      .then((base64) => {
        const base64Data = last(base64?.toString().split('base64,'))!
        const f: IHomeContentUpload = {
          fileName: file.name,
          fileContentBase64: base64Data,
          contentType: file.type,
        }
        return homeContentService.upload(f)
      })
      .then((res) => {
        setFileUploaded(res.data)
        setInvalidFile(null)
        setFileFormData(res.data)
      })
      .finally(() => setUploadingFile(false))
  }

  const onRemoveFile = () => {
    setFileUploaded(undefined)
    setFileFormData(undefined)
  }

  const onBack = () => router.replace('/home-content/version-history')

  const onInvalidSubmit = (err: any) => {
    if (err.imageFile) {
      setInvalidFile({
        title: 'Missing field',
        message: 'please upload image',
      })
    }
  }

  const onSubmit = (data: HomeContentData) => {
    confirmDialog({
      message: 'Are you sure you want to create new home content?',
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
              delete data.imageFile
              setLoading(true)
              const promise = homeContentService
                .publish(data)
                .then(onBack)
                .finally(() => setLoading(false))
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

  const buttonActionTemplate = (
    <div className='flex gap-3 justify-content-center md:justify-content-start'>
      {mode === 'CREATE' && (
        <Button
          disabled={loading}
          className='px-5 bg-primary-blue'
          label='Publish'
          onClick={formRef.current?.handleSubmit(onSubmit, onInvalidSubmit)}
        />
      )}
      <Button
        type='button'
        disabled={loading}
        className='px-5 text-primary-blue'
        label='Close'
        text
        onClick={onBack}
      />
    </div>
  )

  useEffect(() => {
    setMenuAction(buttonActionTemplate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formRef.current, loading])

  return (
    <>
      <FormController
        ref={formRef}
        defualtValue={defaultValue}
        onSubmit={onSubmit}
        onInvalid={onInvalidSubmit}
      >
        <div className='flex gap-3'>
          <div className='flex flex-1 flex-column'>
            <div className='card'>
              <>
                <h4 className='text-astronaut font-bold'>
                  {mode === 'CREATE' ? 'Create new home content' : 'Hero image'}
                </h4>
                <small className='font-medium'>
                  Last update&nbsp;
                  <span className='font-bold'>
                    {props.lastVersion?.updatedDateDisplay}&nbsp;
                  </span>
                  Update by&nbsp;
                  <span className='font-bold'>
                    {props.lastVersion?.updatedBy}
                  </span>
                </small>
              </>
              <div className='flex flex-column mt-5 gap-2'>
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
                <small className='text-xs font-bold text-info'>
                  Hero image ( Recommend image ratio 9:16 ) ( Min 360x640px, Max
                  860x1527 ) Supported image formats: PNG and JPEG.
                </small>
                {uploadingFile ? (
                  <ProgressBar
                    mode='indeterminate'
                    style={{ height: '6px' }}
                  ></ProgressBar>
                ) : fileUploaded ? (
                  <Message
                    content={
                      <div className='w-full flex justify-content-between py-3'>
                        <span>{fileUploaded.originalFileName}</span>
                        {mode === 'CREATE' && (
                          <i
                            className='pi pi-times cursor-pointer'
                            onClick={onRemoveFile}
                          ></i>
                        )}
                      </div>
                    }
                  />
                ) : (
                  <>
                    <div className='w-full'>
                      <ImageButtonField
                        rules={{ required: ' ' }}
                        acceptTypes={acceptTypes.join(', ')}
                        name='imageFile'
                        outputType='file'
                        mode='single'
                        onError={setInvalidFile}
                        onChange={onFileChange}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className='flex'>
                <div className='flex flex-column gap-1 w-full my-5'>
                  {mode === 'SHOW' ? (
                    <LabelField label='Note (Not visible to users)'>
                      <span className='font-medium'>{props.data?.note}</span>
                    </LabelField>
                  ) : (
                    <TextField
                      label='Note (Not visible users)'
                      aria-describedby='note'
                      name='note'
                      placeholder='text here'
                    />
                  )}
                </div>
              </div>
            </div>

            {mode === 'CREATE' && (
              <div className='card mt-5'>
                <div className='flex flex-column md:flex-row justify-content-between'>
                  <div className='flex flex-column gap-3 mb-3 md:mb-0'>
                    <h4 className='mb-0'>Announcement</h4>
                    <small>
                      Please go to notification section to create a new
                      announcement
                    </small>
                  </div>
                  <div className='flex align-items-center w-full md:w-12rem'>
                    <DropdownField
                      placeholder='Please select'
                      name='visible'
                      options={announcementType}
                      optionLabel='name'
                      optionValue='value'
                      rules={{ required: 'Visible announcement required.' }}
                      showRequiredLabel={false}
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              {/* Footer Button */}
              {buttonActionTemplate}
            </div>
          </div>

          {/* Preview Section */}
          <div className='flex'>
            <div className='card w-full'>
              <h4>Preview</h4>
              {fileUploaded?.imageURL ? (
                <div
                  className='relative flex justify-content-center overflow-hidden'
                  style={{
                    width: '375px',
                    backgroundPosition: 'center center',
                  }}
                >
                  <Image
                    alt={fileUploaded.originalFileName}
                    src={fileUploaded.imageURL}
                    // width={'375'}
                    height={'812'}
                  />
                  <div
                    className='absolute flex flex-column justify-content-center text-center'
                    style={{
                      height: '175px',
                      background: '#162C51',
                      bottom: '4px',
                      width: '375px',
                    }}
                  >
                    <span className='text-2xl' style={{ color: '#87DAFF' }}>
                      Good Morning,
                    </span>
                    <span className='text-2xl text-white mb-5'>Khun Joe</span>
                    <span className='text-sm' style={{ color: '#87DAFF' }}>
                      What would you like to do first?
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className='relative flex flex-column m-auto'
                    style={{ width: '360px', height: '780px' }}
                  >
                    <div
                      className='bg-red-200 text-white flex flex-column align-items-center justify-content-center'
                      style={{ height: '120px' }}
                    >
                      <div
                        style={{
                          width: '1px',
                          height: '100%',
                          background: 'white',
                        }}
                      ></div>
                      <span>Safe Space</span>
                      <span>120px</span>
                      <div
                        style={{
                          width: '1px',
                          height: '100%',
                          background: 'white',
                        }}
                      ></div>
                    </div>
                    <div
                      className='surface-300 text-white flex flex-column align-items-center justify-content-center'
                      style={{ height: '640px' }}
                    >
                      <span>Artwork Size</span>
                      <span>360x640</span>
                    </div>
                    <div
                      className='flex flex-column justify-content-center text-center'
                      style={{ height: '175px', background: '#162C51' }}
                    >
                      <span className='text-2xl' style={{ color: '#87DAFF' }}>
                        Good Morning,
                      </span>
                      <span className='text-2xl text-white mb-5'>Khun Joe</span>
                      <span className='text-sm' style={{ color: '#87DAFF' }}>
                        What would you like to do first?
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </FormController>
    </>
  )
}
