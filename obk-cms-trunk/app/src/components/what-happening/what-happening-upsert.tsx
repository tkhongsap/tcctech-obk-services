import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import { useRouter } from 'next/router'
import { Dialog } from 'primereact/dialog'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { KeyValue } from '@src/types/key-value'
import { whatHappeningService } from '@src/services/what-happening/service'
import {
  UpsertWhatHappening,
  WhatHappening,
} from '@src/services/what-happening/model'
// import WhatHappeningPublishDetail from './upsert/what-happening-publish-detail'
import WhatHappeningDetail from './upsert/what-happening-detail'
import WhatHappeningContent from './upsert/what-happening-content'
import { toast } from 'react-toastify'
import { defaultToastMessage } from '@src/utils/default-toast'
import WhatHappeningButton from './upsert/what-happening-button'
import { confirmDialog } from 'primereact/confirmdialog'

type Props = {
  id?: string
  mode: 'DRAFT' | 'PUBLISH'
  tags: KeyValue[]
  categories: KeyValue[]
  formData: WhatHappening
}

export default function WhatsHappeningUpsert(props: Props) {
  const { id, mode, tags, categories, formData } = props
  const [isLoading, setIsLoading] = useState(false)
  const [errorState, setErrorState] = useState<number>(0)
  const [isSubmited, setIsSubmited] = useState<boolean>(false)

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

  const langItems: Lang[] = [
    { label: 'English', code: 'en' },
    { label: 'Thai(ไทย)', code: 'th' },
    { label: 'Simplify Chinese(简体中文)', code: 'zh' },
  ]
  const [activeLang, setActiveLang] = useState<Lang>(langItems[0])

  // OBBMSSDK.setBaseUrl(process.env.BMS_BASEURL || '')
  const [visiblePublishDialog, setVisiblePublishDialog] = useState(false)
  const { setMenuName, setMenuAction } = useLayoutContext()
  const router = useRouter()
  const formRef = useRef<FormControllerRef<any>>(null)

  const onPublish = async () => {
    setVisiblePublishDialog(false)
    const value = formRef.current?.getValues()
    const payload = new UpsertWhatHappening(value)
    setIsLoading(true)

    const promise = whatHappeningService
      .upsertDocument(payload.categoryId, id, payload, true)
      .catch((e) => {
        console.error(e)
        throw e
      })
      .finally(() => setIsLoading(false))

    toast.promise(
      promise.then(() => {
        router.push('/what-happening')
      }),
      defaultToastMessage
    )
  }

  const onSaveDraft = async () => {
    const isValid = await formRef.current?.trigger()
    setIsSubmited(true)

    if (!isValid) {
      setErrorState((prev) => prev + 1)
      return
    }

    confirmDialog({
      message: `Are you sure you want to save draft this item?`,
      closable: false,
      style: { width: '500px' },
      contentClassName: 'flex justify-content-center font-semibold text-lg',
      footer: (option) => (
        <div className='flex justify-content-center gap-3'>
          <Button
            type='submit'
            label='Confirm'
            className='bg-primary-blue'
            onClick={async () => {
              option.accept()

              const value = formRef.current?.getValues()
              const payload = new UpsertWhatHappening(value)
              setIsLoading(true)

              const promise = whatHappeningService
                .upsertDocument(payload.categoryId, id, payload, false)
                .finally(() => setIsLoading(false))

              toast.promise(
                promise.then(() => {
                  router.push('/what-happening')
                }),
                defaultToastMessage
              )
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

  const onDelete = async () => {
    confirmDialog({
      message: `Are you sure you want to delete this ${formData.content.en.title}?`,
      closable: false,
      style: { width: '500px' },
      contentClassName: 'flex justify-content-start font-semibold text-lg',
      footer: (option) => (
        <div className='flex justify-content-start gap-3'>
          <Button
            type='submit'
            label='Confirm'
            severity='danger'
            onClick={async () => {
              option.accept()

              if (!id) return
              setIsLoading(true)
              const promise = whatHappeningService
                .delete(id)
                .finally(() => setIsLoading(false))

              toast.promise(
                promise.then(() => {
                  router.push('/what-happening')
                }),
                defaultToastMessage
              )
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

  const onDeleteDraft = async () => {
    confirmDialog({
      message: `Are you sure you want to delete this?`,
      closable: false,
      style: { width: '500px' },
      contentClassName: 'flex justify-content-start font-semibold text-lg',
      footer: (option) => (
        <div className='flex justify-content-start gap-3'>
          <Button
            type='submit'
            label='Confirm'
            severity='danger'
            onClick={async () => {
              option.accept()

              if (!id) return
              setIsLoading(true)
              const promise = whatHappeningService
                .deleteDraft(id)
                .finally(() => setIsLoading(false))

              toast.promise(
                promise.then(() => {
                  router.push('/what-happening')
                }),
                defaultToastMessage
              )
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

  useEffect(() => {
    if (id) {
      setMenuName('Edit What’s Happening details')
    } else {
      setMenuName('Create new What’s Happening')
    }
    setMenuAction(buttonAction)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuName])

  const OnCancel = () => {
    router.replace({
      pathname: '/what-happening',
    })
  }

  const buttonAction = (
    <div className='flex flex-column xl:flex-row mb-5 justify-content-between align-items-center'>
      <div className='flex gap-3 px-3'>
        <Button
          type='submit'
          className='px-3 bg-primary-blue'
          label={
            mode === 'DRAFT' ? "Create new What's Happening" : 'Save changes'
          }
          onClick={() => {
            formRef.current?.trigger().then((res) => {
              if (!res) {
                setErrorState(() => errorState + 1)
                setIsSubmited(true)
                return
              }
              setVisiblePublishDialog(true)
            })
          }}
        />
        {mode === 'DRAFT' ? (
          <>
            <Button
              type='button'
              label='Save draft'
              className='text-primary-blue'
              outlined
              onClick={onSaveDraft}
            />
            {id && (
              <Button
                type='button'
                label='Delete this item'
                severity='danger'
                onClick={onDeleteDraft}
              />
            )}
          </>
        ) : (
          <Button
            label='Delete this item'
            severity='danger'
            onClick={onDelete}
          />
        )}
        <Button
          type='button'
          disabled={isLoading}
          className='px-5 text-primary-blue'
          text
          onClick={OnCancel}
          label='Cancel'
          severity='secondary'
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
        {/* <WhatHappeningPublishDetail
          triggerErrorState={triggerErrorState}
          errorState={errorState}
        /> */}
        <WhatHappeningDetail
          id={id}
          categories={categories}
          triggerErrorState={triggerErrorState}
        />
        <WhatHappeningContent
          tags={tags}
          activeLang={activeLang}
          setActiveLang={setActiveLang}
          langItems={langItems}
          triggerErrorState={triggerErrorState}
        />
        <WhatHappeningButton
          activeLang={activeLang}
          langItems={langItems}
          setActiveLang={setActiveLang}
          triggerErrorState={triggerErrorState}
        />

        <div className='flex flex-wrap gap-3'>
          <Button
            type='submit'
            className='px-3 bg-primary-blue'
            label={
              mode === 'DRAFT' ? "Create new What's Happening" : 'Save changes'
            }
            onClick={() => {
              formRef.current?.trigger().then((res) => {
                if (!res) {
                  setErrorState(() => errorState + 1)
                  setIsSubmited(true)
                  return
                }
                setVisiblePublishDialog(true)
              })
            }}
          />

          {mode === 'PUBLISH' ? (
            <Button
              type='button'
              label='Delete this item'
              severity='danger'
              onClick={onDelete}
            />
          ) : (
            <>
              <Button
                type='button'
                label='Save draft'
                className='text-primary-blue'
                outlined
                onClick={onSaveDraft}
              />

              {id && (
                <Button
                  type='button'
                  label='Delete this item'
                  severity='danger'
                  onClick={onDeleteDraft}
                />
              )}
            </>
          )}

          <Button
            type='button'
            disabled={isLoading}
            className='px-5 text-primary-blue'
            label='Close'
            text
            onClick={OnCancel}
          />
        </div>

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
                {mode === 'PUBLISH'
                  ? 'Are you sure you want to publish the changes?'
                  : 'Are you sure you want to create this item?'}
              </span>
              <div className='flex gap-3 mt-5'>
                <Button
                  className='bg-primary-blue'
                  label='Confirm'
                  onClick={onPublish}
                />
                <Button
                  className='px-5 text-primary-blue'
                  outlined
                  onClick={(e) => hide(e)}
                  label='Cancel'
                />
              </div>
            </div>
          )}
        ></Dialog>
      </FormController>
    </>
  )
}
WhatsHappeningUpsert.activePrime = true
