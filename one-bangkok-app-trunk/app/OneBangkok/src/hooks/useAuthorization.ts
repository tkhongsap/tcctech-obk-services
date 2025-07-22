import {hookstate, useHookstate} from '@hookstate/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {compact} from 'lodash';
import * as OB_BMS_SDK from 'ob-bms-sdk';
import authenState from '~/states/authen/authenState';
import firebaseConfigState from '~/states/firebase';

export type PermissionAction =
  | 'view'
  | 'create'
  | 'update'
  | 'delete'
  | 'manage';

export enum FEATURE_LIST {
  Workspace = 'Workspace',
  MyParkingTicket = 'MyParkingTicket',
  FindMyCar = 'FindMyCar',
  ValetParking = 'ValetParking',
  ReservedParking = 'ReservedParking',
}

type PermissionList = {
  [key in FEATURE_LIST]?: PermissionAction[];
};

const authorizationState = hookstate<PermissionList>({});

export const useAuthorizationState = () => useHookstate(authorizationState);

const setPermissions = async (grantedPermissions: PermissionList) => {
  authorizationState.set(prev => {
    return {
      ...prev,
      ...grantedPermissions,
    };
  });
  AsyncStorage.setItem('permissions', JSON.stringify(grantedPermissions)).then(
    () => {
      console.log('[useAuthorization] Permissions set');
    },
  );
};

const isWorker = async (): Promise<boolean> => {
  try {
    OB_BMS_SDK.setAcessToken(authenState.token.value || '');
    const result = await OB_BMS_SDK.client.membersIndex();
    const resultData = compact(result.data.data as []);

    return resultData && resultData.length > 0;
  } catch (error) {
    console.log(error);
  }

  return false;
};

export const assignPermissions = async () => {
  let permissions: PermissionList = {};

  if (await isWorker()) {
    permissions = {
      ...permissions,
      Workspace: ['view'],
      MyParkingTicket: ['view'],
      FindMyCar: ['view'],
      ValetParking: ['view'],
    };
    console.log('[useAuthorization] Worker permissions assigned');
  } else {
    const enable_shopper_valet = firebaseConfigState.enable_shopper_valet.value;
    const enable_shopper_find_my_car = firebaseConfigState.enable_shopper_find_my_car.value;
    const enable_shopper_parking_ticket = firebaseConfigState.enable_shopper_parking_ticket.value;

    if (enable_shopper_valet) {
      permissions = {
        ...permissions,
        ValetParking: ['view'],
      };
    }
    if (enable_shopper_find_my_car) {
      permissions = {
        ...permissions,
        FindMyCar: ['view'],
      };
    }
    if (enable_shopper_parking_ticket) {
      permissions = {
        ...permissions,
        MyParkingTicket: ['view'],
      };
    }
  }

  setPermissions(permissions);
};

export const resetPermissions = () => {
  authorizationState.set({});
  AsyncStorage.removeItem('permissions').then(() => {
    console.log('[useAuthorization] Permissions reset');
  });
};

export const restorePermissions = () => {
  AsyncStorage.getItem('permissions').then(permissions => {
    if (permissions) {
      authorizationState.set(JSON.parse(permissions));
    }
  });
};

export const checkPermission = (
  action: PermissionAction,
  feature: keyof typeof FEATURE_LIST,
): boolean => {
  return authorizationState.get()[feature]?.includes(action) ? true : false;
};

export const useAuthorization = () => {
  return {
    checkPermission,
    setPermissions,
    resetPermissions,
    restorePermissions,
  };
};
