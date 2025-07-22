import { getExternalCameraList } from '@src/utils/external-camera-list'
import { AddParkingTicketIdType } from 'ob-parking-sdk/dist/api'
import { Dropdown } from 'primereact/dropdown'
import { useEffect, useRef, useState } from 'react'
import { QrReader } from 'react-qr-reader'

export default function QRParkinkReader({
  addParkingTicket,
}: {
  addParkingTicket: (id: string, type: AddParkingTicketIdType) => void
}) {
  const [cameraList, setCameraList] = useState<MediaDeviceInfo[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState('')
  const currentStreamRef = useRef<MediaStream | null>(null)
  const hasScannedRef = useRef<boolean>(false)

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
          startCamera(defaultCamera.deviceId)
        }
      } catch (error: any) {
        alert('Camera error ' + error.message)
      }
    }

    init()

    return () => {
      if (currentStreamRef.current) {
        currentStreamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  async function startCamera(deviceId: string) {
    if (currentStreamRef.current) {
      currentStreamRef.current.getTracks().forEach((track) => track.stop())
    }
    try {
      const constraints = {
        video: {
          deviceId: { exact: deviceId },
        },
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      currentStreamRef.current = stream
      setSelectedDeviceId(deviceId)
    } catch (error: any) {
      alert('Camera error ' + error.message)
    }
  }

  const onResult = (text: string) => {
    console.log('QR Code Result:', hasScannedRef.current)
    if (hasScannedRef.current) return

    const isJson = text.startsWith('{') && text.endsWith('}')
    if (isJson) {
      const logId = JSON.parse(text).id
      addParkingTicket(logId, 'member_id')
    } else {
      const splitedText = text.split('/')
      const logId = splitedText[splitedText.length - 1]
      if (logId) {
        addParkingTicket(logId, 'log_id')
      }
    }

    hasScannedRef.current = true
  }

  return (
    <div className='flex tw-gap-6 tw-flex-col'>
      <div className='flex tw-gap-2 tw-items-center'>
        <span>select camera:</span>
        <Dropdown
          optionLabel='label'
          options={cameraList.map((device) => {
            return {
              label: device.label || `Camera ${device.deviceId}`,
              value: device.deviceId,
            }
          })}
          onChange={(e) => {
            setSelectedDeviceId(e.value)
          }}
          value={selectedDeviceId}
          placeholder='Select a Camera'
        />
      </div>
      <QrReader
        key={selectedDeviceId}
        constraints={{ deviceId: { exact: selectedDeviceId } }}
        scanDelay={300}
        containerStyle={{
          height: 450,
        }}
        videoContainerStyle={{
          height: '100%',
          paddingTop: 0,
        }}
        videoStyle={{
          height: '100%',
        }}
        onResult={(result) => {
          if (!!result) {
            onResult(result.getText())
          }
        }}
      />
    </div>
  )
}
