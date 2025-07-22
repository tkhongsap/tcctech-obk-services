import BookingHistoryContent from '@components/art-and-culture/booking-history/booking-history'
import {
  convertToTimeRageFormat,
  formatDate,
} from '@components/art-and-culture/booking-setting/utils/helper'

import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import { artCProgramServices } from '@src/services/art-and-culture/art-c-program-service'
import { bookingTransactionService } from '@src/services/art-and-culture/booking/booking-transaction-service'
import { IBookingTransactionList } from '@src/services/art-and-culture/booking/model'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface ShowBookingHistoryPageProps {
  bookingSlotTimeId: string
  programId: string
}
export default function ShowBookingHistoryPage(
  props: ShowBookingHistoryPageProps
) {
  const { bookingSlotTimeId, programId } = props
  const router = useRouter()
  const [bookingHistoryList, setBookingHistoryList] = useState<
    IBookingTransactionList[]
  >([])
  const [programName, setProgramName] = useState<string | undefined>(undefined)

  const fetchProgram = async () => {
    try {
      const programResponse = await artCProgramServices.get(programId, 'en')
      const program = programResponse.data.data
      setProgramName(program.programTranslation[0].title)
    } catch (error) {
      console.log('Not found program', programId)
      router.push(`/art-and-culture/programs`)
    }
  }

  const fetchBookingHistoryList = async () => {
    const bookingHistoryListResponse = await bookingTransactionService.getList(
      bookingSlotTimeId
    )
    const bookingHistoryListFetched = bookingHistoryListResponse.data.data
    setBookingHistoryList(bookingHistoryListFetched)
    if (!bookingHistoryListFetched || bookingHistoryListFetched.length === 0)
      router.push(
        `/art-and-culture/booking/edit-setting?programId=${programId}`
      )
  }

  const timeRange = () => {
    const start = bookingHistoryList[0].beginSlotTime
    const end = bookingHistoryList[0].endSlotTime

    if (start && end) return convertToTimeRageFormat(start, end)
    return ''
  }

  useEffect(() => {
    fetchProgram()
  }, [])

  useEffect(() => {
    fetchBookingHistoryList()
  }, [])

  if (!programName || bookingHistoryList.length === 0) return <></>

  return (
    <BookingHistoryContent
      {...props}
      programName={programName}
      showDate={formatDate(bookingHistoryList[0].slotDate)}
      timeRange={timeRange()}
    />
  )
}

ShowBookingHistoryPage.activePrime = true
export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const { bookingSlotTimeId, programId } = ctx.props.query

    ctx.props = {
      ...ctx.props,
      bookingSlotTimeId,
      programId,
    }
    return ctx
  },
  {},
  { accessPage: PCODE.VIEWBOOKINGHISTORY, redirectPath: '' }
)
