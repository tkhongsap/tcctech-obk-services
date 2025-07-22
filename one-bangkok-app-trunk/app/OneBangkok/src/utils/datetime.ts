import dayjs, {Dayjs} from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import weekday from 'dayjs/plugin/weekday';
import utc from 'dayjs/plugin/utc';
import t from './text';
import 'dayjs/locale/th';
import appLanguageActions from '~/states/appLanguage/appLanguageActions';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekday);

const DEFAULT_TIMEZONE = 'Asia/Bangkok';
const DEFAULT_FORMAT = 'DD MMMM YYYY';
/**
 * DateTime class implementation for replacing the direct dayjs utilization
 * @default default timezone is always 'Asia/Bangkok'
 * @default default format is always 'DD MMMM yyyy' (Ex. 09 March 2023)
 */
export default class DateTime {
  /**
   *  @param timezone - if doesn't pass timezone, default timezone will be used'
   * @returns return current date type Dayjs
   */
  static getCurrentDateTime(): Dayjs {
    const currentTime = dayjs();

    return currentTime;
  }

  /**
   *  @param date - dayjs object in any tz that wants to keep the same year, month, day
   * @returns return new dayjs obj for same year, month, date but in UTC tz
   */
  static convertToUTC(date: Dayjs): Dayjs {
    return dayjs(Date.UTC(date.year(), date.month(), date.date()));
  }

  /**
   * @param value - date as string to format
   * @param format - does not take timezone
   * @returns return date in DEFAULT_FORMAT
   */
  static formatDateNoTimeZone(
    value: string | number | Date,
    format: string = DEFAULT_FORMAT,
  ): string {
    return dayjs(value).format(format);
  }

  /**
   * @param value - date as string to format
   * @param format - if doesn't pass timezone, default timezone will be used'
   * @param format - if doesn't pass timezone, default timezone will be used'
   * @returns return formatted date string from a format input param
   */
  static formatDate(
    value: string | number | Date,
    format: string = DEFAULT_FORMAT,
    locale: string = 'en',
    timezone: string = DEFAULT_TIMEZONE,
  ): string {
    return dayjs.tz(value, timezone).locale(locale).format(format);
  }

  /**
   * get date different in specific unit
   * @param start - end date
   * @param end - end date
   * @param unit - default unit = 'milliseconds'
   * @returns return different value of date (end - start)
   */
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

  /**
   * @param value - datetime to be added
   * @param amount - amount of unit to add on value (datetime)
   * @param unit - unit of addition, default = 'milliseconds'
   * @param timezone - if doesn't pass timezone, default timezone will be used'
   * @returns return result of addition Dayjs datetime
   */
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
    timezone: string = DEFAULT_TIMEZONE,
  ): Dayjs {
    return dayjs.tz(value, timezone).add(amount, unit);
  }

  /**
   * @param value - datetime to be subtracted
   * @param amount - amount of unit to add on value (datetime)
   * @param unit - unit of subtraction, default = 'milliseconds'
   * @param timezone - if doesn't pass timezone, default timezone will be used'
   * @returns result of subtraction Dayjs datetime
   */
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
    timezone: string = DEFAULT_TIMEZONE,
  ): Dayjs {
    return dayjs.tz(value, timezone).subtract(amount, unit);
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
    return dayjs(date).isSame(dayjs(dateToCompare), 'day');
  }

  static getDiffDateTimeText(date: string | number | Date) {
    const current = DateTime.getCurrentDateTime();

    let diff = DateTime.getDateDiff(date, current.toDate(), 'seconds');
    if (diff <= 60) {
      return t('General__Just_now', 'Just now');
    }
    diff = DateTime.getDateDiff(date, current.toDate(), 'minutes');
    if (diff <= 60) {
      return t('General__mins_ago', '{{min}} mins ago', {min: diff});
    }
    diff = DateTime.getDateDiff(date, current.toDate(), 'hours');
    if (diff <= 24) {
      return t('General__hours_ago', '{{hour}} hours ago', {hour: diff});
    }
    diff = DateTime.getDateDiff(date, current.toDate(), 'days');
    if (diff <= 365) {
      const locale = appLanguageActions.getLanguage() || 'en';
      const timeFormat = locale === 'en' ? 'HH:mm A' : 'HH:mm';
      return t('General__date_time', '{{date}} at {{time}}', {
        date: DateTime.formatDate(date, 'DD MMMM', locale),
        time: DateTime.formatDate(date, timeFormat, locale),
      });
    } else {
      return `${DateTime.formatDate(date, 'MMMM DD, YYYY')}`;
    }
  }

  static formatSeconds(seconds: number) {
    // Create a duration from the seconds
    const time = dayjs.duration(seconds, 'seconds');

    // Format the duration as "mm:ss"
    return time.format('mm:ss');
  }

  static getDayInWeekByweekDayName(day: dayjs.WeekdayNames[number]): number {
    return dayjs.weekdays().indexOf(day);
  }

  static getMonthInYearBymonthName(month: dayjs.MonthNames[number]): number {
    return dayjs.months().indexOf(month);
  }

  static getWeekday(day: number) {
    return dayjs().weekday(day);
  }

  static isSameWithType(
    date: string | number | Date,
    dateToCompare: string | number | Date,
    typeCompare: dayjs.OpUnitType | undefined,
  ): boolean {
    return dayjs(date).isSame(dayjs(dateToCompare), typeCompare);
  }

  static formatDateRange(startDate: string, endDate: string) {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (start.isSame(end, 'day')) {
      return start.format('D MMM YYYY');
    } else if (start.isSame(end, 'year')) {
      return `${start.format('D MMM')} - ${end.format('D MMM YYYY')}`;
    } else {
      return `${start.format('D MMM YYYY')} - ${end.format('D MMM YYYY')}`;
    }
  }
}
