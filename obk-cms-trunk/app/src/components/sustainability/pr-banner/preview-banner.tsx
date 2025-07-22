import React from 'react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { Image } from 'primereact/image'

const PreviewBanner = (props: any) => {
  const {
    formData,
    lang,
    isContent,
    headerState,
    bannerState,
    textBanner,
    mode = 'I',
    data,
  } = props

  const { watch } = formData

  const { file: banner } = bannerState[lang]
  const { file } = headerState[lang]
  const text = textBanner[lang]

  const titleValue = data[`title_${lang}`]
  const contentValue = watch(`${lang}_contents`)

  const renderContentSection = () => {
    return (
      <div className='flex flex-column gap-2'>
        <div
          className='flex w-full surface-300 flex flex-column align-items-center justify-content-center overflow-hidden'
          style={{
            position: 'relative',
          }}
        >
          {!banner ? (
            <>
              <span>Artwork Size</span>
              <span>400 x 720 px</span>
            </>
          ) : (
            <>
              {mode === 'I' ? (
                <Image
                  src={banner.imageURL}
                  alt={banner.originalFileName}
                  width='100%'
                  height='720px'
                  style={{ objectFit: 'cover' }}
                  className='banner-image'
                />
              ) : (
                <video width='100%' height='720' autoPlay loop muted>
                  <source src={banner.imageURL} type='video/mp4' />
                </video>
              )}

              <div
                className='ql-editor !tw-p-0'
                style={{
                  height: 'max-content',
                  position: 'absolute',
                  bottom: '3%',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                  width: '80%',
                }}
                dangerouslySetInnerHTML={{
                  __html: text,
                }}
              />
            </>
          )}
        </div>
      </div>
    )
  }

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
      {isContent ? (
        <>
          <div className='flex w-full tw-justify-between align-items-center px-3 mb-2'>
            <ArrowBackIcon />
            <h6 className='text-astronaut font-bold mb-0 mt-0'>Banner name</h6>
            <div></div>
          </div>
          <div
            className='flex w-full surface-300 flex flex-column align-items-center justify-content-center overflow-hidden'
            style={{
              height: '510px',
            }}
          >
            {!file ? (
              <>
                <span>Artwork Size</span>
                <span>360 x 510 px</span>
              </>
            ) : (
              <Image
                src={file.imageURL}
                alt={file.originalFileName}
                width='100%'
                height='100%'
                className='preview-image'
              />
            )}
          </div>
          <div className='flex flex-column gap-1 w-full px-3 mt-2'>
            <h4 className='text-astronaut font-bold mb-0 mt-0'>{titleValue}</h4>
            {contentValue.map((f: any) => (
              <>
                {(f.type === 1 || f.type === undefined) && (
                  <div style={{ marginTop: '5px', marginBottom: '5px' }}>
                    <div
                      className='ql-editor !tw-p-0'
                      dangerouslySetInnerHTML={{
                        __html: f.answer,
                      }}
                    />
                  </div>
                )}
                {f.type === 2 && (
                  <Image
                    alt={f.originalFileName}
                    src={f.imageURL}
                    width='100%'
                    style={{ marginTop: '5px', marginBottom: '5px' }}
                  />
                )}
                {f.type === 3 && f.youtube && (
                  <div
                    style={{
                      width: '100%',
                      height: '180px',
                      marginTop: '5px',
                      marginBottom: '5px',
                    }}
                  >
                    <iframe
                      src={getCodeVideo(f.youtube)}
                      style={{ width: '100%', height: '100%' }}
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                      allowFullScreen
                      title={`YouTube video ${lang}`}
                    ></iframe>
                  </div>
                )}
              </>
            ))}
          </div>
        </>
      ) : (
        <>{renderContentSection()}</>
      )}
    </div>
  )
}

export default PreviewBanner
