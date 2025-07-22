/* eslint-disable @next/next/no-img-element */
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import { Tab, TabList, Tabs } from '@chakra-ui/react'
import {
  acceptImageFileTypes,
  ArtCTypeFormData,
  IArtCTranslation,
  IArtCTypeForm,
  IArtCTypeItem,
  IArtCultureContentUpload,
  IInputErrors,
  IPlaylist,
  IPlaylistTranslation,
  IProgram,
  IProgramTranslation,
  OptionItem,
} from '@src/services/art-and-culture/model'
import {
  isObjectDeepEqual,
  mappingValidateErrorMessage,
} from '@src/utils/art-c'
import { AxiosResponse } from 'axios'
import { useRouter } from 'next/router'
import { Button } from 'primereact/button'
import { Panel } from 'primereact/panel'
import React, { useEffect, useRef, useState } from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { InputText } from 'primereact/inputtext'
import { Message } from 'primereact/message'
import { ProgressBar } from 'primereact/progressbar'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'
import ImageButtonField from '@components/forms/components/image-button-field'
import { Chips } from 'primereact/chips'
import { InputNumber } from 'primereact/inputnumber'
import dayjs from 'dayjs'
import { InputSwitch } from 'primereact/inputswitch'
import { MultiSelect } from 'primereact/multiselect'
import { InputTextarea } from 'primereact/inputtextarea'
import Image from 'next/image'
import Link from 'next/link'
import { last } from 'lodash'
import { convertToBase64 } from '@src/utils/image'
import { artCGeneralServices } from '@src/services/art-and-culture/art-c-general-service'
import { artCServices } from '@src/services/art-and-culture/art-c-services'
import { artCPlaylistServices } from '@src/services/art-and-culture/art-c-playlist-services'
import { artCProgramServices } from '@src/services/art-and-culture/art-c-program-service'
import CustomEditor from '@components/input/customEditor'

interface IArtCUpsert {
  type: string
  artCTypeItem?: IArtCTypeItem
}

interface IArtCFormTransValue {
  th: IArtCTypeForm
  en: IArtCTypeForm
  zh: IArtCTypeForm
}

