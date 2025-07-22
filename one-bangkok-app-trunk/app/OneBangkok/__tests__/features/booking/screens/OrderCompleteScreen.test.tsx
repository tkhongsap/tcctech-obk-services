import { SpiedClass } from 'jest-mock';
import { SpiedFunction } from 'jest-mock';
import { jest } from '@jest/globals';
import React from 'react';
import OrderCompleteScreen from '~/features/booking/screens/OrderCompleteScreen';
import { NavigationContainer } from '@react-navigation/native';
import { render, screen } from '@testing-library/react-native';

jest.mock('../../../../src/components/atoms', () => {
  const actualAtoms = jest.requireActual('../../../../src/components/atoms');
  return Object.assign({}, actualAtoms, {
    Icon: jest.fn(() => null),
  });
});

jest.mock('../../../../src/features/booking/components/BookingNextButton', () => ({
  __esModule: true,
  default: () => null,
}));

describe('OrderCompleteScreen', () => {
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
          name: 'OrderCompleteScreen' as const,
          params: { orderId: '123', bookingId: '123' }, 
          
        };
       
    
        render(
            <NavigationContainer>
                <OrderCompleteScreen navigation={mockNavigation as any} route={mockRoute} />
            </NavigationContainer>
        );
    
      });
});
