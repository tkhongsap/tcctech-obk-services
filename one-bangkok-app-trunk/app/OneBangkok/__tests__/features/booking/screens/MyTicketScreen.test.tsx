import {render, screen, fireEvent} from '@testing-library/react-native';
import MyTicketScreen from '../../../../src/features/booking/screens/MyTicketScreen';
import { NavigationContainer } from '@react-navigation/native';
import { jest } from '@jest/globals';
import { SpiedFunction } from 'jest-mock';
import { SpiedClass } from 'jest-mock';

describe('MyTicketScreen', () => {
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
  });

  afterEach(() => {
    useNavigationMock.mockRestore();
  });

  it('renders screen correctly', () => {
    render(
      <NavigationContainer>
        <MyTicketScreen />
      </NavigationContainer>
    );

    expect(screen.getByText('One Bangkok')).toBeTruthy();
    expect(screen.getByText('My Tickets')).toBeTruthy();
    expect(screen.getByText('Upcoming')).toBeTruthy();
    expect(screen.getByText('Past')).toBeTruthy();
  });

  it('can press back button', () => {
    render(
      <NavigationContainer>
        <MyTicketScreen />
      </NavigationContainer>
    );

    const backButton = screen.getByTestId('back-button');
    fireEvent.press(backButton);
  });

  it('displays upcoming program correctly', () => {
    const mockBookings = {
      value: [
        {
          id: '1',
          showingStatus: 'upcoming',
          slotDate: '2024-02-01',
          beginSlotTime: '2024-02-01T10:00:00',
          endSlotTime: '2024-02-01T11:00:00',
          program: {
            title: 'Test Program 1',
            artCTitle: 'ArtC Test Program 1',
            locations: ['Location 1'],
            thumbnail: 'thumbnail1.png',
            periodAt: '2024-02-01',
            periodEnd: '2024-02-02',
          },
        },
        {
          id: '1',
          showingStatus: 'past',
          slotDate: '2024-02-01',
          beginSlotTime: '2024-02-01T10:00:00',
          endSlotTime: '2024-02-01T11:00:00',
          program: {
            title: 'Test Program 1',
            artCTitle: 'ArtC Test Program 1',
            locations: ['Location 1'],
            thumbnail: 'thumbnail1.png',
            periodAt: '2024-02-01',
            periodEnd: '2024-02-02',
          },
        },
      ],
    };

    jest.spyOn(require('@hookstate/core'), 'useHookstate')
      .mockReturnValue({ bookings: mockBookings });

    render(
      <NavigationContainer>
        <MyTicketScreen />
      </NavigationContainer>
    );

    expect(screen.getByText('Test Program 1')).toBeTruthy();
  });
});