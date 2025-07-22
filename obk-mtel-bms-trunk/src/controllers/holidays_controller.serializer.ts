import { map } from 'lodash';
import { HolidayResponse } from './holidays_controller.interfaces';
import { Prisma } from '../../db/client';
import dayjs from 'dayjs';

export function holidaysSerializer(holidays: Prisma.HolidayGetPayload<null>[]): HolidayResponse[] {
  return map(holidays, (holiday) => {
    return {
      id: holiday.id,
      holiday_week_day: holiday.holiday_week_day,
      holiday_week_day_thai: holiday.holiday_description_thai,
      date: dayjs(holiday.date).format('YYYY-MM-DD'),
      date_thai: holiday.date_thai,
      holiday_description: holiday.holiday_description,
      holiday_description_thai: holiday.holiday_description_thai,
    };
  });
}
