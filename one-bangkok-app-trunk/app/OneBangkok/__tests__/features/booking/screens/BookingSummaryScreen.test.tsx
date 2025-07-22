import { render, screen, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { jest } from '@jest/globals';
import { SpiedFunction } from 'jest-mock';
import { SpiedClass } from 'jest-mock';
import React from 'react';
import BookingSummaryScreen from '~/features/booking/screens/BookingSummaryScreen';
import { bookingSlotDateState } from '~/features/booking/state/booking-slot-date';
import { bookingSettingState } from '~/features/booking/state/booking-setting';
import { bookingState } from '~/features/booking/state/booking';

jest.mock('../../../../src/components/atoms', () => {
    const actualAtoms = jest.requireActual('../../../../src/components/atoms');
    return Object.assign({}, actualAtoms, {
      Icon: jest.fn(() => null),
    });
  });

jest.mock('react-native-gesture-handler', () => ({
  ScrollView: require('react-native/Libraries/Components/ScrollView/ScrollView'),
}));

describe('BookingSummaryScreen', () => {
  let mockNavigate;
  let mockGoBack;
  let useNavigationMock: SpiedClass<any> | SpiedFunction<any>;

  beforeEach(() => {
    mockNavigate = jest.fn();
    mockGoBack = jest.fn();

    useNavigationMock = jest.spyOn(require('../../../../src/navigations/AppNavigation'), 'useNavigation');
    useNavigationMock.mockReturnValue({
      navigate: mockNavigate,
      goBack: mockGoBack,
    });

  });

  afterEach(() => {
    useNavigationMock.mockRestore();
  });

  it('renders correctly', () => {

    bookingSlotDateState.set({
        bookingSlotDate: {
            id: '123',
            createdAt: '2023-10-01',
            updatedAt: '2023-10-02',
            programId: 'program_1',
            bookingSettingId: 'booking_setting_1',
            slotDate: '2023-10-01',
            bookingSlotTimes: [
                {
                    id: '123',
                    beginSlotTime: '10:00',
                    endSlotTime: '12:00',
                    maxTicketsPerSlotTime: 10,
                    bookedTicketsCount: 0,
                    status: 'available'
                }
            ]
        }
    })

    bookingSettingState.set({
        bookingSettingDetail: {
            id: 123,
            programId: 'program_1',
            createdAt: '2023-10-01',
            updatedAt: '2023-10-02',
            conditionText: 'conditionText',
            ticketPrice: 100,
            maxTicketsPerTransaction: 10,
            openBookingTime: '10:00',
            closeBookingTime: '12:00',
            program: {
                periodAt: '2023-10-01',
                periodEnd: '2023-10-02',
                artCTitle: 'artCTitle',
                locale: 'locale',
                locations: ['location1', 'location2'],
                title: 'title',
                thumbnail: 'thumbnail',
                banner: 'banner'
            },
            bookingSlotDates: [
                {
                    id: '123',
                    createdAt: '2023-10-01',
                    updatedAt: '2023-10-02',
                    programId: 'program_1',
                    bookingSettingId: 'booking_setting_1',
                    slotDate: '2023-10-01',
                    bookingSlotTimes: [
                        {
                            id: '123',
                            beginSlotTime: '10:00',
                            endSlotTime: '12:00',
                            maxTicketsPerSlotTime: 10,
                            bookedTicketsCount: 0,
                            status: 'available'
                        }
                    ]
                }
            ]
        }
    })

    bookingState.set({
        loading: false,
        loadingCount: 0,
        bookingFormData: {
            programId: 'program_1',
            bookingSlotDateId: 'booking_slot_date_1',
            bookingSlotTimeId: 'booking_slot_time_1',
            numberOfTicket: '1'
        }
    })

    render(
      <NavigationContainer>
        <BookingSummaryScreen />
      </NavigationContainer>
    );

    expect(screen.getByText('Get tickets')).toBeTruthy();
  });

}); 