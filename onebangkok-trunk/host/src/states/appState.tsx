import dayjs from 'dayjs';
import {isEmpty, isUndefined} from 'lodash';
import React, {useState, useEffect, ComponentType, FC} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {
  parkingAction,
  useParkingState,
} from '~/features/buildingAccess/store/parking';

// Define a type for the props of the WrappedComponent
interface WithAppStateProps {
  appState: AppStateStatus;
}

// Define the HOC with TypeScript
const withAppState = <P extends WithAppStateProps>(
  WrappedComponent: ComponentType<P>,
): FC<Omit<P, keyof WithAppStateProps>> => {
  return (props: Omit<P, keyof WithAppStateProps>) => {
    const {parkingLot} = useParkingState();
    const getParkingLots = () => {
      const parkingLots = parkingLot.value;
      if (!isUndefined(parkingLots) && !isEmpty(parkingLots)) {
        const date1 = dayjs(parkingLots[0].updated_at);
        const date2 = dayjs();

        // Calculate the difference in minutes
        const diffInMinutes = date2.diff(date1, 'minute');
        if (diffInMinutes >= 5) {
          parkingAction.getParkingLots();
        }
      }
    };
    const [appState, setAppState] = useState<AppStateStatus>(
      AppState.currentState,
    );

    useEffect(() => {
      const handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (
          appState.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          getParkingLots();
        }

        setAppState(nextAppState);
      };

      // Add event listener for app state changes
      const subscription = AppState.addEventListener(
        'change',
        handleAppStateChange,
      );

      // Clean up the event listener on component unmount
      return () => {
        subscription.remove();
      };
    }, [appState]);

    return <WrappedComponent {...(props as P)} appState={appState} />;
  };
};

export default withAppState;
