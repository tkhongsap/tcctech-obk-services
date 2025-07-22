import request from 'supertest';
import { HolidayRepository } from '../../src/repositories';
import dayjs from 'dayjs';
import { MOCK_HOLIDAY_RESPONSE } from '../fixtures/holiday';
import app from '../../src/app';
import { newErrorHandler } from '../../src/middlewares/error';
import { resetDB } from '../helpers/db';
import { OBError } from '../../src/utils/error_spec';
import HolidayService from '../../src/services/holiday_service';

beforeEach(async () => {
  await resetDB();
  jest.restoreAllMocks();
  jest.useFakeTimers().setSystemTime(new Date('2023-02-13T21:00:00.000Z'));
  app.use(newErrorHandler);
});
afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

describe('HolidaysController', () => {
  describe('GET /holidays', () => {
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
    it('return 200', async () => {
      const response = await request(app).get('/holidays');

      expect(response.status).toEqual(200);
      expect(response.body.data[0].date).toEqual('2024-01-01');
    });
    it('return 200 and empty', async () => {
      const response = await request(app).get("/holidays?date='2025-01-01'");

      expect(response.status).toEqual(200);
      expect(response.body.data).toEqual([]);
    });
    it('return 400', async () => {
      const response = await request(app).get("/holidays?date=''");

      expect(response.status).toEqual(400);
      expect(response.body.error.code).toEqual(OBError.BMS_HOLIDAY_002.errorCode);
    });
  });
  describe('POST /holidays', () => {
    it('return 200', async () => {
      const response = await request(app)
        .post('/holidays')
        .send([
          {
            HolidayWeekDay: 'Tuesday',
            HolidayWeekDayThai: 'วันอังคาร',
            Date: '2024-12-31',
            DateThai: '31/12/2567',
            HolidayDescription: 'New Year’s Eve',
            HolidayDescriptionThai: 'วันสิ้นปี',
          },
        ]);

      expect(response.status).toEqual(200);
      expect(response.body.data.result).toEqual(true);
    });
    it('return 500', async () => {
      const response = await request(app).post('/holidays').send([]);

      expect(response.status).toEqual(400);
      expect(response.body.error.code).toEqual(OBError.BMS_HOLIDAY_001.errorCode);
    });
    it('return error list', async () => {
      jest.spyOn(HolidayService.prototype, 'upsertHolidays').mockResolvedValue([
        {
          date: '2024-12-31',
          error: 'mock upsert error',
        },
      ]);
      const response = await request(app)
        .post('/holidays')
        .send([
          {
            HolidayWeekDay: 'Tuesday',
            HolidayWeekDayThai: 'วันอังคาร',
            Date: '2024-12-31',
            DateThai: '31/12/2567',
            HolidayDescription: 'New Year’s Eve',
            HolidayDescriptionThai: 'วันสิ้นปี',
          },
        ]);

      expect(response.status).toEqual(500);
      expect(response.body.data.result[0].date).toEqual('2024-12-31');
    });
  });
});
