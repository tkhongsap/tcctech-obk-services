import { Tab, TabList, Tabs } from '@chakra-ui/react'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import withGenericServer from '@hocs/server/generic'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import {
  IArtCTranslation,
  IArtCTypeItem,
  IInputErrors,
  ILandingPage,
  ILandingPageForm,
  ILandingPageTranslation,
  IProgram,
  IProgramTranslation,
  LandingPageFormData,
  OptionItem,
} from '@src/services/art-and-culture/model'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { MultiSelect } from 'primereact/multiselect'
import { Panel } from 'primereact/panel'
import * as Yup from 'yup'
import React, { useEffect, useRef, useState } from 'react'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'
import {
  isObjectDeepEqual,
  mappingValidateErrorMessage,
} from '@src/utils/art-c'
import { AxiosResponse } from 'axios'
import { InputTextarea } from 'primereact/inputtextarea'
import Image from 'next/image'
import { toast } from 'react-toastify'
import HighlightProgramSlide from '@components/art-and-culture/program/highlight-program-slide'
import { InputNumber } from 'primereact/inputnumber'
import { artCLandingServices } from '@src/services/art-and-culture/art-c-landing-service'
import { artCProgramServices } from '@src/services/art-and-culture/art-c-program-service'

interface ILandingFormTransValue {
  th: ILandingPageForm
  en: ILandingPageForm
  zh: ILandingPageForm
}

