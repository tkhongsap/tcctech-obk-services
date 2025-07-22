import { hookstate, useHookstate } from '@hookstate/core';
import dayjs from 'dayjs';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';


export type RepeatConfigDay = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"
export enum RepetitionType {
  EVERYDAY = 1,
  EVERY_SPECIFIC_DATE = 2,
  EVERY_SPECIFIC_DAY = 3,
}

type RepeatConfig = {
  isRepeat: boolean
  type: RepetitionType | null
  date: number | null
  days: RepeatConfigDay[] | null
  endDate: string | null
}
type CreateVisitorPass = {
  tenantId: string
  companyId: string
  name: string
  idNumber: string | null
  email: string
  buildingId: string
  buildingName: string
  unitId: string
  unitName: string
  floorCode: string
  floorId: string
  floorName: string
  elevatorId: string
  elevatorName: string
  date: string,
  timeConfig: {
    isSpecific: boolean
    start: string
    end: string
  },
  repeatConfig: RepeatConfig
  isEdit: boolean
}

const DEFAULT_STATE = {
  tenantId: '',
  companyId: '',
  name: '',
  idNumber: null,
  email: '',
  buildingId: '',
  buildingName: '',
  unitId: '',
  unitName: '',
  floorCode: '',
  floorId: '',
  floorName: '',
  elevatorId: '',
  elevatorName: '',
  date: '',
  timeConfig: {
    isSpecific: true,
    start: '00:00',
    end: '23:59',
  },
  repeatConfig: {
    isRepeat: false,
    type: null,
    date: new Date().getDate(),
    days: null,
    endDate: null
  },
  isEdit: false,
};

const createVisitorPassState = hookstate<CreateVisitorPass>({ ...DEFAULT_STATE });

const useCreateVisitorPassState = () => useHookstate(createVisitorPassState);

const createVisitorPassAction = {
  reset: () => {
    createVisitorPassState.set({ ...DEFAULT_STATE });
  },
  set: (value: object) => {
    createVisitorPassState.set(prev => ({ ...prev, ...value }));
  },
  createPass: async () => {
    const tenantId = await residentialTenantAction.getTenantId()
    if (!tenantId) return

    const isRepeat = createVisitorPassState.repeatConfig.isRepeat.value
    let repeatConfig: RepeatConfig = {
      isRepeat,
      type: null,
      date: null,
      days: null,
      endDate: null
    }
    if (isRepeat) {
      const repeatType = createVisitorPassState.repeatConfig.type.value ?? RepetitionType.EVERYDAY
      const date = repeatType === RepetitionType.EVERY_SPECIFIC_DATE ? createVisitorPassState.repeatConfig.date.value : null
      const days = repeatType === RepetitionType.EVERY_SPECIFIC_DAY ? createVisitorPassState.repeatConfig.days.value as RepeatConfigDay[] | null : null
      repeatConfig = {
        ...repeatConfig,
        type: repeatType,
        date,
        days,
        endDate: dayjs(createVisitorPassState.repeatConfig.endDate.value).format('YYYY-MM-DD')
      }
    }

    const body = {
      tenantId: tenantId.toString(),
      companyId: createVisitorPassState.companyId.value,
      name: createVisitorPassState.name.value,
      idNumber: createVisitorPassState.idNumber.value,
      email: createVisitorPassState.email.value,
      buildingId: createVisitorPassState.buildingId.value,
      unitId: createVisitorPassState.unitId.value,
      floorId: createVisitorPassState.floorId.value,
      elevatorId: createVisitorPassState.elevatorId.value,
      date: createVisitorPassState.date.value,
      timeConfig: createVisitorPassState.timeConfig.value,
      repeatConfig
    };
    return await serviceMindService.createVisitorPass(body)
  },
};

export {
  createVisitorPassState,
  createVisitorPassAction,
  useCreateVisitorPassState,
};
