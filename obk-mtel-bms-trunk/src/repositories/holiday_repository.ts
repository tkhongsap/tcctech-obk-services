import dbClient from '../../db/client';

export default class HolidayRepository {
  static findMany = dbClient.holiday.findMany;
  static upsert = dbClient.holiday.upsert;
}
