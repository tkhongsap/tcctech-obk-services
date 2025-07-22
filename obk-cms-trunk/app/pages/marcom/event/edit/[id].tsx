import withGenericServer from '@hocs/server/generic'
import { HeroData } from '@src/services/marcom/hero-banner/model'
import React from 'react'
import { useForm } from 'react-hook-form'
import { PCODE } from '@src/data/constants/privilege'
import { Box } from '@chakra-ui/react'
import Upsert from '@components/marcom/event/upsert'
import { eventService } from '@src/services/marcom/special-event/service'

const EditEvent = ({ initialData }: { initialData: any }) => {
  const defaultValue: any = new HeroData(undefined)
  const form = useForm({
    defaultValues: defaultValue,
  })
  return (
    <Box maxW='inherit' pb='60px'>
      <Upsert
        formData={form}
        defaultValue={defaultValue}
        formType='edit'
        eventData={initialData}
      />
    </Box>
  )
}

export default EditEvent

EditEvent.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const { id } = ctx.props.query

    let initialData: any = null

    if (id && typeof id === 'string') {
      initialData = await eventService
        .getEvent(id)
        .then((res) => res.data)
        .catch((err) => {
          console.log('Fetch event detail error: ', err)
          return null // Handle error appropriately
        })
    }

    return {
      props: {
        initialData,
      },
    }
  },
  {},
  {
    redirectPath: '/marcom/event',
    accessPage: PCODE.EDITEVENT,
  }
)
