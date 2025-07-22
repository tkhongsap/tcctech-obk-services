import React from 'react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { Image } from 'primereact/image'

const PreviewTable = (props: any) => {
  const { content } = props

  const getCodeVideo = (path: any) => {
    if (path) {
      const splitPath = path.split('/')
      const endPath = splitPath[splitPath.length - 1]
      let codeYoutubeSave = endPath
      if (endPath.indexOf('watch') !== -1) {
        codeYoutubeSave = endPath.split('=', endPath.length)[1]
        if (codeYoutubeSave.indexOf('&') !== -1) {
          codeYoutubeSave = codeYoutubeSave.split('&')[0]
        }
      } else if (endPath.indexOf('playlist') !== -1) {
        codeYoutubeSave = endPath.split('list=RD')[1]
        codeYoutubeSave = codeYoutubeSave.split('&')[0]
      }
      const sFullPath = `https://www.youtube.com/embed/${codeYoutubeSave}`
      return sFullPath
    } else {
      return ''
    }
  }

  return (
    <div className='flex flex-column gap-1 w-full'>
      <div className='flex w-full tw-justify-between align-items-center px-3 mb-2'>
        <ArrowBackIcon />
        <h6 className='text-astronaut font-bold mb-0 mt-0'>
          {'Main menu name'}
        </h6>
        <div></div>
      </div>
      <div
        className='flex w-full surface-300 flex flex-column align-items-center justify-content-center overflow-hidden'
        style={{
          height: '211px',
        }}
      >
        <Image
          src={content.headImageURL}
          alt={content.headOriginalFileName}
          width='100%'
          height='100%'
          className='preview-image'
        />
      </div>
      <div className='flex flex-column gap-1 w-full px-3 mt-2'>
        <h4 className='text-astronaut font-bold mb-0 mt-0'>{content.menu}</h4>
        <small className='font-medium'>{content.introduce}</small>
        {content.cms.map((f: any) => (
          <>
            {(f.contentType === 1 || f.contentType === undefined) && (
              <div style={{ marginTop: '5px', marginBottom: '5px' }}>
                <div
                  className='ql-editor !tw-p-0'
                  dangerouslySetInnerHTML={{
                    __html: f.text,
                  }}
                />
              </div>
            )}
            {f.contentType === 2 && (
              <Image
                alt={f.originalFileName}
                src={f.imageURL}
                width='100%'
                style={{ marginTop: '5px', marginBottom: '5px' }}
              />
            )}
            {f.contentType === 3 && f.youtubeURL && (
              <div
                style={{
                  width: '100%',
                  height: '180px',
                  marginTop: '5px',
                  marginBottom: '5px',
                }}
              >
                <iframe
                  src={getCodeVideo(f.youtubeURL)}
                  style={{ width: '100%', height: '100%' }}
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                  title={`YouTube video`}
                ></iframe>
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  )
}

export default PreviewTable
