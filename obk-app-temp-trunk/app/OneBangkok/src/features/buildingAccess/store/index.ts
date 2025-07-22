import {hookstate, useHookstate} from '@hookstate/core';
import * as OB_BMS_SDK from 'ob-bms-sdk';
import authenState from '~/states/authen/authenState';
import {memberState} from './member';
import Config from 'react-native-config';
import dayjs from 'dayjs';

OB_BMS_SDK.setBaseUrl(Config.OB_BMS_URL!);
//TODO: change when BE is implemented
enum repetitionType {
  EVERYDAY = 'EVERYDAY',
  WEEKDAY = 'WEEKDAY',
  DAY_IN_MONTH = 'DAY_IN_MONTH',
}
interface repetitionValue {
  type: repetitionType;
  value?: number;
}
interface CreateVisitorPass {
  name: string;
  companyName: string;
  reference: string;
  email: string;
  towerId: string;
  floorId: string;
  repetition?: repetitionValue;
  date: string;
  from: string;
  to?: string;
  until?: string;
  dateUntil?: string;
  enableSpecificTime: boolean;
}

const DEFAULT_STATE = {
  name: '',
  companyName: '',
  reference: '',
  email: '',
  towerId: '',
  floorId: '',
  repetition: undefined,
  date: '',
  from: '',
  to: undefined,
  until: undefined,
  dateUntil: undefined,
  enableSpecificTime: false,
};

const createVisitorPassState = hookstate<CreateVisitorPass>({...DEFAULT_STATE});

const useCreateVisitorPassState = () => useHookstate(createVisitorPassState);

const createVisitorPassAction = {
  reset: () => {
    createVisitorPassState.set({...DEFAULT_STATE});
  },
  setName: (name: string) => {
    createVisitorPassState.name.set(name);
  },
  set: (value: object) => {
    createVisitorPassState.set(prevState => ({...prevState, ...value}));
  },
  setCompanyName: (companyName: string) => {
    createVisitorPassState.companyName.set(companyName);
  },
  setReference: (reference: string) => {
    createVisitorPassState.reference.set(reference);
  },
  setEmail: (email: string) => {
    createVisitorPassState.email.set(email);
  },
  setTowerId: (towerId: string) => {
    createVisitorPassState.towerId.set(towerId);
  },
  setFloorId: (floorId: string) => {
    createVisitorPassState.floorId.set(floorId);
  },
  setDate: (date: string) => {
    createVisitorPassState.date.set(date);
  },
  setDateUntil: (date: string) => {
    createVisitorPassState.dateUntil.set(date);
  },
  setFrom: (from: string) => {
    createVisitorPassState.from.set(from);
  },
  setTo: (to: string) => {
    createVisitorPassState.to.set(to);
  },
  setUntil: (to: string) => {
    createVisitorPassState.until.set(to);
  },
  setEnableSpecificTime: (enableSpecificTime: boolean) => {
    createVisitorPassState.enableSpecificTime.set(enableSpecificTime);
  },
  setRepetition: (type: repetitionType, value?: number) => {
    createVisitorPassState.repetition.set({
      type,
      value,
    });
  },
  setRepetitionDefault: () => {
    createVisitorPassState.dateUntil.set(undefined);
    createVisitorPassState.repetition.set(undefined);
  },
  createPass: async () => {
    try {
      OB_BMS_SDK.setAcessToken(`${authenState.token.value}` ?? '');
      const untilDate =
        dayjs(createVisitorPassState.until.value) ??
        dayjs(createVisitorPassState.from.value).add(90, 'day').toISOString();

      const body = {
        name: createVisitorPassState.name.value,
        email: createVisitorPassState.email.value,
        company_name: createVisitorPassState.companyName.value,
        reference: createVisitorPassState.reference.value,
        inviter_id: memberState.id.value,
        visitor_schedule: {
          from: dayjs(createVisitorPassState.from.value),
          to: dayjs(createVisitorPassState.to.value),
          tower_id: createVisitorPassState.towerId.value,
          floor_id: createVisitorPassState.floorId.value,
          repetition: createVisitorPassState.repetition.value && {
            ...createVisitorPassState.repetition.value,
            until: untilDate,
          },
        },
        profile_image_url: null,
      };
      return await OB_BMS_SDK.client.visitorsCreate(body);
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  },
};

export {
  createVisitorPassState,
  createVisitorPassAction,
  useCreateVisitorPassState,
};
