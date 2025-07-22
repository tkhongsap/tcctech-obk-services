/* eslint-disable @next/next/no-img-element */
import { Tab, TabList, Tabs } from '@chakra-ui/react'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import {
  acceptImageFileTypes,
  IAddOnItem,
  IAddOnTranslation,
  IArtCCategoryItem,
  IArtCTranslation,
  IArtCTypeItem,
  IArtCultureContentUpload,
  IInputErrors,
  IPartnerItem,
  IPartnerTranslation,
  IProgram,
  IProgramForm,
  IProgramInfoItem,
  IProgramTranslation,
  OptionItem,
  ProgramContentData,
} from '@src/services/art-and-culture/model'
import { useRouter } from 'next/router'
import { Button } from 'primereact/button'
import { Panel } from 'primereact/panel'
import * as Yup from 'yup'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  isObjectDeepEqual,
  mappingValidateErrorMessage,
} from '@src/utils/art-c'
import { AxiosResponse } from 'axios'
import dayjs from 'dayjs'
import { Calendar } from 'primereact/calendar'
import { InputSwitch } from 'primereact/inputswitch'
import clsx from 'clsx'
import { InputText } from 'primereact/inputtext'
import { ProgressBar } from 'primereact/progressbar'
import { Message } from 'primereact/message'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'
import ImageButtonField from '@components/forms/components/image-button-field'
import { InputNumber } from 'primereact/inputnumber'
import { Chips } from 'primereact/chips'
import { MultiSelect } from 'primereact/multiselect'
import { Dropdown } from 'primereact/dropdown'
import { InputTextarea } from 'primereact/inputtextarea'
import QRCode from 'qrcode'
import Image from 'next/image'

import { Dialog } from 'primereact/dialog'
import Link from 'next/link'
import { last } from 'lodash'
import { convertToBase64 } from '@src/utils/image'
import { artCGeneralServices } from '@src/services/art-and-culture/art-c-general-service'
import { artCProgramServices } from '@src/services/art-and-culture/art-c-program-service'
import { artCServices } from '@src/services/art-and-culture/art-c-services'
import { artCAddOnServices } from '@src/services/art-and-culture/art-c-add-on-service'
import { artCPartnerServices } from '@src/services/art-and-culture/art-c-partner-services'
import { toast } from 'react-toastify'
import { bookingSettingService } from '@src/services/art-and-culture/booking/booking-setting-service'
import { usePermission } from '@src/hooks/permissionProvider'
import { PCODE } from '@src/data/constants/privilege'
import CustomEditor from '@components/input/customEditor'

interface IProgramUpsert {
  type: string
  item?: IProgram
}

interface IProgramFormTransValue {
  th: IProgramForm
  en: IProgramForm
  zh: IProgramForm
}

