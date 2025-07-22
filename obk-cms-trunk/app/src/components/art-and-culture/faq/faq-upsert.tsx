import { Tab, TabList, Tabs } from '@chakra-ui/react'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import {
  FaqContentData,
  IFaqForm,
  IFaqItem,
  IFaqTranslation,
  IInputErrors,
} from '@src/services/art-and-culture/model'
import {
  isObjectDeepEqual,
  mappingValidateErrorMessage,
} from '@src/utils/art-c'
import { AxiosResponse } from 'axios'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { Button } from 'primereact/button'
import { InputSwitch } from 'primereact/inputswitch'
import { InputText } from 'primereact/inputtext'
import { Panel } from 'primereact/panel'
import { Calendar } from 'primereact/calendar'
import { useEffect, useRef, useState } from 'react'
import * as Yup from 'yup'
import dayjs from 'dayjs'
import { artCFaqsServices } from '@src/services/art-and-culture/art-c-faqs-services'
import CustomEditor from '@components/input/customEditor'

interface IFaqUpsert {
  type: string
  faqItem?: IFaqItem
}

interface IFaqFormTransValue {
  th: IFaqForm
  en: IFaqForm
  zh: IFaqForm
}

const FaqUpsert = ({ type, faqItem }: IFaqUpsert) => {
  const router = useRouter()
  const { locale } = router.query
  const formRef = useRef<FormControllerRef<IFaqForm>>(null)

  const [isFormSubmitting, setIsFormSubmitting] = useState(false)
  const [formValues, setFormValues] = useState<IFaqForm>(new FaqContentData())
  const [formTransValues, setFormTransValues] = useState<IFaqFormTransValue>({
    th: new FaqContentData(),
    en: new FaqContentData(),
    zh: new FaqContentData(),
  })
  const [formLocale, setFormLocale] = useState<string>('en')

  const initFormErrors: IInputErrors = {
    question: { status: false, message: '' },
    answer: { status: false, message: '' },
  }

  const [errorForm, setErrorForm] = useState(initFormErrors)
  const [requestError, setRequestError] = useState({
    status: false,
    message: '',
  })

  const initialFormValues = (item: IFaqItem | undefined) => {
    if (item && item.faqTranslation.length > 0) {
      const value = { ...formTransValues }

      item.faqTranslation.forEach((itemTrans: IFaqTranslation) => {
        if (itemTrans.locale === 'en') {
          value['en'] = {
            question: itemTrans.question,
            answer: itemTrans.answer,
            publishedAt: item.publishedAt,
            isPublished: item.isPublished ? true : false,
          }
        }

        if (itemTrans.locale === 'th') {
          value['th'] = {
            question: itemTrans.question,
            answer: itemTrans.answer,
            publishedAt: item.publishedAt,
            isPublished: item.isPublished ? true : false,
          }
        }

        if (itemTrans.locale === 'zh') {
          value['zh'] = {
            question: itemTrans.question,
            answer: itemTrans.answer,
            publishedAt: item.publishedAt,
            isPublished: item.isPublished ? true : false,
          }
        }
      })

      setFormTransValues(value)
      setFormValues({
        ...value[formLocale as keyof IFaqFormTransValue],
        publishedAt: item.publishedAt,
        isPublished: item.isPublished ? true : false,
      })
    }
  }

  const handleFormLocaleChange = (locale: string) => {
    setErrorForm(initFormErrors)
    setRequestError({ status: false, message: '' })

    // save current form values to formTransValues
    const tempFormTransValues = formTransValues
    tempFormTransValues[formLocale as keyof IFaqFormTransValue] = formValues

    Object.keys(tempFormTransValues).forEach((key) => {
      if (key === formLocale) return
      tempFormTransValues[key as keyof IFaqFormTransValue] = {
        ...tempFormTransValues[key as keyof IFaqFormTransValue],
        publishedAt: formValues.publishedAt,
        isPublished: formValues.isPublished,
      }
    })

    setFormTransValues(tempFormTransValues)

    // set form locale and form values
    setFormLocale(locale)

    setFormValues({
      ...tempFormTransValues[locale as keyof IFaqFormTransValue],
    })
  }

  const onEditContent = (editorState: any) => {
    if (formValues) {
      setFormValues({
        ...formValues,
        answer: editorState ? editorState : '',
      })

      setErrorForm({
        ...errorForm,
        answer: { status: false, message: '' },
      })
    }
  }

  let validationSchema = Yup.object({
    question: Yup.string()
      .max(255, 'Question should be less than 255 characters')
      .required('Question is required'),
    answer: Yup.string().required('Answer is required'),
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
      prepareFormValues[formLocale as keyof IFaqFormTransValue] = formValues
    }

    let isOtherLocaleValid = true
    for (const key in formTransValues) {
      if (isOtherLocaleValid) {
        const checkFormValues = {
          question: formTransValues[key as keyof IFaqFormTransValue].question,
          answer: formTransValues[key as keyof IFaqFormTransValue].answer,
        }

        const defaultValue = new FaqContentData()

        const initValues = {
          question: defaultValue.question,
          answer: defaultValue.answer,
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
            setIsFormSubmitting(false)
            handleFormLocaleChange(key)
            isOtherLocaleValid = false
          } else {
            formValuesItem.push(key)
            prepareFormValues[key as keyof IFaqFormTransValue].isPublished =
              formValues.isPublished
            prepareFormValues[key as keyof IFaqFormTransValue].publishedAt =
              formValues.publishedAt
          }
        }
      }
    }

    if (!isOtherLocaleValid) {
      return
    }

    setIsFormSubmitting(true)

    let res = { id: faqItem ? faqItem.id : 0, status: false }
    for (const key in prepareFormValues) {
      if (formValuesItem.includes(key)) {
        const tempAnswer = document.createElement('div')
        tempAnswer.innerHTML =
          prepareFormValues[key as keyof IFaqFormTransValue].answer
        tempAnswer.querySelectorAll('img').forEach((img) => {
          img.removeAttribute('style')
          img.removeAttribute('width')
          img.removeAttribute('height')
        })

        const saveValue = {
          ...prepareFormValues[key as keyof IFaqFormTransValue],
          answer: tempAnswer.outerHTML,
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
        `/art-and-culture/faqs${
          type === 'create' ? '?status=createSuccess' : '?status=updateSuccess'
        }`
      )
    }

    setIsFormSubmitting(false)
  }

  const saveFormValues = async (
    id: number,
    saveLocale: string,
    values: IFaqForm
  ): Promise<{ id: number; status: boolean }> => {
    try {
      let result: AxiosResponse | null = null

      if (type === 'create' && id === 0) {
        result = await artCFaqsServices.create(saveLocale, values)
      } else {
        result = await artCFaqsServices.edit(`${id}`, saveLocale, values)
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
    if (confirm('Are you sure you want to delete this faq?')) {
      setIsFormSubmitting(true)

      await artCFaqsServices
        .delete(`${id}`)
        .then(() => {
          router.push('/art-and-culture/faqs')
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

  const onBack = () => router.push('/art-and-culture/faqs')
  const buttonActionTemplate = (
    <div className='flex gap-3 justify-content-center md:justify-content-start'>
      <Button
        disabled={isFormSubmitting}
        className='px-5 py-3 bg-primary-blue text-white'
        label='Publish'
        onClick={formRef.current?.handleSubmit(onSubmit)}
      />
      {type === 'update' && (
        <Button
          type='button'
          className='px-5 text-red-600 border-2 border-red-600'
          label='Delete this faq'
          severity='danger'
          outlined
          disabled={isFormSubmitting}
          onClick={() => deleteItem(faqItem!.id)}
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
  )

  useEffect(() => {
    setTimeout(() => {
      initialFormValues(faqItem)
    }, 250)
  }, [faqItem, locale])

  return (
    <>
      <FormController
        ref={formRef}
        defualtValue={new FaqContentData()}
        onSubmit={onSubmit}
      >
        <Panel className='mb-5'>
          {formValues && (
            <div className='p-2'>
              <div className='mb-5'>
                <h4 className='text-astronaut font-bold'>Details</h4>
                {type === 'update' && faqItem && (
                  <small className='font-medium'>
                    Last update&nbsp;
                    <span className='font-bold'>
                      {dayjs(faqItem.updatedAt).format('DD/MM/YYYY HH:mm')}
                      &nbsp;
                    </span>
                  </small>
                )}
              </div>

              <div className='flex'>
                <div className='field grid mt-5 pr-4'>
                  <div className='flex col-12 tw-items-center'>
                    <div className='flex items-center text-primary-800 font-bold pr-2'>
                      <div>Publish At</div>
                    </div>

                    <div>
                      <Calendar
                        id='calendar-24h'
                        value={
                          formValues.publishedAt
                            ? dayjs(formValues.publishedAt).toDate()
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
                        dateFormat='dd/mm/yy'
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
                      checked={formValues.isPublished}
                      onChange={(e) =>
                        setFormValues({ ...formValues, isPublished: e.value })
                      }
                    />
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

              <div className='field grid'>
                <div className='col-12'>
                  <div className='text-primary-800 font-bold pb-2'>
                    Question <span className='text-red-700'>*</span>
                  </div>
                  <InputText
                    key={`question-${formLocale}`}
                    className='w-full'
                    maxLength={255}
                    onChange={(e) => {
                      setFormValues({
                        ...formValues,
                        question: e.target.value || '',
                      })
                      setErrorForm({
                        ...errorForm,
                        question: { status: false, message: '' },
                      })
                    }}
                    value={formValues.question}
                  />
                  {errorForm.question.status && (
                    <div className='pt-2 text-red-700 text-sm'>
                      {errorForm.question.message}
                    </div>
                  )}
                </div>
              </div>

              <div className='field grid'>
                <div className='col-12'>
                  <div className='text-primary-800 font-bold pb-2'>
                    Answer <span className='text-red-700'>*</span>
                  </div>
                  <CustomEditor
                    key={`answer-${formLocale}`}
                    onChange={onEditContent}
                    data={formValues.answer}
                  />
                  {errorForm.answer.status && (
                    <div className='pt-2 text-red-700 text-sm'>
                      {errorForm.answer.message}
                    </div>
                  )}
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
    </>
  )
}

export default FaqUpsert
