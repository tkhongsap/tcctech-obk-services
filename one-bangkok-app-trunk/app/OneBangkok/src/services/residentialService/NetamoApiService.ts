import {reduce} from 'lodash';
import netatmoService from './NetatmoService';
type DayTimeOffset = {
  day: string;
  hour: number;
  minute: number;
};

const minutesInDay = 60 * 24;
const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const dayMapping: any = {
  Sun: 'Sunday',
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
};
const dayNumberMapping: any = {
  1: 'Sunday',
  2: 'Monday',
  3: 'Tuesday',
  4: 'Wednesday',
  5: 'Thursday',
  6: 'Friday',
  7: 'Saturday',
};

const getDayOffsetSequence = (day: string) => {
  return days.findIndex(e => e.toLowerCase() === day.toLowerCase());
};

const hourToMinutes = (hour: number) => hour * 60;

const minutesToHoursAndMinutes = (offset: number) => {
  let hours = Math.floor(offset / 60);
  let minutes = offset % 60;
  return {hours, minutes};
};
const netamoApiService = {
  dayTimeToOffset: ({day, hour, minute}: DayTimeOffset): number => {
    const dayOffsetSequence = getDayOffsetSequence(day);
    console.log('day', dayOffsetSequence);
    return dayOffsetSequence * minutesInDay + hourToMinutes(hour) + minute;
  },
  findDayByOffset: (offset: number) => {
    const {hours, minutes} = minutesToHoursAndMinutes(offset);
    const day = days[Math.floor(hours / 24)];
    return {hours, day, minutes};
  },
  mapTimeTableWithZone: (timetable: any, zones: any) => {
    let timeFormat = timetable.map(({m_offset, zone_id}: any) => {
      let offsetTime = netamoApiService.findDayByOffset(m_offset);
      return {zone_id, ...offsetTime};
    });
    let timeTableWithZone = timeFormat.map((time: any) => {
      let zone = zones.filter((zone: any) => {
        return time.zone_id == zone.id;
      });
      return {...time, zone};
    });
    return timeTableWithZone;
  },
  groupTimeTable: (timetable: any) => {
    let groupByDay = timetable.reduce((table: any, obj: any) => {
      const key = obj.day;
      if (!table[key]) {
        table[key] = [];
      }
      table[key].push(obj);
      return table;
    }, {});
    return groupByDay;
  },
  getFullDayName: (shortDay: string) => {
    return dayMapping[shortDay];
  },
  getFullDayNameByNumber: (num: number) => {
    return dayNumberMapping[num];
  },
  formatTime(hour: any, minute: any) {
    const formattedHour = String(hour).padStart(2, '0');
    const formattedMinute = String(minute).padStart(2, '0');

    return `${formattedHour}:${formattedMinute}`;
  },
  validateTime: async (getUpAt: any, goToBedAt: any) => {
    let formatStart = netamoApiService.formatTime(getUpAt.hour, getUpAt.minute);
    let formatEnd = netamoApiService.formatTime(
      goToBedAt.hour,
      goToBedAt.minute,
    );
    let template = [
      {
        startTime: formatStart,
        endTime: formatEnd,
      },
    ];
    let result = await netatmoService.validateCrateSchedule(template);
    return {result, getUpAt: formatStart, goToBedAt: formatEnd};
  },
  replaceTimetable: (timeTable: any, day: any) => {
    const index = timeTable.findIndex((time: any) => time.days === day);
    if (index !== -1) {
      timeTable[index].set(timeTable);
    }
    return timeTable;
  },
};

export default netamoApiService;
