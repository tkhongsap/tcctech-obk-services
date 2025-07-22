import { setupServer } from 'msw/node'

import { artCBookingSettingServiceHandlers } from './service-art-c-booking-setting'
import { artCServiceProgramHandlers } from './service-art-c-program'
import { obkCmsServiceHandlers } from './service-obk-cms'

export const server = setupServer(
  ...artCBookingSettingServiceHandlers,
  ...artCServiceProgramHandlers,
  ...obkCmsServiceHandlers
)
