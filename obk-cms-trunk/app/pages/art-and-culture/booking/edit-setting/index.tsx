import EditBookingContent from '@components/art-and-culture/booking-setting/edit-booking'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import { artCProgramServices } from '@src/services/art-and-culture/art-c-program-service'
import { bookingSettingService } from '@src/services/art-and-culture/booking/booking-setting-service'
import { IBookingSettingDetail } from '@src/services/art-and-culture/booking/model'
import { IProgram } from '@src/services/art-and-culture/model'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
interface EditBookingSettingPageProps {
  programId: string
}
export default function EditBookingSettingPage(
  props: EditBookingSettingPageProps
) {
  const { programId } = props
  const router = useRouter()
  const [program, setProgram] = useState<IProgram | undefined>(undefined)
  const [bookingSetting, setBookingSetting] = useState<
    IBookingSettingDetail | undefined
  >(undefined)

  const fetchProgram = async () => {
    try {
      const programResponse = await artCProgramServices.get(programId, 'en')
      setProgram(programResponse.data.data)
    } catch (error) {
      console.log('Not found program', programId)
      router.push(`/art-and-culture/programs`)
    }
  }

  const fetchBookingSetting = async () => {
    let defaultValues = undefined
    try {
      const hasBookingSettingResponse =
        await bookingSettingService.getDetailByProgramId(Number(programId))
      defaultValues = hasBookingSettingResponse.data.data
      setBookingSetting(defaultValues)
    } catch (error) {
      console.log('not found setting return to edit program')
    }

    if (!defaultValues) router.push(`/art-and-culture/programs`)
  }

  useEffect(() => {
    fetchProgram()
  }, [])

  useEffect(() => {
    if (program) fetchBookingSetting()
  }, [program])

  if (!program || !bookingSetting) return <></>

  return (
    <EditBookingContent
      {...props}
      program={program}
      programName={program?.programTranslation[0].title}
      fetchedData={bookingSetting}
    />
  )
}

EditBookingSettingPage.activePrime = true
export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const { programId } = ctx.props.query

    ctx.props = {
      ...ctx.props,
      programId,
    }
    return ctx
  },
  {},
  { accessPage: PCODE.EDITBOOKINGSETTING, redirectPath: '' }
)
