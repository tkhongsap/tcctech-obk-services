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
import { KeyValue } from '@src/types/key-value'
import { v4 as uuidv4 } from 'uuid'
import {
  IGetDirectoryContact,
  IUpsertDirectoryContact,
  UpsertDirectoryContact,
} from '@src/services/directory-contact/model'
import { toast } from 'react-toastify'
import { defaultToastMessage } from '@src/utils/default-toast'

type Props = { categories: KeyValue[] }

export default function DirectoryContactCreate(props: Props) {
  OBBMSSDK.setBaseUrl(process.env.BMS_BASEURL || '')
  const [visiblePublishDialog, setVisiblePublishDialog] = useState(false)
  const { setMenuName, setMenuAction } = useLayoutContext()
  const router = useRouter()
  const formRef = useRef<FormControllerRef<any>>(null)
  let data: IUpsertDirectoryContact = {
    categoryId: '',
    categoryName: '',
    contactList: [],
  }
  const formData = new UpsertDirectoryContact(data)

  const { categories } = props

  const onPublish = async () => {
    setVisiblePublishDialog(false)
    const value = formRef.current?.getValues()
    const categoryName = categories.find(
      (x) => x.value == value.categoryId
    )!.name

    let newContact: IGetDirectoryContact = {
      id: uuidv4(),
      nameEn: value.titleEng,
      nameTh:
        value.titleTh === null || value.titleTh === undefined
          ? '-'
          : value.titleTh,
      nameZh:
        value.titleZh === null || value.titleZh === undefined
          ? '-'
          : value.titleZh,
      categoryId: value.categoryId,
      category: categoryName,
      phonenumber: value.contact,
      updatedAt: 'c',
      updatedBy: 'c',
      seq: -1,
    }

    var contactlist = await directoryContactService.getDataCategory(
      value.categoryId
    )
    let sendData: IUpsertDirectoryContact = {
      categoryId: value.categoryId,
      categoryName: categoryName,
      contactList: contactlist.data!.contactList,
    }
    sendData.contactList.push(newContact)

    console.log(sendData)

    const promise = directoryContactService
      .createNumber(sendData)
      .then(() => {
        router.push({
          pathname: '/directory-contact',
        })
      })
      .catch((e) => {
        console.log('error', e)
      })
    toast.promise(promise, defaultToastMessage)
  }

  useEffect(() => {
    setMenuName('Add Number')
    setMenuAction(buttonAction)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          label='Add contact'
          onClick={() => {
            formRef.current?.trigger().then((res) => {
              if (res) {
                setVisiblePublishDialog(true)
              }
            })
          }}
        />
        <Button
          className='px-5 text-primary-blue'
          label='Cancel'
          severity='secondary'
          outlined
          onClick={OnCancel}
          text
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
                  placeholder='Select Category..'
                  className='w-full'
                  showClear
                  rules={{ required: 'Category is required.' }}
                />
              </div>
              <div className='field col-12 md:col-4'>
                <TextField
                  label='Phone number'
                  name='contact'
                  rules={{ required: 'Phone number is required.' }}
                  keyfilter={/[0-9\-()\s+]/}
                />
              </div>
            </div>

            <div className='formgrid grid'>
              <div className='field col-12 md:col-4'>
                <TextField
                  label='Name (English)'
                  name='titleEng'
                  rules={{ required: 'Name (English) is required.' }}
                />
              </div>
              <div className='field col-12 md:col-4'>
                <TextField label='Name (Thai)' name='titleTh' />
              </div>
              <div className='field col-12 md:col-4'>
                <TextField label='Name (Simplify Chinese)' name='titleZh' />
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-wrap gap-3'>
          <Button
            className='px-3 bg-primary-blue'
            label='Add contact'
            onClick={() => onConfirmPublish()}
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
              Are you sure you want to create this item?
            </span>
            <div className='flex gap-3 mt-5'>
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
    const categories = categoriesRes.data.map((x) => {
      return { name: x.category, value: x.categoryId } as KeyValue
    })
    ctx.props = { ...ctx.props, categories }
    return ctx
  },
  {},
  {
    redirectPath: '/directory-contact',
    accessPage: PCODE.VIEWDIRECTORYCONTACT,
  }
)
