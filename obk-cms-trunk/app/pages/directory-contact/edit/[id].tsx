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
import DropdownField from '@components/forms/components/dropdown-field'
import { directoryContactService } from '@src/services/directory-contact/service'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import { KeyValue } from '@src/types/key-value'
import {
  IEditNubmer,
  IGetDirectoryContact,
  IUpsertDirectoryContact,
  UpsertDirectoryContact,
} from '@src/services/directory-contact/model'
import { defaultToastMessage } from '@src/utils/default-toast'

type Props = { categories: KeyValue[]; data: IGetDirectoryContact; id: string }

export default function DirectoryContactCreate(props: Props) {
  // OBBMSSDK.setBaseUrl(process.env.BMS_BASEURL || '')
  const [visiblePublishDialog, setVisiblePublishDialog] = useState(false)
  const [visibleDeleteDialog, setVisibleDeleteDialog] = useState(false)
  const { setMenuName, setMenuAction } = useLayoutContext()
  const router = useRouter()
  const formRef = useRef<FormControllerRef<any>>(null)

  const { categories, data, id } = props

  const formData: IGetDirectoryContact = props.data
  const currentCategory = props.data.categoryId

  const onSaveUpdate = async () => {
    setVisiblePublishDialog(false)
    const value = formRef.current?.getValues()
    const categoryName = categories.find(
      (x) => x.value == value?.categoryId
    )!.name

    let updateContact: IGetDirectoryContact = {
      id: value.id ?? uuidv4,
      nameEn: value.nameEn,
      nameTh: value.nameTh,
      nameZh: value.nameZh,
      categoryId: value.categoryId,
      category: categoryName,
      phonenumber: value.phonenumber,
      updatedAt: value.updatedAt,
      updatedBy: value.updatedBy,
      seq: -1,
    }
    console.log(updateContact)
    var contactlist = await directoryContactService.getDataCategory(
      value.categoryId
    )

    let sendData: IUpsertDirectoryContact = {
      categoryId: currentCategory,
      categoryName: categoryName,
      categoryMoveto:
        value.categoryId === currentCategory ? undefined : value.categoryId,
      contactList: contactlist.data!.contactList,
    }

    let editNumberData: IEditNubmer = {
      CategoryId: currentCategory,
      MoveCategoryId:
        value.categoryId === currentCategory ? undefined : value.categoryId,
      Id: value.id,
      phonenumber: value.phonenumber,
      nameEn: value.nameEn,
      nameTh:
        value.nameTh === '' || value.nameTh === undefined ? '-' : value.nameTh,
      nameZh:
        value.nameZh === '' || value.nameZh === undefined ? '-' : value.nameZh,
      seq: value.seq,
    }

    const existingIndex = sendData.contactList.findIndex(
      (contact) => contact.id === updateContact.id
    )

    if (existingIndex !== -1) {
      sendData.contactList[existingIndex] = updateContact // Update the existing contact
    } else {
      sendData.contactList.push(updateContact) // Add the new contact
    }
    console.log('editnum', editNumberData)

    const promise = directoryContactService
      .editNumber(editNumberData)
      .then(() => {
        router.push({
          pathname: '/directory-contact',
        })
      })
    toast.promise(promise, defaultToastMessage)
  }

  const onDeleteNumber = async () => {
    const value = formRef.current?.getValues()
    await directoryContactService
      .deleteNumber(value!.categoryId, id)
      .then((res) => {
        router.push({
          pathname: '/directory-contact',
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }

  useEffect(() => {
    setMenuName('Edit Number')
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
          className='px-5 bg-primary-blue'
          label='Save'
          onClick={() => {
            formRef.current?.trigger().then((res) => {
              if (res) {
                setVisiblePublishDialog(true)
              }
            })
          }}
        />
        <Button
          className='px-5'
          label='Delete this number'
          severity='danger'
          onClick={() => setVisibleDeleteDialog(true)}
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

  const onConfirmPublish = async () => {
    const isValid = await formRef.current?.trigger()
    if (isValid) {
      setVisiblePublishDialog(true)
    }
  }

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
                <DropdownField
                  label='Category'
                  name='categoryId'
                  options={categories}
                  optionLabel='name'
                  optionValue='value'
                  placeholder='Category'
                  className='w-full'
                  showClear
                  rules={{ required: 'Category is required.' }}
                />
              </div>
              <div className='field col-12 md:col-4'>
                <TextField
                  label='Phone Number'
                  name='phonenumber'
                  rules={{ required: 'Phone Number is required.' }}
                />
              </div>
            </div>

            <div className='formgrid grid'>
              <div className='field col-12 md:col-4'>
                <TextField
                  label='Name (English)'
                  name='nameEn'
                  rules={{ required: 'Name (English) is required.' }}
                />
              </div>
              <div className='field col-12 md:col-4'>
                <TextField
                  label='Name (Thai)'
                  name='nameTh'
                  // rules={{ required: 'Name (Thai) is required.' }}
                />
              </div>
              <div className='field col-12 md:col-4'>
                <TextField
                  label='Name (Simplify Chinese)'
                  name='nameZh'
                  // rules={{ required: 'Name (Simplify Chinese) is required.' }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-wrap gap-3'>
          <Button
            className='px-5 bg-primary-blue'
            type='submit'
            label='Save'
            onClick={onConfirmPublish}
          />
          <Button
            className='px-5'
            type='button'
            label='Delete this number'
            severity='danger'
            onClick={() => setVisibleDeleteDialog(true)}
          />
          <Button
            type='button'
            className='px-5 text-primary-blue'
            label='Cancel'
            severity='secondary'
            outlined
            onClick={OnCancel}
            text
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
              Are you sure you want to publish the changes?
            </span>
            <div className='flex gap-3 mt-5'>
              <Button
                className='bg-primary-blue'
                type='submit'
                label='Confirm'
                onClick={onSaveUpdate}
              />
              <Button
                className='text-primary-blue'
                type='button'
                onClick={(e) => hide(e)}
                label='Cancel'
                outlined
              />
            </div>
          </div>
        )}
      ></Dialog>

      <Dialog
        draggable={false}
        blockScroll={true}
        visible={visibleDeleteDialog}
        style={{ minWidth: '30vw' }}
        onHide={() => {
          setVisibleDeleteDialog(false)
        }}
        modal
        content={({ hide }) => (
          <div className='flex flex-column bg-white p-5 border-round-lg'>
            <span className='font-bold'>
              Are you sure you want to delete this item?
            </span>
            <div className='flex gap-3 mt-5'>
              <Button
                className='px-5'
                type='submit'
                label='Delete'
                severity='danger'
                onClick={onDeleteNumber}
              />
              <Button
                className='text-primary-blue'
                type='button'
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
    const { id } = ctx.props.query
    const categoriesRes = await directoryContactService.getAllCategory()
    const categories = categoriesRes.data.map((x) => {
      return { name: x.category, value: x.categoryId } as KeyValue
    })
    const data = await directoryContactService.getById(id)

    ctx.props = { ...ctx.props, categories, data, id }
    return ctx
  },
  {},
  {
    redirectPath: '/directory-contact',
    accessPage: PCODE.VIEWDIRECTORYCONTACT,
  }
)
