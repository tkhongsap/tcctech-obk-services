import {hookstate, useHookstate} from '@hookstate/core';

interface CreateAirConditionerRequest {
  towerId: string;
  floorId: string;
  acZoneId: string[];
  dateTimeStart: string;
  date: string;
  duration: string;
  submitted?: boolean;
}

const DEFAULT_STATE = {
  towerId: '',
  floorId: '',
  acZoneId: [],
  date: '',
  duration: '',
  dateTimeStart: '',
  submitted: false,
};

const createAirConditionerRequestState = hookstate<CreateAirConditionerRequest>(
  {
    ...DEFAULT_STATE,
  },
);

const useCreateAirConditionerRequestState = () =>
  useHookstate(createAirConditionerRequestState);

const createAirConditionerRequestAction = {
  reset: () => {
    createAirConditionerRequestState.set({...DEFAULT_STATE});
  },
  setValueACFirstPage: (
    towerId: string,
    floorId: string,
    acZoneId: string[],
  ) => {
    createAirConditionerRequestState.set(p => {
      p.towerId = towerId;
      p.floorId = floorId;
      p.acZoneId = acZoneId;
      return p;
    });
  },
  setValueACSecondPage: (
    dateTimeStart: string,
    duration: string,
    date: string,
  ) => {
    createAirConditionerRequestState.set(p => {
      p.date = date;
      p.duration = duration;
      p.dateTimeStart = dateTimeStart;
      return p;
    });
  },
  setSubmitted: (value: boolean) => {
    createAirConditionerRequestState.submitted.set(value);
  },
};

export {
  createAirConditionerRequestState,
  createAirConditionerRequestAction,
  useCreateAirConditionerRequestState,
};