export default function ProgramUpsert({ type, item }: IProgramUpsert) {
  const router = useRouter()
  const { locale } = router.query
  const { query } = router
  const { id } = query
  const formRef = useRef<FormControllerRef<IProgramForm>>(null)
  const { checkAccess } = usePermission()

  const [isFormSubmitting, setIsFormSubmitting] = useState(false)
  const [formLocale, setFormLocale] = useState<string>('en')
  const [formValues, setFormValues] = useState<IProgramForm>(
    new ProgramContentData()
  )
  const [formTransValues, setFormTransValues] =
    useState<IProgramFormTransValue>({
      th: new ProgramContentData(),
      en: new ProgramContentData(),
      zh: new ProgramContentData(),
    })

  const [artCTypeItems, setArtCTypeItems] = useState<IArtCTypeItem[]>([])
  const [selectedArtCType, setSSelectedArtCType] = useState<string>()
  const [artCTypeOptions, setArtCTypeOptions] = useState<OptionItem[]>([])

  const [selectedArtCCategory, setSSelectedArtCCategory] = useState<string>()
  const [artCCategoryOptions, setArtCCategoryOptions] = useState<OptionItem[]>(
    []
  )

  const [addOnItems, setAddOnItems] = useState<IAddOnItem[]>([])
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [addOnOptions, setAddOnOptions] = useState<OptionItem[]>([])

  const [partnerItems, setPartnerItems] = useState<IPartnerItem[]>([])
  const [selectedPartners, setSelectedPartners] = useState<string[]>([])
  const [partnerOptions, setPartnerOptions] = useState<OptionItem[]>([])

  const initFormErrors: IInputErrors = {
    artCTypeId: { status: false, message: '' },
    isPublished: { status: false, message: '' },
    periodAt: { status: false, message: '' },
    periodEnd: { status: false, message: '' },
    publishedAt: { status: false, message: '' },
    isProduct: { status: false, message: '' },
    productPrice: { status: false, message: '' },
    type: { status: false, message: '' },
    title: { status: false, message: '' },
    shortDesc: { status: false, message: '' },
    desc: { status: false, message: '' },
    author: { status: false, message: '' },
    thumbnail: { status: false, message: '' },
    banner: { status: false, message: '' },
    openingHours: { status: false, message: '' },
    locations: { status: false, message: '' },
    enterFee: { status: false, message: '' },
    externalLink: { status: false, message: '' },
    audio: { status: false, message: '' },
    video: { status: false, message: '' },
    tags: { status: false, message: '' },
  }
  const initInfoItemError: IInputErrors[] = []

  const [errorForm, setErrorForm] = useState(initFormErrors)
  const [infoItemErrorForm, setInfoItemErrorForm] = useState(initInfoItemError)
  const [requestError, setRequestError] = useState({
    status: false,
    message: '',
  })

  const initialFormValues = (item: IProgram | undefined) => {
    if (item && item.programTranslation.length > 0) {
      const value = { ...formTransValues }

      setSelectedAddOns(item.addOns.map((item) => `${item.id}`))
      setSelectedPartners(item.partners.map((item) => `${item.id}`))

      item.programTranslation.forEach((itemTrans: IProgramTranslation) => {
        if (itemTrans.locale === 'en') {
          value['en'] = {
            artCTypeId: item.artCTypeId,
            artCCategoryId: item.artCCategoryId,
            type: item.type,
            isPublished: item.isPublished ? true : false,
            publishedAt: item.publishedAt,
            periodAt: item.periodAt,
            periodEnd: item.periodEnd,
            isProduct: item.isProduct,
            productPrice: item.productPrice,
            displayFreeLabel: item.displayFreeLabel,
            addOns: item.addOns,
            partners: item.partners,
            relateProgramIds: item.relateProgramIds,
            relateProductIds: item.relateProductIds,
            title: itemTrans.title,
            shortDesc: itemTrans.shortDesc,
            desc: itemTrans.desc,
            author: itemTrans.author,
            thumbnail: itemTrans.thumbnail,
            banner: itemTrans.banner,
            openingHours: itemTrans.openingHours,
            locations: itemTrans.locations,
            enterFee: itemTrans.enterFee,
            externalLink: itemTrans.externalLink,
            audio: itemTrans.audio,
            video: itemTrans.video,
            tags: itemTrans.tags,
            infoItems: itemTrans.infoItems,
          }
        }

        if (itemTrans.locale === 'th') {
          value['th'] = {
            artCTypeId: item.artCTypeId,
            artCCategoryId: item.artCCategoryId,
            type: item.type,
            isPublished: item.isPublished ? true : false,
            publishedAt: item.publishedAt,
            periodAt: item.periodAt,
            periodEnd: item.periodEnd,
            isProduct: item.isProduct,
            productPrice: item.productPrice,
            displayFreeLabel: item.displayFreeLabel,
            addOns: item.addOns,
            partners: item.partners,
            relateProgramIds: item.relateProgramIds,
            relateProductIds: item.relateProductIds,
            title: itemTrans.title,
            shortDesc: itemTrans.shortDesc,
            desc: itemTrans.desc,
            author: itemTrans.author,
            thumbnail: itemTrans.thumbnail,
            banner: itemTrans.banner,
            openingHours: itemTrans.openingHours,
            locations: itemTrans.locations,
            enterFee: itemTrans.enterFee,
            externalLink: itemTrans.externalLink,
            audio: itemTrans.audio,
            video: itemTrans.video,
            tags: itemTrans.tags,
            infoItems: itemTrans.infoItems,
          }
        }

        if (itemTrans.locale === 'zh') {
          value['zh'] = {
            artCTypeId: item.artCTypeId,
            artCCategoryId: item.artCCategoryId,
            type: item.type,
            isPublished: item.isPublished ? true : false,
            publishedAt: item.publishedAt,
            periodAt: item.periodAt,
            periodEnd: item.periodEnd,
            isProduct: item.isProduct,
            productPrice: item.productPrice,
            displayFreeLabel: item.displayFreeLabel,
            addOns: item.addOns,
            partners: item.partners,
            relateProgramIds: item.relateProgramIds,
            relateProductIds: item.relateProductIds,
            title: itemTrans.title,
            shortDesc: itemTrans.shortDesc,
            desc: itemTrans.desc,
            author: itemTrans.author,
            thumbnail: itemTrans.thumbnail,
            banner: itemTrans.banner,
            openingHours: itemTrans.openingHours,
            locations: itemTrans.locations,
            enterFee: itemTrans.enterFee,
            externalLink: itemTrans.externalLink,
            audio: itemTrans.audio,
            video: itemTrans.video,
            tags: itemTrans.tags,
            infoItems: itemTrans.infoItems,
          }
        }
      })

      setFormTransValues(value)
      setFormValues({
        ...value[formLocale as keyof IProgramFormTransValue],
        artCTypeId: item.artCTypeId,
        artCCategoryId: item.artCCategoryId,
        type: item.type,
        isPublished: item.isPublished ? true : false,
        publishedAt: item.publishedAt,
        periodAt: item.periodAt,
        periodEnd: item.periodEnd,
        isProduct: item.isProduct,
        productPrice: item.productPrice,
        displayFreeLabel: item.displayFreeLabel,
        addOns: item.addOns,
        partners: item.partners,
        relateProgramIds: item.relateProgramIds,
        relateProductIds: item.relateProductIds,
      })
    }
  }

  const handleFormLocaleChange = (locale: string) => {
    setErrorForm(initFormErrors)
    setRequestError({ status: false, message: '' })

    // save current form values to formTransValues
    const tempFormTransValues = JSON.parse(JSON.stringify(formTransValues))
    tempFormTransValues[formLocale as keyof IProgramFormTransValue] = formValues

    Object.keys(tempFormTransValues).forEach((key) => {
      if (key === formLocale) return
      tempFormTransValues[key as keyof IProgramFormTransValue] = {
        ...tempFormTransValues[key as keyof IProgramFormTransValue],
        artCTypeId: formValues.artCTypeId,
        artCCategoryId: formValues.artCCategoryId,
        type: formValues.type,
        isPublished: formValues.isPublished ? true : false,
        publishedAt: formValues.publishedAt,
        periodAt: formValues.periodAt,
        periodEnd: formValues.periodEnd,
        isProduct: formValues.isProduct,
        productPrice: formValues.productPrice,
        displayFreeLabel: formValues.displayFreeLabel,
        addOns: formValues.addOns,
        partners: formValues.partners,
        relateProgramIds: formValues.relateProgramIds,
        relateProductIds: formValues.relateProductIds,
      }
    })

    // Use freshly updated tempFormTransValues to avoid stale data
    setFormLocale(locale)
    setFormTransValues(tempFormTransValues)

    const selectedLocaleValues =
      tempFormTransValues[locale as keyof IProgramFormTransValue]
    setFormValues({
      ...selectedLocaleValues,
    })
  }

  const onEditContent = (editorState: any) => {
    if (formValues) {
      setFormValues({ ...formValues, desc: editorState })

      setErrorForm({
        ...errorForm,
        desc: { status: false, message: '' },
      })
    }
  }

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

  const onArtCTypeChange = (e: any) => {
    setSSelectedArtCType(e.value)
    setFormValues({
      ...formValues,
      artCTypeId: Number(e.value),
      artCCategoryId: 0,
    })

    setErrorForm({
      ...errorForm,
      artCTypeId: {
        status: false,
        message: '',
      },
      artCCategoryId: {
        status: false,
        message: '',
      },
    })

    const categories =
      artCTypeItems.find((item) => item.id === Number(e.value))?.artCCategory ||
      []

    handleSetArtCCategoryOptions(categories)
  }

  const handleSetArtCCategoryOptions = (categories: IArtCCategoryItem[]) => {
    if (categories.length > 0) {
      const options: OptionItem[] = []
      categories.forEach((category: IArtCCategoryItem) => {
        let translation: IArtCTranslation | undefined
        for (let item of ['en', 'th', 'zh']) {
          translation = category.artCTranslation?.find(
            (tItem) => tItem.locale === item
          )
          if (translation) {
            break
          }
        }

        if (translation) {
          options.push({ label: translation.title, value: `${category.id}` })
        }
      })

      setArtCCategoryOptions(options)

      if (item && item.artCCategoryId) {
        setSSelectedArtCCategory(`${item.artCCategoryId}`)
      }
    } else {
      setArtCCategoryOptions([])
    }
  }

  const validateProgramTypes = (
    value: string[]
  ): { status: boolean; message: string } => {
    let typeError = {
      status: false,
      message: '',
    }
    if (!value || value.length <= 0) {
      typeError = {
        status: true,
        message: 'Type is required',
      }
    }

    return typeError
  }

  const validateProgramInfoItems = (
    infoItems: IProgramInfoItem[]
  ): {
    status: boolean
    infoItemError: IInputErrors[]
  } => {
    let validateInfoItemsResult = false
    const infoItemsErrors = initInfoItemError
    if (infoItems && infoItems.length > 0) {
      infoItems.forEach((item) => {
        const title = { status: false, message: '' }
        const content = { status: false, message: '' }

        if (!item.title) {
          title.status = true
          title.message = 'Info item title is required'
        } else if (item.title.length > 255) {
          title.status = true
          title.message = 'Info item title is required'
        }

        if (!item.content) {
          content.status = true
          content.message = 'Info item content is required'
        }

        if (title.status || content.status) {
          validateInfoItemsResult = true
        }

        infoItemsErrors.push({ title, content })
      })
    }

    return { status: validateInfoItemsResult, infoItemError: infoItemsErrors }
  }

  let validationSchema = Yup.object({
    artCTypeId: Yup.number().required('Art & Culture category is required'),
    title: Yup.string()
      .max(255, 'Title must be less than 255 characters')
      .required('Title is required'),
    shortDesc: Yup.string().max(
      255,
      'Short description must be less than 255 characters'
    ),
    desc: Yup.string().required('Content is required'),
    author: Yup.string().max(255, 'Author must be less than 255 characters'),
    // .required('Author is required'),
    thumbnail: Yup.string().required('Thumbnail is required'),
    banner: Yup.string().required('Cover image is required'),
    enterFee: Yup.number()
      .required('Enter fee is required')
      .moreThan(-1, 'Enter fee must greater than 0')
      .integer('Enter fee must be a number'),
    externalLink: Yup.string()
      .max(255, 'External link must be less than 255 characters')
      .url('External link must be a valid URL'),
    audio: Yup.string().url('Audio must be a valid URL'),
    video: Yup.string().url('Video must be a valid URL'),
    // periodAt: Yup.date().required('Program period at is required'),
    // periodEnd: Yup.date()
    //   .required('Program period end is required')
    //   .min(
    //     Yup.ref('periodAt'),
    //     'Program period end must be greater than program period at'
    //   ),
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
      setIsFormSubmitting(false)
      return
    } else {
      formValuesItem.push(formLocale)
      prepareFormValues[formLocale as keyof IProgramFormTransValue] = formValues
    }

    let typeError = validateProgramTypes(formValues.type)
    if (typeError.status) {
      setRequestError({ status: false, message: '' })
      setErrorForm({ ...errors, type: typeError })
      return
    }

    let validateInfoItemsError = validateProgramInfoItems(formValues.infoItems)
    if (validateInfoItemsError.status) {
      setRequestError({ status: false, message: '' })
      setInfoItemErrorForm(validateInfoItemsError.infoItemError)
      return
    }

    let isOtherLocaleValid = true
    for (const key in formTransValues) {
      if (isOtherLocaleValid) {
        const checkFormValues = {
          title: formTransValues[key as keyof IProgramFormTransValue].title,
          shortDesc:
            formTransValues[key as keyof IProgramFormTransValue].shortDesc,
          desc: formTransValues[key as keyof IProgramFormTransValue].desc,
          author: formTransValues[key as keyof IProgramFormTransValue].author,
          thumbnail:
            formTransValues[key as keyof IProgramFormTransValue].thumbnail,
          banner: formTransValues[key as keyof IProgramFormTransValue].banner,
          openingHours:
            formTransValues[key as keyof IProgramFormTransValue].openingHours,
          locations:
            formTransValues[key as keyof IProgramFormTransValue].locations,
          enterFee:
            formTransValues[key as keyof IProgramFormTransValue].enterFee,
          externalLink:
            formTransValues[key as keyof IProgramFormTransValue].externalLink,
          audio: formTransValues[key as keyof IProgramFormTransValue].audio,
          video: formTransValues[key as keyof IProgramFormTransValue].video,
          tags: formTransValues[key as keyof IProgramFormTransValue].tags,
          infoItems:
            formTransValues[key as keyof IProgramFormTransValue].infoItems,
        }

        const defaultValue = new ProgramContentData()

        const initValues = {
          title: defaultValue.title,
          shortDesc: defaultValue.shortDesc,
          desc: defaultValue.desc,
          author: defaultValue.author,
          thumbnail: defaultValue.thumbnail,
          banner: defaultValue.banner,
          openingHours: defaultValue.openingHours,
          locations: defaultValue.locations,
          enterFee: defaultValue.enterFee,
          externalLink: defaultValue.externalLink,
          audio: defaultValue.audio,
          video: defaultValue.video,
          tags: defaultValue.tags,
          infoItems: defaultValue.infoItems,
        }

        if (!isObjectDeepEqual(checkFormValues, initValues)) {
          const currentFormLocaleValues = {
            ...checkFormValues,
            artCTypeId:
              formTransValues[key as keyof IProgramFormTransValue].artCTypeId,
            artCCategoryId:
              formTransValues[key as keyof IProgramFormTransValue]
                .artCCategoryId,
            type: formTransValues[key as keyof IProgramFormTransValue].type,
            isPublished: formTransValues[key as keyof IProgramFormTransValue]
              .isPublished
              ? true
              : false,
            publishedAt:
              formTransValues[key as keyof IProgramFormTransValue].publishedAt,
            periodAt:
              formTransValues[key as keyof IProgramFormTransValue].periodAt,
            periodEnd:
              formTransValues[key as keyof IProgramFormTransValue].periodEnd,
            isProduct:
              formTransValues[key as keyof IProgramFormTransValue].isProduct,
            productPrice:
              formTransValues[key as keyof IProgramFormTransValue].productPrice,
            displayFreeLabel:
              formTransValues[key as keyof IProgramFormTransValue]
                .displayFreeLabel,
            addOns: formTransValues[key as keyof IProgramFormTransValue].addOns,
            partners:
              formTransValues[key as keyof IProgramFormTransValue].partners,
            relateProgramIds:
              formTransValues[key as keyof IProgramFormTransValue]
                .relateProgramIds,
            relateProductIds:
              formTransValues[key as keyof IProgramFormTransValue]
                .relateProductIds,
          }

          const result = await validationSchema
            .validate(currentFormLocaleValues, { abortEarly: false })
            .catch(async (err) => {
              errors = mappingValidateErrorMessage(errors, err.inner)
              return false
            })

          if (!result) {
            setRequestError({ status: false, message: '' })
            setErrorForm(errors)
            setIsFormSubmitting(false)
            handleFormLocaleChange(key)
            isOtherLocaleValid = false
          } else {
            let currentLocaleTypeError = validateProgramTypes(
              currentFormLocaleValues.type
            )
            if (isOtherLocaleValid && currentLocaleTypeError.status) {
              setRequestError({ status: false, message: '' })
              setErrorForm({ ...errors, type: currentLocaleTypeError })
              setIsFormSubmitting(false)
              handleFormLocaleChange(key)
              isOtherLocaleValid = false
            }

            let validateCurrentLocaleInfoItemsError = validateProgramInfoItems(
              currentFormLocaleValues.infoItems
            )
            if (
              isOtherLocaleValid &&
              validateCurrentLocaleInfoItemsError.status
            ) {
              setRequestError({ status: false, message: '' })
              setInfoItemErrorForm(validateInfoItemsError.infoItemError)
              setIsFormSubmitting(false)
              handleFormLocaleChange(key)
              isOtherLocaleValid = false
            }

            if (isOtherLocaleValid) {
              formValuesItem.push(key)
              prepareFormValues[key as keyof IProgramFormTransValue] =
                currentFormLocaleValues
            }
          }
        }
      }
    }

    if (!isOtherLocaleValid) {
      return
    }

    setIsFormSubmitting(true)

    let res = { id: item ? item.id : 0, status: false }
    for (const key in prepareFormValues) {
      if (formValuesItem.includes(key)) {
        const tempAnswer = document.createElement('div')
        tempAnswer.innerHTML =
          prepareFormValues[key as keyof IProgramFormTransValue].desc
        tempAnswer.querySelectorAll('img').forEach((img) => {
          img.removeAttribute('style')
          img.removeAttribute('width')
          img.removeAttribute('height')
        })

        const saveValue = {
          ...prepareFormValues[key as keyof IProgramFormTransValue],
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
        `/art-and-culture/programs${
          type === 'create' ? '?status=createSuccess' : '?status=updateSuccess'
        }`
      )
    }

    setIsFormSubmitting(false)
  }

  const saveFormValues = async (
    id: number,
    saveLocale: string,
    values: IProgramForm
  ): Promise<{ id: number; status: boolean }> => {
    try {
      let result: AxiosResponse | null = null

      if (type === 'create' && id === 0) {
        result = await artCProgramServices.create(saveLocale, values)
      } else {
        result = await artCProgramServices.edit(`${id}`, saveLocale, values)
      }

      if (!result) return { id: 0, status: false }

      if (result.status == 201) {
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
    if (confirm('Are you sure you want to delete this programs?')) {
      setIsFormSubmitting(true)

      await artCProgramServices
        .delete(`${id}`)
        .then(() => {
          router.push('/art-and-culture/programs')
        })
        .catch((error) => {
          setRequestError({
            status: true,
            message: error.response.data.message,
          })
        })
        .finally(() => {
          setIsFormSubmitting(false)
        })
    }
  }

  const onBack = () => router.push('/art-and-culture/programs')

  const [hasBookingSetting, setHasBookingSetting] = useState(false)
  const [isBookingSettingFetched, setIsBookingSettingFetched] = useState(false)
  const checkBookingSetting = useCallback(async () => {
    setIsBookingSettingFetched(false)
    try {
      if (item?.id) {
        await bookingSettingService.getDetailByProgramId(item?.id)
        setHasBookingSetting(true)
      }
    } catch (error) {
      console.log('booking setting error', error)
      setHasBookingSetting(false)
    } finally {
      setIsBookingSettingFetched(true)
    }
  }, [item?.id])

  const getBookingSettingUrl = useCallback(() => {
    if (hasBookingSetting) {
      return `/art-and-culture/booking/edit-setting?programId=${item?.id}`
    } else {
      return `/art-and-culture/booking/create-setting?programId=${item?.id}`
    }
  }, [hasBookingSetting, item?.id])

  const isShowBookingSettingButton = useMemo(() => {
    let canAccess = false
    if (hasBookingSetting) canAccess = checkAccess(PCODE.EDITBOOKINGSETTING)
    else canAccess = checkAccess(PCODE.CREATEBOOKINGSETTING)

    return canAccess && type === 'update' && item && isBookingSettingFetched
  }, [hasBookingSetting, checkAccess, type, item, isBookingSettingFetched])

  const buttonActionTemplate = (
    <div className='flex justify-content-between '>
      <div className='flex gap-3 justify-content-center md:justify-content-start'>
        <Button
          disabled={isFormSubmitting}
          className='px-5 py-3 bg-primary-blue text-white'
          label='Publish'
          onClick={formRef.current?.handleSubmit(onSubmit)}
        />
        {type === 'update' && item && (
          <Button
            className='px-5 text-red-600 border-2 border-red-600'
            label='Delete this program'
            severity='danger'
            outlined
            disabled={isFormSubmitting}
            onClick={() => deleteItem(item.id)}
          />
        )}
        <Button
          type='button'
          disabled={isFormSubmitting}
          className='px-5 text-primary-blue'
          label='Close'
          text
          onClick={onBack}
        />
      </div>

      {isShowBookingSettingButton && (
        <a href={getBookingSettingUrl()}>
          <Button
            type='button'
            disabled={isFormSubmitting}
            className='px-5 text-primary-blue'
            label={hasBookingSetting ? 'Edit Booking' : 'Create Booking'}
            outlined
          />
        </a>
      )}
    </div>
  )

  const fetchArtCType = async () => {
    await artCServices
      .getAll('all')
      .then((res) => {
        const { data } = res.data

        setArtCTypeItems(data)

        const options: OptionItem[] = []
        data.forEach((artCType: IArtCTypeItem) => {
          let translation: IArtCTranslation | undefined
          for (let item of ['en', 'th', 'zh']) {
            translation = artCType.artCTranslation?.find(
              (tItem) => tItem.locale === item
            )
            if (translation) {
              break
            }
          }

          if (translation) {
            options.push({ label: translation.title, value: `${artCType.id}` })

            if (item && artCType.id === item.artCTypeId) {
              if (artCType.artCCategory.length > 0) {
                handleSetArtCCategoryOptions(artCType.artCCategory)
              }
            }
          }
        })

        setArtCTypeOptions(options)
        if (item) {
          setSSelectedArtCType(`${item.artCTypeId}`)
        }
      })
      .catch(() => {
        setRequestError({
          status: true,
          message: 'Something went wrong, please try again.',
        })
      })
  }

  const fetchAddOns = async () => {
    await artCAddOnServices
      .getAll('all')
      .then((res) => {
        const { data } = res.data

        setAddOnItems(data)

        const options: OptionItem[] = []
        data.forEach((addOn: IAddOnItem) => {
          let translation: IAddOnTranslation | undefined
          for (let item of ['en', 'th', 'zh']) {
            translation = addOn.addOnTranslation.find(
              (tItem) => tItem.locale === item
            )
            if (translation) {
              break
            }
          }

          if (translation) {
            options.push({ label: translation.title, value: `${addOn.id}` })
          }
        })

        setAddOnOptions(options)
      })
      .catch(() => {
        setRequestError({
          status: true,
          message: 'Something went wrong, please try again.',
        })
      })
  }

  const fetchPartners = async () => {
    await artCPartnerServices
      .getAll('all')
      .then((res) => {
        const { data } = res.data

        setPartnerItems(data)

        const options: OptionItem[] = []
        data.forEach((partner: IPartnerItem) => {
          let translation: IPartnerTranslation | undefined
          for (let item of ['en', 'th', 'zh']) {
            translation = partner.partnerTranslation.find(
              (tItem) => tItem.locale === item
            )
            if (translation) {
              break
            }
          }

          if (translation) {
            options.push({ label: translation.title, value: `${partner.id}` })
          }
        })

        setPartnerOptions(options)
      })
      .catch(() => {
        setRequestError({
          status: true,
          message: 'Something went wrong, please try again.',
        })
      })
  }

  const [visibleQrCode, setVisibleQrCode] = useState(false)
  const [qrCodeImage, setQRCodeImage] = useState<string | null>(null)
  const createQRCode = (item: IProgram | undefined) => {
    if (item) {
      QRCode.toDataURL(
        `${process.env.ART_CULTURE_UNIVERSAL_LINK}/program/${item.id}`
      )
        .then((url: string) => {
          setQRCodeImage(url)
        })
        .catch((err: any) => {
          console.warn(err)
        })
    }
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

          if (translation && program.id !== item?.id) {
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

  const handleDragRelateProductOrder = (result: DropResult) => {
    if (!result || !result.destination) return
    const newList = Array.from(formValues.relateProductIds)
    const [draggedItem] = newList.splice(result.source.index, 1)
    newList.splice(result.destination!.index, 0, draggedItem)

    setFormValues({ ...formValues, relateProductIds: newList })
  }

  const [selectedRelatePrograms, setSelectedRelatePrograms] = useState<
    IProgram[]
  >([])
  const [selectedRelateProducts, setSelectedRelateProducts] = useState<
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

    if (formValues.relateProductIds && formValues.relateProductIds.length > 0) {
      const relateProductItems: IProgram[] = []
      formValues.relateProductIds.forEach((id) => {
        const program = programs.find((item) => item.id === id)
        if (!program) return

        relateProductItems.push(program)
      })

      setSelectedRelateProducts(relateProductItems)
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
    setTimeout(() => {
      initialFormValues(item)
      fetchArtCType()
      fetchPartners()
      fetchPrograms()
      fetchAddOns()
      createQRCode(item)
    }, 250)
  }, [item, locale])

  useEffect(() => {
    if (item?.id) checkBookingSetting()
  }, [item?.id])

  const fallbackCopyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea')
    textArea.value = text

    // Avoid scrolling to bottom of page when selecting text
    textArea.style.position = 'fixed'
    textArea.style.top = '0'
    textArea.style.left = '0'
    textArea.style.width = '2em'
    textArea.style.height = '2em'
    textArea.style.padding = '0'
    textArea.style.border = 'none'
    textArea.style.outline = 'none'
    textArea.style.boxShadow = 'none'
    textArea.style.background = 'transparent'

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      const successful = document.execCommand('copy')
      if (successful) {
        toast.success('Copy ID Successfully.')
      } else {
        toast.warning('Failed to copy ID.')
      }
    } catch (err) {
      toast.warning('Failed to copy ID.')
    }

    document.body.removeChild(textArea)
  }

  return (
    <>
      <Dialog
        header='QR Code'
        visible={visibleQrCode}
        style={{ width: '300px' }}
        blockScroll={true}
        closeOnEscape={false}
        onHide={() => {
          if (!visibleQrCode) return
          setVisibleQrCode(false)
        }}
      >
        {qrCodeImage && (
          <div className='border-1 border-gray-200'>
            <Image
              src={qrCodeImage}
              className='w-full h-auto'
              width={320}
              height={320}
              alt='Picture of the author'
            />
          </div>
        )}
      </Dialog>
      <div className='flex'>
        <div className='col-8'>
          <FormController
            ref={formRef}
            defualtValue={new ProgramContentData()}
            onSubmit={onSubmit}
          >
            <Panel className='mb-5'>
              {formValues && (
                <div className='flex flex-row'>
                  <div className='w-full p-2'>
                    <div>
                      <div className='flex tw-justify-between'>
                        <h4 className='text-astronaut font-bold'>Details</h4>
                        <div>
                          {type === 'update' && (
                            <Button
                              type='button'
                              label='Copy ID to Clipboard'
                              size='small'
                              style={{ marginRight: '1rem' }}
                              onClick={() =>
                                fallbackCopyToClipboard((id ?? '').toString())
                              }
                            />
                          )}
                          {qrCodeImage && (
                            <Button
                              type='button'
                              label='View QR'
                              size='small'
                              onClick={() => setVisibleQrCode(true)}
                            />
                          )}
                        </div>
                      </div>
                      {type === 'update' && item && (
                        <small className='font-medium'>
                          Last update&nbsp;
                          <span className='font-bold'>
                            {dayjs(item.updatedAt).format('DD/MM/YYYY HH:mm')}
                            &nbsp;
                          </span>
                        </small>
                      )}
                    </div>

                    <div className='w-full'>
                      <div className='flex w-full -mx-2'>
                        <div className='w-6 flex-shrink-0 mt-5 px-2'>
                          <div className='text-primary-800 font-bold pb-2'>
                            Art & Culture Category{' '}
                            <span className='text-red-700'>*</span>
                          </div>
                          <div>
                            <Dropdown
                              value={selectedArtCType}
                              onChange={(e) => onArtCTypeChange(e)}
                              options={artCTypeOptions}
                              placeholder='Select Art & Culture Category'
                              className='w-full'
                            />
                          </div>
                          {errorForm.artCTypeId.status && (
                            <div className='pt-2 text-red-700 text-sm'>
                              {errorForm.artCTypeId.message}
                            </div>
                          )}
                        </div>

                        {selectedArtCType && artCCategoryOptions.length > 0 && (
                          <div className='w-6 flex-shrink-0 mt-5 px-2'>
                            <div className='text-primary-800 font-bold pb-2'>
                              Sub Category
                            </div>
                            <div>
                              <Dropdown
                                value={selectedArtCCategory}
                                onChange={(e) => {
                                  setSSelectedArtCCategory(e.value)
                                  setFormValues({
                                    ...formValues,
                                    artCCategoryId: Number(e.value),
                                  })
                                }}
                                options={artCCategoryOptions}
                                placeholder='Select Art & Culture Sub Category'
                                className='w-full'
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className='flex w-full -mx-2'>
                        <div className='w-6 flex-shrink-0 mt-5 px-2'>
                          <div className='text-primary-800 font-bold pb-2'>
                            Type <span className='text-red-700'>*</span>
                          </div>
                          <div>
                            <MultiSelect
                              display='chip'
                              value={formValues.type}
                              onChange={(e) => {
                                setFormValues({
                                  ...formValues,
                                  type: e.value,
                                })
                                setErrorForm({
                                  ...errorForm,
                                  type: {
                                    status: false,
                                    message: '',
                                  },
                                })
                              }}
                              options={[
                                {
                                  label: 'Sculpture',
                                  value: 'sculpture',
                                },
                                {
                                  label: 'Painting',
                                  value: 'painting',
                                },
                                {
                                  label: 'Installation Art',
                                  value: 'installation-art',
                                },
                                {
                                  label: 'Digital Art',
                                  value: 'digital-art',
                                },
                                {
                                  label: 'Urban Furniture',
                                  value: 'urban-furniture',
                                },
                                {
                                  label: 'ETC',
                                  value: 'etc',
                                },
                              ]}
                              placeholder='Select Type'
                              className='w-full'
                            />
                          </div>
                          {errorForm.type.status && (
                            <div className='pt-2 text-red-700 text-sm'>
                              {errorForm.type.message}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className='flex w-full -mx-2'>
                        <div className='w-6 flex-shrink-0 mt-5 px-2'>
                          <div className='text-primary-800 font-bold pb-2'>
                            Add-On Contents
                          </div>
                          <div className='multi-select-display-all'>
                            <MultiSelect
                              display='chip'
                              value={selectedAddOns}
                              onChange={(e) => {
                                setSelectedAddOns(e.value)

                                const addOnsId: number[] = []
                                e.value.forEach((id: string) => {
                                  addOnsId.push(Number(id))
                                })

                                const addOnsValue = addOnItems.filter(
                                  (addOn) =>
                                    addOnsId.includes(addOn.id) && addOn
                                )

                                setFormValues({
                                  ...formValues,
                                  addOns: addOnsValue,
                                })
                              }}
                              options={addOnOptions}
                              optionLabel='label'
                              filter
                              placeholder='Select Add-On Content'
                              maxSelectedLabels={100}
                              className='w-full'
                            />
                          </div>
                        </div>

                        <div className='w-6 flex-shrink-0 mt-5 px-2'>
                          <div className='text-primary-800 font-bold pb-2'>
                            Partners
                          </div>
                          <div className='multi-select-display-all'>
                            <MultiSelect
                              display='chip'
                              value={selectedPartners}
                              onChange={(e) => {
                                setSelectedPartners(e.value)

                                const partnersId: number[] = []
                                e.value.forEach((id: string) => {
                                  partnersId.push(Number(id))
                                })

                                const partnersValue = partnerItems.filter(
                                  (addOn) =>
                                    partnersId.includes(addOn.id) && addOn
                                )
                                setFormValues({
                                  ...formValues,
                                  partners: partnersValue,
                                })
                              }}
                              options={partnerOptions}
                              optionLabel='label'
                              filter
                              placeholder='Select partners'
                              maxSelectedLabels={100}
                              className='w-full'
                            />
                          </div>
                        </div>
                      </div>

                      <div className='flex'>
                        <div className='field grid mt-5 pr-4'>
                          <div className='flex col-12 tw-items-center'>
                            <div className='flex items-center text-primary-800 font-bold pr-2'>
                              <div>Publish At</div>
                            </div>
                            <div>
                              <Calendar
                                value={
                                  formValues?.publishedAt
                                    ? dayjs(formValues?.publishedAt).toDate()
                                    : null
                                }
                                onChange={(e) => {
                                  if (e.value) {
                                    setFormValues({
                                      ...formValues,
                                      publishedAt: e.value,
                                    })
                                  }
                                }}
                                dateFormat='dd/mm/yy '
                                showTime
                                hourFormat='24'
                                showIcon
                              />
                            </div>
                          </div>
                        </div>

                        <div className='field grid mt-5'>
                          <div className='flex col-12 tw-items-center'>
                            <div className='text-primary-800 font-bold pr-2'>
                              Publish Content
                            </div>
                            <InputSwitch
                              checked={formValues?.isPublished}
                              onChange={(e) =>
                                setFormValues({
                                  ...formValues,
                                  isPublished: e.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className='flex w-6' style={{ height: '108px' }}>
                        <div className='field grid mt-5 pr-4 pt-1'>
                          <div className='flex col-12 pt-2'>
                            <div className='text-primary-800 font-bold pr-2 pt-1'>
                              Product ?
                            </div>
                            <InputSwitch
                              checked={formValues?.isProduct}
                              onChange={(e) =>
                                setFormValues({
                                  ...formValues,
                                  isProduct: e.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className='field grid mt-5'>
                          <div className='flex col-12'>
                            <div className='text-primary-800 font-bold pr-2 pt-3'>
                              <div>Price</div>
                            </div>
                            <div>
                              <InputNumber
                                name='productPrice'
                                className='w-full'
                                value={formValues.productPrice || 0}
                                onValueChange={(e) => {
                                  setFormValues({
                                    ...formValues,
                                    productPrice: e.value || 0,
                                  })
                                  setErrorForm({
                                    ...errorForm,
                                    productPrice: {
                                      status: false,
                                      message: '',
                                    },
                                  })
                                }}
                                minFractionDigits={0}
                                maxFractionDigits={2}
                              />
                              {errorForm.productPrice.status && (
                                <div className='pt-2 text-red-700 text-sm'>
                                  {errorForm.productPrice.message}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='field mt-2'>
                        <div className='flex items-center text-primary-800 font-bold pb-2'>
                          <div>Program Period</div>
                        </div>
                        <div className='flex items-center'>
                          <div>
                            <Calendar
                              value={
                                formValues?.periodAt
                                  ? dayjs(formValues?.periodAt).toDate()
                                  : null
                              }
                              onChange={(e) => {
                                if (e.value) {
                                  setFormValues({
                                    ...formValues,
                                    periodAt: e.value,
                                  })
                                } else {
                                  setFormValues({
                                    ...formValues,
                                    periodAt: undefined,
                                    periodEnd: undefined,
                                  })
                                }
                              }}
                              dateFormat='dd/mm/yy '
                              showTime
                              hourFormat='24'
                              showIcon
                              showButtonBar
                              onBlur={(e) => {
                                e.preventDefault()
                              }}
                            />
                          </div>
                          <div className='px-4 py-2'>to</div>
                          <div>
                            <Calendar
                              disabled={!formValues?.periodAt}
                              value={
                                formValues?.periodEnd
                                  ? dayjs(formValues?.periodEnd).toDate()
                                  : null
                              }
                              onChange={(e) => {
                                setFormValues({
                                  ...formValues,
                                  periodEnd: e.value || undefined,
                                })
                              }}
                              minDate={dayjs(formValues?.periodAt)
                                .add(1, 'day')
                                .toDate()}
                              dateFormat='dd/mm/yy '
                              showTime
                              showButtonBar
                              hourFormat='24'
                              showIcon
                            />
                          </div>
                        </div>
                        <div className='flex -mx-2'>
                          {errorForm.periodAt.status && (
                            <div className='pt-2 text-red-700 text-sm px-2'>
                              {errorForm.periodAt.message}
                            </div>
                          )}
                          {errorForm.periodEnd.status && (
                            <div className='pt-2 text-red-700 text-sm px-2'>
                              {errorForm.periodEnd.message}
                            </div>
                          )}
                        </div>
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
                                title: {
                                  status: false,
                                  message: '',
                                },
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
                                shortDesc: {
                                  status: false,
                                  message: '',
                                },
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

                      <div className='field grid'>
                        <div className='col-12'>
                          <div className='text-primary-800 font-bold pb-2'>
                            Content <span className='text-red-700'>*</span>
                          </div>
                          <CustomEditor
                            key={`content-${formLocale}`}
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

                      <div className='field grid'>
                        <div className='col-12'>
                          <div className='text-primary-800 font-bold pb-2'>
                            Author
                          </div>
                          <InputText
                            key={`author-${formLocale}`}
                            className='w-full'
                            maxLength={255}
                            onChange={(e) => {
                              setFormValues({
                                ...formValues,
                                author: e.target.value || '',
                              })
                              setErrorForm({
                                ...errorForm,
                                author: {
                                  status: false,
                                  message: '',
                                },
                              })
                            }}
                            value={formValues.author}
                          />
                          {errorForm.author.status && (
                            <div className='pt-2 text-red-700 text-sm'>
                              {errorForm.author.message}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className='flex flex-column mt-5 gap-2'>
                        <div className='pb-2'>
                          <div className='text-primary-800 font-bold'>
                            Thumbnail image{' '}
                            <span className='text-red-700'>*</span>
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
                                key={`thumbnail-button-${formLocale}`}
                                rules={{ required: false }}
                                acceptTypes={acceptImageFileTypes.join(', ')}
                                name='coverImage'
                                outputType='file'
                                mode='single'
                                onError={setInvalidThumbnailFile}
                                onChange={(file) =>
                                  onFileChange('thumbnail', file)
                                }
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
                            Cover image <span className='text-red-700'>*</span>
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
                                key={`banner-button-${formLocale}`}
                                rules={{ required: false }}
                                acceptTypes={acceptImageFileTypes.join(', ')}
                                name='coverImage'
                                outputType='file'
                                mode='single'
                                onError={setInvalidBannerFile}
                                onChange={(file) =>
                                  onFileChange('banner', file)
                                }
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

                      <div className='flex flex-wrap -mx-2 mt-4'>
                        <div className='col-6 mb-2 px-2'>
                          <div className='text-primary-800 font-bold pb-2'>
                            Opening hours
                          </div>
                          <Chips
                            key={`opening-hours-${formLocale}`}
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
                            key={`location-${formLocale}`}
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
                              key={`enter-fee-${formLocale}`}
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
                                key={`display-free-label-${formLocale}`}
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
                            key={`external-link-${formLocale}`}
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

                      <div className='flex -mx-2'>
                        <div className='w-6 mt-5 px-2'>
                          <div className='field grid'>
                            <div className='col-12'>
                              <div className='text-primary-800 font-bold pb-2'>
                                Audio
                              </div>
                              <InputText
                                key={`audio-${formLocale}`}
                                className='w-full'
                                maxLength={255}
                                onChange={(e) => {
                                  setFormValues({
                                    ...formValues,
                                    audio:
                                      e.target.value.replace(
                                        /true/g,
                                        'false'
                                      ) || '',
                                  })
                                  setErrorForm({
                                    ...errorForm,
                                    audio: { status: false, message: '' },
                                  })
                                }}
                                value={formValues.audio}
                              />
                              {errorForm.audio.status && (
                                <div className='pt-2 text-red-700 text-sm'>
                                  {errorForm.audio.message}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className='w-6 mt-5 px-2'>
                          <div className='field grid'>
                            <div className='col-12'>
                              <div className='text-primary-800 font-bold pb-2'>
                                Video
                              </div>
                              <InputText
                                key={`video-${formLocale}`}
                                className='w-full'
                                maxLength={255}
                                onChange={(e) => {
                                  setFormValues({
                                    ...formValues,
                                    video: e.target.value || '',
                                  })
                                  setErrorForm({
                                    ...errorForm,
                                    video: { status: false, message: '' },
                                  })
                                }}
                                value={formValues.video}
                              />
                              {errorForm.video.status && (
                                <div className='pt-2 text-red-700 text-sm'>
                                  {errorForm.video.message}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='field grid mt-3'>
                        <div className='col-6'>
                          <div className='text-primary-800 font-bold pb-2'>
                            Tags
                          </div>
                          <Chips
                            key={`tags-${formLocale}`}
                            name='tags'
                            className='w-full'
                            value={formValues.tags}
                            onChange={(e) => {
                              setFormValues({
                                ...formValues,
                                tags: e.value || [],
                              })
                              setErrorForm({
                                ...errorForm,
                                tags: {
                                  status: false,
                                  message: '',
                                },
                              })
                            }}
                            separator=','
                          />
                          {errorForm.tags.status && (
                            <div className='pt-2 text-red-700 text-sm'>
                              {errorForm.tags.message}
                            </div>
                          )}
                        </div>
                      </div>

                      <hr className='mt-5' />

                      <div>
                        <div className='text-primary-800 font-bold pt-2'>
                          Program Info Items
                        </div>
                        <div id='program-info-items' className='-mt-2 pt-5'>
                          {formValues.infoItems &&
                          formValues.infoItems.length > 0 ? (
                            <>
                              {formValues.infoItems.map((item, index) => (
                                <div
                                  key={`program-info-item-${index}`}
                                  className='flex w-full py-4 px-2 mb-4 border-1 border-gray-200 tw-rounded-lg'
                                >
                                  <div className='w-6 px-2'>
                                    <div className='text-primary-800 font-bold pb-2'>
                                      Title{' '}
                                      <span className='text-red-700'>*</span>
                                    </div>
                                    <InputText
                                      key={`info-item-title-${index}-${formLocale}`}
                                      className='w-full'
                                      maxLength={255}
                                      onChange={(e) => {
                                        setFormValues({
                                          ...formValues,
                                          infoItems: formValues.infoItems.map(
                                            (infoItem, i) => {
                                              if (i === index) {
                                                return {
                                                  ...infoItem,
                                                  title: e.target.value,
                                                }
                                              }
                                              return infoItem
                                            }
                                          ),
                                        })
                                      }}
                                      value={item.title}
                                    />
                                    {infoItemErrorForm[index] &&
                                      infoItemErrorForm[index].title.status && (
                                        <div className='pt-2 text-red-700 text-sm'>
                                          {
                                            infoItemErrorForm[index].title
                                              .message
                                          }
                                        </div>
                                      )}
                                  </div>
                                  <div className='w-6 px-2'>
                                    <div className='text-primary-800 font-bold pb-2'>
                                      Content{' '}
                                      <span className='text-red-700'>*</span>
                                    </div>
                                    <InputTextarea
                                      key={`info-item-content-${index}-${formLocale}`}
                                      className='w-full'
                                      value={item.content}
                                      onChange={(e: any) =>
                                        setFormValues({
                                          ...formValues,
                                          infoItems: formValues.infoItems.map(
                                            (infoItem, i) => {
                                              if (i === index) {
                                                return {
                                                  ...infoItem,
                                                  content: e.target.value,
                                                }
                                              }
                                              return infoItem
                                            }
                                          ),
                                        })
                                      }
                                      rows={3}
                                    />
                                    {infoItemErrorForm[index] &&
                                      infoItemErrorForm[index].content
                                        .status && (
                                        <div className='pt-2 text-red-700 text-sm'>
                                          {
                                            infoItemErrorForm[index].content
                                              .message
                                          }
                                        </div>
                                      )}
                                  </div>
                                  <div className='px-2 pt-4'>
                                    <Button
                                      key={`remove-info-item-${index}-${formLocale}`}
                                      size='small'
                                      icon='pi pi-trash'
                                      severity='danger'
                                      aria-label='Cancel'
                                      onClick={() => {
                                        setFormValues({
                                          ...formValues,
                                          infoItems:
                                            formValues.infoItems.filter(
                                              (infoItem, i) => i !== index
                                            ),
                                        })
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </>
                          ) : (
                            <div className='text-center pb-5 text-gray-400'>
                              No info items
                            </div>
                          )}
                        </div>
                        <div className='mt-3'>
                          <Button
                            key={`add-info-item-${formLocale}`}
                            type='button'
                            label='Add Info Items +'
                            className='w-full'
                            outlined
                            onClick={() => {
                              setFormValues({
                                ...formValues,
                                infoItems: [
                                  ...formValues.infoItems,
                                  { title: '', content: '' },
                                ],
                              })
                            }}
                          />
                        </div>
                      </div>

                      <hr className='mt-4' />

                      <div className='-mx-2'>
                        <div className='w-full flex-shrink-0 mt-5 px-2'>
                          <div className='text-primary-800 font-bold pb-2'>
                            Relate Programs
                          </div>
                          <div className='border-2 border-gray-200 tw-rounded-lg py-2 px-5'>
                            <div className='multi-select-display-all pt-4'>
                              <MultiSelect
                                key={`relate-programs-${formLocale}`}
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
                                    relateProgramIds: e.value.map(
                                      (item: string) => Number(item)
                                    ),
                                  })
                                }}
                                optionLabel='label'
                                filter
                                placeholder='Select Relate Programs'
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

                      <div className='-mx-2'>
                        <div className='w-full flex-shrink-0 mt-5 px-2'>
                          <div className='text-primary-800 font-bold pb-2'>
                            Relate Products
                          </div>
                          <div className='border-2 border-gray-200 tw-rounded-lg py-2 px-5'>
                            <div className='multi-select-display-all pt-4'>
                              <MultiSelect
                                key={`relate-products-${formLocale}`}
                                display='chip'
                                value={
                                  formValues.relateProductIds
                                    ? formValues.relateProductIds.map(
                                        (item) => `${item}`
                                      )
                                    : []
                                }
                                options={programOptions}
                                onChange={(e) => {
                                  setFormValues({
                                    ...formValues,
                                    relateProductIds: e.value.map(
                                      (item: string) => Number(item)
                                    ),
                                  })
                                }}
                                optionLabel='label'
                                filter
                                placeholder='Select Relate Products'
                                maxSelectedLabels={100}
                                className='w-full'
                              />
                            </div>

                            <div className='text-primary-800 font-bold pt-4'>
                              Order Items
                            </div>
                            {formValues.relateProductIds &&
                            formValues.relateProductIds.length > 0 ? (
                              <DragDropContext
                                onDragEnd={handleDragRelateProductOrder}
                              >
                                <Droppable droppableId='boxes'>
                                  {(provided) => (
                                    <ul
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      className='list-none pl-0'
                                    >
                                      {formValues.relateProductIds.map(
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
                  className='bg-cover bg-center'
                  style={{
                    backgroundImage: `url(${
                      formValues.banner
                        ? formValues.banner
                        : '/images/art-c/thumb-img-375-520.png'
                    })`,
                  }}
                >
                  <Image
                    src='/images/art-c/space-375-450.png'
                    className='w-full h-auto'
                    alt=''
                    width={375}
                    height={450}
                  />
                </div>

                <div className='pt-4 px-4'>
                  <div>
                    <div className='text-sm' style={{ color: '#DC7032' }}>
                      <strong>
                        {artCTypeOptions.find(
                          (item) => item.value === selectedArtCType
                        )?.label || 'Selected Type'}
                      </strong>
                    </div>
                    <h4 className='mt-2 mb-0'>
                      {formValues.title || 'Title go here'}
                    </h4>
                    <div className='text-sm pt-1'>
                      {formValues.author || 'Author go here'}
                    </div>
                    <div
                      className='pt-4'
                      style={{ fontWeight: 'bold' }}
                      dangerouslySetInnerHTML={{
                        __html: formValues.shortDesc.replace(
                          /(?:\r\n|\r|\n)/g,
                          '<br />'
                        ),
                      }}
                    />
                  </div>

                  {!formValues.isProduct && (
                    <div>
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
                                <strong>Opening Period</strong>
                              </div>
                            </div>

                            <div className='capitalize'>
                              {dayjs(formValues.periodAt).format('DD MMM YYYY')}{' '}
                              -{' '}
                              {dayjs(formValues.periodEnd).format(
                                'DD MMM YYYY'
                              )}
                            </div>
                          </div>
                        )}
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
                      {formValues.locations &&
                        formValues.locations.length > 0 && (
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
                    </div>
                  )}

                  <div
                    className='mt-4 pt-3'
                    style={{
                      maxWidth: '342px',
                      borderTop: '1px solid #E5E5E5',
                    }}
                  >
                    <Image
                      src='/images/art-c/content-btn-ctrl.png'
                      className='w-full h-auto'
                      alt=''
                      width={342}
                      height={40}
                    />
                  </div>

                  <div
                    className='mt-4 preview-html-content'
                    dangerouslySetInnerHTML={{
                      __html: formValues.desc || 'Content go here',
                    }}
                  />

                  {formValues.infoItems && formValues.infoItems.length > 0 && (
                    <div>
                      {formValues.infoItems.map((item, index) => (
                        <div
                          key={`program-info-item-${index}`}
                          className='pt-3'
                        >
                          <div className='text-sm pb-1'>
                            <strong>{item.title}</strong>
                          </div>

                          <div className='capitalize'>{item.content}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {formValues.isProduct && (
                    <div>
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
                                <strong>Opening Period</strong>
                              </div>
                            </div>

                            <div className='capitalize'>
                              {dayjs(formValues.periodAt).format('DD MMM YYYY')}{' '}
                              -{' '}
                              {dayjs(formValues.periodEnd).format(
                                'DD MMM YYYY'
                              )}
                            </div>
                          </div>
                        )}

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

                      {formValues.locations &&
                        formValues.locations.length > 0 && (
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
                    </div>
                  )}

                  {formValues.audio && (
                    <div className='pt-4'>
                      <iframe width='100%' src={formValues.audio}></iframe>
                    </div>
                  )}

                  {formValues.video && (
                    <div className='pt-4'>
                      <iframe
                        width='100%'
                        height='220'
                        src={formValues.video}
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                      ></iframe>
                    </div>
                  )}

                  {formValues.partners && formValues.partners.length > 0 && (
                    <div className='pt-4'>
                      <div className='text-sm'>
                        <strong>In partnership with</strong>
                      </div>
                      <div className='flex -mx-1 pt-2'>
                        {formValues.partners.map((partner) => {
                          let translation: IPartnerTranslation | undefined
                          for (let item of ['en', 'th', 'zh']) {
                            translation = partner.partnerTranslation.find(
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
                              key={`preview-partner-item-${partner.id}`}
                              className='px-1'
                            >
                              <div
                                className='bg-cover bg-center'
                                style={{
                                  backgroundImage: `url(${translation.thumbnail})`,
                                }}
                              >
                                <Image
                                  src='/images/art-c/dot.png'
                                  className='w-12 h-12'
                                  alt=''
                                  width={60}
                                  height={60}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {formValues.tags && formValues.tags.length > 0 && (
                    <div className='pt-4'>
                      <div className='text-sm pb-2'>
                        <strong>Tags</strong>
                      </div>
                      <div className='flex flex-wrap -mx-1'>
                        {formValues.tags.map((tag, index) => (
                          <div key={`tag-item-${index}`} className='px-1 pb-2'>
                            <div
                              className='px-3 py-1'
                              style={{
                                border: '1px solid #4F4F4F',
                                borderRadius: '16px',
                              }}
                            >
                              {tag}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {formValues.addOns && formValues.addOns.length > 0 && (
                    <div className='pt-4'>
                      <div className='text-sm pb-2'>
                        <strong>Add on Material</strong>
                      </div>
                      <div className='flex -mx-1 tw-overflow-x-auto'>
                        {formValues.addOns.map((addOn) => {
                          let translation: IAddOnTranslation | undefined
                          for (let item of ['en', 'th', 'zh']) {
                            translation = addOn.addOnTranslation.find(
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
                              key={`preview-add-on-${addOn.id}`}
                              className='px-1 col-7'
                            >
                              <div
                                className='relative bg-cover bg-center'
                                style={{
                                  backgroundImage: `url(${translation.thumbnail})`,
                                }}
                              >
                                <Image
                                  src='/images/art-c/space-200-360.png'
                                  className='w-full h-auto'
                                  width={200}
                                  height={360}
                                  alt=''
                                />
                                <div
                                  className='absolute w-full bottom-0 left-0 text-white px-2 pt-4'
                                  style={{
                                    height: '30%',
                                    fontWeight: 'bold',
                                    background:
                                      'linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.65) 60%, rgba(0,0,0,0) 100%)',
                                  }}
                                >
                                  <div
                                    className='text-sm capitalize pb-2'
                                    style={{ color: '#ADBCF4' }}
                                  >
                                    {addOn.type}
                                  </div>
                                  <div>{translation.title}</div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {selectedRelatePrograms &&
                    selectedRelatePrograms.length > 0 && (
                      <>
                        <div className='mt-5'>
                          <div>
                            <div className='text-sm pb-2'>
                              <strong>Relate Programs</strong>
                            </div>

                            <div className='flex pt-2 -mx-1 overflow-x-auto'>
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
                                    className='col-7 px-1 flex-shrink-0 h-full'
                                  >
                                    <div
                                      style={{ border: '1px solid #dcdcdc' }}
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
                                          <strong>{translation.title}</strong>
                                        </div>
                                        {translation.author && (
                                          <div className='text-sm pb-2'>
                                            by{' '}
                                            <span style={{ color: '#EB4D3D' }}>
                                              {translation.author}
                                            </span>
                                          </div>
                                        )}
                                        {translation.locations &&
                                          translation.locations.length > 0 && (
                                            <div className='text-sm pb-2'>
                                              {translation.locations.join(', ')}
                                            </div>
                                          )}
                                        {program.publishedAt && (
                                          <div className='text-sm'>
                                            {dayjs(program.publishedAt).format(
                                              'DD MMM YYYY'
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                  {selectedRelateProducts &&
                    selectedRelateProducts.length > 0 && (
                      <>
                        <div className='mt-5 pb-2'>
                          <div>
                            <div className='text-sm pb-2'>
                              <strong>Relate Products</strong>
                            </div>

                            <div className='flex pt-2 -mx-1 tw-overflow-x-auto'>
                              {selectedRelateProducts.map((program) => {
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
                                    className='col-7 px-1 flex-shrink-0 h-full'
                                  >
                                    <div
                                      style={{ border: '1px solid #dcdcdc' }}
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
                                          <strong>{translation.title}</strong>
                                        </div>
                                        {translation.author && (
                                          <div className='text-sm pb-2'>
                                            by{' '}
                                            <span style={{ color: '#EB4D3D' }}>
                                              {translation.author}
                                            </span>
                                          </div>
                                        )}
                                        {translation.locations &&
                                          translation.locations.length > 0 && (
                                            <div className='text-sm pb-2'>
                                              {translation.locations.join(', ')}
                                            </div>
                                          )}
                                        {program.publishedAt && (
                                          <div className='text-sm'>
                                            {dayjs(program.publishedAt).format(
                                              'DD MMM YYYY'
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </>
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
