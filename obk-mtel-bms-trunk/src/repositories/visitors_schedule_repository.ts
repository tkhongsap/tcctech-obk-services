import dbClient from '../../db/client';

export default class VisitorScheduleRepository {
  static update = dbClient.visitorSchedule.update;
}
