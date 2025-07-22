import React, { useEffect, useState } from 'react'
import withGenericServer from '@hocs/server/generic'
import Heading from '@components/typography/heading'
import { useRouter } from 'next/router'
import { Dialog } from 'primereact/dialog'
import { feedbackRequestService } from '@src/services/buildingservice/feedbackrequest/service'
import { CreateWorkOrder } from '@components/building/feedbackrequest/create-work-order'
import {
  ICreateAWorkOrderModel,
  IFeedbackRequest,
} from '@src/services/buildingservice/feedbackrequest/model'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { Button } from 'primereact/button'
import { FormController } from '@components/forms/components/form-controller'
import TextField from '@components/forms/components/text-field'
import LabelValue from '@components/forms/utils/label-field'
import { Image } from '@chakra-ui/react'
import { toast } from 'react-toastify'

type Props = {
  feedbackRequest: IFeedbackRequest
}

export default function FeedbackShow({ feedbackRequest }: Props) {
  const router = useRouter()
  const { setMenuName } = useLayoutContext()

  const onSubmit = (data: ICreateAWorkOrderModel) => {
    const promise = feedbackRequestService
      .createWorkOrder(data)
      .then(() => router.back())
    toast.promise(promise, {
      success: 'Saved success',
      error: 'Error Some thing went wrong',
      pending: 'Loading...',
    })
  }

  const [visibleCreateModal, setVisibleCreateModal] = useState(false)
  const [visibleCloseModal, setVisibleCloseModal] = useState(false)

  const onDoneClick = () => {
    router.push({
      pathname: '/building/feedbackrequest',
    })
  }

  useEffect(() => {
    setMenuName(feedbackRequest.feedbackcode)
  }, [feedbackRequest.feedbackcode, setMenuName])

  return (
    <div className='card'>
      <div>
        <Heading as='h3' color='biscay'>
          Details
        </Heading>
        <FormController defualtValue={feedbackRequest} onSubmit={() => {}}>
          <div className='grid'>
            <div className='col-4'>
              <TextField name='location' label='Location' disabled />
            </div>
            <div className='col-4'>
              <TextField name='problemtype' label='Problem type' disabled />
            </div>
            <div className='col-4'>
              <TextField name='issue' label='Issue' disabled />
            </div>
            <div className='col-12'>
              <TextField name='description' label='Description' disabled />
            </div>
            <div className='col-12'>
              <LabelValue label='Image'>
                <Image
                  src={feedbackRequest?.image}
                  width={'100%'}
                  alt='Dan Abramov'
                />
              </LabelValue>
            </div>
            <div className='col-4'>
              <TextField name='authorname' label='Author name' disabled />
            </div>
            <div className='col-4'>
              <TextField name='email' label='Email' disabled />
            </div>
            <div className='col-4'>
              <TextField name='phonenumber' label='Phone Number' disabled />
            </div>

            <div className='col-12'>
              <TextField
                name='datetime'
                label='Date and time submitted'
                disabled
              />
            </div>

            <div className='flex gap-3 mt-3 mx-2'>
              <Button
                className='bg-gray-900 border-gray-900 text-gray-50'
                onClick={() => setVisibleCreateModal(true)}
                label='Create a work order'
              />
              <Button
                className='bg-gray-50 border-gray-900 text-gray-600'
                onClick={() => setVisibleCloseModal(true)}
                label='Close this feedback'
              />
              <Button
                className='bg-gray-50 border-gray-900 text-gray-600'
                onClick={onDoneClick}
                label='Done'
              />
            </div>
          </div>
        </FormController>
      </div>

      <CreateWorkOrder
        onSubmit={onSubmit}
        setVisible={setVisibleCreateModal}
        visible={visibleCreateModal}
      ></CreateWorkOrder>

      <Dialog
        header='confirm'
        blockScroll={true}
        visible={visibleCloseModal}
        style={{ width: '50vw' }}
        onHide={() => {
          setVisibleCloseModal(false)
        }}
      >
        <div className=''>
          <span>Are you sure you want to make changes to the request?</span>
          <div className='flex gap-3 mt-3'>
            <Button
              className='bg-gray-900 border-gray-900 text-gray-50'
              onClick={onDoneClick}
              label='Confirm'
            />
            <Button
              className='bg-gray-50 border-gray-900 text-gray-600'
              onClick={() => setVisibleCloseModal(false)}
              label='Cancel'
            />
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const { id } = ctx.props.query
    const res = await feedbackRequestService.get(id)
    const feedbackRequest = res.data

    return { props: { feedbackRequest } }
  },
  {
    redirectPath: '/users/all',
  }
)
