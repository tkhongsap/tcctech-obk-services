import ImageButtonField from '@components/forms/components/image-button-field'
import TextField from '@components/forms/components/text-field'
import BlockItem from '@components/notifications/components/block-item'
import { NotificationMessageBlock } from '@components/notifications/types/notification'
import { Button } from 'primereact/button'
import { DropdownChangeEvent } from 'primereact/dropdown'
import { TabMenu } from 'primereact/tabmenu'
import React, {
  Dispatch,
  Fragment,
  MouseEventHandler,
  SetStateAction,
  useState,
} from 'react'
import MessageImageBlock from './message-blocks/message-image-block'
import EditorField from '@components/forms/components/editor-field'
import { useFormController } from '@components/forms/components/form-controller'
import { Controller, useFieldArray } from 'react-hook-form'
import { Image } from 'primereact/image'
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from 'primereact/autocomplete'
import { KeyValue } from '@src/types/key-value'
import { classNames } from 'primereact/utils'
import { Message } from 'primereact/message'
import { getFormErrorMessage } from '@components/forms/utils/form-error-message'

type Props = {
  langItems: Lang[]
  activeLang: Lang
  tags: KeyValue[]
  setActiveLang: Dispatch<SetStateAction<Lang>>
  onBackClick?: MouseEventHandler<HTMLButtonElement>
  onNextClick?: MouseEventHandler<HTMLButtonElement>
  addBlockVisible: boolean
  tagsVisible?: boolean
  requiredTitleAndMessage?: boolean
}

