import dayjs, { Dayjs } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
export class DateTimeUtils {
  static readonly weekDayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ] as const;

  static readonly monthInYearNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ] as const;

  static getCurrentDateTime(timezone?: string): Dayjs {
    if (timezone) {
      return dayjs().tz(timezone);
    } else {
      return dayjs();
    }
  }

  static formatDate(
    value: string | number | Date,
    format = 'YYYY-MM-DD HH:mm:ss',
    timezone?: string,
  ): string {
    if (timezone) {
      return dayjs(value).tz(timezone).format(format);
    } else {
      return dayjs(value).format(format);
    }
  }

  static getDateDiff(
    start: string | number | Date,
    end: string | number | Date,
    unit:
      | 'milliseconds'
      | 'seconds'
      | 'minutes'
      | 'hours'
      | 'days'
      | 'weeks'
      | 'months'
      | 'years' = 'milliseconds',
  ): number {
    return dayjs(end).diff(dayjs(start), unit);
  }

  static addTime(
    value: string | number | Date,
    amount: number,
    unit:
      | 'milliseconds'
      | 'seconds'
      | 'minutes'
      | 'hours'
      | 'days'
      | 'weeks'
      | 'months'
      | 'years' = 'milliseconds',
    timezone?: string,
  ): Dayjs {
    if (timezone) {
      return dayjs(value).tz(timezone).add(amount, unit);
    } else {
      return dayjs(value).add(amount, unit);
    }
  }

  static subtractTime(
    value: string | number | Date,
    amount: number,
    unit:
      | 'milliseconds'
      | 'seconds'
      | 'minutes'
      | 'hours'
      | 'days'
      | 'weeks'
      | 'months'
      | 'years' = 'milliseconds',
    timezone?: string,
  ): Dayjs {
    if (timezone) {
      return dayjs(value).tz(timezone).subtract(amount, unit);
    } else {
      return dayjs(value).subtract(amount, unit);
    }
  }

  static isBefore(
    date: string | number | Date,
    dateToCompare: string | number | Date,
  ): boolean {
    return dayjs(date).isBefore(dayjs(dateToCompare));
  }

  static isAfter(
    date: string | number | Date,
    dateToCompare: string | number | Date,
  ): boolean {
    return dayjs(date).isAfter(dayjs(dateToCompare));
  }

  static isSame(
    date: string | number | Date,
    dateToCompare: string | number | Date,
  ): boolean {
    return dayjs(date).isSame(dayjs(dateToCompare));
  }

  static getDayInWeekByweekDayName(
    day: (typeof DateTimeUtils.weekDayNames)[number],
  ): number {
    return DateTimeUtils.weekDayNames.indexOf(day);
  }

  static getMonthInYearBymonthName(
    month: (typeof DateTimeUtils.monthInYearNames)[number],
  ): number {
    return DateTimeUtils.monthInYearNames.indexOf(month);
  }
}
