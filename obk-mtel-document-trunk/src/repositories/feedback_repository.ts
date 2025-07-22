import dbClient from '../../db/client';

export default class FeedbackRepository {
  static findMany = dbClient.feedback.findMany;
  static create = dbClient.feedback.create;
  static update = dbClient.feedback.update;
  static delete = dbClient.feedback.delete;
}
