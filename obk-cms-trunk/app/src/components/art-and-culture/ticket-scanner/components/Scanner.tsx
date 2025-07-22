import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import styled, { CSSProperties } from 'styled-components'
import { ScannerMode, ScannerModeSection } from './ScannerModeSection'
import { validate as uuidValidate } from 'uuid'
import { toast } from 'react-toastify'

const BarcodeScannerComponent = dynamic(
  () => import('react-qr-barcode-scanner'),
  { ssr: false }
)

const OuterContainer = styled.div<{ ['custom-height']: string }>`
  position: relative;
  height: ${(props) => props['custom-height']};
  display: flex;
`
const styles: { [key: string]: CSSProperties } = {
  container: {
    position: 'relative',
    width: '100%',
    minWidth: '240px',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: '64px',
    left: 'calc(50% - 104px)',
    width: '20px',
    height: '20px',
    borderTop: '4px solid red',
    borderLeft: '4px solid red',
    zIndex: 2,
  },
  cornerTopRight: {
    position: 'absolute',
    top: '64px',
    left: 'calc(50% + 84px)',
    width: '20px',
    height: '20px',
    borderTop: '4px solid red',
    borderRight: '4px solid red',
    zIndex: 2,
  },
  cornerBottomLeft: {
    position: 'absolute',
    top: 'calc(50px + 200px)',
    left: 'calc(50% - 104px)',
    width: '20px',
    height: '20px',
    borderBottom: '4px solid red',
    borderLeft: '4px solid red',
    zIndex: 2,
  },
  cornerBottomRight: {
    position: 'absolute',
    top: 'calc(50px + 200px)',
    left: 'calc(50% + 84px)',
    width: '20px',
    height: '20px',
    borderBottom: '4px solid red',
    borderRight: '4px solid red',
    zIndex: 2,
  },
}

interface IScanner {
  isDesktopSize: boolean
  mode: ScannerMode
  onModeChange: (mode: ScannerMode) => void
  onScan: (id: string) => void
  stopStream: boolean
  setStopStream: (stop: boolean) => void
}

export const Scanner = ({
  isDesktopSize,
  mode,
  onModeChange,
  onScan,
  setStopStream,
  stopStream,
}: IScanner) => {
  const customHeight = useMemo(() => {
    if (isDesktopSize) return '500px'
    return '100%'
  }, [isDesktopSize])

  const handleScan = (id: string) => {
    const isUuid = uuidValidate(id)
    if (isUuid) {
      onScan(id)
      setStopStream(true)
    } else {
      toast.error('invalid qr code. Please try again.')
    }
  }

  const cornerColor = useMemo(
    () => (mode === 'check-in' ? '#676B9B' : '#CD1A1A'),
    [mode]
  )

  return (
    <OuterContainer custom-height={customHeight}>
      <div style={{ ...styles.container, height: customHeight }}>
        <div
          id='video-container'
          style={{
            background: 'white',
            border: '4px solid',
            height: customHeight,
          }}
        >
          <BarcodeScannerComponent
            torch={false}
            height={customHeight}
            stopStream={stopStream}
            onUpdate={(err, result) => {
              if (result) handleScan(result.getText())
            }}
          />
          <div
            style={{ ...styles.cornerTopLeft, borderColor: cornerColor }}
          ></div>
          <div
            style={{ ...styles.cornerTopRight, borderColor: cornerColor }}
          ></div>
          <div
            style={{ ...styles.cornerBottomLeft, borderColor: cornerColor }}
          ></div>
          <div
            style={{ ...styles.cornerBottomRight, borderColor: cornerColor }}
          ></div>
        </div>
      </div>
      <ScannerModeSection
        isDesktopSize={isDesktopSize}
        mode={mode}
        onModeChange={onModeChange}
      />
    </OuterContainer>
  )
}
