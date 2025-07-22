import { BookingHistoryTableDataTestId } from '@components/art-and-culture/booking-history/components/BookingHistoryTable'
import { FilterBookingHistoryDataTestId } from '@components/art-and-culture/booking-history/components/FilterBookingHistory'
import { ViewBookingHistoryButtonDataTestId } from '@components/art-and-culture/booking-history/components/ViewBookingHistoryButton'
import { BookingStatusFilterDataTestId } from '@components/art-and-culture/booking-status/components/BookingStatusFilter'
import { NO_BOOKING_SETTING_PROGRAM_ID } from '@mocks/service-art-c-booking-setting'
import { NO_PROGRAM_ID } from '@mocks/service-art-c-program'
import CreateBookingSettingPage from '@pages/art-and-culture/booking/create-setting'
import EditBookingSettingPage from '@pages/art-and-culture/booking/edit-setting'
import BookingStatusPage, {
  getServerSideProps as BookingStatusPageServerSideRenderProps,
} from '@pages/art-and-culture/booking/manage-status'
import ShowBookingHistoryPage from '@pages/art-and-culture/booking/show-booking-history'
import TicketScannerPage from '@pages/art-and-culture/booking/ticket-scanner'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import TestAppWrapper from '@tests/TestAppWrapper'
import { useRouter } from 'next/router'
import { describe, expect, it, vi } from 'vitest'

vi.mock('next/router', () => ({
  useRouter: vi.fn(),
}))

