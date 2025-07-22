import { Box } from '@chakra-ui/react'
import Upsert from '@components/sustainability/digital-library/upsert'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import { libraryService } from '@src/services/sustainability/digital-library/service'
import React from 'react'
import { useForm } from 'react-hook-form'

const EditLibrary = ({ initialData }: { initialData: any }) => {
  const defaultValue: any = {}
  const form = useForm({
    defaultValues: defaultValue,
  })
  return (
    <Box maxW='inherit' pb='60px'>
      <Upsert
        formData={form}
        defaultValue={defaultValue}
        libData={initialData}
        formType='edit'
      />
    </Box>
  )
}

export default EditLibrary

EditLibrary.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const { id } = ctx.props.query

    let initialData: any = null

    if (id && typeof id === 'string') {
      initialData = await libraryService
        .getLib(id)
        .then((res) => res.data)
        .catch((err) => {
          console.log('Fetch banner detail error: ', err)
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
    redirectPath: '/sustainability/library',
    accessPage: PCODE.EDITLIBRARY,
  }
)