export default function MessageStep(props: Props) {
  const {
    langItems,
    tags,
    activeLang,
    setActiveLang,
    tagsVisible = true,
    onBackClick,
    requiredTitleAndMessage,
  } = props

  const [filteredTags, setFilteredTags] = useState<string[]>([])

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
    trigger,
    formState: { errors },
  } = useFormController()
  const { append, remove, update } = useFieldArray({
    name: 'data',
    control,
  })

  const watchThumbnail: string | null = watch('thumbnail')
  const [thumbnail, setThumbnail] = useState<string | ArrayBuffer | null>(
    watchThumbnail
  )

  const watchData: NotificationMessageBlock[] = watch('data')

  const onBlockTypeChange = (e: DropdownChangeEvent, index: number) => {
    update(index, { type: e.target.value })
  }

  const [errorState, setErrorState] = useState<number>(0)
  const [isSubmited, setIsSubmited] = useState<boolean>(false)

  const triggerErrorState = () => {
    console.log(isSubmited)
    if (isSubmited) {
      trigger().then((res) => {
        if (res) {
          setErrorState(0)
        } else {
          setErrorState(() => errorState + 1)
        }
      })
    }
  }

  return (
    <div className='mb-5'>
      <span className='flex text-xl font-bold pl-5 lg:pl-2 mb-5 text-primary-800'>
        Message
      </span>
      {errorState > 0 && (
        <Message
          severity='error'
          content={
            <>
              <span className='font-bold'>Missing Fields: </span>{' '}
              {Object.keys(errors).length} of the required fields are empty or
              contain invalid data; please check your input.
            </>
          }
        />
      )}

      <TabMenu
        model={langItems}
        activeIndex={langItems.findIndex((x) => x.code === activeLang.code)}
        onTabChange={(e) => setActiveLang(langItems[e.index])}
      />
      <div>
        {activeLang &&
          langItems.map((lang, langIndex) => (
            <Fragment key={langIndex}>
              <div hidden={activeLang.code !== lang.code}>
                <div className='flex flex-column gap-5 p-5 lg:p-0 my-5'>
                  <div>
                    <span className='flex text-xl font-bold text-primary-800'>
                      Hero Image
                    </span>
                    <small className='text-primary-800'>
                      Hero image (Recommend Ratio 16:9) Supported image formats:
                      PNG and JPEG.
                    </small>
                    {thumbnail && (
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
                            src={decodeURIComponent(thumbnail.toString())}
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
                              setValue('thumbnail', undefined)
                              setThumbnail(null)
                            }}
                          >
                            <i className='pi pi-times m-auto text-primary-blue'></i>
                          </div>
                        </div>
                      </div>
                    )}
                    <ImageButtonField
                      mode='single'
                      outputType='base64'
                      name='thumbnail'
                      onChange={setThumbnail}
                      acceptTypes='image/png, image/jpg, image/jpeg'
                    />
                  </div>

                  <div className='flex flex-column'>
                    <span className='flex text-xl font-bold text-primary-800'>
                      Title
                    </span>
                    <div className='flex flex-column gap-1 w-full'>
                      <small className='text-primary-800'>
                        Title ({lang.label}){' '}
                        {lang.code === 'en' && requiredTitleAndMessage && (
                          <span>*</span>
                        )}
                      </small>
                      <TextField
                        name={`title.${lang.code}`}
                        rules={
                          lang.code === 'en' && requiredTitleAndMessage
                            ? { required: 'Title required' }
                            : { required: undefined }
                        }
                        onChange={triggerErrorState}
                        showRequiredLabel={false}
                      />
                    </div>
                  </div>
                </div>

                <div className=''>
                  <BlockItem
                    value={{ type: 'text', data: { en: '' } }}
                    index={-1}
                    displayIndex={1}
                  >
                    <small className='text-primary-800'>
                      Message ({lang.label}){' '}
                      {lang.code === 'en' && requiredTitleAndMessage && (
                        <span>*</span>
                      )}
                    </small>
                    <EditorField
                      name={`sub_title.${lang.code}`}
                      style={{ height: '320px' }}
                      rules={
                        lang.code === 'en' && requiredTitleAndMessage
                          ? { required: 'message required' }
                          : { required: undefined }
                      }
                      onTextChange={triggerErrorState}
                      showRequiredLabel={false}
                    />
                  </BlockItem>
                </div>

                <div id='blocktype'>
                  <div className='flex flex-column gap-3 p-5 lg:p-0 my-3'>
                    {watchData &&
                      watchData.map((block, blockIndex) => {
                        const getBlockChild = () => {
                          switch (block.type) {
                            case 'hyperlink':
                              return (
                                <>
                                  <div className='flex flex-column gap-1 w-full'>
                                    <small className='text-primary-800'>
                                      Message
                                    </small>
                                    <TextField
                                      id='id'
                                      name={`data.${blockIndex}.data.message.${lang.code}`}
                                      // rules={
                                      //   lang.code !== 'en'
                                      //     ? { required: undefined }
                                      //     : { required: 'Message is required.' }
                                      // }
                                      onChange={triggerErrorState}
                                      showRequiredLabel={false}
                                    />
                                  </div>
                                  <div className='flex flex-column gap-1 w-full'>
                                    <small className='text-primary-800'>
                                      Link URL
                                    </small>
                                    <TextField
                                      id='id'
                                      name={`data.${blockIndex}.data.url`}
                                      // rules={
                                      //   lang.code !== 'en'
                                      //     ? { required: undefined }
                                      //     : {
                                      //         required: 'Link URL is required.',
                                      //       }
                                      // }
                                      onChange={triggerErrorState}
                                      showRequiredLabel={false}
                                    />
                                  </div>
                                </>
                              )
                            case 'image':
                              return (
                                <MessageImageBlock
                                  block={block}
                                  onChange={(e) => {
                                    const data = watchData[blockIndex]
                                    data.data = e.data
                                    update(blockIndex, data)
                                    triggerErrorState()
                                  }}
                                />
                              )
                            case 'text':
                            default:
                              return (
                                <>
                                  <small className='text-primary-800'>
                                    Message ({lang.label})
                                  </small>
                                  <EditorField
                                    name={`data.${blockIndex}.data.${lang.code}`}
                                    style={{ height: '320px' }}
                                    // rules={
                                    //   lang.code !== 'en'
                                    //     ? { required: undefined }
                                    //     : { required: 'Message is required' }
                                    // }
                                    onChange={triggerErrorState}
                                    showRequiredLabel={false}
                                  />
                                </>
                              )
                          }
                        }
                        return (
                          <BlockItem
                            key={blockIndex}
                            value={watchData[blockIndex]}
                            index={blockIndex}
                            displayIndex={blockIndex + 2}
                            onChange={(e) => onBlockTypeChange(e, blockIndex)}
                            onRemove={() => remove(blockIndex)}
                          >
                            {getBlockChild()}
                          </BlockItem>
                        )
                      })}
                  </div>
                </div>
                <div className='flex my-4'>
                  <Button
                    type='button'
                    className='px-5 w-full'
                    label='+ Add a Block'
                    outlined
                    onClick={() => {
                      append({
                        type: 'text',
                        data: { en: '', th: '', zh: '' },
                      })
                    }}
                    visible={props.addBlockVisible}
                  />
                </div>
                {tagsVisible && (
                  <div className='flex flex-column gap-2 w-full'>
                    <span className='flex text-xl font-bold text-primary-800'>
                      Notification Tag
                    </span>
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
                )}
                <div className='flex justify-content-end w-full gap-3 px-5 mt-5'>
                  <Button
                    type='button'
                    className='px-5'
                    label='Back'
                    outlined
                    onClick={(e) => {
                      onBackClick && onBackClick(e)
                    }}
                  />
                  <Button
                    type='submit'
                    className='px-5 bg-primary-blue'
                    label='Next'
                    onClick={() => {
                      trigger().then((res) => {
                        if (!res) {
                          setErrorState(() => errorState + 1)
                          setIsSubmited(true)
                        }
                      })
                    }}
                  />
                </div>
              </div>
            </Fragment>
          ))}
      </div>
    </div>
  )
}
