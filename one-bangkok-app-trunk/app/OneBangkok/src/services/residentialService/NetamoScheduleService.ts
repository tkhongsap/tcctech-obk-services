import { hookstate, useHookstate } from '@hookstate/core';

export type Time = {
  hour: number;
  minute: number;
};
export type WeekSchedule = {
  getUpAt: Time;
  goToBedAt: Time;
};
export type WeekDays = {
  isHomeDuringTheDay: boolean | null;
  leaveHomeAt: Time;
  comeBackHomeAt: Time;
};
export type WeekendSchedule = {
  getUpAt: Time;
  goToBedAt: Time;
};
export type ScheduleSaturday = {
  isHomeOnSaturday: boolean | null;
  leaveHomeAt: Time;
  comeBackHomeAt: Time;
};
export type ScheduleSunday = {
  isHomeOnSunday: boolean | null;
  leaveHomeAt: Time;
  comeBackHomeAt: Time;
};

export type timeSchedule = {
  isHome: boolean;
  startTime: string;
  endTime: string;
  days: string;
};
export type CreateScheduleModelStep = {
  name: string;
  weekSchedule: WeekSchedule;
  weekDays: WeekDays;
  weekendSchedule: WeekendSchedule;
  scheduleSaturday: ScheduleSaturday;
  scheduleSunday: ScheduleSunday;
  temperature: number;
};

export const defaultCoolingCreationStepState: CreateScheduleModelStep = {
  name: '',
  weekSchedule: {
    getUpAt: {
      hour: 7,
      minute: 0,
    },
    goToBedAt: {
      hour: 22,
      minute: 0,
    },
  },
  weekDays: {
    isHomeDuringTheDay: null,
    leaveHomeAt: {
      hour: 8,
      minute: 0,
    },
    comeBackHomeAt: {
      hour: 19,
      minute: 0,
    },
  },
  weekendSchedule: {
    getUpAt: {
      hour: 7,
      minute: 0,
    },
    goToBedAt: {
      hour: 22,
      minute: 0,
    },
  },
  scheduleSaturday: {
    isHomeOnSaturday: null,
    leaveHomeAt: {
      hour: 10,
      minute: 0,
    },
    comeBackHomeAt: {
      hour: 17,
      minute: 0,
    },
  },
  scheduleSunday: {
    isHomeOnSunday: null,
    leaveHomeAt: {
      hour: 10,
      minute: 0,
    },
    comeBackHomeAt: {
      hour: 17,
      minute: 0,
    },
  },
  temperature: 24,
};

const coolingCreationState = hookstate<CreateScheduleModelStep>({ ...defaultCoolingCreationStepState })
export const useCoolingCreationState = () => useHookstate(coolingCreationState)
