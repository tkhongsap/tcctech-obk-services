import React from 'react'
import { Image } from 'primereact/image'

const PreviewEvent = (props: any) => {
  const {
    lang,
    eventState,
    // isShowMessage
  } = props

  const { file: event } = eventState[lang]

  const renderContentSection = () => {
    return (
      <div className='flex flex-column gap-2'>
        <div
          className='flex w-full surface-300 flex flex-column align-items-center justify-content-center overflow-hidden'
          style={{
            height: '600px',
            position: 'relative',
          }}
        >
          {!event ? (
            <>
              <span>Artwork Size</span>
              <span>360 x 640 px</span>
            </>
          ) : (
            <Image
              src={event.imageURL}
              alt={event.originalFileName}
              width='100%'
              height='600px'
              style={{ objectFit: 'cover' }}
              className='event-image'
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-column gap-1 w-full'>
      {renderContentSection()}
    </div>
  )
}

export default PreviewEvent
