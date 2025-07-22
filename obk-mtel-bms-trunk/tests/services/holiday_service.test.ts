import { resetDB } from '../helpers/db';
import HolidayService from '../../src/services/holiday_service';
import { MOCK_HOLIDAY_RESPONSE } from '../fixtures/holiday';
import { HolidayRepository } from '../../src/repositories';
import dayjs from 'dayjs';
import { HolidayRequestBody } from '../../src/controllers/holidays_controller.interfaces';

const holidayService = new HolidayService();

beforeEach(async () => {
  await resetDB();
  jest.restoreAllMocks();
  jest.useFakeTimers().setSystemTime(new Date('2023-02-13T21:00:00.000Z'));
});
afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
  jest.clearAllMocks();
});

describe('HolidayService', () => {
  describe('getHolidayWithMinDate', () => {
    beforeEach(async () => {
      const dataUpdate = {
        holiday_week_day: MOCK_HOLIDAY_RESPONSE[0].HolidayWeekDay,
        holiday_week_day_thai: MOCK_HOLIDAY_RESPONSE[0].HolidayWeekDayThai,
        date_thai: MOCK_HOLIDAY_RESPONSE[0].DateThai,
        holiday_description: MOCK_HOLIDAY_RESPONSE[0].HolidayDescription,
        holiday_description_thai: MOCK_HOLIDAY_RESPONSE[0].HolidayDescriptionThai,
        updated_at: new Date(), // Update the timestamp
      };
      await HolidayRepository.upsert({
        where: { date: dayjs(MOCK_HOLIDAY_RESPONSE[0].Date).toDate() },
        update: dataUpdate,
        create: {
          ...dataUpdate,
          date: dayjs(MOCK_HOLIDAY_RESPONSE[0].Date).toDate(),
        },
      });
    });
    it('return holidays', async () => {
      const holidays = await holidayService.getHolidayWithMinDate();
      expect(holidays).toHaveLength(1);
    });
    it('return empty array', async () => {
      const holidays = await holidayService.getHolidayWithMinDate('2025-01-01');
      expect(holidays).toHaveLength(0);
    });
  });
  describe('upsertHolidays', () => {
    let mockData: HolidayRequestBody[];
    beforeEach(async () => {
      mockData = [
        {
          HolidayWeekDay: 'Tuesday',
          HolidayWeekDayThai: 'วันอังคาร',
          Date: '2024-12-31',
          DateThai: '31/12/2567',
          HolidayDescription: 'New Year’s Eve',
          HolidayDescriptionThai: 'วันสิ้นปี',
        },
      ];
    });
    it('return empty error', async () => {
      const errorResult = await holidayService.upsertHolidays(mockData);
      expect(errorResult).toHaveLength(0);
    });
    it('return error array', async () => {
      const upsertSpy = jest.spyOn(HolidayRepository, 'upsert').mockImplementationOnce(() => {
        throw new Error('Mocked upsert error');
      });
      const errorResult = await holidayService.upsertHolidays(mockData);
      expect(errorResult).toHaveLength(1);
      expect(upsertSpy).toHaveBeenCalled();
    });
  });
});
