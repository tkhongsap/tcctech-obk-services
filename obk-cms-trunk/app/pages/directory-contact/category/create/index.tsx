/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import TextField from '@components/forms/components/text-field'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import { useRouter } from 'next/router'
import { Dialog } from 'primereact/dialog'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import withGenericServer from '@hocs/server/generic'
import * as OBBMSSDK from 'ob-bms-sdk'
import { PCODE } from '@src/data/constants/privilege'
import { directoryContactService } from '@src/services/directory-contact/service'
import { UpsertCategory } from '@src/services/directory-contact/model'
import { toast } from 'react-toastify'
import { defaultToastMessage } from '@src/utils/default-toast'
import { string } from 'yup'
import { KeyValue } from '@src/types/key-value'

type Props = { categories: KeyValue[] }

export default function DirectoryContactCreate(props: Props) {
  OBBMSSDK.setBaseUrl(process.env.BMS_BASEURL || '')
  const { categories } = props
  const [visiblePublishDialog, setVisiblePublishDialog] = useState(false)
  const { setMenuName, setMenuAction } = useLayoutContext()
  const [errorMessage, SetErrorMessage] = useState<string | undefined>()
  const router = useRouter()
  const formRef = useRef<FormControllerRef<any>>(null)

  const formData = new UpsertCategory()

  const checkDuplicateAndProceed = () => {
    const value = formRef.current?.getValues()
    const isDuplicate = categories.some(
      (category) =>
        category.name.toLowerCase() === value.categoryName.toLowerCase()
    )

    if (isDuplicate) {
      SetErrorMessage(`A category name "${value.categoryName}" already exists.`)
      return false
    } else {
      SetErrorMessage(undefined)
      setVisiblePublishDialog(true)
      return true
    }
  }
  const onPublish = async () => {
    SetErrorMessage(undefined)
    const value = formRef.current?.getValues()

    const promise = directoryContactService
      .createCategory(value)
      .then((res) => {
        router.push({
          pathname: '/directory-contact',
        })
      })
      .catch((e) => {
        setVisiblePublishDialog(false)
        SetErrorMessage(e.response.data.messages[0])
        throw e
      })
    toast.promise(promise, defaultToastMessage)
  }

  useEffect(() => {
    setMenuName('Add Category')
    setMenuAction(buttonAction)
  }, [setMenuName])

  const OnCancel = () => {
    router.push({
      pathname: '/directory-contact',
    })
  }

  const buttonAction = (
    <div className='flex flex-column xl:flex-row mb-5 justify-content-between align-items-center'>
      <div className='flex gap-3 px-3'>
        <Button
          className='px-3 bg-primary-blue'
          type='button'
          label='Add Category'
          onClick={() => {
            formRef.current?.trigger().then((res) => {
              if (res) {
                checkDuplicateAndProceed()
              }
            })
          }}
        />
        <Button
          className='px-5 text-primary-blue'
          label='Cancel'
          severity='secondary'
          text
          onClick={OnCancel}
        />
      </div>
    </div>
  )

  return (
    <>
      <FormController
        defualtValue={formData}
        ref={formRef}
        onSubmit={() => setVisiblePublishDialog(true)}
      >
        <div className='card mb-5'>
          <div className='p-2'>
            <span className='flex text-xl font-bold mb-5'>Details</span>

            <div className='formgrid grid'>
              <div className='field col-12 md:col-4'>
                <TextField
                  label='Category name'
                  name='categoryName'
                  rules={{ required: 'Category name is required.' }}
                />
              </div>
            </div>
            <small className='p-error'>{errorMessage}</small>
          </div>
        </div>
        <div className='flex flex-wrap gap-3'>
          <Button
            className='px-3 bg-primary-blue'
            type='button'
            label='Add Category'
            onClick={() => {
              formRef.current?.trigger().then((res) => {
                if (res) {
                  checkDuplicateAndProceed()
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
      </FormController>

      <Dialog
        draggable={false}
        blockScroll={true}
        visible={visiblePublishDialog}
        style={{ minWidth: '30vw' }}
        onHide={() => {
          setVisiblePublishDialog(false)
        }}
        modal
        content={({ hide }) => (
          <div className='flex flex-column bg-white p-5 border-round-lg'>
            <span className='font-bold'>
              Are you sure you want to create this item?
            </span>
            <div className='flex gap-3 mt-5 '>
              <Button
                className='bg-primary-blue'
                label='Confirm'
                onClick={onPublish}
              />
              <Button
                className='text-primary-blue'
                onClick={(e) => hide(e)}
                label='Cancel'
                outlined
              />
            </div>
          </div>
        )}
      ></Dialog>
    </>
  )
}
DirectoryContactCreate.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const categoriesRes = await directoryContactService.getAllCategory()
    const categories = categoriesRes.data
      .map((x) => {
        return { name: x.category, value: x.categoryId } as KeyValue
      })
      .sort((a, b) => a.name.localeCompare(b.name))
    ctx.props = { ...ctx.props, categories }
    return ctx
  },
  {},
  {
    redirectPath: '/directory-contact',
    accessPage: PCODE.VIEWDIRECTORYCONTACT,
  }
)
