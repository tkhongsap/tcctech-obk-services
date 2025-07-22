import { ErrorUpsertHoliday } from '../services/interfaces/holiday.interface';

export interface HolidayResponse {
  id: string;
  holiday_week_day: string;
  holiday_week_day_thai: string;
  date: string;
  date_thai: string;
  holiday_description: string;
  holiday_description_thai: string;
}

export interface UpsertHolidayResponse {
  result: boolean | ErrorUpsertHoliday[];
}

export interface HolidayRequestBody {
  HolidayWeekDay: string;
  HolidayWeekDayThai: string;
  Date: string;
  DateThai: string;
  HolidayDescription: string;
  HolidayDescriptionThai: string;
}
