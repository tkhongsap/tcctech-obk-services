import styled from '@emotion/styled'
import { PCODE } from '@src/data/constants/privilege'
import { usePermission } from '@src/hooks/permissionProvider'
import { Modal } from 'antd'
import { Button, ButtonProps } from 'primereact/button'

const ActionAbsolute = styled.div`
  position: absolute;
  height: 35%;
  background-color: white;
  width: 100%;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 24px 16px 64px 16px;
  bottom: 0;
`

const ActionInline = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  background-color: #fcfcfc;
  padding: 100px 16px 16px 16px;
  width: 400px;
  height: 100%;
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

interface CheckInContentProps extends ModeProperties {
  onClickCheckIn: () => void
  onClickReset: () => void
}

export const Content = ({
  title,
  titleClassName,
  description,
  rightButtonClassName,
  leftButtonProps,
  onClickCheckIn,
  onClickReset,
}: CheckInContentProps) => {
  const { checkAccess } = usePermission()
  return (
    <ContentContainer id='scanner-mode-container'>
      <div className='content-text'>
        <h2 className={titleClassName}>{title}</h2>
        <p className='tw-text-lg text-primary-blue text-center'>
          {description}
        </p>
      </div>
      <div className='button-container'>
        <Button
          className={leftButtonProps?.outlined ? undefined : 'bg-primary-blue'}
          {...leftButtonProps}
          onClick={onClickCheckIn}
        >
          Check-in
        </Button>
        {checkAccess(PCODE.RESETTICKET) && (
          <Button className={rightButtonClassName} text onClick={onClickReset}>
            Reset Ticket
          </Button>
        )}
      </div>
    </ContentContainer>
  )
}

interface ModeProperties {
  title: string
  titleClassName: string
  description: string
  leftButtonProps: ButtonProps | undefined
  rightButtonClassName: string
}

export const modeProperties: {
  'check-in': ModeProperties
  reset: ModeProperties
} = {
  'check-in': {
    title: 'Check-in Mode',
    titleClassName: 'text-success',
    description: 'Scan ticket to check-in.',
    leftButtonProps: undefined,
    rightButtonClassName: 'tw-text-#676B9B',
  },
  reset: {
    title: 'Reset ticket Mode',
    titleClassName: 'text-danger ',
    description: 'Scan ticket to reset status to unused.',
    leftButtonProps: { outlined: true },
    rightButtonClassName: 'text-danger',
  },
}

export type ScannerMode = keyof typeof modeProperties

interface CheckInActionProps {
  isDesktopSize: boolean
  onModeChange: (mode: ScannerMode) => void
  mode: ScannerMode
}

export const ScannerModeSection = ({
  isDesktopSize,
  mode,
  onModeChange,
}: CheckInActionProps) => {
  const handleClickCheckInMode = () => {
    onModeChange('check-in')
  }

  const handleClickResetMode = () => {
    if (mode === 'check-in') {
      Modal.confirm({
        styles: {
          content: {
            padding: '40px',
          },
        },
        title: (
          <div className='w-full flex justify-content-center md:justify-content-start'>
            <h4 className='text-warning'>Switch to Reset Ticket</h4>
          </div>
        ),
        content: (
          <div className='w-full flex justify-content-center md:justify-content-start'>
            <p className='tw-text-[16px] tw-text-[#676B9B]'>
              Are you sure you want to switch scan mode?
            </p>
          </div>
        ),
        icon: null,
        closable: false,
        width: 640,
        footer: (
          <div className='flex flex-column md:flex-row md:justify-start gap-2 mt-4'>
            <Button
              type='button'
              className='w-full sm:w-auto justify-content-center bg-primary-blue'
              onClick={async () => {
                onModeChange('reset')
                Modal.destroyAll()
              }}
            >
              Yes, switch to reset ticket mode
            </Button>
            <Button
              outlined
              className='w-full sm:w-auto justify-content-center text-primary-blue'
              onClick={() => Modal.destroyAll()}
            >
              Cancel
            </Button>
          </div>
        ),
        centered: true,
      })
    } else {
      onModeChange('reset')
    }
  }

  const ContentComponent = () => {
    return (
      <Content
        {...modeProperties[mode]}
        onClickCheckIn={handleClickCheckInMode}
        onClickReset={handleClickResetMode}
      />
    )
  }

  if (isDesktopSize)
    return (
      <ActionInline>
        <ContentComponent />
      </ActionInline>
    )
  return (
    <ActionAbsolute>
      <ContentComponent />
    </ActionAbsolute>
  )
}
