import { dayjs } from '../libs/dayjs';
import { HolidayRepository } from '../repositories';
import { ErrorUpsertHoliday } from './interfaces/holiday.interface';
import logging from '../utils/logging';
import { HolidayRequestBody } from '../controllers/holidays_controller.interfaces';

export default class HolidayService {
  public async upsertHolidays(body: HolidayRequestBody[]): Promise<ErrorUpsertHoliday[]> {
    const errorUpsertHoliday: ErrorUpsertHoliday[] = [];
    for (const holiday of body) {
      try {
        await HolidayRepository.upsert({
          where: { date: dayjs(holiday.Date).toDate() },
          update: {
            holiday_week_day: holiday.HolidayWeekDay,
            holiday_week_day_thai: holiday.HolidayWeekDayThai,
            date_thai: holiday.DateThai,
            holiday_description: holiday.HolidayDescription,
            holiday_description_thai: holiday.HolidayDescriptionThai,
          },
          create: {
            holiday_week_day: holiday.HolidayWeekDay,
            holiday_week_day_thai: holiday.HolidayWeekDayThai,
            date: dayjs(holiday.Date).toDate(),
            date_thai: holiday.DateThai,
            holiday_description: holiday.HolidayDescription,
            holiday_description_thai: holiday.HolidayDescriptionThai,
          },
        });
      } catch (e) {
        const error = (e as Error).message;
        errorUpsertHoliday.push({
          date: holiday.Date,
          error: error,
        });
        logging.error(`Failed to upsert holiday on date ${holiday.Date}:`, error);
      }
    }
    return errorUpsertHoliday;
  }

  public async getHolidayWithMinDate(date?: string): Promise<typeof holiday> {
    let minDate = dayjs().subtract(1, 'day').endOf('day').toDate();
    if (date) {
      minDate = dayjs(date).subtract(1, 'day').endOf('day').toDate();
    }

    const holiday = await HolidayRepository.findMany({
      where: {
        date: {
          gte: minDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
    return holiday;
  }
}
