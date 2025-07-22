import {render, screen, fireEvent  } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { jest } from '@jest/globals';
import { SpiedFunction } from 'jest-mock';
import { SpiedClass } from 'jest-mock';
import React from 'react';
import TicketScreen from '~/features/booking/screens/TicketScreen';
import { bookingTransactionAction } from '~/features/booking/state/boking-transaction';
import { Alert, ToastAndroid } from 'react-native';


jest.mock('react-native-gesture-handler', () => ({
    ScrollView: require('react-native/Libraries/Components/ScrollView/ScrollView'),
  }))

  jest.mock('react-native-view-shot', () => ({
    __esModule: true,
    default: function ViewShot(props: any) {
      return props.children;
    }
  }));

describe('TicketScreen', () => {
    let mockNavigate;
    let mockGoBack;
    let useNavigationMock: SpiedClass<any> | SpiedFunction<any>;
  
    beforeEach(() => {
      mockNavigate = jest.fn();
      mockGoBack = jest.fn();
      
      useNavigationMock = jest.spyOn(require('../../../../src/navigations/AppNavigation'), 'useNavigation');
      useNavigationMock.mockReturnValue({
        navigate: mockNavigate,
        goBack: mockGoBack
      });

      jest.spyOn(require('../../../../src/features/booking/components/BookingNextButton'), 'default').mockImplementation(() => null);
      jest.spyOn(bookingTransactionAction, 'fetchBookingDetail').mockResolvedValue();
      

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
      name: 'TicketScreen' as const,
      params: { bookingId: '123' },
    };
    jest.spyOn(require('@hookstate/core'), 'useHookstate')
    .mockReturnValue({ bookingDetail: {
      '123': {
        value: {
            id: '123',
            createdAt: '2023-10-01',
            updatedAt: '2023-10-02',
            userId: 'user_1',
            programId: 'program_1',
            bookingSlotDateId: 'slot_date_1',
            bookingSlotTimeId: 'slot_time_1',
            orderId: 'order_1',
            slotDate: '2023-10-01',
            beginSlotTime: '10:00',
            endSlotTime: '12:00',
            bookerName: 'John Doe',
            bookerEmail: 'john.doe@example.com',
            bookerPhoneNumber: '1234567890',
            ticketsCount: 2,
            showingStatus: 'confirmed',
            price: 100,
            bookingTickets: [
              {
                id: 'ticket_1',
                status: 'checked-in',
                ticketNo: 'TICKET123',
              },
            ],
          }
      },
    } });

    render(
        <NavigationContainer>
            <TicketScreen navigation={mockNavigation as any} route={mockRoute} />
        </NavigationContainer>
    );

    expect(screen.getByText('My tickets')).toBeTruthy();
  });

  

  it('renders correctly2', () => {
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
      name: 'TicketScreen' as const,
      params: { bookingId: '123' },
    };
    jest.spyOn(require('@hookstate/core'), 'useHookstate')
    .mockReturnValue({ bookingDetail: {
      '123': {
        value: {
            id: '123',
            createdAt: '2023-10-01',
            updatedAt: '2023-10-02',
            userId: 'user_1',
            programId: 'program_1',
            bookingSlotDateId: 'slot_date_1',
            bookingSlotTimeId: 'slot_time_1',
            orderId: 'order_1',
            slotDate: '2023-10-01',
            beginSlotTime: '10:00',
            endSlotTime: '12:00',
            bookerName: 'John Doe',
            bookerEmail: 'john.doe@example.com',
            bookerPhoneNumber: '1234567890',
            ticketsCount: 2,
            showingStatus: 'confirmed',
            price: 0,
            bookingTickets: [
              {
                id: 'ticket_1',
                status: 'checked-in',
                ticketNo: 'TICKET123',
              },
            ],
          }
      },
    } });

    render(
        <NavigationContainer>
            <TicketScreen navigation={mockNavigation as any} route={mockRoute} />
        </NavigationContainer>
    );

    expect(screen.getByText('My tickets')).toBeTruthy();
  });

  it('renders correctly3', () => {
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
      name: 'TicketScreen' as const,
      params: { bookingId: '123' },
    };
    jest.spyOn(require('@hookstate/core'), 'useHookstate')
    .mockReturnValue({ bookingDetail: {

    } });

    render(
        <NavigationContainer>
            <TicketScreen navigation={mockNavigation as any} route={mockRoute} />
        </NavigationContainer>
    );

    expect(screen.getByText('My tickets')).toBeTruthy();
  });

  it('should save ticket when permission is granted', async () => {
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
        name: 'TicketScreen' as const,
        params: { bookingId: '123' },
      };
      jest.spyOn(require('@hookstate/core'), 'useHookstate')
      .mockReturnValue({ bookingDetail: {
        '123': {
          value: {
              id: '123',
              createdAt: '2023-10-01',
              updatedAt: '2023-10-02',
              userId: 'user_1',
              programId: 'program_1',
              bookingSlotDateId: 'slot_date_1',
              bookingSlotTimeId: 'slot_time_1',
              orderId: 'order_1',
              slotDate: '2023-10-01',
              beginSlotTime: '10:00',
              endSlotTime: '12:00',
              bookerName: 'John Doe',
              bookerEmail: 'john.doe@example.com',
              bookerPhoneNumber: '1234567890',
              ticketsCount: 2,
              showingStatus: 'confirmed',
              price: 100,
              bookingTickets: [
                {
                  id: 'ticket_1',
                  status: 'checked-in',
                  ticketNo: 'TICKET123',
                },
              ],
            }
        },
      } });
    const { getByText } = render(
        <NavigationContainer>
        <TicketScreen navigation={mockNavigation as any} route={mockRoute} />
    </NavigationContainer>
    );
    
    // Mock permission granted
    jest.spyOn(require('react-native-permissions'), 'request').mockResolvedValue('granted');
    
    // Mock ViewShot capture
    const mockCapture = jest.fn().mockResolvedValue('mock-uri' as never);
    jest.spyOn(require('react-native-view-shot'), 'default').mockImplementation((props: any) => {
      props.ref.current = { capture: mockCapture };
      return props.children;
    });

    // Mock CameraRoll.saveAsset
    const mockSaveAsset = jest.fn().mockResolvedValue(undefined as never);
    jest.mock('@react-native-camera-roll/camera-roll', () => {
        return {
          CameraRoll: {
            saveAsset: () => Promise.resolve()
          }
        };
      });

    jest.spyOn(Alert, 'alert');

    jest.spyOn(ToastAndroid, 'show');

    fireEvent.press(getByText('Save Ticket'));

  });
});