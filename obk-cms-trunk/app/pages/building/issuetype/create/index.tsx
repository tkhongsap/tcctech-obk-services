/* eslint-disable unused-imports/no-unused-vars-ts */
import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import TextField from '@components/forms/components/text-field'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import { useRouter } from 'next/router'
import TextAreaField from '@components/forms/components/text-area-field'
import { Dialog } from 'primereact/dialog'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import withGenericServer from '@hocs/server/generic'
import * as OBBMSSDK from 'ob-bms-sdk'
import { PCODE } from '@src/data/constants/privilege'

export default function IssueTypeCreate() {
  OBBMSSDK.setBaseUrl(process.env.BMS_BASEURL || '')
  const [visiblePublishDialog, setVisiblePublishDialog] = useState(false)
  const [english, setEnglish] = useState('')
  const [thai, setThai] = useState('')
  const [chinese, setChinese] = useState('')
  const [internalRemark, setInternalRemark] = useState('')
  const { setMenuName, setMenuAction } = useLayoutContext()
  const router = useRouter()
  const formRef = useRef<FormControllerRef<any>>(null)

  const formData = {
    display_name: { en: '', th: '', zh: '' },
    name: english,
    // id: '5b6a4965-dd9d-4f59-8702-40c55f3177d7',
    // updated_at: new Date().toISOString(),
    // internal_remark: undefined,
  }

  const onPublish = async () => {
    const value = formRef.current?.getValues()
    value.name = english
    console.log(value)

    await OBBMSSDK.client
      .issueTypesCreate(value)
      .then((res) => {
        console.log(res.data?.data)
        router.push({
          pathname: '/building/issuetype',
        })
      })
      .catch((ex) => {
        console.log(ex)
      })
  }

  useEffect(() => {
    setMenuName('Create new issue type')
    setMenuAction(buttonAction)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuName])

  const OnCancel = () => {
    router.push({
      pathname: '/building/issuetype',
    })
  }

  const buttonAction = (
    <div className='flex flex-column xl:flex-row mb-5 justify-content-between align-items-center'>
      <div className='flex gap-3 px-3'>
        <Button
          className='px-3'
          label='Publish'
          onClick={() => setVisiblePublishDialog(true)}
        />
        <Button
          className='px-5'
          label='Cancel'
          severity='secondary'
          outlined
          onClick={OnCancel}
        />
      </div>
    </div>
  )

  const onConfirmPublish = () => {
    if (english && thai && chinese) setVisiblePublishDialog(true)
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
                <TextField disabled label='Issue ID' name='id' />
              </div>
            </div>
            <div className='formgrid grid'>
              <div className='field col-12 md:col-4'>
                <TextField
                  label='Issue type name(English)'
                  name='display_name.en'
                  rules={{ required: 'Issue type(English) is required.' }}
                  value={english}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEnglish(e.target.value)
                  }
                />
              </div>
              <div className='field col-12 md:col-4'>
                <TextField
                  label='Issue type name(Thai)'
                  name='display_name.th'
                  rules={{ required: 'Issue type(Thai) is required.' }}
                  value={thai}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setThai(e.target.value)
                  }
                />
              </div>
              <div className='field col-12 md:col-4'>
                <TextField
                  label='Issue type name(Simplify Chinese)'
                  name='display_name.zh'
                  rules={{
                    required: 'Issue type(Simplify Chinese) is required.',
                  }}
                  value={chinese}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setChinese(e.target.value)
                  }
                />
              </div>
            </div>
            <div className='field grid'>
              <div className='col-12'>
                <TextAreaField
                  name='internal_remark'
                  label='Internal remark'
                  rows={5}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setInternalRemark(e.target.value)
                  }
                  value={internalRemark ?? ''}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-wrap gap-3'>
          <Button
            className='px-3'
            label='Publish'
            onClick={() => onConfirmPublish()}
          />
          <Button
            type='button'
            className='px-5'
            label='Cancel'
            severity='secondary'
            outlined
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
                Are you sure you want to create new issue type?
              </span>
              <div className='flex gap-3 mt-5'>
                <Button label='Confirm' onClick={onPublish} />
                <Button
                  className='bg-gray-50 border-gray-900 text-gray-600'
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
IssueTypeCreate.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/issuetype',
    accessPage: PCODE.CREATEANDEDITISSUETYPE,
  }
)