export default function ArtCultureLandingPage() {
  const router = useRouter()
  const { locale } = router.query
  const formRef = useRef<FormControllerRef<ILandingPageForm>>(null)
  const { setMenuName } = useLayoutContext()

  const defaultValue = new LandingPageFormData()
  const [isFormSubmitting, setIsFormSubmitting] = useState(false)
  const [formLocale, setFormLocale] = useState<string>(
    locale ? `${locale}` : 'en'
  )
  const [formValues, setFormValues] = useState<ILandingPageForm>(defaultValue)
  const [formTransValues, setFormTransValues] =
    useState<ILandingFormTransValue>({
      th: defaultValue,
      en: defaultValue,
      zh: defaultValue,
    })

  const [content, setContent] = useState<ILandingPage>()

  const [programs, setPrograms] = useState<IProgram[]>([])
  const [programOptions, setProgramOptions] = useState<OptionItem[]>([])

  const initFormErrors: IInputErrors = {
    programsId: { status: false, message: '' },
    highlightAutoPlay: { status: false, message: '' },
    artCTitle: { status: false, message: '' },
    artCDesc: { status: false, message: '' },
    artMapTitle: { status: false, message: '' },
    artMapDesc: { status: false, message: '' },
    programTitle: { status: false, message: '' },
    programDesc: { status: false, message: '' },
  }

  const [errorForm, setErrorForm] = useState(initFormErrors)
  const [requestError, setRequestError] = useState({
    status: false,
    message: '',
  })

  let validationSchema = Yup.object({
    programsId: Yup.array().min(1, 'Programs is required'),
    highlightAutoPlay: Yup.number()
      .min(1, 'Autoplay duration must be more than 0')
      .required('Autoplay duration is required'),
    artCTitle: Yup.string().required('Title is required'),
    artCDesc: Yup.string().required('Description is required'),
    artMapTitle: Yup.string().required('Title is required'),
    artMapDesc: Yup.string().required('Description is required'),
    programTitle: Yup.string().required('Title is required'),
    programDesc: Yup.string().required('Description is required'),
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
      prepareFormValues[formLocale as keyof ILandingFormTransValue] = formValues
    }

    let isOtherLocaleValid = true
    for (const key in formTransValues) {
      if (isOtherLocaleValid) {
        const checkFormValues = {
          artCTitle:
            formTransValues[key as keyof ILandingFormTransValue].artCTitle,
          artCDesc:
            formTransValues[key as keyof ILandingFormTransValue].artCDesc,
          artMapTitle:
            formTransValues[key as keyof ILandingFormTransValue].artMapTitle,
          artMapDesc:
            formTransValues[key as keyof ILandingFormTransValue].artMapDesc,
          programTitle:
            formTransValues[key as keyof ILandingFormTransValue].programTitle,
          programDesc:
            formTransValues[key as keyof ILandingFormTransValue].programDesc,
        }

        const initValues = {
          artCTitle: defaultValue.artCTitle,
          artCDesc: defaultValue.artCDesc,
          artMapTitle: defaultValue.artMapTitle,
          artMapDesc: defaultValue.artMapDesc,
          programTitle: defaultValue.programTitle,
          programDesc: defaultValue.programDesc,
        }

        if (!isObjectDeepEqual(checkFormValues, initValues)) {
          const result = await validationSchema
            .validate(
              {
                ...checkFormValues,
                programsId:
                  formTransValues[key as keyof ILandingFormTransValue]
                    .programsId,
                highlightAutoPlay:
                  formTransValues[key as keyof ILandingFormTransValue]
                    .highlightAutoPlay,
              },
              { abortEarly: false }
            )
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
            formValuesItem.push(key)
            prepareFormValues[key as keyof ILandingFormTransValue].programsId =
              formValues.programsId
            prepareFormValues[
              key as keyof ILandingFormTransValue
            ].highlightAutoPlay = formValues.highlightAutoPlay
            prepareFormValues[key as keyof ILandingFormTransValue].artCTypesId =
              formValues.artCTypesId
            prepareFormValues[
              key as keyof ILandingFormTransValue
            ].sectionOrder = formValues.sectionOrder
          }
        }
      }
    }

    if (!isOtherLocaleValid) {
      return
    }

    setIsFormSubmitting(true)

    let res = { status: false }
    for (const key in prepareFormValues) {
      if (formValuesItem.includes(key)) {
        res = await saveFormValues(
          `${key}`,
          prepareFormValues[key as keyof ILandingFormTransValue]
        )
      }
    }

    if (res.status) {
      toast.success('Successfully updated landing page content')
    } else {
      toast.error('Update landing page content failed')
    }

    setIsFormSubmitting(false)
  }

  const saveFormValues = async (
    saveLocale: string,
    values: ILandingPageForm
  ): Promise<{ status: boolean }> => {
    try {
      let result: AxiosResponse | null = null

      result = await artCLandingServices.edit(saveLocale, values)

      if (!result) return { status: false }

      if (result.status == 200) {
        return { status: true }
      } else {
        setRequestError({ status: true, message: result.data.message })
        return { status: false }
      }
    } catch (error) {
      setRequestError({
        status: true,
        message: 'Something went wrong. Please try again later.',
      })
      return { status: false }
    }
  }

  const [artCTypeContent, setArtCTypeContent] = useState<IArtCTypeItem[]>([])
  const fetchContent = async () => {
    await artCLandingServices
      .get('all')
      .then((res) => {
        const { data } = res.data
        setContent(data)
        setArtCTypeContent(data.artCTypes)
      })
      .catch(() => {
        alert("Something went wrong, can't fetch page content.")
        router.replace('/')
      })
  }

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

  useEffect(() => {
    setMenuName('Landing Page')
    fetchContent()
    fetchPrograms()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuName])

  const initialFormValues = (content: ILandingPage | undefined) => {
    if (content && content.translation.length > 0) {
      const value = formTransValues

      content.translation.forEach((itemTrans: ILandingPageTranslation) => {
        if (itemTrans.locale === 'en') {
          value['en'] = {
            artCTitle: itemTrans.content.artCTitle || '',
            artCDesc: itemTrans.content.artCDesc || '',
            artMapTitle: itemTrans.content.artMapTitle || '',
            artMapDesc: itemTrans.content.artMapDesc || '',
            programTitle: itemTrans.content.programTitle || '',
            programDesc: itemTrans.content.programDesc || '',
            programsId: content.highlightPrograms.map((item) => item.id),
            highlightAutoPlay: content.highlightAutoPlay,
            artCTypesId: content.artCTypes.map((item) => item.id),
            sectionOrder: content.sectionOrder,
          }
        }

        if (itemTrans.locale === 'th') {
          value['th'] = {
            artCTitle: itemTrans.content.artCTitle || '',
            artCDesc: itemTrans.content.artCDesc || '',
            artMapTitle: itemTrans.content.artMapTitle || '',
            artMapDesc: itemTrans.content.artMapDesc || '',
            programTitle: itemTrans.content.programTitle || '',
            programDesc: itemTrans.content.programDesc || '',
            programsId: content.highlightPrograms.map((item) => item.id),
            highlightAutoPlay: content.highlightAutoPlay,
            artCTypesId: content.artCTypes.map((item) => item.id),
            sectionOrder: content.sectionOrder,
          }
        }

        if (itemTrans.locale === 'zh') {
          value['zh'] = {
            artCTitle: itemTrans.content.artCTitle || '',
            artCDesc: itemTrans.content.artCDesc || '',
            artMapTitle: itemTrans.content.artMapTitle || '',
            artMapDesc: itemTrans.content.artMapDesc || '',
            programTitle: itemTrans.content.programTitle || '',
            programDesc: itemTrans.content.programDesc || '',
            programsId: content.highlightPrograms.map((item) => item.id),
            highlightAutoPlay: content.highlightAutoPlay,
            artCTypesId: content.artCTypes.map((item) => item.id),
            sectionOrder: content.sectionOrder,
          }
        }
      })

      setFormTransValues(value)
      setFormValues(value[formLocale as keyof ILandingFormTransValue])
    }
  }

  const handleFormLocaleChange = (locale: string) => {
    setErrorForm(initFormErrors)
    setRequestError({ status: false, message: '' })

    // save current form values to formTransValues
    const tempFormTransValues = formTransValues
    tempFormTransValues[formLocale as keyof ILandingFormTransValue] = formValues

    Object.keys(tempFormTransValues).forEach((key) => {
      if (key === formLocale) return
      tempFormTransValues[key as keyof ILandingFormTransValue] = {
        ...tempFormTransValues[key as keyof ILandingFormTransValue],
        programsId: formValues.programsId,
        highlightAutoPlay: formValues.highlightAutoPlay,
        artCTypesId: formValues.artCTypesId,
        sectionOrder: formValues.sectionOrder,
      }
    })

    setFormTransValues(tempFormTransValues)

    // set form locale and form values
    setFormLocale(locale)
    setFormValues(tempFormTransValues[locale as keyof ILandingFormTransValue])
  }

  useEffect(() => {
    if (content) {
      initialFormValues(content)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content])

  const [highlightPrograms, setHighlightPrograms] = useState<IProgram[]>([])
  const handleHighlightPrograms = () => {
    if (
      !formValues.programsId ||
      formValues.programsId.length === 0 ||
      programs.length === 0
    ) {
      return
    }

    const highlightPrograms: IProgram[] = []
    formValues.programsId.forEach((id) => {
      const program = programs.find((item) => item.id === id)
      if (!program) return

      highlightPrograms.push(program)
    })

    setHighlightPrograms(highlightPrograms)
  }

  useEffect(() => {
    handleHighlightPrograms()
  }, [formValues, programs])

  const handleDragHighlightProgramOrder = (result: DropResult) => {
    if (!result || !result.destination) return
    const newList = Array.from(formValues.programsId)
    const [draggedItem] = newList.splice(result.source.index, 1)
    newList.splice(result.destination!.index, 0, draggedItem)

    setFormValues({ ...formValues, programsId: newList })
  }

  const handleDragSectionOrder = (result: DropResult) => {
    if (!result || !result.destination) return

    const newList = Array.from(formValues.sectionOrder)
    const [draggedItem] = newList.splice(result.source.index, 1)
    newList.splice(result.destination!.index, 0, draggedItem)

    setFormValues({ ...formValues, sectionOrder: newList })
  }

  const handleDragArtCType = (result: DropResult) => {
    if (!result || !result.destination) return
    if (!content || content.artCTypes.length === 0) return

    const newList = Array.from(formValues.artCTypesId)
    const [draggedItem] = newList.splice(result.source.index, 1)
    newList.splice(result.destination!.index, 0, draggedItem)

    setFormValues({ ...formValues, artCTypesId: newList })

    const newArtCTypes = []
    for (let i = 0; i < newList.length; i++) {
      const artCItem = artCTypeContent.find((item) => item.id === newList[i])
      if (artCItem) {
        newArtCTypes.push(artCItem)
      }
    }

    setArtCTypeContent(newArtCTypes)
  }

  const buttonActionTemplate = (
    <div className='flex gap-3 justify-content-center md:justify-content-start'>
      <Button
        disabled={isFormSubmitting}
        className='px-5 py-3 bg-primary-blue text-white'
        label='Publish'
        onClick={formRef.current?.handleSubmit(onSubmit)}
      />
    </div>
  )

  return (
    <>
      <div className='flex'>
        <div className='col-8'>
          <FormController
            ref={formRef}
            defualtValue={defaultValue}
            onSubmit={onSubmit}
          >
            <Panel className='mb-5'>
              {formValues && content && (
                <div className='p-2'>
                  <div>
                    <h4 className='text-astronaut font-bold'>Details</h4>
                    <small className='font-medium'>
                      Last update&nbsp;
                      <span className='font-bold'>
                        {dayjs(content.updatedAt).format('DD/MM/YYYY HH:mm')}
                        &nbsp;
                      </span>
                    </small>
                  </div>

                  <div className='-mx-2'>
                    <div className='w-full flex-shrink-0 mt-5 px-2'>
                      <div className='text-primary-800 font-bold pb-2'>
                        Highlight Programs
                      </div>

                      <div className='border-2 border-gray-200 tw-rounded-lg py-2 px-5'>
                        <div className='multi-select-display-all pt-4'>
                          <MultiSelect
                            display='chip'
                            value={formValues.programsId.map(
                              (item) => `${item}`
                            )}
                            options={programOptions}
                            onChange={(e) => {
                              {
                                setFormValues({
                                  ...formValues,
                                  programsId: e.value.map((item: string) =>
                                    Number(item)
                                  ),
                                })
                                setErrorForm({
                                  ...errorForm,
                                  programsId: { status: false, message: '' },
                                })
                              }
                            }}
                            optionLabel='label'
                            filter
                            placeholder='Select highlight programs'
                            maxSelectedLabels={100}
                            className='w-full'
                          />
                        </div>
                        {errorForm.programsId.status && (
                          <div className='pt-2 text-red-700 text-sm'>
                            {errorForm.programsId.message}
                          </div>
                        )}

                        <div className='text-primary-800 font-bold pt-4'>
                          Order Items
                        </div>
                        {formValues.programsId.length > 0 ? (
                          <DragDropContext
                            onDragEnd={handleDragHighlightProgramOrder}
                          >
                            <Droppable droppableId='boxes'>
                              {(provided) => (
                                <ul
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  className='list-none pl-0'
                                >
                                  {formValues.programsId.map((id, index) => {
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
                                  })}
                                </ul>
                              )}
                            </Droppable>
                          </DragDropContext>
                        ) : (
                          <div className='py-8 text-center'>
                            No selected programs
                          </div>
                        )}

                        <div className='col-6 mb-2 px-2'>
                          <div className='text-primary-800 font-bold pb-2'>
                            Autoplay in second{' '}
                            <span className='text-red-700'>*</span>
                          </div>
                          <InputNumber
                            name='enterFee'
                            className='w-full'
                            value={formValues.highlightAutoPlay || 0}
                            onValueChange={(e) => {
                              setFormValues({
                                ...formValues,
                                highlightAutoPlay: e.value || 0,
                              })
                              setErrorForm({
                                ...errorForm,
                                highlightAutoPlay: {
                                  status: false,
                                  message: '',
                                },
                              })
                            }}
                            minFractionDigits={0}
                            maxFractionDigits={0}
                          />
                          {errorForm.highlightAutoPlay.status && (
                            <div className='pt-2 text-red-700 text-sm'>
                              {errorForm.highlightAutoPlay.message}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='mt-5'>
                    <div className='text-primary-800 font-bold pb-2'>
                      Section Order
                    </div>

                    <div className='border-2 border-gray-200 tw-rounded-lg py-2 px-5'>
                      {formValues.sectionOrder.length > 0 ? (
                        <DragDropContext onDragEnd={handleDragSectionOrder}>
                          <Droppable droppableId='boxes'>
                            {(provided) => (
                              <ul
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className='list-none pl-0'
                              >
                                {formValues.sectionOrder.map(
                                  (section, index) => (
                                    <Draggable
                                      key={section}
                                      draggableId={`section-item-${section}`}
                                      index={index}
                                    >
                                      {(provided) => (
                                        <li
                                          ref={provided.innerRef}
                                          {...provided.dragHandleProps}
                                          {...provided.draggableProps}
                                        >
                                          <div className='w-full border-2 border-gray-200 tw-rounded-lg text-center py-4 my-4 font-bold capitalize'>
                                            {section === 'art+c'
                                              ? 'Art & Culture'
                                              : section}
                                          </div>
                                        </li>
                                      )}
                                    </Draggable>
                                  )
                                )}
                              </ul>
                            )}
                          </Droppable>
                        </DragDropContext>
                      ) : (
                        <div className='text-center'>
                          There is no section order.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='mt-5'>
                    <div className='text-primary-800 font-bold pb-2'>
                      Art & Culture Category Order
                    </div>

                    <div className='border-2 border-gray-200 tw-rounded-lg py-2 px-5'>
                      <div
                        className='art-c-dd-container w-full mx-auto'
                        style={{ maxWidth: '768px' }}
                      >
                        {artCTypeContent && artCTypeContent.length > 0 ? (
                          <DragDropContext onDragEnd={handleDragArtCType}>
                            <Droppable droppableId='boxes'>
                              {(provided) => (
                                <ul
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  className='list-none flex flex-wrap pl-0'
                                >
                                  {artCTypeContent.map((artCType, index) => {
                                    let title = '-'

                                    if (artCType.artCTranslation) {
                                      let translation:
                                        | IArtCTranslation
                                        | undefined
                                      for (let item of ['en', 'th', 'zh']) {
                                        translation =
                                          artCType.artCTranslation?.find(
                                            (tItem) => tItem.locale === item
                                          )

                                        if (translation) {
                                          break
                                        }
                                      }

                                      if (translation) {
                                        title = translation.title
                                      }
                                    }

                                    return (
                                      <Draggable
                                        key={artCType.id}
                                        draggableId={`art-c-item-${artCType.id}`}
                                        index={index}
                                      >
                                        {(provided) => (
                                          <li
                                            ref={provided.innerRef}
                                            {...provided.dragHandleProps}
                                            {...provided.draggableProps}
                                            className='w-half p-2'
                                          >
                                            <div className='w-full border-2 border-gray-200 tw-rounded-lg text-center py-4 font-bold capitalize'>
                                              {title}
                                            </div>
                                          </li>
                                        )}
                                      </Draggable>
                                    )
                                  })}
                                </ul>
                              )}
                            </Droppable>
                          </DragDropContext>
                        ) : (
                          <div className='text-center'>
                            There is no section order.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='relative my-5'>
                    <div className='tw-w-full'>
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

                  <div>
                    <h5 className='text-primary-800 font-bold pb-2'>
                      Art & Culture Category
                    </h5>

                    <div className='grid'>
                      <div className='col-12'>
                        <div className='text-primary-800 font-bold pb-2'>
                          Title <span className='text-red-700'>*</span>
                        </div>
                        <InputText
                          className='w-full'
                          maxLength={255}
                          onChange={(e) => {
                            setFormValues({
                              ...formValues,
                              artCTitle: e.target.value || '',
                            })
                            setErrorForm({
                              ...errorForm,
                              artCTitle: {
                                status: false,
                                message: '',
                              },
                            })
                          }}
                          value={formValues.artCTitle}
                        />
                        {errorForm.artCTitle.status && (
                          <div className='pt-2 text-red-700 text-sm'>
                            {errorForm.artCTitle.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className='grid mt-2'>
                      <div className='col-12'>
                        <div className='text-primary-800 font-bold pb-2'>
                          Description <span className='text-red-700'>*</span>
                        </div>
                        <InputTextarea
                          className='w-full'
                          value={formValues.artCDesc}
                          maxLength={255}
                          onChange={(e: any) => {
                            setFormValues({
                              ...formValues,
                              artCDesc: e.target.value || '',
                            })
                            setErrorForm({
                              ...errorForm,
                              artCDesc: {
                                status: false,
                                message: '',
                              },
                            })
                          }}
                          rows={3}
                        />
                        {errorForm.artCDesc.status && (
                          <div className='pt-2 text-red-700 text-sm'>
                            {errorForm.artCDesc.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <hr />
                  </div>

                  <div className='mt-5'>
                    <h5 className='text-primary-800 font-bold pb-2'>Map</h5>

                    <div className='grid'>
                      <div className='col-12'>
                        <div className='text-primary-800 font-bold pb-2'>
                          Title <span className='text-red-700'>*</span>
                        </div>
                        <InputText
                          className='w-full'
                          maxLength={255}
                          onChange={(e) => {
                            setFormValues({
                              ...formValues,
                              artMapTitle: e.target.value || '',
                            })
                            setErrorForm({
                              ...errorForm,
                              artMapTitle: {
                                status: false,
                                message: '',
                              },
                            })
                          }}
                          value={formValues.artMapTitle}
                        />
                        {errorForm.artMapTitle.status && (
                          <div className='pt-2 text-red-700 text-sm'>
                            {errorForm.artMapTitle.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className='grid mt-2'>
                      <div className='col-12'>
                        <div className='text-primary-800 font-bold pb-2'>
                          Description <span className='text-red-700'>*</span>
                        </div>
                        <InputTextarea
                          className='w-full'
                          value={formValues.artMapDesc}
                          maxLength={255}
                          onChange={(e: any) => {
                            setFormValues({
                              ...formValues,
                              artMapDesc: e.target.value || '',
                            })
                            setErrorForm({
                              ...errorForm,
                              artMapDesc: {
                                status: false,
                                message: '',
                              },
                            })
                          }}
                          rows={3}
                        />
                        {errorForm.artMapDesc.status && (
                          <div className='pt-2 text-red-700 text-sm'>
                            {errorForm.artMapDesc.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <hr />
                  </div>

                  <div className='mt-5'>
                    <h5 className='text-primary-800 font-bold pb-2'>Program</h5>

                    <div className='grid'>
                      <div className='col-12'>
                        <div className='text-primary-800 font-bold pb-2'>
                          Title <span className='text-red-700'>*</span>
                        </div>
                        <InputText
                          className='w-full'
                          maxLength={255}
                          onChange={(e) => {
                            setFormValues({
                              ...formValues,
                              programTitle: e.target.value || '',
                            })
                            setErrorForm({
                              ...errorForm,
                              programTitle: {
                                status: false,
                                message: '',
                              },
                            })
                          }}
                          value={formValues.programTitle}
                        />
                        {errorForm.programTitle.status && (
                          <div className='pt-2 text-red-700 text-sm'>
                            {errorForm.programTitle.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className='grid mt-2'>
                      <div className='col-12'>
                        <div className='text-primary-800 font-bold pb-2'>
                          Description <span className='text-red-700'>*</span>
                        </div>
                        <InputTextarea
                          className='w-full'
                          value={formValues.programDesc}
                          maxLength={255}
                          onChange={(e: any) => {
                            setFormValues({
                              ...formValues,
                              programDesc: e.target.value || '',
                            })
                            setErrorForm({
                              ...errorForm,
                              programDesc: {
                                status: false,
                                message: '',
                              },
                            })
                          }}
                          rows={3}
                        />
                        {errorForm.programDesc.status && (
                          <div className='pt-2 text-red-700 text-sm'>
                            {errorForm.programDesc.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <br />
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
                {formValues.programsId &&
                formValues.programsId.length > 0 &&
                highlightPrograms.length > 0 ? (
                  <div>
                    <HighlightProgramSlide
                      items={highlightPrograms}
                      artCTypes={content?.artCTypes || []}
                    />
                  </div>
                ) : (
                  <div className='slide-container'>
                    <Image
                      src='/images/art-c/thumb-img-375-520.png'
                      className='w-full h-auto'
                      alt=''
                      width={375}
                      height={520}
                    />
                  </div>
                )}

                {formValues.sectionOrder.map((section) => {
                  if (section === 'art+c') {
                    return (
                      <div key={`section-${section}`} className='mt-5'>
                        <div className='px-4'>
                          <h5 className='pb-0 mb-2'>{formValues.artCTitle}</h5>
                          <div>{formValues.artCDesc}</div>
                        </div>

                        {/* art c type container */}
                        <div className='flex flex-wrap pt-2 px-3'>
                          {artCTypeContent.map((artCType) => {
                            let translation: IArtCTranslation | undefined

                            if (artCType.artCTranslation) {
                              for (let item of ['en', 'th', 'zh']) {
                                translation = artCType.artCTranslation?.find(
                                  (tItem) => tItem.locale === item
                                )

                                if (translation) {
                                  break
                                }
                              }
                            }

                            if (!translation) {
                              return null
                            }

                            return (
                              <div
                                key={`preview-art-c-type-${artCType.id}`}
                                className='col-6'
                              >
                                <div
                                  className='relative bg-gray-400 bg-cover bg-center'
                                  style={{
                                    backgroundImage: `url(${translation?.thumbnail})`,
                                  }}
                                >
                                  <div style={{ lineHeight: 0 }}>
                                    <Image
                                      src='/images/art-c/dot.png'
                                      className='w-full h-auto'
                                      alt=''
                                      width={50}
                                      height={50}
                                    />
                                  </div>
                                  <div
                                    className='absolute text-white'
                                    style={{
                                      width: '85%',
                                      top: '50%',
                                      left: '50%',
                                      transform: 'translate(-50%, -50%)',
                                    }}
                                  >
                                    <div className='block leading-4'>
                                      <strong>{translation.title}</strong>
                                    </div>
                                    <div className='block leading-4 text-xs'>
                                      {translation.shortDesc}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  }

                  if (section === 'map') {
                    return (
                      <div key={`section-${section}`} className='mt-5'>
                        <div className='px-4'>
                          <h5 className='pb-0 mb-2'>
                            {formValues.artMapTitle}
                          </h5>
                          <div>{formValues.artMapDesc}</div>
                        </div>
                        <div className='pt-3' style={{ lineHeight: 0 }}>
                          <Image
                            src='/images/art-c/map-thumbnail.png'
                            className='w-full h-auto'
                            alt=''
                            width={750}
                            height={400}
                          />
                        </div>
                      </div>
                    )
                  }

                  if (section === 'programs') {
                    return (
                      <div key={`section-${section}`} className='mt-5'>
                        <div className='px-4'>
                          <h5 className='pb-0 mb-2'>
                            {formValues.programTitle}
                          </h5>
                          <div>{formValues.programDesc}</div>
                        </div>

                        <div className='flex pt-3 px-3'>
                          {content?.artCTypes.map((artCType, index) => {
                            let title = '-'

                            if (artCType.artCTranslation) {
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
                                title = translation.title
                              }
                            }

                            return (
                              <div
                                key={`preview-art-c-type-${artCType.id}`}
                                className='px-2'
                              >
                                <div
                                  className={clsx([
                                    'text-xs px-2 py-1',
                                    index === 0 && 'text-white',
                                  ])}
                                  style={{
                                    whiteSpace: 'nowrap',
                                    backgroundColor:
                                      index === 0 ? '#000' : '#fff',
                                    border: '1px solid #000',
                                  }}
                                >
                                  {title}
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        <div className='flex pt-3 px-3'>
                          <div
                            className='px-2 flex-shrink-0'
                            style={{ width: '85%' }}
                          >
                            <div className='bg-gray-400'>
                              <Image
                                src='/images/art-c/space-320-490.png'
                                className='w-full h-auto'
                                alt=''
                                width={320}
                                height={490}
                              />
                            </div>
                          </div>

                          <div
                            className='px-2 flex-shrink-0'
                            style={{ width: '85%' }}
                          >
                            <div className='bg-gray-400'>
                              <Image
                                src='/images/art-c/space-320-490.png'
                                className='w-full h-auto'
                                alt=''
                                width={320}
                                height={490}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

ArtCultureLandingPage.activePrime = true
export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }
  return ctx
}, {})
