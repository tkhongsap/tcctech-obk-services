import { TicketScannerContent } from '@components/art-and-culture/ticket-scanner/ticket-scanner'

import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'

export default function TicketScannerPage() {
  return <TicketScannerContent />
}

TicketScannerPage.activePrime = true
export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = {
      ...ctx.props,
    }
    return ctx
  },
  {},
  { accessPage: PCODE.SCANTICKET, redirectPath: '' }
)
