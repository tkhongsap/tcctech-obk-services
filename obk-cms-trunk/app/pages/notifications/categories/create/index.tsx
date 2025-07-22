/* eslint-disable unused-imports/no-unused-vars-ts */
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Button } from 'primereact/button'
import TextField from '@components/forms/components/text-field'
import { ICategoryRequest } from '@src/services/notificationservice/category/model'
import { useRouter } from 'next/router'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import DropdownField from '@components/forms/components/dropdown-field'
import TextAreaField from '@components/forms/components/text-area-field'
import { Dialog } from 'primereact/dialog'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import * as OBNOTISDK from 'ob-notification-sdk'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import { defaultToastMessage } from '@src/utils/default-toast'
import { toast } from 'react-toastify'
import { Message } from 'primereact/message'

type Props = {
  categoryRequest: ICategoryRequest
}
// const order = [
//   { name: '1', code: '1' },
//   { name: '2', code: '2' },
//   { name: '3', code: '3' },
//   { name: '4', code: '4' },
//   { name: '5', code: '5' },
// ]

const status = [
  { name: 'Visible', code: 'true' },
  { name: 'Invisible', code: 'false' },
]

export default function CategoryRequest({ categoryRequest }: Props) {
  OBNOTISDK.setBaseUrl(process.env.OB_NOTIFICATION_SDK_BASE_URL || '')
  const [visibleSubmitDialog, setVisibleSubmitDialog] = useState(false)
  const { setMenuName, setMenuAction } = useLayoutContext()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [ordering, setOrdering] = useState<number>(0)

  const fetchCategory = useCallback(async () => {
    await OBNOTISDK.client.messageCategoriesIndex().then((res: any) => {
      setOrdering(res.data.data.length)
    })
  }, [])

  useEffect(() => {
    fetchCategory()
  }, [])

  let dataID: string = ''
  const formRef = useRef<FormControllerRef<any>>(null)
  const [errorState, setErrorState] = useState<number>(0)
  const [isSubmited, setIsSubmited] = useState<boolean>(false)

  const formData = {
    id: '',
    sequence: undefined,
    name: '',
    visible: false,
    remark: '',
    display_name: {
      en: '',
      th: '',
      zh: '',
    },
  }

  const OnCancel = () => {
    router.push({
      pathname: '/notifications/categories',
    })
  }

  const onSubmitClick = async () => {
    const isValid = await formRef.current?.trigger()
    if (isValid) {
      setVisibleSubmitDialog(true)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const buttonAction = (
    <div className='flex flex-column xl:flex-row mb-5 justify-content-between align-item-middle'>
      <div className='flex flex-wrap gap-3'>
        <Button
          type='button'
          className='px-3 bg-primary-blue'
          label='Create new category'
          onClick={() => {
            formRef.current?.trigger().then((res) => {
              if (!res) {
                setErrorState(() => errorState + 1)
                setIsSubmited(true)
              } else {
                onSubmitClick()
              }
            })
          }}
        />
        <Button
          type='button'
          className='px-5 text-primary-blue'
          label='Cancel'
          severity='secondary'
          text
          onClick={OnCancel}
        />
      </div>
    </div>
  )

  useEffect(() => {
    setMenuName('Create new Category')
    setMenuAction(buttonAction)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuName, setMenuAction, formRef])

  const triggerErrorState = () => {
    if (isSubmited) {
      formRef.current?.trigger().then((res) => {
        if (res) {
          setErrorState(0)
        } else {
          setErrorState(() => errorState + 1)
        }
      })
    }
  }

  const onSubmit = async () => {
    setLoading(true)
    const value = formRef.current?.getValues()
    value.name = value.display_name.en
    delete value.id
    console.log(value)
    value.sequence = ordering + 1
    const promise = OBNOTISDK.client
      .messageCategoriesCreate(value)
      .then(() => router.back())
      .finally(() => {
        setVisibleSubmitDialog(false)
        setLoading(false)
      })
    toast.promise(promise, defaultToastMessage)
  }

  return (
    <>
      <FormController
        defualtValue={formData}
        ref={formRef}
        onSubmit={onSubmitClick}
      >
        <div className='card mb-5'>
          <div className='p-2'>
            <span className='flex text-xl font-bold mb-3'>Details</span>
            {errorState > 0 && (
              <Message
                className='mb-3'
                severity='error'
                content={
                  <>
                    <span className='font-bold'>Missing Fields: </span>
                    &nbsp; One or more of the required fields are empty or
                    contain invalid data; please check your input.
                  </>
                }
              />
            )}
            <div className='formgrid grid'>
              <div className='field col-12 md:col-4'>
                <TextField
                  disabled
                  label='Category ID'
                  name='id'
                  aria-describedby='username-help'
                  onChange={triggerErrorState}
                />
              </div>
              {/* <div className='field col-12 md:col-4'>
                <DropdownField
                  className='w-full'
                  name='sequence'
                  label='Ordering'
                  placeholder='Please Select'
                  options={order}
                  optionLabel='name'
                  optionValue='code'
                  rules={{ required: 'Ordering is required.' }}
                  onChange={triggerErrorState}
                />
              </div> */}
              <div className='field col-12 md:col-4'>
                <DropdownField
                  name='visible'
                  label='Display status'
                  placeholder='Please Select'
                  options={status}
                  optionLabel='name'
                  optionValue='code'
                  rules={{ required: 'Display status is required.' }}
                  onChange={triggerErrorState}
                />
              </div>
            </div>
            <div className='formgrid grid'>
              <div className='field col-12 md:col-4'>
                <TextField
                  label='Category name(English)'
                  name='display_name.en'
                  rules={{ required: 'Category name(English) is required.' }}
                  onChange={triggerErrorState}
                />
              </div>
              <div className='field col-12 md:col-4'>
                <TextField
                  label='Category name(Thai)'
                  name='display_name.th'
                  rules={{ required: 'Category name(Thai) is required.' }}
                  onChange={triggerErrorState}
                />
              </div>
              {/* <div className='field col-12 md:col-4'>
                <TextField
                  label='Category name(Simplify Chinese)'
                  name='display_name.zh'
                  rules={{
                    required: 'Category name(Simplify Chinese) is required.',
                  }}
                  onChange={triggerErrorState}
                />
              </div> */}
            </div>
            <div className='field grid'>
              <div className='col-12'>
                <TextAreaField name='remark' label='Internal remark' rows={5} />
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-wrap gap-3'>
          <Button
            type='submit'
            className='px-3 bg-primary-blue'
            label='Create new category'
            onClick={() => {
              formRef.current?.trigger().then((res) => {
                if (!res) {
                  setErrorState(() => errorState + 1)
                  setIsSubmited(true)
                }
              })
            }}
          />
          <Button
            type='button'
            className='px-5 text-primary-blue'
            label='Cancel'
            severity='secondary'
            outlined
            onClick={OnCancel}
          />
        </div>
      </FormController>

      <Dialog
        draggable={false}
        blockScroll={true}
        visible={visibleSubmitDialog}
        style={{ minWidth: '30vw' }}
        onHide={() => {
          setVisibleSubmitDialog(false)
        }}
        modal
        content={({ hide }) => (
          <div className='flex flex-column bg-white p-5 border-round-lg'>
            <span className='font-bold'>
              Are you sure you want to create new category?
            </span>
            <div className='flex gap-3 mt-5'>
              {/* Event Submit */}
              <Button
                type='button'
                className='bg-primary-blue'
                onClick={onSubmit}
                label='Confirm'
              />
              <Button
                type='button'
                className='bg-gray-50 border-gray-900 text-gray-600'
                onClick={(e) => hide(e)}
                label='Cancel'
                text
              />
            </div>
          </div>
        )}
      ></Dialog>
    </>
  )
}
CategoryRequest.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/notifications/categories',
    accessPage: PCODE.CREATEANDEDITNEWINAPPNOTIFICATIONSCATEGORY,
  }
)
