import ImageButtonField from '@components/forms/components/image-button-field'
import { NotificationMessageImageBlock } from '@components/notifications/types/notification'
import { Image } from 'primereact/image'
import { Fragment } from 'react'

type Props = {
  block: NotificationMessageImageBlock
  onChange(e: NotificationMessageImageBlock): void
}

export default function MessageImageBlock(props: Props) {
  const { block, onChange } = props
  const FILE_LENGTH = 3

  const onSelectImage = async (
    filesBase64: (string | ArrayBuffer | null)[]
  ) => {
    block.data = []
    block.data.push(
      ...filesBase64
        .filter((base64) => base64 != null)
        .map((base64) => base64!.toString())
    )
    onChange && onChange(block)
  }

  return (
    <>
      <small className='text-primary-800'>Image (Size recommend 16:9)</small>
      <div className='relative flex justify-content-start align-items-center gap-3 border-dashed border-gray-300 p-2'>
        {block.data && block.data.length > 0 && (
          <Fragment>
            {block.data?.map((img, imgIndex) => (
              <div
                key={imgIndex}
                className='relative flex justify-content-center align-items-center overflow-hidden'
                style={{
                  height: '240px',
                  width: '426px',
                  backgroundPosition: 'center center',
                }}
              >
                <Image
                  className='absolute'
                  alt={decodeURIComponent(imgIndex.toString())}
                  src={img}
                  width={'426'}
                  style={{
                    objectPosition: 'center',
                    objectFit: 'none',
                  }}
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
                    block.data.splice(imgIndex, 1)
                    onChange && onChange(block)
                  }}
                >
                  <i className='pi pi-times m-auto text-primary-blue'></i>
                </div>
              </div>
            ))}
          </Fragment>
        )}
      </div>
      <ImageButtonField
        name=''
        fileLength={FILE_LENGTH}
        outputType='base64'
        mode='multiple'
        acceptTypes='image/png, image/jpg, image/jpeg'
        onChange={onSelectImage}
      />
    </>
  )
}
