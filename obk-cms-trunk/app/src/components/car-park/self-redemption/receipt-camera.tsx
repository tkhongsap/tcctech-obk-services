import { CloseIcon } from '@chakra-ui/icons'
import { RedemptionDetailModal } from '@pages/car-park/self-redemption-record/show/[id]'
import Image from 'next/image'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import * as OB_PARKING_SDK from 'ob-parking-sdk'
import { convertToBase64 } from '@src/utils/image'
import { imageUploader } from '@src/utils/image-uploader'
import { getExternalCameraList } from '@src/utils/external-camera-list'

type Props = {
  visible: boolean
  isShowModal: RedemptionDetailModal
  setIsShowModal: Dispatch<SetStateAction<RedemptionDetailModal>>
  parkingDetailId: string
  email: string
  imageFile?: File
  setImageFile?: Dispatch<SetStateAction<File | undefined>>
}

const Camera = ({
  visible,
  setIsShowModal,
  parkingDetailId,
  email,
  imageFile,
  setImageFile,
}: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const currentStreamRef = useRef<MediaStream | null>(null)
  const [cameraList, setCameraList] = useState<MediaDeviceInfo[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [capturedBase64, setCapturedBase64] = useState<string | null>(null)

  const handleImageFile = useCallback(async (imageFile: File) => {
    const result = await convertToBase64(imageFile)

    if (typeof result === 'string') {
      const base64 = result.split(',')[1]
      setCapturedBase64(base64)
      setImageUrl(URL.createObjectURL(imageFile))
    }
  }, [])

  useEffect(() => {
    if (imageFile) {
      handleImageFile(imageFile)
    }
  }, [handleImageFile, imageFile])

  useEffect(() => {
    async function init() {
      try {
        const initialStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        })
        initialStream.getTracks().forEach((track) => track.stop())

        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(
          (device) => device.kind === 'videoinput'
        )
        const externalCameraName = await getExternalCameraList()
        const externalCamera = videoDevices.filter((device) =>
          externalCameraName.some((name) => device.label.includes(name))
        )
        const defaultCamera = externalCamera?.[0] || videoDevices[0]

        setCameraList(videoDevices)

        if (videoDevices.length > 0) {
          setSelectedCamera(defaultCamera.deviceId)
          startCamera(defaultCamera.deviceId)
        }
      } catch (error) {
        alert('Error starting camera:' + error)
      }
    }

    if (!imageUrl) {
      init()
    }

    return () => {
      if (currentStreamRef.current) {
        currentStreamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [imageUrl])

  const startCamera = async (deviceId: string) => {
    if (currentStreamRef.current) {
      currentStreamRef.current.getTracks().forEach((track) => track.stop())
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: { exact: deviceId },
        },
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      currentStreamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play() // <-- ensures the video starts
      }

      const settings = stream.getVideoTracks()[0].getSettings()
      if (canvasRef.current) {
        canvasRef.current.width = settings.width || 560
        canvasRef.current.height = settings.height || 560
      }
    } catch (error) {
      console.error('Error starting camera:', error)
    }
  }

  const generateFilename = (ext: string = 'png') => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    return `${timestamp}_${random}.${ext}`
  }

  const captureImage = () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(async (blob) => {
      if (!blob) return

      const fileName = generateFilename()
      const fakeFile = new File([blob], fileName, { type: 'image/png' })

      const result = await convertToBase64(fakeFile)

      if (typeof result === 'string') {
        const base64 = result.split(',')[1]
        setCapturedBase64(base64)
        setImageUrl(URL.createObjectURL(blob))
      }
    }, 'image/png')
  }

  const CameraDisplay = ({
    hide,
  }: {
    hide: (e: React.SyntheticEvent) => void
  }) => {
    return (
      <div
        style={{ width: '100%', height: 560 }}
        className='flex tw-flex-col tw-gap-6'
      >
        {!imageFile && (
          <div className='flex tw-gap-2 tw-items-center'>
            <span>select camera:</span>
            <Dropdown
              loading={isLoading}
              disabled={isLoading}
              options={cameraList.map((camera) => {
                return {
                  value: camera.deviceId,
                  label: camera.label || `Camera ${camera.deviceId}`,
                }
              })}
              placeholder='Select a Camera'
              value={selectedCamera}
              onChange={(e) => {
                setSelectedCamera(e.value)
                startCamera(e.value)
              }}
            />
          </div>
        )}

        {imageUrl ? (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              backgroundColor: 'black',
              borderRadius: 16,
            }}
            className='tw-w-full flex tw-items-center tw-justify-center'
          >
            <Button
              disabled={isLoading}
              style={{
                zIndex: 1,
                top: 10,
                right: 14,
                position: 'absolute',
                border: 'none',
                backgroundColor: '#FBE9E9',
                width: 48,
                height: 48,
              }}
              onClick={(e) => {
                setImageUrl('')
                setCapturedBase64(null)
                if (imageFile && setImageFile) {
                  hide(e)
                }
              }}
              className='tw-rounded-full flex tw-items-center tw-justify-center tw-absolute'
              aria-label='close-image'
            >
              <CloseIcon color={'#CD1A1A'} />
            </Button>
            <Image
              objectFit='contain'
              src={imageUrl}
              alt='capture-img'
              className='tw-px-10'
              fill
            />
          </div>
        ) : (
          <video
            autoPlay
            playsInline
            ref={videoRef}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        )}
        <canvas ref={canvasRef} className='hidden' />
      </div>
    )
  }

  const createReceipt = async () => {
    setIsLoading(true)

    if (!capturedBase64) {
      alert('No captured image to upload')
      setIsLoading(false)
      return
    }

    try {
      const filename = generateFilename('png')
      const uploadResult = await imageUploader(
        capturedBase64,
        filename,
        'image/png',
        'obk-cms-ocr-receipt'
      )
      const uploadedImageUrl = uploadResult.imageUrl

      const response = await OB_PARKING_SDK.client.receiptCreateReceipt({
        imageUrl: uploadedImageUrl,
        parkingDetailId: parkingDetailId,
        email,
      })

      if (response.status === 200 && response.data) {
        setIsShowModal(undefined)
        setImageUrl(null)
        setCapturedBase64(null)
      }
    } catch (err) {
      setIsShowModal('invalid')
      setImageUrl(null)
      if (setImageFile) setImageFile(undefined)
      setCapturedBase64(null)
    }

    setIsLoading(false)
  }

  return (
    <Dialog
      draggable={false}
      blockScroll={true}
      visible={visible}
      style={{ width: 640 }}
      onHide={() => {
        setIsShowModal('add-receipt')
        setCapturedBase64(null)
        if (setImageFile && imageFile) {
          setImageFile(undefined)
        }
      }}
      modal
      content={({ hide }) => (
        <div className='tw-flex tw-flex-col bg-white p-5 border-round-lg tw-gap-6'>
          <span className='font-bold tw-text-2xl tw-text-[#1B2559]'>
            {imageFile ? 'Add a receipt' : 'Scanned Ticket'}
          </span>
          <CameraDisplay hide={hide} />
          <div className='flex gap-5'>
            {imageUrl ? (
              <Button
                loading={isLoading}
                disabled={isLoading}
                className='bg-primary-blue'
                onClick={() => createReceipt()}
                label='Validate receipt'
              />
            ) : (
              <Button
                loading={isLoading}
                disabled={isLoading}
                className='bg-primary-blue'
                label='Capture receipt'
                onClick={() => captureImage()}
              />
            )}
            <Button
              loading={isLoading}
              disabled={isLoading}
              text
              style={{ color: '#4318FF' }}
              type='button'
              onClick={(e) => {
                hide(e)
              }}
              label='Cancel'
            />
          </div>
        </div>
      )}
    ></Dialog>
  )
}

export const ReceiptCamera = React.memo(Camera)
