import {hookstate, useHookstate} from '@hookstate/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {WrappedResponseParkingLotsIndexResponseData} from 'ob-bms-sdk/dist/api';
import {memberAction} from './member';

export interface ParkingResponse
  extends WrappedResponseParkingLotsIndexResponseData {}

interface Parking {
  parkingLot: ParkingResponse[];
}

const DEFAULT_STATE = {
  parkingLot: [],
};

const parkingState = hookstate<Parking>({...DEFAULT_STATE});

const useParkingState = () => useHookstate(parkingState);

const parkingAction = {
  getParkingLots: async () => {
    const data =
      (await memberAction.parkingLots()) as WrappedResponseParkingLotsIndexResponseData[];
    parkingState.parkingLot.set(data);
  },
  setParkingLots: async (
    data: WrappedResponseParkingLotsIndexResponseData[],
  ) => {
    parkingState.parkingLot.set(data);
  },
};

export {parkingState, parkingAction, useParkingState};
