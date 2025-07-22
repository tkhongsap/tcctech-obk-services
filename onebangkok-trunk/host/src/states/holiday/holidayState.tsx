import {hookstate, useHookstate} from '@hookstate/core';
import {HolidayResponse} from 'ob-bms-sdk/dist/api';

export interface Holidays {
  holidays: HolidayResponse[];
}

const DEFAULT_STATE = {
  holidays: [],
};

const holidayState = hookstate<Holidays>({...DEFAULT_STATE});
const useHolidayState = () => useHookstate(holidayState);

const holidayStateAction = {
  reset: () => {
    holidayState.set({...DEFAULT_STATE});
  },
  setHolidays: (holidays: HolidayResponse[]) => {
    holidayState.holidays.set(holidays);
  },
};

export {holidayState, useHolidayState, holidayStateAction};
