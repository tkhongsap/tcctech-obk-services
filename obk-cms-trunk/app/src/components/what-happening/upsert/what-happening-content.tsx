import { useFormController } from '@components/forms/components/form-controller'
import ImageButtonField from '@components/forms/components/image-button-field'
import TextField from '@components/forms/components/text-field'
import { getFormErrorMessage } from '@components/forms/utils/form-error-message'
import { KeyValue } from '@src/types/key-value'
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from 'primereact/autocomplete'
import { Image } from 'primereact/image'
import { TabMenu } from 'primereact/tabmenu'
import { classNames } from 'primereact/utils'
import React, { Dispatch, SetStateAction, useState, useRef } from 'react' // Import useRef
import { Controller } from 'react-hook-form'
import CustomEditor from '@components/input/customEditor'
import RichTextField from '@components/forms/components/rich-text-field'

type Props = {
  tags: KeyValue[]
  langItems: Lang[]
  activeLang: Lang
  setActiveLang: Dispatch<SetStateAction<Lang>>
  triggerErrorState: () => void
}

const WhatHappeningContent = (props: Props) => {
  const { tags, langItems, activeLang, setActiveLang, triggerErrorState } =
    props
  const [filteredTags, setFilteredTags] = useState<string[]>([])

  const thumbnailImageRef = useRef<HTMLInputElement>(null)
  const headImageRef = useRef<HTMLInputElement>(null)

  const searchTags = (event: AutoCompleteCompleteEvent) => {
    let _filteredTags: KeyValue[] = []

    if (!event.query.trim().length) {
      _filteredTags = [...tags]
    } else {
      _filteredTags = tags.filter((tag) => {
        return tag.name.toLowerCase().startsWith(event.query.toLowerCase())
      })
    }

    _filteredTags.unshift({ name: event.query, value: event.query })

    setFilteredTags(_filteredTags.map((x) => x.name))
  }

  const {
    watch,
    control,
    setValue,
    formState: { errors },
  } = useFormController()

  const watchThumbnail: string | null = watch('thumbnailImage')
  const watchHeadImage: string | null = watch('headImage')
  const [thumbnailImage, setThumbnailImage] = useState<
    string | ArrayBuffer | null
  >(watchThumbnail)
  const [headImage, setHeadImage] = useState<string | ArrayBuffer | null>(
    watchHeadImage
  )

  const renderRichHeader = () => {
    return (
      <span className='ql-formats'>
        <span className='ql-formats'>
          <select className='ql-size'></select>
          <select className='ql-font'></select>
        </span>
        <span className='ql-formats'>
          <button className='ql-bold' aria-label='Bold'></button>
          <button className='ql-italic' aria-label='Italic'></button>
          <button className='ql-underline' aria-label='Underline'></button>
        </span>
        <span className='ql-formats'>
          <button className='ql-list' value='ordered'></button>
          <button className='ql-list' value='bullet'></button>
          <button className='ql-indent' value='-1'></button>
          <button className='ql-indent' value='+1'></button>
        </span>
        <span className='ql-formats'>
          <select className='ql-color'></select>
          <select className='ql-background'></select>
        </span>
        <span className='ql-formats'>
          <button className='ql-direction' value='rtl'></button>
          <select className='ql-align'></select>
        </span>
      </span>
    )
  }
  const RichHeader = renderRichHeader()

  return (
    <div className='card mb-5'>
      <div className='p-2'>
        <span className='flex text-xl font-bold mb-5 text-primary-800'>
          Content
        </span>
      </div>
      <TabMenu
        model={langItems}
        activeIndex={langItems.findIndex((x) => x.code === activeLang.code)}
        onTabChange={(e) => setActiveLang(langItems[e.index])}
      />

      {activeLang &&
        langItems.map((lang, langIndex) => (
          <React.Fragment key={langIndex}>
            <div hidden={activeLang.code !== lang.code}>
              <div className='flex flex-column gap-5 p-5 lg:p-0 my-5'>
                <div>
                  <span className='flex text-xl font-bold text-primary-800 mt-5'>
                    Thumbnail Image
                  </span>
                  <small className='text-primary-800'>
                    Thumbnail image Allow file: jpg, jpeg, png Maximum 5MB
                    (Recommend image ratio 1:1) (Min 180x180 px, Max 540x540 px)
                  </small>
                  {thumbnailImage && (
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
                          alt=''
                          src={decodeURIComponent(thumbnailImage.toString())}
                          width={'426'}
                          style={{
                            objectPosition: 'center',
                            objectFit: 'none',
                          }}
                          // height={'360'}
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
                            setValue('thumbnailImage', undefined)
                            setThumbnailImage(null)
                            if (thumbnailImageRef.current) {
                              thumbnailImageRef.current.value = ''
                            }
                          }}
                        >
                          <i className='pi pi-times m-auto text-primary-blue'></i>
                        </div>
                      </div>
                    </div>
                  )}
                  <ImageButtonField
                    title='Upload thumbnail image'
                    name='thumbnailImage'
                    mode='single'
                    outputType='base64'
                    rules={{ required: 'Cover image is required' }}
                    onChange={setThumbnailImage}
                    acceptTypes='image/png, image/jpg, image/jpeg'
                    inputRef={thumbnailImageRef}
                  />
                </div>
              </div>
              <div className='flex flex-column gap-5 p-5 lg:p-0 my-5'>
                <div>
                  <span className='flex text-xl font-bold text-primary-800 mt-5'>
                    Head Image
                  </span>
                  <small className='text-primary-800'>
                    Head image Allow file: jpg, jpeg, png Maximum 5MB (Recommend
                    image ratio 16:9) (Min 800x450 px, Max 1600x900 px)
                  </small>
                  {headImage && (
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
                          alt=''
                          src={decodeURIComponent(headImage.toString())}
                          width={'426'}
                          style={{
                            objectPosition: 'center',
                            objectFit: 'none',
                          }}
                          // height={'360'}
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
                            setValue('headImage', undefined)
                            setHeadImage(null)
                            if (headImageRef.current) {
                              headImageRef.current.value = ''
                            }
                          }}
                        >
                          <i className='pi pi-times m-auto text-primary-blue'></i>
                        </div>
                      </div>
                    </div>
                  )}
                  <ImageButtonField
                    title='Upload head image'
                    name='headImage'
                    mode='single'
                    outputType='base64'
                    rules={{ required: 'Head image is required' }}
                    onChange={setHeadImage}
                    acceptTypes='image/png, image/jpg, image/jpeg'
                    inputRef={headImageRef}
                  />
                </div>
              </div>
              <div className='flex flex-column gap-1 w-full'>
                <small className='text-primary-800'>
                  Title ({lang.label}) {lang.code === 'en' && <span>*</span>}
                </small>
                <TextField
                  label=''
                  name={`content.${lang.code}.title`}
                  rules={
                    lang.code === 'en'
                      ? { required: 'Title is required' }
                      : { required: undefined }
                  }
                  showRequiredLabel={false}
                  onChange={triggerErrorState}
                />
              </div>
              <div className='flex flex-column gap-1 w-full mt-5'>
                <small className='text-primary-800 mb-1'>
                  Description ({lang.label}){' '}
                  {lang.code === 'en' && <span>*</span>}
                </small>
                <Controller
                  name={`content.${lang.code}.description`}
                  control={control}
                  rules={
                    lang.code === 'en'
                      ? { required: 'Description is required' }
                      : { required: undefined }
                  }
                  render={({
                    field: { name, onChange, value },
                    fieldState,
                  }) => (
                    <>
                      <CustomEditor
                        data={value}
                        onChange={(e: any) => {
                          onChange(e)
                          triggerErrorState()
                        }}
                        error={fieldState.invalid}
                      />
                      {getFormErrorMessage(name, errors)}
                    </>
                  )}
                />
              </div>
              <div className='flex flex-column gap-1 w-full mt-5'>
                <small className='text-primary-800 mb-1'>
                  Text Image ({lang.label}){' '}
                </small>
                <RichTextField
                  headerTemplate={RichHeader}
                  label=''
                  name={`content.${lang.code}.textOverlay`}
                  showRequiredLabel={false}
                  onChange={triggerErrorState}
                />
              </div>
              <div className='flex flex-column gap-1 w-full mt-5'>
                <div className='flex flex-column gap-2 w-full'>
                  {/* <span className='flex text-xl font-bold text-primary-800'>
                    Notification Tag
                  </span> */}
                  <small className='text-primary-800'>
                    Tag (English) <span>*</span>
                  </small>
                  <Controller
                    name={`tags`}
                    control={control}
                    rules={{ required: 'Notification Tag is required.' }}
                    render={({ field, fieldState }) => (
                      <>
                        <AutoComplete
                          className={classNames('w-full', {
                            'p-invalid': fieldState.error,
                          })}
                          multiple
                          value={field.value}
                          suggestions={filteredTags}
                          completeMethod={searchTags}
                          onChange={(e) => {
                            field.onChange(e.value)
                            triggerErrorState()
                          }}
                        />
                        {getFormErrorMessage(field.name, errors)}
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
    </div>
  )
}

export default WhatHappeningContent
