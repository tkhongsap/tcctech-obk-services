/* eslint-disable unused-imports/no-unused-vars-ts */
import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import TextField from '@components/forms/components/text-field'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import TextAreaField from '@components/forms/components/text-area-field'
import { Dialog } from 'primereact/dialog'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import withGenericServer from '@hocs/server/generic'
import { useRouter } from 'next/router'
import * as OBBMSSDK from 'ob-bms-sdk'
import { PCODE } from '@src/data/constants/privilege'
import { IssueTypeData } from 'ob-bms-sdk/dist/api'

type Props = {
  RequestData: IssueTypeData
  id: string
}

export default function IssueTypeEdit(props: Props) {
  const { RequestData, id } = props
  const [visiblePublishDialog, setVisiblePublishDialog] = useState(false)
  const [visibleDeleteDialog, setVisibleDeleteDialog] = useState(false)
  const [english, setEnglish] = useState(
    (RequestData.display_name as { en: any }).en ?? ''
  )
  const [thai, setThai] = useState(
    (RequestData.display_name as { th: any }).th ?? ''
  )
  const [chinese, setChinese] = useState(
    (RequestData.display_name as { zh: any }).zh ?? ''
  )
  const [internalRemark, setInternalRemark] = useState('')
  const { setMenuName, setMenuAction } = useLayoutContext()
  const router = useRouter()

  const formRef = useRef<FormControllerRef<any>>(null)
  const formData = {
    // updated_at: RequestData.updated_at,
    // created_at: RequestData.created_at,
    display_name: { en: english, th: thai, zh: chinese },
    name: RequestData.name,
    id: RequestData.id,
    internal_remark: RequestData.internal_remark,
  }

  useEffect(() => {
    // fetchCampaign()
    setMenuName('Edit new issue type')
    setMenuAction(buttonAction)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuAction])

  const OnCancel = () => {
    router.push({
      pathname: '/building/issuetype',
    })
  }

  function handlePublish() {
    OBBMSSDK.client.issueTypesUpdate(id, {
      display_name: {
        en: english,
        th: thai,
        zh: chinese,
      },
      name: english,
      internal_remark: internalRemark ?? '',
    })
    console.log('update data is ', RequestData)

    setVisiblePublishDialog(false)
    router.push({
      pathname: '/building/issuetype',
    })
  }

  function handleDelete() {
    OBBMSSDK.client.issueTypesUpdate(id, {
      deleted_at: new Date().toISOString(),
    })

    setVisibleDeleteDialog(false)
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
          label='Delete this issue type'
          severity='danger'
          outlined
          onClick={() => setVisibleDeleteDialog(true)}
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

  return (
    <>
      <div className='card mb-5'>
        <div className='p-2'>
          <span className='flex text-xl font-bold mb-5'>Details</span>
          <FormController
            defualtValue={formData}
            ref={formRef}
            onSubmit={() => {}}
          >
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
                  // value={RequestData.internal_remark ?? ''}
                />
              </div>
            </div>
          </FormController>
        </div>
      </div>
      <div className='flex flex-wrap gap-3'>
        <Button
          className='px-3'
          label='Publish'
          onClick={() => setVisiblePublishDialog(true)}
        />
        <Button
          className='px-5'
          label='Delete this issue type'
          severity='danger'
          outlined
          onClick={() => setVisibleDeleteDialog(true)}
        />
        <Button
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
              Are you sure you want to publish change?
            </span>
            <div className='flex gap-3 mt-5'>
              <Button label='Confirm' onClick={handlePublish} />
              <Button
                className='bg-gray-50 border-gray-900 text-gray-600'
                onClick={(e) => hide(e)}
                label='Cancel'
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
              Are you sure you want to remove this issue type?
            </span>
            <div className='flex gap-3 mt-5'>
              <Button label='Delete' severity='danger' onClick={handleDelete} />
              <Button
                className='bg-gray-50 border-gray-900 text-gray-600'
                onClick={(e) => hide(e)}
                label='Cancel'
              />
            </div>
          </div>
        )}
      ></Dialog>
    </>
  )
}
IssueTypeEdit.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const { id } = ctx.props.query
    OBBMSSDK.setBaseUrl(process.env.BMS_BASEURL || '')
    const res = await OBBMSSDK.client.issueTypesShow(id)
    const RequestData = res.data.data
    console.log('data is ', res.data)

    ctx.props = {
      ...ctx.props,
      RequestData,
      id,
    }
    return ctx
  },
  {},
  {
    redirectPath: '/issuetype',
    accessPage: PCODE.CREATEANDEDITISSUETYPE,
  }
)