describe('Module BookingSetting', () => {
  it('render the EditBookingSetting page', async () => {
    const mockRouter = {
      query: { id: '24' },
      push: vi.fn(),
      pathname: '/art-and-culture/booking/edit-setting?programId=24',
      asPath: '/art-and-culture/booking/edit-setting?programId=24',
    }
    const mockedUseRouter = useRouter as unknown as ReturnType<typeof vi.fn>
    mockedUseRouter.mockReturnValue(mockRouter)

    const { getByTestId } = render(
      <TestAppWrapper>
        <EditBookingSettingPage programId='24' />
      </TestAppWrapper>
    )

    await waitFor(() => {
      const cardDetailForm = getByTestId('card-detail-form')
      const cardShowtimeSection = getByTestId('card-showtime-section')

      expect(cardDetailForm).toBeTruthy()
      expect(cardShowtimeSection).toBeTruthy()
    })
  })

  it('render the EditBookingSetting page with no setting', async () => {
    const push = vi.fn()
    const mockRouter = {
      query: { id: NO_BOOKING_SETTING_PROGRAM_ID },
      push,
      pathname: `/art-and-culture/booking/edit-setting?programId=${NO_BOOKING_SETTING_PROGRAM_ID}`,
      asPath: `/art-and-culture/booking/edit-setting?programId=${NO_BOOKING_SETTING_PROGRAM_ID}`,
    }
    const mockedUseRouter = useRouter as unknown as ReturnType<typeof vi.fn>
    mockedUseRouter.mockReturnValue(mockRouter)

    render(
      <TestAppWrapper>
        <EditBookingSettingPage programId={NO_BOOKING_SETTING_PROGRAM_ID} />
      </TestAppWrapper>
    )

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/art-and-culture/programs')
    })
  })

  it('render the EditBookingSetting page with no program', async () => {
    const push = vi.fn()
    const mockRouter = {
      query: { id: NO_PROGRAM_ID },
      push,
      pathname: `/art-and-culture/booking/edit-setting?programId=${NO_PROGRAM_ID}`,
      asPath: `/art-and-culture/booking/edit-setting?programId=${NO_PROGRAM_ID}`,
    }
    const mockedUseRouter = useRouter as unknown as ReturnType<typeof vi.fn>
    mockedUseRouter.mockReturnValue(mockRouter)

    render(
      <TestAppWrapper>
        <EditBookingSettingPage programId={NO_PROGRAM_ID} />
      </TestAppWrapper>
    )

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/art-and-culture/programs')
    })
  })

  it('render the CreateBookingSetting page with setting', async () => {
    const id = '24'
    const push = vi.fn()
    const mockRouter = {
      query: { id },
      push,
      pathname: `/art-and-culture/booking/create-setting?programId=${id}`,
      asPath: `/art-and-culture/booking/create-setting?programId=${id}`,
    }
    const mockedUseRouter = useRouter as unknown as ReturnType<typeof vi.fn>
    mockedUseRouter.mockReturnValue(mockRouter)

    render(
      <TestAppWrapper>
        <CreateBookingSettingPage programId={id} />
      </TestAppWrapper>
    )

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith(`/art-and-culture/programs/edit/${id}`)
    })
  })

  it('render the CreateBookingSetting page with no program', async () => {
    const push = vi.fn()
    const mockRouter = {
      query: { id: NO_PROGRAM_ID },
      push,
      pathname: `/art-and-culture/booking/create-setting?programId=${NO_PROGRAM_ID}`,
      asPath: `/art-and-culture/booking/create-setting?programId=${NO_PROGRAM_ID}`,
    }
    const mockedUseRouter = useRouter as unknown as ReturnType<typeof vi.fn>
    mockedUseRouter.mockReturnValue(mockRouter)

    render(
      <TestAppWrapper>
        <CreateBookingSettingPage programId={NO_PROGRAM_ID} />
      </TestAppWrapper>
    )

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/art-and-culture/programs')
    })
  })

  it('render the BookingHistory page', async () => {
    const push = vi.fn()
    const params = {
      programId: '34',
      bookingSlotTimeId: 'b06105b9-0b42-4da6-be77-886a167b300d',
    }
    const mockRouter = {
      query: {
        ...params,
      },
      push,
      pathname: `/art-and-culture/booking/show-booking-history?programId=${params.programId}&bookingSlotTimeId=${params.bookingSlotTimeId}`,
      asPath: `/art-and-culture/booking/show-booking-history?programId=${params.programId}&bookingSlotTimeId=${params.bookingSlotTimeId}`,
    }
    const mockedUseRouter = useRouter as unknown as ReturnType<typeof vi.fn>
    mockedUseRouter.mockReturnValue(mockRouter)

    render(
      <TestAppWrapper>
        <ShowBookingHistoryPage {...params} />
      </TestAppWrapper>
    )

    const bookerNameField = await screen.findByTestId(
      FilterBookingHistoryDataTestId.bookerName
    )
    await fireEvent.change(bookerNameField, { target: { value: 'Uat' } })

    const ViewBookingHistoryButton = await screen.findByTestId(
      `${BookingHistoryTableDataTestId.ViewBookingHistoryButton}_7c2bb488-2599-415a-bfb7-de119f9e6d2c`
    )
    await fireEvent.click(ViewBookingHistoryButton)

    const CloseModalButton = await screen.findByTestId(
      ViewBookingHistoryButtonDataTestId.CloseButton
    )
    await fireEvent.click(CloseModalButton)
  })

  it('render the BookingStatus page', async () => {
    const push = vi.fn()
    const params = {
      page: '1',
      limit: '10',
    }
    const mockRouter = {
      query: {
        ...params,
      },
      push,
      pathname: `/art-and-culture/booking/manage-status?page=${params.page}&limit=${params.limit}`,
      asPath: `/art-and-culture/booking/manage-status?page=${params.page}&limit=${params.limit}`,
    }
    const mockedUseRouter = useRouter as unknown as ReturnType<typeof vi.fn>
    mockedUseRouter.mockReturnValue(mockRouter)

    const { getByTestId } = render(
      <TestAppWrapper>
        <BookingStatusPage />
      </TestAppWrapper>
    )

    await waitFor(async () => {
      expect(BookingStatusPage.activePrime).toBe(true)
      const ctx = { props: {} }
      const result = await BookingStatusPageServerSideRenderProps(ctx as any)
      expect(result.props)
      // expect(push).toHaveBeenCalledWith(`/art-and-culture/booking/manage-status?page=1&limit=10`)
      const filterTitle = getByTestId(BookingStatusFilterDataTestId.title)
      expect(filterTitle).toBeTruthy()
    })
  })

  it('render the TicketScanner page', async () => {
    // const push = vi.fn()
    // const mockRouter = {
    //   query: {},
    //   push,
    //   pathname: `/art-and-culture/booking/ticket-scanner`,
    //   asPath: `/art-and-culture/booking/ticket-scanner`,
    // }
    // const mockedUseRouter = useRouter as unknown as ReturnType<typeof vi.fn>
    // mockedUseRouter.mockReturnValue(mockRouter)

    render(
      <TestAppWrapper>
        <TicketScannerPage />
      </TestAppWrapper>
    )

    // await waitFor(() => {
    //   expect(push).toHaveBeenCalledWith(
    //     `/art-and-culture/booking/ticket-scanner`
    //   )
    // })
  })
})
