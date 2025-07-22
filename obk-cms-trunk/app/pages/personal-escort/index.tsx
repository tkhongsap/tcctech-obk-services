/* eslint-disable unused-imports/no-unused-vars-ts */
import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import TextField from '@components/forms/components/text-field'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import { useRouter } from 'next/router'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import { emergencyContact } from '@src/services/emergency-contact/servive'
import {
  IGetEmergencyContact,
  UpsertEmergencyContactData,
} from '@src/services/emergency-contact/model'
import { confirmDialog } from 'primereact/confirmdialog'
import { defaultToastMessage } from '@src/utils/default-toast'
import { toast } from 'react-toastify'
import _ from 'lodash'

type Props = {
  ecData: IGetEmergencyContact
}

export default function EmergencyContact(props: Props) {
  const { setMenuName, setMenuAction } = useLayoutContext()
  const [notSaved, setNotSaved] = React.useState<boolean>(false)

  const router = useRouter()

  const formRef = useRef<FormControllerRef<IGetEmergencyContact>>(null)
  const defaultValue: IGetEmergencyContact = {
    title: props.ecData.title,
    titleTh: props.ecData.titleTh,
    titleZh: props.ecData.titleZh,
    descriptionTh: props.ecData.descriptionTh,
    descriptionEn: props.ecData.descriptionEn,
    descriptionZh: props.ecData.descriptionZh,
    phoneNumber: props.ecData.phoneNumber,
    updatedDate: props.ecData.updatedDate,
    updatedBy: props.ecData.updatedBy,
  }
  console.log('Default Value:', defaultValue)

  const [updatedDate, setupdatedDate] = useState(
    formatDate(defaultValue.updatedDate)
  )

  const [updatedBy, setupdatedBy] = useState(defaultValue.updatedBy)

  const [oldData, setOldData] = React.useState(defaultValue)

  function formatDate(updatedDate: string | number | Date) {
    const date = new Date(updatedDate)

    const day = date.getDate().toString().padStart(2, '0')
    const month = date.toLocaleString('en-US', { month: '2-digit' })
    const year = date.getFullYear()
    let hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    // const ampm = hours >= 12 ? 'PM' : 'AM'
    // hours = hours % 12 || 12 // Convert 24-hour to 12-hour format, with 12:00 instead of 0:00

    return `${year}-${month}-${day} ${hours}:${minutes} `
  }

  useEffect(() => {
    setMenuName('Personal Escort')
    setMenuAction(buttonAction)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuName])

  React.useEffect(() => {
    const confirmationMessage = 'Changes you made may not be saved.'
    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      ;(e || window.event).returnValue = confirmationMessage
      return confirmationMessage // Gecko + Webkit, Safari, Chrome etc.
    }
    const beforeRouteHandler = (url: string) => {
      if (router.pathname !== url && !confirm(confirmationMessage)) {
        // to inform NProgress or something ...
        router.events.emit('routeChangeError')
        // tslint:disable-next-line: no-string-throw
        throw `Route change to "${url}" was aborted (this error can be safely ignored).`
      }
    }
    if (notSaved) {
      window.addEventListener('beforeunload', beforeUnloadHandler)
      router.events.on('routeChangeStart', beforeRouteHandler)
    } else {
      window.removeEventListener('beforeunload', beforeUnloadHandler)
      router.events.off('routeChangeStart', beforeRouteHandler)
    }
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler)
      router.events.off('routeChangeStart', beforeRouteHandler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notSaved])

  const validateForm = (data: any) => {
    return data.title && data.descriptionEn && data.phoneNumber
  }

  const touchForm = () => {
    const isSame = _.isEqual(oldData, formRef.current?.getValues())
    setNotSaved(!isSame)
  }

  const onCancel = () => {
    confirmDialog({
      message: `Are you sure you want to cancel this ?`,
      closable: false,
      style: { width: '500px' },
      contentClassName: 'flex justify-content-start font-semibold text-lg',
      footer: (option) => (
        <div className='flex justify-content-start gap-3 ml-2'>
          <Button
            type='submit'
            label='Confirm'
            className='bg-primary-blue'
            onClick={async () => {
              option.accept()

              if (formRef.current) {
                Object.keys(oldData).forEach((key) => {
                  formRef.current?.setValue(
                    key as keyof IGetEmergencyContact,
                    oldData[key as keyof IGetEmergencyContact]
                  )
                })
              }

              setNotSaved(false)
              router.push('/personal-escort')
            }}
          />
          <Button
            className='px-5 text-primary-blue'
            outlined
            label='Cancel'
            onClick={option.reject}
          />
        </div>
      ),
    })
  }

  const onSubmit = (data: any) => {
    if (!validateForm(data)) {
      return
    }

    confirmDialog({
      message: 'Are you sure you want to publish the changes?',
      closable: false,
      style: { width: '500px' },
      contentClassName: 'flex justify-content-start font-semibold text-lg',
      footer: ({ accept, reject }) => (
        <div className='flex justify-content-start gap-3 ml-2'>
          <Button
            type='submit'
            label='Confirm'
            className='bg-primary-blue'
            onClick={async () => {
              console.log('data', formRef.current?.getValues())
              accept()
              let fdata = formRef.current?.getValues()
              let payload: UpsertEmergencyContactData = {
                title: fdata!.title,
                titleTh: fdata!.titleTh,
                titleZh: fdata!.titleZh,
                descriptionTh: fdata!.descriptionTh,
                descriptionEn: fdata!.descriptionEn,
                descriptionZh: fdata!.descriptionZh,
                phoneNumber: fdata!.phoneNumber,
              }

              console.log('Payload:', payload)
              const promise = emergencyContact
                .publish(payload)
                .then(async (rs) => {
                  console.log('Res', rs)
                  const res = await emergencyContact.get()
                  setupdatedDate(formatDate(res.updatedDate))
                  setupdatedBy(res.updatedBy)

                  if (formRef.current) {
                    Object.keys(res).forEach((key) => {
                      formRef.current?.setValue(
                        key as keyof IGetEmergencyContact,
                        res[key as keyof IGetEmergencyContact]
                      )
                    })
                  }

                  setOldData(res)
                })
                .finally(() => {
                  setNotSaved(false)
                })
              toast.promise(promise, defaultToastMessage)
            }}
          />
          <Button
            className='text-primary-blue'
            label='Cancel'
            text
            onClick={reject}
          />
        </div>
      ),
    })
  }

  const buttonAction = (
    <div className='flex flex-column xl:flex-row mb-5 justify-content-between align-items-center'>
      <div className='flex gap-3 px-3'>
        <Button
          className='px-5 bg-primary-blue'
          label='Publish'
          onClick={() => {
            formRef.current?.trigger().then((res) => {
              if (res) {
                onSubmit(defaultValue)
              }
            })
          }}
        />
        <Button
          className='px-5 text-primary-blue'
          label='Cancel'
          severity='secondary'
          onClick={onCancel}
          outlined
          text
        />
      </div>
    </div>
  )

  return (
    <>
      <FormController
        defualtValue={defaultValue}
        ref={formRef}
        onSubmit={onSubmit}
      >
        <div className='card mb-5'>
          <div className='p-2'>
            <p className='flex text-xl font-bold'>Details</p>
            <p>
              Last upadate <strong>{updatedDate}</strong> Updated By{' '}
              <strong>{updatedBy}</strong>
            </p>

            <div className='formgrid grid'>
              <div className='field col-12'>
                <TextField
                  label='Title (English)'
                  name='title'
                  rules={{ required: 'Title (English) is required.' }}
                  maxLength={30}
                  onChange={touchForm}
                />
              </div>
            </div>
            <div className='formgrid grid'>
              <div className='field col-12'>
                <TextField
                  label='Title (Thai)'
                  name='titleTh'
                  rules={{ required: 'Title (Thai) is required.' }}
                  maxLength={30}
                  onChange={touchForm}
                />
              </div>
            </div>
            <div className='formgrid grid'>
              <div className='field col-12'>
                <TextField
                  label='Title (Simplify Chinese)'
                  name='titleZh'
                  rules={{ required: 'Title (Simplify Chinese) is required.' }}
                  maxLength={30}
                  onChange={touchForm}
                />
              </div>
            </div>
            <div className='formgrid grid'>
              <div className='field col-12'>
                <TextField
                  label='Description (English)'
                  name='descriptionEn'
                  rules={{ required: 'Description (English) is required.' }}
                  maxLength={150}
                  onChange={touchForm}
                />
              </div>
              <div className='field col-12'>
                <TextField
                  label='Description (Thai)'
                  name='descriptionTh'
                  maxLength={150}
                  onChange={touchForm}
                />
              </div>
            </div>
            <div className='field grid'>
              <div className='col-12'>
                <TextField
                  label='Description (Simplify Chinese)'
                  name='descriptionZh'
                  maxLength={150}
                  onChange={touchForm}
                />
              </div>
            </div>
            <div className='field grid'>
              <div className='col-12 md:col-4'>
                <TextField
                  label='Phone number'
                  name='phoneNumber'
                  rules={{ required: 'Phone number is required.' }}
                  keyfilter={/[0-9\-()\s+]/}
                  onChange={touchForm}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-wrap gap-3'>
          <Button
            type='submit'
            className='px-5 bg-primary-blue'
            label='Publish'
            onClick={() => {
              formRef.current?.trigger().then((res) => {
                if (res) {
                  onSubmit(defaultValue)
                }
              })
            }}
          />
          <Button
            className='px-5 text-primary-blue'
            type='button'
            label='Cancel'
            severity='secondary'
            onClick={onCancel}
            outlined
            text
          />
        </div>
      </FormController>
    </>
  )
}
EmergencyContact.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const res = await emergencyContact.get()
    let ecData = res
    ctx.props = { ...ctx.props, ecData }
    return ctx
  },
  {},
  {
    redirectPath: '/personal-escort',
    accessPage: PCODE.VIEWPERSONALESCORD,
  }
)
