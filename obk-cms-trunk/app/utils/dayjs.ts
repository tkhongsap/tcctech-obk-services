import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Bangkok')

export default dayjs

export function formatDateTime(date: string) {
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}
