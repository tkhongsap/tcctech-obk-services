import React from 'react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { Image } from 'primereact/image'

type content = 'A' | 'B' | 'C'

const PreviewContent = (props: any) => {
  const {
    type,
    formData,
    lang,
    isSubMenu,
    mainMenu = 'Health & Wellbeing',
    headerState,
    data,
  } = props

  const { watch } = formData

  const { file } = headerState[lang]

  const menuValue = data[`menu_${lang}`] ?? ''
  const introduceValue = data[`introduce_${lang}`] ?? ''
  const contentValue = watch(`${lang}_contents`)

  const renderContentSection = (mode: content) => {
    let sustainContent
    if (mode === 'A') {
      sustainContent = (
        <div className='relative flex flex-column justify-content-center overflow-hidden mt-2'>
          <div className='flex tw-justify-between gap-1'>
            <div
              className='tw-rounded flex align-items-center justify-content-center tw-text-sm'
              style={{
                width: '180px',
                background: '#ebebeb',
                height: '180px',
                color: '#cfcfcf',
              }}
            >
              Sub menu 1
            </div>
            <div
              className='tw-rounded flex align-items-center justify-content-center tw-text-sm'
              style={{
                width: '180px',
                background: '#ebebeb',
                height: '180px',
                color: '#cfcfcf',
              }}
            >
              Sub menu 2
            </div>
          </div>
          <div className='flex tw-justify-between gap-1 mt-2'>
            <div
              className='tw-rounded flex align-items-center justify-content-center tw-text-sm'
              style={{
                width: '180px',
                background: '#ebebeb',
                height: '180px',
                color: '#cfcfcf',
              }}
            >
              Sub menu 3
            </div>
            <div
              className='tw-rounded flex align-items-center justify-content-center tw-text-sm'
              style={{
                width: '180px',
                background: '#ebebeb',
                height: '180px',
                color: '#cfcfcf',
              }}
            >
              Sub menu 4
            </div>
          </div>
        </div>
      )
    } else if (mode === 'B') {
      sustainContent = (
        <div className='relative flex flex-column justify-content-center overflow-hidden mt-2'>
          <div className='flex tw-justify-between gap-2'>
            <div
              className='tw-rounded flex align-items-center justify-content-center tw-text-sm'
              style={{
                width: '115px',
                background: '#ebebeb',
                height: '200px',
                color: '#cfcfcf',
              }}
            >
              Sub menu 1
            </div>
            <div
              className='tw-rounded flex align-items-center justify-content-center tw-text-sm'
              style={{
                width: '115px',
                background: '#ebebeb',
                height: '200px',
                color: '#cfcfcf',
              }}
            >
              Sub menu 2
            </div>
            <div
              className='tw-rounded flex align-items-center justify-content-center tw-text-sm'
              style={{
                width: '115px',
                background: '#ebebeb',
                height: '200px',
                color: '#cfcfcf',
              }}
            >
              Sub menu 3
            </div>
          </div>
        </div>
      )
    } else {
      sustainContent = (
        <div
          className='relative flex flex-column justify-content-center overflow-hidden mt-2'
          style={{ width: '313px' }}
        >
          <div className='flex tw-justify-between gap-1'>
            <div
              className='tw-rounded flex align-items-center justify-content-center tw-text-sm'
              style={{
                width: '100%',
                background: '#ebebeb',
                height: '80px',
                color: '#cfcfcf',
              }}
            >
              Sub menu 1
            </div>
          </div>
          <div className='flex tw-justify-between gap-1 mt-2'>
            <div
              className='tw-rounded flex align-items-center justify-content-center tw-text-sm'
              style={{
                width: '100%',
                background: '#ebebeb',
                height: '80px',
                color: '#cfcfcf',
              }}
            >
              Sub menu 2
            </div>
          </div>
          <div className='flex tw-justify-between gap-1 mt-2'>
            <div
              className='tw-rounded flex align-items-center justify-content-center tw-text-sm'
              style={{
                width: '100%',
                background: '#ebebeb',
                height: '80px',
                color: '#cfcfcf',
              }}
            >
              Sub menu 3
            </div>
          </div>
        </div>
      )
    }

    return <div className='flex flex-column gap-2'>{sustainContent}</div>
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
      {isSubMenu ? (
        <>
          <div className='flex w-full tw-justify-between align-items-center px-3 mb-2'>
            <ArrowBackIcon />
            <h6 className='text-astronaut font-bold mb-0 mt-0'>{mainMenu}</h6>
            <div></div>
          </div>
          <div
            className='flex w-full surface-300 flex flex-column align-items-center justify-content-center overflow-hidden'
            style={{
              height: '211px',
            }}
          >
            {!file ? (
              <>
                <span>Artwork Size</span>
                <span>400 x 225 px</span>
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
            <h4 className='text-astronaut font-bold mb-0 mt-0'>{menuValue}</h4>
            <small className='font-medium'>{introduceValue}</small>
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
        <>
          <h4 className='text-astronaut font-bold mb-0'>{menuValue}</h4>
          <small className='font-medium'>{introduceValue}</small>
          {renderContentSection(type)}
        </>
      )}
    </div>
  )
}

export default PreviewContent
