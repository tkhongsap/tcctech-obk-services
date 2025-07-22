import { BookingStatusContent } from '@components/art-and-culture/booking-status/booking-status'

import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'

export default function BookingStatusPage() {
  return <BookingStatusContent />
}

BookingStatusPage.activePrime = true
export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = {
      ...ctx.props,
    }
    return ctx
  },
  {},
  { accessPage: PCODE.VIEWBOOKINGSTATUS, redirectPath: '' }
)
