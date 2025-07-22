import { render, screen, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { jest } from '@jest/globals';
import { SpiedFunction } from 'jest-mock';
import { SpiedClass } from 'jest-mock';
import React from 'react';
import BookingStep1Screen from '~/features/booking/screens/BookingStep1Screen';
import { bookingSettingState } from '~/features/booking/state/booking-setting';
import { bookingSlotDateState } from '~/features/booking/state/booking-slot-date';
import { useWatch } from 'react-hook-form';

jest.mock('../../../../src/components/atoms', () => {
    const actualAtoms = jest.requireActual('../../../../src/components/atoms');
    return Object.assign({}, actualAtoms, {
      Icon: jest.fn(() => null),
    });
  });

jest.mock('react-native-gesture-handler', () => ({
  ScrollView: require('react-native/Libraries/Components/ScrollView/ScrollView'),
}));

describe('BookingStep1Screen', () => {
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
    const mockNavigation = {
        navigate: jest.fn(),
        dispatch: jest.fn(),
        reset: jest.fn(),
        goBack: jest.fn(),
        isFocused: jest.fn(),
        canGoBack: jest.fn(),
        getParent: jest.fn(),
        getId: jest.fn(),
        getState: jest.fn(),
        setParams: jest.fn(),
        setOptions: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        replace: jest.fn(),
        push: jest.fn(),
        pop: jest.fn(),
        popToTop: jest.fn(),
      };
        const mockRoute = {
            key: 'testKey',
            name: 'BookingStep1Screen' as const,
            params: { programId: '123' }, 
        
      };

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

    jest.spyOn(require('react-hook-form'), 'useWatch').mockReturnValue('123');

    jest.spyOn(require('react-hook-form'), 'useWatch').mockReturnValue('123');

    jest.spyOn(require('react-hook-form'), 'useWatch').mockReturnValue(1);

    // const dateValue = useWatch({
    //     control: form.control,
    //     name: 'bookingSlotDateId',
    //   });
    //   const timeValue = useWatch({
    //     control: form.control,
    //     name: 'bookingSlotTimeId',
    //   });
    //   const numberOfTicketValue = useWatch({
    //     control: form.control,
    //     name: 'numberOfTicket',
    //   });

    render(
      <NavigationContainer>
        <BookingStep1Screen navigation={mockNavigation as any} route={mockRoute} />
      </NavigationContainer>
    );

    expect(screen.getByText('Get tickets')).toBeTruthy();
  });

}); 