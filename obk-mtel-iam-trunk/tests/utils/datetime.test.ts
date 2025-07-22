// import { DateTime } from 'luxon';
import { DateTime } from 'luxon';
import { DateTimeUtils } from '../../src/utils/datetime';

describe('datetime', () => {
  const luxonDateTime = DateTime.now();
  const jsDate = luxonDateTime.toJSDate();

  it('should return current time - getCurrentDateTime', async () => {
    expect(DateTimeUtils.getCurrentDateTime('America/Toronto')).toBeTruthy();
    expect(DateTimeUtils.getCurrentDateTime()).toBeTruthy();
  });
  it('should return format date - formatDate', async () => {
    expect(DateTimeUtils.formatDate(jsDate)).toBeTruthy();
    expect(DateTimeUtils.formatDate(jsDate, 'YYYY-MM-DD HH:mm:ss', 'America/Toronto')).toBeTruthy();
  });
  it('should return different value - getDateDiff', async () => {
    expect(DateTimeUtils.getDateDiff(jsDate, DateTime.now().toJSDate())).toBeTruthy();
  });

  it('should return time with added value - addTime', async () => {
    expect(DateTimeUtils.addTime(jsDate, 1, 'hours', 'America/Toronto')).toBeTruthy();
    expect(DateTimeUtils.addTime(jsDate, 2, 'hours')).toBeTruthy();
  });

  it('should return time with subtracted value - subtractTime', async () => {
    expect(DateTimeUtils.subtractTime(jsDate, 1, 'hours', 'America/Toronto')).toBeTruthy();
    expect(DateTimeUtils.subtractTime(jsDate, 2, 'hours')).toBeTruthy();
  });

  it('should return boolean - isBefore', async () => {
    expect(DateTimeUtils.isBefore(jsDate, DateTime.now().toJSDate())).toBe(true);
  });
  it('should return boolean - isAfter', async () => {
    expect(DateTimeUtils.isAfter(jsDate, DateTime.now().toJSDate())).toBe(false);
  });
  it('should return boolean - isSame', async () => {
    expect(DateTimeUtils.isSame(jsDate, jsDate)).toBe(true);
    expect(DateTimeUtils.isSame(jsDate, DateTime.now().toJSDate())).toBe(false);
  });
  it('should return index of day name - getDayInWeekByweekDayName', async () => {
    expect(DateTimeUtils.getDayInWeekByweekDayName('Sunday')).toBe(0);
    expect(DateTimeUtils.getDayInWeekByweekDayName('Wednesday')).toBe(3);
  });
  it('should return index of month name - getMonthInYearBymonthName', async () => {
    expect(DateTimeUtils.getMonthInYearBymonthName('January')).toBe(0);
    expect(DateTimeUtils.getMonthInYearBymonthName('December')).toBe(11);
  });
});