const ArtCUpsert = ({ type, artCTypeItem }: IArtCUpsert) => {
  const router = useRouter()
  const { locale } = router.query

  const formRef = useRef<FormControllerRef<ArtCTypeFormData>>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [formValues, setFormValues] = useState<IArtCTypeForm>(
    new ArtCTypeFormData()
  )
  const [formTransValues, setFormTransValues] = useState<IArtCFormTransValue>({
    th: new ArtCTypeFormData(),
    en: new ArtCTypeFormData(),
    zh: new ArtCTypeFormData(),
  })
  const [formLocale, setFormLocale] = useState<string>('en')

  const [playlistOptions, setPlaylistOptions] = useState<
    OptionItem[] | undefined
  >()

  const [uploadingThumbnailFile, setUploadingThumbnailFile] =
    useState<boolean>(false)
  const [invalidThumbnailFile, setInvalidThumbnailFile] = useState<{
    title: string
    message: string
  } | null>(null)

  const [uploadingBannerFile, setUploadingBannerFile] = useState<boolean>(false)
  const [invalidBannerFile, setInvalidBannerFile] = useState<{
    title: string
    message: string
  } | null>(null)

  const initFormErrors: IInputErrors = {
    title: { status: false, message: '' },
    shortDesc: { status: false, message: '' },
    desc: { status: false, message: '' },
    thumbnail: { status: false, message: '' },
    banner: { status: false, message: '' },
    categorySectionTitle: { status: false, message: '' },
    playlistSectionTitle: { status: false, message: '' },
    programSectionTitle: { status: false, message: '' },
    openingHours: { status: false, message: '' },
    locations: { status: false, message: '' },
    enterFee: { status: false, message: '' },
    externalLink: { status: false, message: '' },
  }

  const [errorForm, setErrorForm] = useState(initFormErrors)
  const [requestError, setRequestError] = useState({
    status: false,
    message: '',
  })

  const initialFormValues = (item: IArtCTypeItem | undefined) => {
    if (item && item.artCTranslation && item.artCTranslation.length > 0) {
      const value = { ...formTransValues }

      item.artCTranslation.forEach((itemTrans: IArtCTranslation) => {
        if (itemTrans.locale === 'en') {
          value['en'] = {
            displayList: item.displayList || false,
            displayFreeLabel: item.displayFreeLabel || false,
            playlist:
              item.playlist && item.playlist.length > 0
                ? item.playlist.map((playlist) => `${playlist}`)
                : [],
            relateProgramIds: item.relateProgramIds || [],
            relateProductIds: item.relateProductIds || [],
            title: itemTrans.title,
            shortDesc: itemTrans.shortDesc || '',
            desc: itemTrans.desc,
            thumbnail: itemTrans.thumbnail,
            banner: itemTrans.banner || '',
            categorySectionTitle: itemTrans.categorySectionTitle || '',
            playlistSectionTitle: itemTrans.playlistSectionTitle || '',
            programSectionTitle: itemTrans.programSectionTitle || '',
            openingHours: itemTrans.openingHours || [],
            locations: itemTrans.locations || [],
            enterFee: itemTrans.enterFee || 0,
            externalLink: itemTrans.externalLink || '',
            tags: itemTrans.tags || [],
          }
        }

        if (itemTrans.locale === 'th') {
          value['th'] = {
            displayList: item.displayList || false,
            displayFreeLabel: item.displayFreeLabel || false,
            playlist:
              item.playlist && item.playlist.length > 0
                ? item.playlist.map((playlist) => `${playlist}`)
                : [],
            relateProgramIds: item.relateProgramIds || [],
            relateProductIds: item.relateProductIds || [],
            title: itemTrans.title,
            shortDesc: itemTrans.shortDesc || '',
            desc: itemTrans.desc,
            thumbnail: itemTrans.thumbnail,
            banner: itemTrans.banner || '',
            categorySectionTitle: itemTrans.categorySectionTitle || '',
            playlistSectionTitle: itemTrans.playlistSectionTitle || '',
            programSectionTitle: itemTrans.programSectionTitle || '',
            openingHours: itemTrans.openingHours || [],
            locations: itemTrans.locations || [],
            enterFee: itemTrans.enterFee || 0,
            externalLink: itemTrans.externalLink || '',
            tags: itemTrans.tags || [],
          }
        }

        if (itemTrans.locale === 'zh') {
          value['zh'] = {
            displayList: item.displayList || false,
            displayFreeLabel: item.displayFreeLabel || false,
            playlist:
              item.playlist && item.playlist.length > 0
                ? item.playlist.map((playlist) => `${playlist}`)
                : [],
            relateProgramIds: item.relateProgramIds || [],
            relateProductIds: item.relateProductIds || [],
            title: itemTrans.title,
            shortDesc: itemTrans.shortDesc || '',
            desc: itemTrans.desc,
            thumbnail: itemTrans.thumbnail,
            banner: itemTrans.banner || '',
            categorySectionTitle: itemTrans.categorySectionTitle || '',
            playlistSectionTitle: itemTrans.playlistSectionTitle || '',
            programSectionTitle: itemTrans.programSectionTitle || '',
            openingHours: itemTrans.openingHours || [],
            locations: itemTrans.locations || [],
            enterFee: itemTrans.enterFee || 0,
            externalLink: itemTrans.externalLink || '',
            tags: itemTrans.tags || [],
          }
        }
      })

      setFormTransValues(value)
      setFormValues({
        ...value[formLocale as keyof IArtCFormTransValue],
        displayList: item.displayList || false,
        displayFreeLabel: item.displayFreeLabel || false,
        playlist:
          item.playlist && item.playlist.length > 0
            ? item.playlist.map((playlist) => `${playlist}`)
            : [],
        relateProgramIds: item.relateProgramIds || [],
        relateProductIds: item.relateProductIds || [],
      })
    }
  }

  const handleFormLocaleChange = (locale: string) => {
    setErrorForm(initFormErrors)
    setRequestError({ status: false, message: '' })

    // save current form values to formTransValues (deep copy to avoid mutation)
    const tempFormTransValues = JSON.parse(JSON.stringify(formTransValues))
    tempFormTransValues[formLocale as keyof IArtCFormTransValue] = formValues

    Object.keys(tempFormTransValues).forEach((key) => {
      if (key === formLocale) return

      tempFormTransValues[key as keyof IArtCFormTransValue] = {
        ...tempFormTransValues[key as keyof IArtCFormTransValue],
        displayList: formValues.displayList || false,
        displayFreeLabel: formValues.displayFreeLabel || false,
        playlist:
          formValues.playlist && formValues.playlist.length > 0
            ? formValues.playlist.map((playlist) => `${playlist}`)
            : [],
        relateProgramIds: formValues.relateProgramIds || [],
        relateProductIds: formValues.relateProductIds || [],
      }
    })

    // Use freshly updated tempFormTransValues to avoid stale data
    setFormLocale(locale)
    setFormTransValues(tempFormTransValues)

    const selectedLocaleValues =
      tempFormTransValues[locale as keyof IArtCFormTransValue]
    setFormValues({
      ...selectedLocaleValues,
    })
  }

  const onEditContent = (editorState: any) => {
    if (formValues) {
      setFormValues({
        ...formValues,
        desc: editorState ? editorState : '',
      })

      setErrorForm({
        ...errorForm,
        desc: { status: false, message: '' },
      })
    }
  }

  const onRemoveFile = (type: string) => {
    const fileValue = type === 'thumbnail' ? { thumbnail: '' } : { banner: '' }
    setFormValues({ ...formValues, ...fileValue })

    if (type === 'thumbnail') {
      setErrorForm({
        ...errorForm,
        thumbnail: {
          status: false,
          message: '',
        },
      })
    }

    if (type === 'banner') {
      setErrorForm({
        ...errorForm,
        banner: {
          status: false,
          message: '',
        },
      })
    }
  }

  const onFileChange = async (type: string, file: File) => {
    setInvalidThumbnailFile(null)
    setInvalidBannerFile(null)

    if (type === 'thumbnail') {
      setErrorForm({
        ...errorForm,
        thumbnail: {
          status: false,
          message: '',
        },
      })
    }

    if (type === 'banner') {
      setErrorForm({
        ...errorForm,
        banner: {
          status: false,
          message: '',
        },
      })
    }

    if (type === 'thumbnail') {
      setUploadingThumbnailFile(true)
    } else {
      setUploadingBannerFile(true)
    }

    const size = file.size / 1024 / 1024
    if (size > 2) {
      if (type === 'thumbnail') {
        setInvalidThumbnailFile({
          title: 'File size is too large',
          message: 'Please upload a file with size less than 2MB',
        })
      } else {
        setInvalidBannerFile({
          title: 'File size is too large',
          message: 'Please upload a file with size less than 2MB',
        })
      }

      setUploadingThumbnailFile(false)
      setUploadingBannerFile(false)

      return
    }

    try {
      const base64Data = last(
        (await convertToBase64(file))?.toString().split('base64,')
      )!
      const uploadData: IArtCultureContentUpload = {
        fileName: file.name,
        fileContentBase64: base64Data,
        contentType: file.type,
      }

      const res = await artCGeneralServices.uploadImage(uploadData)
      const { status, data } = res

      if (data && status === 200) {
        const fileValue =
          type === 'thumbnail'
            ? { thumbnail: data.imageURL }
            : { banner: data.imageURL }
        setFormValues({ ...formValues, ...fileValue })
      } else {
        throw new Error('Something went wrong while uploading the file')
      }
    } catch (error) {
      if (type === 'thumbnail') {
        setErrorForm({
          ...errorForm,
          thumbnail: {
            status: true,
            message: 'Something went wrong while uploading the file',
          },
        })
      } else {
        setErrorForm({
          ...errorForm,
          banner: {
            status: true,
            message: 'Something went wrong while uploading the file',
          },
        })
      }
    }

    setUploadingThumbnailFile(false)
    setUploadingBannerFile(false)
  }

  let validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    shortDesc: Yup.string().max(
      255,
      'Short description should be less than 255 characters'
    ),
    desc: Yup.string().required('Content is required'),
    thumbnail: Yup.string().required('Thumbnail is required'),
    categorySectionTitle: Yup.string().max(
      255,
      'Category section title should be less than 255 characters'
    ),
    playlistSectionTitle: Yup.string().max(
      255,
      'Playlist section title should be less than 255 characters'
    ),
    programSectionTitle: Yup.string().max(
      255,
      'Program section title should be less than 255 characters'
    ),
    enterFee: Yup.number()
      .required('Enter fee is required')
      .moreThan(-1, 'Enter fee must greater than 0')
      .integer('Enter fee must be a number'),
    externalLink: Yup.string().url('External link must be a valid URL'),
  })
  const onSubmit = async () => {
    if (!formValues) return

    const prepareFormValues = formTransValues
    const formValuesItem: string[] = []
    let errors = initFormErrors
    const validationResult = await validationSchema
      .validate(formValues, { abortEarly: false })
      .catch(async (err) => {
        errors = mappingValidateErrorMessage(errors, err.inner)
        return false
      })

    if (!validationResult) {
      setRequestError({ status: false, message: '' })
      setErrorForm(errors)
      setIsLoading(false)
      return
    } else {
      formValuesItem.push(formLocale)
      prepareFormValues[formLocale as keyof IArtCFormTransValue] = formValues
    }

    let isOtherLocaleValid = true
    for (const key in formTransValues) {
      if (isOtherLocaleValid) {
        const checkFormValues = {
          title: formTransValues[key as keyof IArtCFormTransValue].title,
          shortDesc:
            formTransValues[key as keyof IArtCFormTransValue].shortDesc || '',
          desc: formTransValues[key as keyof IArtCFormTransValue].desc,
          thumbnail:
            formTransValues[key as keyof IArtCFormTransValue].thumbnail,
          banner:
            formTransValues[key as keyof IArtCFormTransValue].banner || '',
          categorySectionTitle:
            formTransValues[key as keyof IArtCFormTransValue]
              .categorySectionTitle || '',
          playlistSectionTitle:
            formTransValues[key as keyof IArtCFormTransValue]
              .playlistSectionTitle || '',
          programSectionTitle:
            formTransValues[key as keyof IArtCFormTransValue]
              .programSectionTitle || '',
          openingHours:
            formTransValues[key as keyof IArtCFormTransValue].openingHours ||
            [],
          locations:
            formTransValues[key as keyof IArtCFormTransValue].locations || [],
          enterFee:
            formTransValues[key as keyof IArtCFormTransValue].enterFee || 0,
          externalLink:
            formTransValues[key as keyof IArtCFormTransValue].externalLink ||
            '',
          tags: formTransValues[key as keyof IArtCFormTransValue].tags || [],
        }

        const defaultValue = new ArtCTypeFormData()

        const initValues = {
          title: defaultValue.title,
          shortDesc: defaultValue.shortDesc || '',
          desc: defaultValue.desc,
          thumbnail: defaultValue.thumbnail,
          banner: defaultValue.banner || '',
          categorySectionTitle: defaultValue.categorySectionTitle || '',
          playlistSectionTitle: defaultValue.playlistSectionTitle || '',
          programSectionTitle: defaultValue.programSectionTitle || '',
          openingHours: defaultValue.openingHours || [],
          locations: defaultValue.locations || [],
          enterFee: defaultValue.enterFee || 0,
          externalLink: defaultValue.externalLink || '',
          tags: defaultValue.tags || [],
        }

        if (!isObjectDeepEqual(checkFormValues, initValues)) {
          const result = await validationSchema
            .validate(checkFormValues, { abortEarly: false })
            .catch(async (err) => {
              errors = mappingValidateErrorMessage(errors, err.inner)
              return false
            })

          if (!result) {
            setRequestError({ status: false, message: '' })
            setErrorForm(errors)
            setIsLoading(false)
            handleFormLocaleChange(key)
            isOtherLocaleValid = false
          } else {
            formValuesItem.push(key)
            prepareFormValues[key as keyof IArtCFormTransValue].displayList =
              formValues.displayList
            prepareFormValues[
              key as keyof IArtCFormTransValue
            ].displayFreeLabel = formValues.displayFreeLabel
            prepareFormValues[key as keyof IArtCFormTransValue].playlist =
              formValues.playlist
            prepareFormValues[
              key as keyof IArtCFormTransValue
            ].relateProgramIds = formValues.relateProgramIds
            prepareFormValues[
              key as keyof IArtCFormTransValue
            ].relateProductIds = formValues.relateProductIds
          }
        }
      }
    }

    if (!isOtherLocaleValid) {
      return
    }

    setIsLoading(true)

    let res = { id: artCTypeItem ? artCTypeItem.id : 0, status: false }
    for (const key in prepareFormValues) {
      if (formValuesItem.includes(key)) {
        const tempAnswer = document.createElement('div')
        tempAnswer.innerHTML =
          prepareFormValues[key as keyof IArtCFormTransValue].desc
        tempAnswer.querySelectorAll('img').forEach((img) => {
          img.removeAttribute('style')
          img.removeAttribute('width')
          img.removeAttribute('height')
        })

        const saveValue = {
          ...prepareFormValues[key as keyof IArtCFormTransValue],
          desc: tempAnswer.outerHTML,
        }

        res = await saveFormValues(
          res.id === 0 ? 0 : res.id,
          `${key}`,
          saveValue
        )
      }
    }

    if (res.status) {
      router.push(
        `/art-and-culture/art-c${
          type === 'create' ? '?status=createSuccess' : '?status=updateSuccess'
        }`
      )
    }

    setIsLoading(false)
  }

  const saveFormValues = async (
    id: number,
    saveLocale: string,
    values: IArtCTypeForm
  ): Promise<{ id: number; status: boolean }> => {
    try {
      let result: AxiosResponse | null = null

      if (type === 'create' && id === 0) {
        result = await artCServices.create(saveLocale, values)
      } else {
        result = await artCServices.edit(`${id}`, saveLocale, values)
      }

      if (!result) return { id: 0, status: false }

      if (result.status == 200) {
        const { id } = result.data.data
        return { id: id, status: true }
      } else {
        setRequestError({ status: true, message: result.data.message })
        return { id: 0, status: false }
      }
    } catch (error) {
      setRequestError({
        status: true,
        message: 'Something went wrong. Please try again later.',
      })
      return { id: 0, status: false }
    }
  }

  const deleteItem = async (id: number) => {
    if (
      confirm('Are you sure you want to delete this Art & Culture Category?')
    ) {
      setIsLoading(true)

      await artCServices
        .delete(`${id}`)
        .then(() => {
          router.push('/art-and-culture/art-c')
        })
        .catch((error) => {
          setRequestError({
            status: true,
            message: error.response.data.message,
          })
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }

  const onBack = () => router.push('/art-and-culture/art-c')
  const buttonActionTemplate = (
    <div className='flex gap-3 justify-content-center md:justify-content-start'>
      <Button
        disabled={isLoading}
        className='px-5 py-3 bg-primary-blue text-white'
        label='Publish'
        onClick={formRef.current?.handleSubmit(onSubmit)}
      />
      {artCTypeItem && !artCTypeItem.modifyStrict && type === 'update' && (
        <Button
          type='button'
          className='px-5 text-red-600 border-2 border-red-600'
          label='Delete this Art & Culture Category'
          severity='danger'
          outlined
          disabled={isLoading}
          onClick={() => deleteItem(artCTypeItem!.id)}
        />
      )}
      <Button
        type='button'
        disabled={isLoading}
        className='px-5 text-primary-blue'
        label='Close'
        text
        onClick={onBack}
      />
    </div>
  )

  const fetchPlaylist = async () => {
    setIsLoading(true)

    await artCPlaylistServices
      .getAll('all')
      .then((res) => {
        const { data } = res.data

        const options: OptionItem[] = []
        data.forEach((playlist: IPlaylist) => {
          let translation: IPlaylistTranslation | undefined
          for (let item of ['en', 'th', 'zh']) {
            translation = playlist.playlistTranslation.find(
              (tItem) => tItem.locale === item
            )
            if (translation) {
              break
            }
          }

          if (translation) {
            options.push({ label: translation.title, value: `${playlist.id}` })
          }
        })

        setPlaylistOptions(options)
      })
      .catch(() => {
        console.warn('Error while fetching playlist')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const [programs, setPrograms] = useState<IProgram[]>([])
  const [programOptions, setProgramOptions] = useState<OptionItem[]>([])
  const fetchPrograms = async () => {
    await artCProgramServices
      .getAll('all')
      .then((res) => {
        const { data } = res.data

        setPrograms(data)

        const options: OptionItem[] = []
        data.forEach((program: IProgram) => {
          let translation: IProgramTranslation | undefined
          for (let item of ['en', 'th', 'zh']) {
            translation = program.programTranslation.find(
              (tItem) => tItem.locale === item
            )
            if (translation) {
              break
            }
          }

          if (translation) {
            options.push({ label: translation.title, value: `${program.id}` })
          }
        })

        setProgramOptions(options)
      })
      .catch(() => {
        alert("Something went wrong, can't fetch page content.")
        router.replace('/')
      })
  }

  const handleDragRelateProgramOrder = (result: DropResult) => {
    if (!result || !result.destination) return
    const newList = Array.from(formValues.relateProgramIds)
    const [draggedItem] = newList.splice(result.source.index, 1)
    newList.splice(result.destination!.index, 0, draggedItem)

    setFormValues({ ...formValues, relateProgramIds: newList })
  }

  const [selectedRelatePrograms, setSelectedRelatePrograms] = useState<
    IProgram[]
  >([])
  const handleRelateItems = () => {
    if (programs.length === 0) {
      return
    }

    if (formValues.relateProgramIds && formValues.relateProgramIds.length > 0) {
      const relateProgramItems: IProgram[] = []
      formValues.relateProgramIds.forEach((id) => {
        const program = programs.find((item) => item.id === id)
        if (!program) return

        relateProgramItems.push(program)
      })

      setSelectedRelatePrograms(relateProgramItems)
    }
  }

  useEffect(() => {
    if (
      (formValues.relateProgramIds && formValues.relateProgramIds.length > 0) ||
      (formValues.relateProductIds && formValues.relateProductIds.length > 0)
    ) {
      handleRelateItems()
    }
  }, [formValues, programs])

  useEffect(() => {
    fetchPlaylist()
    fetchPrograms()
  }, [artCTypeItem, locale])

  useEffect(() => {
    setTimeout(() => {
      initialFormValues(artCTypeItem)
    }, 250)
  }, [playlistOptions])

  return (
    <>
      <div className='flex'>
        <div className='col-8'>
          <FormController
            ref={formRef}
            defualtValue={new ArtCTypeFormData()}
            onSubmit={onSubmit}
          >
            <Panel className='mb-5'>
              {formValues && (
                <div className='p-2'>
                  <div className='mb-5'>
                    <h4 className='text-astronaut font-bold'>Details</h4>
                    {type === 'update' && artCTypeItem && (
                      <small className='font-medium'>
                        Last update&nbsp;
                        <span className='font-bold'>
                          {dayjs(artCTypeItem.updatedAt).format(
                            'DD/MM/YYYY HH:mm'
                          )}
                          &nbsp;
                        </span>
                      </small>
                    )}
                  </div>

                  <div className='flex w-full'>
                    <div className='w-6'>
                      <div className='field grid'>
                        <div className='flex col-12 tw-items-center'>
                          <div className='text-primary-800 font-bold pr-2'>
                            Display Program in List Template
                          </div>
                          <InputSwitch
                            checked={formValues?.displayList}
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                displayList: e.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {type === 'update' &&
                      artCTypeItem &&
                      artCTypeItem.id === 2 &&
                      playlistOptions &&
                      formValues.playlist && (
                        <div className='w-6'>
                          <div className='text-primary-800 font-bold pb-2'>
                            Playlist
                          </div>
                          <div className='multi-select-display-all'>
                            <MultiSelect
                              display='chip'
                              value={formValues.playlist}
                              onChange={(e: any) => {
                                setFormValues({
                                  ...formValues,
                                  playlist: e.value,
                                })
                              }}
                              options={playlistOptions}
                              optionLabel='label'
                              filter
                              placeholder='Select playlist'
                              maxSelectedLabels={100}
                              className='w-full'
                            />
                          </div>
                        </div>
                      )}
                  </div>

                  <div className='relative my-5'>
                    <div className='relative tw-w-full'>
                      {(uploadingThumbnailFile || uploadingBannerFile) && (
                        <div
                          className='absolute w-full h-full'
                          style={{
                            zIndex: 50,
                            backgroundColor: 'rgba(255,255,255,0.5)',
                          }}
                        />
                      )}
                      <Tabs className='locale-tabs'>
                        <TabList className='tabs-list'>
                          <Tab
                            className={clsx([
                              'tab',
                              formLocale === 'en' && 'active',
                            ])}
                            onClick={() => handleFormLocaleChange('en')}
                          >
                            English
                          </Tab>
                          <Tab
                            className={clsx([
                              'tab',
                              formLocale === 'th' && 'active',
                            ])}
                            onClick={() => handleFormLocaleChange('th')}
                          >
                            Thai
                          </Tab>
                          <Tab
                            className={clsx([
                              'tab',
                              formLocale === 'zh' && 'active',
                            ])}
                            onClick={() => handleFormLocaleChange('zh')}
                          >
                            Chinese
                          </Tab>
                        </TabList>
                      </Tabs>
                    </div>
                  </div>

                  <div className='field grid'>
                    <div className='col-12'>
                      <div className='text-primary-800 font-bold pb-2'>
                        Title <span className='text-red-700'>*</span>
                      </div>
                      <InputText
                        key={`title-${formLocale}`}
                        className='w-full'
                        maxLength={255}
                        onChange={(e) => {
                          setFormValues({
                            ...formValues,
                            title: e.target.value || '',
                          })
                          setErrorForm({
                            ...errorForm,
                            title: { status: false, message: '' },
                          })
                        }}
                        value={formValues.title}
                      />
                      {errorForm.title.status && (
                        <div className='pt-2 text-red-700 text-sm'>
                          {errorForm.title.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='field grid'>
                    <div className='col-12'>
                      <div className='text-primary-800 font-bold pb-2'>
                        Short Description
                      </div>
                      <InputTextarea
                        key={`shortDesc-${formLocale}`}
                        className='w-full'
                        value={formValues.shortDesc}
                        maxLength={255}
                        onChange={(e: any) => {
                          setFormValues({
                            ...formValues,
                            shortDesc: e.target.value || '',
                          })
                          setErrorForm({
                            ...errorForm,
                            shortDesc: { status: false, message: '' },
                          })
                        }}
                        rows={3}
                      />
                      {errorForm.shortDesc.status && (
                        <div className='pt-2 text-red-700 text-sm'>
                          {errorForm.shortDesc.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='field grid pt-3'>
                    <div className='col-12'>
                      <div className='text-primary-800 font-bold pb-2'>
                        Content <span className='text-red-700'>*</span>
                      </div>
                      <CustomEditor
                        key={`desc-${formLocale}`}
                        onChange={onEditContent}
                        data={formValues.desc}
                      />
                      {errorForm.desc.status && (
                        <div className='pt-2 text-red-700 text-sm'>
                          {errorForm.desc.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='flex flex-column mt-5 gap-2'>
                    <div className='pb-2'>
                      <div className='text-primary-800 font-bold'>
                        Thumbnail image <span className='text-red-700'>*</span>
                      </div>
                      <small className='text-xs font-bold text-info'>
                        ( Recommend image size: Min 360x388px, Max 520x560)
                        (allow file type: jpg, jpeg, png)
                      </small>
                    </div>
                    {uploadingThumbnailFile ? (
                      <ProgressBar
                        mode='indeterminate'
                        style={{ height: '6px' }}
                      ></ProgressBar>
                    ) : formValues.thumbnail ? (
                      <Message
                        key={`thumbnail-${formLocale}`}
                        content={
                          <div className='w-full'>
                            <div className='w-full flex justify-content-between py-3'>
                              <span>{formValues.thumbnail}</span>
                              <i
                                className='pi pi-times cursor-pointer'
                                onClick={() => onRemoveFile('thumbnail')}
                              ></i>
                            </div>

                            <div
                              className='tw-rounded-lg overflow-hidden mb-2'
                              style={{ maxWidth: '200px', lineHeight: 0 }}
                            >
                              <img
                                src={formValues.thumbnail}
                                alt='thumbnail'
                                className='w-full h-auto'
                              />
                            </div>
                          </div>
                        }
                      />
                    ) : (
                      <>
                        <div className='w-full'>
                          <ImageButtonField
                            key={`thumbnail-btn-${formLocale}`}
                            rules={{ required: false }}
                            acceptTypes={acceptImageFileTypes.join(', ')}
                            name='coverImage'
                            outputType='file'
                            mode='single'
                            onError={setInvalidThumbnailFile}
                            onChange={(file) => onFileChange('thumbnail', file)}
                          />
                        </div>
                      </>
                    )}

                    {invalidThumbnailFile && (
                      <div className='pt-2 text-red-700 text-sm'>
                        <span className='text-danger'>
                          <span className='font-bold'>
                            {invalidThumbnailFile.title} :
                          </span>
                          {invalidThumbnailFile.message}
                        </span>
                      </div>
                    )}
                    {errorForm.thumbnail.status && (
                      <div className='pt-2 text-red-700 text-sm'>
                        {errorForm.thumbnail.message}
                      </div>
                    )}
                  </div>

                  <div className='flex flex-column mt-5 gap-2'>
                    <div className='pb-2'>
                      <div className='text-primary-800 font-bold'>
                        Cover image
                      </div>
                      <small className='text-xs font-bold text-info'>
                        ( Recommend image size: Min 375x211px, Max 860x484)
                        (allow file type: jpg, jpeg, png)
                      </small>
                    </div>
                    {uploadingBannerFile ? (
                      <ProgressBar
                        mode='indeterminate'
                        style={{ height: '6px' }}
                      ></ProgressBar>
                    ) : formValues.banner ? (
                      <Message
                        key={`banner-${formLocale}`}
                        content={
                          <div className='w-full'>
                            <div className='w-full flex justify-content-between py-3'>
                              <span>{formValues.banner}</span>
                              <i
                                className='pi pi-times cursor-pointer'
                                onClick={() => onRemoveFile('banner')}
                              ></i>
                            </div>

                            <div
                              className='tw-rounded-lg overflow-hidden mb-2'
                              style={{ maxWidth: '200px', lineHeight: 0 }}
                            >
                              <img
                                src={formValues.banner}
                                alt='banner'
                                className='w-full h-auto'
                              />
                            </div>
                          </div>
                        }
                      />
                    ) : (
                      <>
                        <div className='w-full'>
                          <ImageButtonField
                            key={`banner-btn-${formLocale}`}
                            rules={{ required: false }}
                            acceptTypes={acceptImageFileTypes.join(', ')}
                            name='coverImage'
                            outputType='file'
                            mode='single'
                            onError={setInvalidBannerFile}
                            onChange={(file) => onFileChange('banner', file)}
                          />
                        </div>
                      </>
                    )}

                    {invalidBannerFile && (
                      <div className='pt-2 text-red-700 text-sm'>
                        <span className='text-danger'>
                          <span className='font-bold'>
                            {invalidBannerFile.title} :
                          </span>
                          {invalidBannerFile.message}
                        </span>
                      </div>
                    )}
                    {errorForm.banner.status && (
                      <div className='pt-2 text-red-700 text-sm'>
                        {errorForm.banner.message}
                      </div>
                    )}
                  </div>

                  <div className='flex flex-wrap pt-4 -mx-2'>
                    <div className='col-6'>
                      <div className='field grid'>
                        <div className='col-12'>
                          <div className='text-primary-800 font-bold pb-2'>
                            Category Section Title
                          </div>
                          <InputText
                            key={`categorySectionTitle-${formLocale}`}
                            className='w-full'
                            maxLength={255}
                            onChange={(e) => {
                              setFormValues({
                                ...formValues,
                                categorySectionTitle: e.target.value || '',
                              })
                              setErrorForm({
                                ...errorForm,
                                categorySectionTitle: {
                                  status: false,
                                  message: '',
                                },
                              })
                            }}
                            value={formValues.categorySectionTitle}
                          />
                          {errorForm.categorySectionTitle.status && (
                            <div className='pt-2 text-red-700 text-sm'>
                              {errorForm.categorySectionTitle.message}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {type === 'update' &&
                      artCTypeItem &&
                      artCTypeItem.id === 2 && (
                        <div className='col-6'>
                          <div className='field grid'>
                            <div className='col-12'>
                              <div className='text-primary-800 font-bold pb-2'>
                                Playlist Section Title
                              </div>
                              <InputText
                                key={`playlistSectionTitle-${formLocale}`}
                                className='w-full'
                                maxLength={255}
                                onChange={(e) => {
                                  setFormValues({
                                    ...formValues,
                                    playlistSectionTitle: e.target.value || '',
                                  })
                                  setErrorForm({
                                    ...errorForm,
                                    playlistSectionTitle: {
                                      status: false,
                                      message: '',
                                    },
                                  })
                                }}
                                value={formValues.playlistSectionTitle}
                              />
                              {errorForm.playlistSectionTitle.status && (
                                <div className='pt-2 text-red-700 text-sm'>
                                  {errorForm.playlistSectionTitle.message}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                    <div className='col-6'>
                      <div className='field grid'>
                        <div className='col-12'>
                          <div className='text-primary-800 font-bold pb-2'>
                            Program Section Title
                          </div>
                          <InputText
                            key={`programSectionTitle-${formLocale}`}
                            className='w-full'
                            maxLength={255}
                            onChange={(e) => {
                              setFormValues({
                                ...formValues,
                                programSectionTitle: e.target.value || '',
                              })
                              setErrorForm({
                                ...errorForm,
                                programSectionTitle: {
                                  status: false,
                                  message: '',
                                },
                              })
                            }}
                            value={formValues.programSectionTitle}
                          />
                          {errorForm.programSectionTitle.status && (
                            <div className='pt-2 text-red-700 text-sm'>
                              {errorForm.programSectionTitle.message}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex flex-wrap w-full -mx-2 mt-4'>
                    <div className='col-6 mb-2 px-2'>
                      <div className='text-primary-800 font-bold pb-2'>
                        Opening hours
                      </div>
                      <Chips
                        key={`openingHours-${formLocale}`}
                        name='openingHours'
                        className='w-full'
                        value={formValues.openingHours}
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            openingHours: e.value || [],
                          })
                        }
                        separator=','
                      />
                    </div>

                    <div className='col-6 mb-2 px-2'>
                      <div className='text-primary-800 font-bold pb-2'>
                        Location
                      </div>
                      <Chips
                        key={`locations-${formLocale}`}
                        name='location'
                        className='w-full'
                        value={formValues.locations}
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            locations: e.value || [],
                          })
                        }
                        separator=','
                      />
                    </div>

                    <div className='col-6 mb-2 px-2'>
                      <div>
                        <div className='text-primary-800 font-bold pb-2'>
                          Enter fee <span className='text-red-700'>*</span>
                        </div>
                        <InputNumber
                          key={`enterFee-${formLocale}`}
                          name='enterFee'
                          className='w-full'
                          value={formValues.enterFee || 0}
                          onValueChange={(e) => {
                            setFormValues({
                              ...formValues,
                              enterFee: e.value || 0,
                            })
                            setErrorForm({
                              ...errorForm,
                              enterFee: {
                                status: false,
                                message: '',
                              },
                            })
                          }}
                          minFractionDigits={0}
                          maxFractionDigits={2}
                        />
                        {errorForm.enterFee.status && (
                          <div className='pt-2 text-red-700 text-sm'>
                            {errorForm.enterFee.message}
                          </div>
                        )}
                      </div>

                      <div className='field grid pt-4'>
                        <div className='flex col-12 tw-items-center'>
                          <div className='text-primary-800 font-bold pr-2'>
                            Display Free Label
                          </div>
                          <InputSwitch
                            checked={formValues?.displayFreeLabel}
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                displayFreeLabel: e.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className='col-6 mb-2 px-2'>
                      <div className='text-primary-800 font-bold pb-2'>
                        External link
                      </div>
                      <InputText
                        key={`externalLink-${formLocale}`}
                        name='externalLink'
                        className='w-full'
                        value={formValues.externalLink}
                        onChange={(e) => {
                          setFormValues({
                            ...formValues,
                            externalLink: e.target.value,
                          })
                          setErrorForm({
                            ...errorForm,
                            externalLink: {
                              status: false,
                              message: '',
                            },
                          })
                        }}
                      />
                      {errorForm.externalLink.status && (
                        <div className='pt-2 text-red-700 text-sm'>
                          {errorForm.externalLink.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <hr className='mt-0' />

                  <div className='-mx-2'>
                    <div className='w-full flex-shrink-0 mt-5 px-2'>
                      <div className='text-primary-800 font-bold pb-2'>
                        Relate Programs / Products
                      </div>
                      <div className='border-2 border-gray-200 tw-rounded-lg py-2 px-5'>
                        <div className='multi-select-display-all pt-4'>
                          <MultiSelect
                            key={`relatePrograms-${formLocale}`}
                            display='chip'
                            value={
                              formValues.relateProgramIds
                                ? formValues.relateProgramIds.map(
                                    (item) => `${item}`
                                  )
                                : []
                            }
                            options={programOptions}
                            onChange={(e) => {
                              setFormValues({
                                ...formValues,
                                relateProgramIds: e.value.map((item: string) =>
                                  Number(item)
                                ),
                              })
                            }}
                            optionLabel='label'
                            filter
                            placeholder='Select Relate Programs / Products'
                            maxSelectedLabels={100}
                            className='w-full'
                          />
                        </div>

                        <div className='text-primary-800 font-bold pt-4'>
                          Order Items
                        </div>
                        {formValues.relateProgramIds &&
                        formValues.relateProgramIds.length > 0 ? (
                          <DragDropContext
                            onDragEnd={handleDragRelateProgramOrder}
                          >
                            <Droppable droppableId='boxes'>
                              {(provided) => (
                                <ul
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  className='list-none pl-0'
                                >
                                  {formValues.relateProgramIds.map(
                                    (id, index) => {
                                      const program = programOptions.find(
                                        (item) => item.value === `${id}`
                                      )

                                      if (program === undefined) return null

                                      return (
                                        <Draggable
                                          key={`highlight-program-item-${id}`}
                                          draggableId={`section-item-${program?.value}`}
                                          index={index}
                                        >
                                          {(provided) => (
                                            <li
                                              ref={provided.innerRef}
                                              {...provided.dragHandleProps}
                                              {...provided.draggableProps}
                                            >
                                              <div className='w-full border-2 border-gray-200 tw-rounded-lg text-center py-4 my-4 font-bold capitalize'>
                                                {program.label}
                                              </div>
                                            </li>
                                          )}
                                        </Draggable>
                                      )
                                    }
                                  )}
                                </ul>
                              )}
                            </Droppable>
                          </DragDropContext>
                        ) : (
                          <div className='py-8 text-center'>
                            No selected programs
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Panel>

            {requestError.status && (
              <div className='pb-4 text-red-700 text-sm'>
                {requestError.message}
              </div>
            )}

            <div>{buttonActionTemplate}</div>
          </FormController>
        </div>

        <div className='col-4'>
          <div className='card'>
            <h4 className='text-astronaut font-bold'>Preview</h4>
            <div className='card-body'>
              <div
                className='border-2 border-gray-600 w-full pb-8'
                style={{
                  height: '796px',
                  overflowX: 'hidden',
                  overflowY: 'auto',
                }}
              >
                <div
                  className='w-full bg-cover bg-center'
                  style={{
                    backgroundImage: `url(${
                      formValues.banner || '/images/art-c/thumb-img-375-520.png'
                    })`,
                  }}
                >
                  <Image
                    src='/images/art-c/dot.png'
                    alt=''
                    className='w-full'
                    width={375}
                    height={250}
                  />
                </div>

                <div className='px-4'>
                  <h4 className='pt-4'>{formValues.title}</h4>

                  <div dangerouslySetInnerHTML={{ __html: formValues.desc }} />

                  {formValues.openingHours &&
                    formValues.openingHours.length > 0 && (
                      <div className='pt-3'>
                        <div className='flex'>
                          <div>
                            <Image
                              src='/images/art-c/icons/calendar.png'
                              alt=''
                              className='w-full'
                              width={16}
                              height={16}
                            />
                          </div>
                          <div className='text-sm pl-2'>
                            <strong>Opening Hours</strong>
                          </div>
                        </div>

                        <div className='capitalize'>
                          {formValues.openingHours}
                        </div>
                      </div>
                    )}

                  {formValues.locations && formValues.locations.length > 0 && (
                    <div className='pt-3'>
                      <div className='flex'>
                        <div>
                          <Image
                            src='/images/art-c/icons/map-pin.png'
                            alt=''
                            className='w-full'
                            width={16}
                            height={16}
                          />
                        </div>
                        <div className='text-sm pl-2'>
                          <strong>Location</strong>
                        </div>
                      </div>

                      <div className='capitalize'>
                        {formValues.locations.join(', ')}
                      </div>
                    </div>
                  )}

                  {formValues.enterFee && formValues.enterFee > 0 ? (
                    <div className='pt-3'>
                      <div className='flex'>
                        <div>
                          <Image
                            src='/images/art-c/icons/thb-currency.png'
                            alt=''
                            className='w-full'
                            width={16}
                            height={16}
                          />
                        </div>
                        <div className='text-sm pl-2'>
                          <strong>Admission Fee</strong>
                        </div>
                      </div>

                      <div className='capitalize'>
                        {formValues.enterFee} THB
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}

                  {formValues.externalLink && (
                    <div className='pt-3'>
                      <div className='flex'>
                        <div>
                          <Image
                            src='/images/art-c/icons/navigator.png'
                            alt=''
                            className='w-full'
                            width={16}
                            height={16}
                          />
                        </div>
                        <div className='text-sm pl-2'>
                          <strong>External Link</strong>
                        </div>
                      </div>

                      <Link
                        href={formValues.externalLink}
                        target='_blank'
                        style={{
                          color: '#7C7C7C',
                          textDecoration: 'underline',
                        }}
                      >
                        {formValues.externalLink}
                      </Link>
                    </div>
                  )}

                  {formValues.categorySectionTitle && (
                    <div className='pt-5'>
                      <h6 className='pb-0 mb-2'>
                        {formValues.categorySectionTitle}
                      </h6>

                      <div className='flex' style={{ margin: '0 -8px' }}>
                        <div className='col-4 px-2'>
                          <div className='bg-gray-400'>
                            <Image
                              src='/images/art-c/dot.png'
                              className='w-full h-auto'
                              alt=''
                              width={320}
                              height={320}
                            />
                          </div>
                        </div>
                        <div className='col-4 px-2'>
                          <div className='bg-gray-400'>
                            <Image
                              src='/images/art-c/dot.png'
                              className='w-full h-auto'
                              alt=''
                              width={320}
                              height={320}
                            />
                          </div>
                        </div>
                        <div className='col-4 px-2'>
                          <div className='bg-gray-400'>
                            <Image
                              src='/images/art-c/dot.png'
                              className='w-full h-auto'
                              alt=''
                              width={320}
                              height={320}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {type === 'update' &&
                    artCTypeItem &&
                    artCTypeItem.id === 2 && (
                      <div className='pt-5'>
                        <h6 className='pb-0 mb-2'>
                          {formValues.playlistSectionTitle || 'Playlist'}
                        </h6>

                        <div>
                          <div
                            className='bg-gray-400 w-full'
                            style={{ height: '120px' }}
                          />
                        </div>

                        <div className='pt-3'>
                          <div
                            className='bg-gray-400 w-full'
                            style={{ height: '120px' }}
                          />
                        </div>

                        <div className='pt-3'>
                          <div
                            className='bg-gray-400 w-full'
                            style={{ height: '120px' }}
                          />
                        </div>
                      </div>
                    )}

                  {selectedRelatePrograms &&
                    selectedRelatePrograms.length > 0 && (
                      <div className='mt-5'>
                        <div>
                          <h6 className='pb-0 mb-1'>
                            {formValues.programSectionTitle || 'Program'}
                          </h6>
                          <div className='text-sm pb-2'>
                            Showing {selectedRelatePrograms.length} items
                          </div>

                          {formValues.displayList ? (
                            <div
                              className='flex flex-wrap'
                              style={{ margin: '0 -8px' }}
                            >
                              {selectedRelatePrograms.map((program) => {
                                let translation: IProgramTranslation | undefined
                                for (let item of ['en', 'th', 'zh']) {
                                  translation = program.programTranslation.find(
                                    (tItem) => tItem.locale === item
                                  )
                                  if (translation) {
                                    break
                                  }
                                }

                                if (!translation) {
                                  return null
                                }

                                return (
                                  <div
                                    key={`relate-program-item-${program.id}`}
                                    className='px-2 col-6'
                                  >
                                    <div
                                      className='bg-cover bg-center'
                                      style={{
                                        backgroundImage: `url(${translation.thumbnail})`,
                                      }}
                                    >
                                      <Image
                                        src='/images/art-c/dot.png'
                                        className='w-full h-auto'
                                        alt=''
                                        width={320}
                                        height={320}
                                      />
                                    </div>

                                    <div className='flex pt-2'>
                                      <div className='w-full pr-2'>
                                        <div className='text-sm'>
                                          <strong>{translation.title}</strong>
                                        </div>
                                        <div className='text-sm'>
                                          {translation.author}
                                        </div>
                                      </div>
                                      <div
                                        className='flex-shrink-0'
                                        style={{ width: '20px' }}
                                      >
                                        <Image
                                          src='/images/art-c/icons/icon-star-outline.png'
                                          alt=''
                                          className='w-full'
                                          width={20}
                                          height={20}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          ) : (
                            <>
                              <div>
                                <div
                                  className='flex pt-2 overflow-x-auto'
                                  style={{ margin: '0 -8px' }}
                                >
                                  {selectedRelatePrograms.map((program) => {
                                    let translation:
                                      | IProgramTranslation
                                      | undefined
                                    for (let item of ['en', 'th', 'zh']) {
                                      translation =
                                        program.programTranslation.find(
                                          (tItem) => tItem.locale === item
                                        )
                                      if (translation) {
                                        break
                                      }
                                    }

                                    if (!translation) {
                                      return null
                                    }

                                    return (
                                      <div
                                        key={`relate-program-item-${program.id}`}
                                        className='px-1 flex-shrink-0 h-full'
                                        style={{ width: '85%' }}
                                      >
                                        <div
                                          style={{
                                            border: '1px solid #dcdcdc',
                                          }}
                                        >
                                          <div
                                            className='bg-cover bg-center'
                                            style={{
                                              backgroundImage: `url(${translation.thumbnail})`,
                                            }}
                                          >
                                            <Image
                                              src='/images/art-c/dot.png'
                                              className='w-full h-auto'
                                              alt=''
                                              width={320}
                                              height={320}
                                            />
                                          </div>

                                          <div
                                            className='py-4 px-2 text-center'
                                            style={{ height: '185px' }}
                                          >
                                            <div className='pb-2 text-base'>
                                              <strong>
                                                {translation.title}
                                              </strong>
                                            </div>
                                            {translation.author && (
                                              <div className='text-sm pb-2'>
                                                by{' '}
                                                <span
                                                  style={{ color: '#EB4D3D' }}
                                                >
                                                  {translation.author}
                                                </span>
                                              </div>
                                            )}
                                            {translation.locations &&
                                              translation.locations.length >
                                                0 && (
                                                <div className='text-sm pb-2'>
                                                  {translation.locations.join(
                                                    ', '
                                                  )}
                                                </div>
                                              )}
                                            {program.publishedAt && (
                                              <div className='text-sm'>
                                                {dayjs(
                                                  program.publishedAt
                                                ).format('DD MMM YYYY')}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ArtCUpsert
