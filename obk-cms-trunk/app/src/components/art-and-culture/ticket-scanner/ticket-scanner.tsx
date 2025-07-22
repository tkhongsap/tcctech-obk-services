import { useMediaQuery } from '@chakra-ui/react'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { bookingTicketService } from '@src/services/art-and-culture/booking/booking-ticket-service'
import { IBookingTicketResponse } from '@src/services/art-and-culture/booking/model'
import { Col, Modal, Row } from 'antd'
import { get } from 'lodash'
import { Button } from 'primereact/button'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { CSSProperties } from 'styled-components'
import { formatDateTime } from '../booking-setting/utils/helper'
import { ProcessingLoading } from './components/ProcessingLoading'
import { Scanner } from './components/Scanner'
import { ScannerMode } from './components/ScannerModeSection'
import { TicketDetail } from './components/TicketDetail'

const containerStyles = (sizes: boolean[]): CSSProperties | undefined => {
  if (sizes[1]) {
    return {
      minWidth: '320px',
      maxWidth: '1330px',
      marginTop: '40px',
    }
  }
  if (sizes[0]) {
    return {
      height: '100vh',
      position: 'fixed',
      left: 0,
      minWidth: '320px',
      top: '60px',
      width: '100%',
    }
  }
}

export function TicketScannerContent() {
  const { setMenuName } = useLayoutContext()
  const matches = useMediaQuery(['(min-width: 320px)', '(min-width: 769px)'])
  const [loading, setLoading] = useState<boolean>(false)

  const [scannerMode, setScannerMode] = useState<ScannerMode>('check-in')
  const [ticketId, setTicketId] = useState<string | undefined>(undefined)
  const [detail, setDetail] = useState<IBookingTicketResponse | undefined>(
    undefined
  )
  const [stopStream, setStopStream] = useState(false)

  const fetchTicketDetail = async (ticketId: string) => {
    try {
      const response = await bookingTicketService.get(ticketId)
      setDetail(response.data.data)
    } catch (error) {
      setTicketId(undefined)
      setStopStream(true)
      const message = get(
        error,
        'response.data.message',
        'Something went wrong'
      )
      toast.error(message)
    }
  }

  const handleChangeMode = (mode: ScannerMode) => {
    setScannerMode(mode)
  }

  const handleScan = async (id: string) => {
    setTicketId(id)
  }

  const handleResetTicket = async () => {
    if (ticketId) {
      try {
        setLoading(true)
        const response = await bookingTicketService.resetTicket(ticketId)
        await fetchTicketDetail(response.data.data.id)

        Modal.confirm({
          styles: {
            content: {
              padding: '40px',
            },
            mask: {
              padding: '16px',
            },
          },
          title: (
            <div className='w-full flex justify-content-center md:justify-content-start'>
              <h4>Reset ticket successful!</h4>
            </div>
          ),
          content: (
            <div className='w-full flex justify-content-center md:justify-content-start'>
              <p className='tw-text-lg tw-text-[#676B9B]'>
                The ticket status is now set to unused.
              </p>
            </div>
          ),
          icon: null,
          closable: false,
          width: 640,
          centered: true,
          footer: (
            <div className='flex flex-column md:flex-row md:justify-start gap-2 mt-4'>
              <Button
                type='button'
                label='Continue on Check-in Mode'
                className='w-full md:w-auto bg-primary-blue'
                style={{ height: '48px' }}
                onClick={() => {
                  handleChangeMode('check-in')
                  handleClearData()
                  Modal.destroyAll()
                }}
              />
              <Button
                text
                type='button'
                label='Reset other ticket'
                severity='danger'
                className='w-full md:w-auto'
                style={{ height: '48px' }}
                onClick={() => {
                  handleChangeMode('reset')
                  handleClearData()
                  Modal.destroyAll()
                }}
              />
            </div>
          ),
        })
      } catch (error) {
        console.log(error)
        const message = get(error, 'response.data.message')
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCheckInTicket = async () => {
    if (ticketId) {
      try {
        setLoading(true)
        const response = await bookingTicketService.checkIn(ticketId)
        const { id, bookedTicketsCount, checkedInTicketsCount } =
          response.data.data
        await fetchTicketDetail(id)
        Modal.confirm({
          styles: {
            content: {
              padding: '40px',
            },
            mask: {
              padding: '16px',
            },
          },
          title: (
            <div className='w-full flex justify-content-center md:justify-content-start'>
              <h4>Check-in successful!</h4>
            </div>
          ),
          content: (
            <Row
              style={{ width: '100%' }}
              align={{ md: 'middle' }}
              justify={{ xs: 'center' }}
            >
              <Col xs={24} md={3}>
                <h2 className='font-bold text-success m-0'>
                  {checkedInTicketsCount}/{bookedTicketsCount}
                </h2>
              </Col>
              <Col xs={24} md={21}>
                <p className='tw-text-lg tw-text-[#676B9B] text-center md:text-left'>
                  ticket has been successfully scanned.
                </p>
              </Col>
            </Row>
          ),
          icon: null,
          closable: false,
          width: 640,
          centered: true,
          footer: (
            <div className='flex flex-column md:flex-row md:justify-start gap-2 mt-4'>
              <Button
                type='submit'
                label='Continue'
                className='w-full md:w-auto bg-primary-blue'
                style={{ height: '48px' }}
                onClick={() => {
                  handleChangeMode('check-in')
                  handleClearData()
                  Modal.destroyAll()
                }}
              />
            </div>
          ),
        })
      } catch (error) {
        console.log(error)
        const message = get(error, 'response.data.message')
        // TODO: Improve Fixed Condition
        if (message == 'ticket already used' && detail?.checkedInAt) {
          Modal.confirm({
            styles: {
              content: {
                padding: '40px',
              },
              mask: {
                padding: '16px',
              },
            },
            title: (
              <div className='w-full flex justify-content-center md:justify-content-start'>
                <p className='text-danger'>Ticket already used</p>
              </div>
            ),
            content: (
              <div className='flex align-items-center gap-2'>
                <p className='tw-text-lg tw-text-[#676B9B]'>
                  This ticket already checked-in at{' '}
                  <span className='font-bold'>
                    {formatDateTime(detail?.checkedInAt)}
                  </span>{' '}
                  and cannot be used again.
                </p>
              </div>
            ),
            icon: null,
            closable: false,
            width: 640,
            centered: true,
            footer: (
              <div className='flex flex-column md:flex-row md:justify-start gap-2 mt-4'>
                <Button
                  style={{ height: '48px', width: '120px' }}
                  type='submit'
                  label='OK'
                  className='w-full md:w-auto bg-primary-blue'
                  onClick={() => {
                    Modal.destroyAll()
                  }}
                />
              </div>
            ),
          })
        } else {
          Modal.confirm({
            styles: {
              content: {
                padding: '40px',
              },
              mask: {
                padding: '16px',
              },
            },
            title: (
              <div className='w-full flex justify-content-center md:justify-content-start'>
                <p className='text-danger'>Ticket invalid</p>
              </div>
            ),
            content: (
              <div className='flex align-items-center gap-2'>
                <p className='tw-text-lg tw-text-[#676B9B]'>
                  Please check showtimes on your ticket details.
                </p>
              </div>
            ),
            icon: null,
            closable: false,
            width: 640,
            centered: true,
            footer: (
              <div className='flex flex-column md:flex-row md:justify-start gap-2 mt-4'>
                <Button
                  style={{ height: '48px', width: '120px' }}
                  type='submit'
                  label='OK'
                  className='w-full md:w-auto bg-primary-blue'
                  onClick={() => {
                    Modal.destroyAll()
                  }}
                />
              </div>
            ),
          })
        }
      } finally {
        setLoading(false)
      }
    }
  }

  const handleClearData = () => {
    setTicketId(undefined)
    setDetail(undefined)
  }

  const isDesktopSize = useMemo(() => {
    return matches[1]
  }, [matches])

  const handleSetStopSteam = (stop: boolean) => {
    setStopStream(stop)
  }

  useEffect(() => {
    if (isDesktopSize) setMenuName('Ticket scanner')
    else setMenuName('')
  }, [isDesktopSize])

  useEffect(() => {
    if (ticketId && !detail) fetchTicketDetail(ticketId)
  }, [ticketId, detail])

  return (
    <>
      <ProcessingLoading loading={loading} />
      <div style={containerStyles(matches)}>
        {detail ? (
          <TicketDetail
            detail={detail}
            mode={scannerMode}
            onCancel={handleClearData}
            onCheckInTicket={handleCheckInTicket}
            onResetTicket={handleResetTicket}
          />
        ) : (
          <Scanner
            mode={scannerMode}
            isDesktopSize={isDesktopSize}
            onModeChange={handleChangeMode}
            onScan={handleScan}
            setStopStream={handleSetStopSteam}
            stopStream={stopStream}
          />
        )}
      </div>
    </>
  )
}
