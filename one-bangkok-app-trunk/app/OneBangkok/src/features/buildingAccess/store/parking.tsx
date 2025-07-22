import {hookstate, useHookstate} from '@hookstate/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ParkingSpaceDetailAndSpaceDetailData,
  WrappedResponseParkingLotsIndexResponseData,
} from 'ob-bms-sdk/dist/api';
import {memberAction, memberState} from './member';
import firebaseConfigState from '~/states/firebase';
import * as OB_BMS_SDK from 'ob-bms-sdk';

export interface ParkingResponse
  extends WrappedResponseParkingLotsIndexResponseData {}

interface Parking {
  parkingLot: ParkingResponse[];
  parkingTicket?: ParkingSpaceDetailAndSpaceDetailData;
}

const DEFAULT_STATE = {
  parkingLot: [],
  parkingTicket: undefined,
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
  getParkingTicket: async () => {
    const parkingTicket = parkingState.parkingTicket.get();
    if (!parkingTicket) {
      await parkingAction.fetchParkingTicket();
    }
    return parkingState.parkingTicket.get();
  },
  fetchParkingTicket: async (): Promise<ParkingSpaceDetailAndSpaceDetailData> => {
    const enable_shopper = firebaseConfigState.enable_shopper.value;

    let res;

    if (enable_shopper) {
      res = await OB_BMS_SDK.client.parkingTicketsV2AllDetails();
    } else {
      res = await OB_BMS_SDK.client.parkingTicketsAllDetails(
        memberState.id.value,
      );
    }

    if (res?.data?.data) {
      parkingState.parkingTicket.set(
        res?.data?.data as ParkingSpaceDetailAndSpaceDetailData,
      );
    }
    return res?.data?.data as ParkingSpaceDetailAndSpaceDetailData
  },
  clear: () => {
    parkingState.set(DEFAULT_STATE)
  }
};

export {parkingState, parkingAction, useParkingState};
