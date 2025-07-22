import dbClient from '../../db/client';

export default class NotificationGroupRepository {
  static findMany = dbClient.notification_group.findMany;
  static create = dbClient.notification_group.create;
  static createMany = dbClient.notification_group.createMany;
  static findFirst = dbClient.notification_group.findFirst;
  static update = dbClient.notification_group.update;
  static delete = dbClient.notification_group.delete;
}
