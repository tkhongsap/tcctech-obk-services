import RoundedButton from '@components/button/rounded'
import { useTranslate } from '@refinedev/core'
import clsx from 'clsx'
import dayjs from 'dayjs'

interface IMaintenanceButton {
  isUnderMaintenace?: boolean
  platform: string
  onClick: () => void
  createdAt?: string
}

const MaintenanceButton = ({
  isUnderMaintenace,
  platform,
  onClick,
  createdAt,
}: IMaintenanceButton) => {
  const translate = useTranslate()
  return (
    <div
      className={clsx(
        'tw-flex tw-items-center tw-justify-between tw-rounded-[8px] tw-p-6',
        isUnderMaintenace ? 'tw-bg-[#FAE8E8]' : 'tw-bg-[#EFF8E8]'
      )}
    >
      <div className='tw-flex tw-items-center tw-space-x-4'>
        <div
          className={clsx(
            'tw-font-bold tw-text-2xl',
            isUnderMaintenace ? 'tw-text-[#CD1A1A]' : 'tw-text-[#59B413]'
          )}
        >
          {platform}
        </div>
        {isUnderMaintenace && createdAt && (
          <div className='tw-text-[#273281] tw-text-sm'>
            {`${translate('appMaintenance.text.createdAt')}: ${dayjs(
              createdAt
            ).format('YYYY-MM-DD HH:mm:ss')}`}
          </div>
        )}
      </div>

      <RoundedButton
        color={isUnderMaintenace ? 'white' : '#4318FF'}
        bg={isUnderMaintenace ? '#4318FF' : 'transparent'}
        border='#4318FF'
        p='12px 24px'
        height='auto'
        onClick={onClick}
      >
        {translate(
          isUnderMaintenace
            ? 'appMaintenance.button.endMaintenance'
            : 'appMaintenance.button.maintenanceNow'
        )}
      </RoundedButton>
    </div>
  )
}

export default MaintenanceButton
