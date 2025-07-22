import CreateBookingContent from '@components/art-and-culture/booking-setting/create-booking'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import { artCProgramServices } from '@src/services/art-and-culture/art-c-program-service'
import { bookingSettingService } from '@src/services/art-and-culture/booking/booking-setting-service'
import { IProgram } from '@src/services/art-and-culture/model'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface CreateBookingSettingPageProps {
  programId: string
}
export default function CreateBookingSettingPage(
  props: CreateBookingSettingPageProps
) {
  const { programId } = props
  const router = useRouter()
  const [program, setProgram] = useState<IProgram | undefined>(undefined)

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
    let hasBookingSetting = undefined
    try {
      const hasBookingSettingResponse =
        await bookingSettingService.getDetailByProgramId(Number(programId))
      hasBookingSetting = hasBookingSettingResponse.data.data
    } catch (error) {
      console.log('not found setting continue to flow')
    }

    if (hasBookingSetting)
      router.push(`/art-and-culture/programs/edit/${programId}`)
  }

  useEffect(() => {
    fetchProgram()
  }, [])

  useEffect(() => {
    if (program) fetchBookingSetting()
  }, [program])

  if (!program) return <></>

  return (
    <CreateBookingContent
      {...props}
      program={program}
      programName={program?.programTranslation[0].title}
    />
  )
}

CreateBookingSettingPage.activePrime = true
export const getServerSideProps = withGenericServer(
  (ctx: any) => {
    const { programId } = ctx.props.query

    ctx.props = {
      ...ctx.props,

      programId,
    }
    return ctx
  },
  {},
  { accessPage: PCODE.CREATEBOOKINGSETTING, redirectPath: '' }
)
