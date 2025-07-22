import dbClient from '../../db/client';

export default class TargetGroupMemberRepository {
  static findMany = dbClient.target_group_member.findMany;
  static create = dbClient.target_group_member.create;
  static createMany = dbClient.target_group_member.createMany;
  static findFirst = dbClient.target_group_member.findFirst;
  static delete = dbClient.target_group_member.delete;
  static update = dbClient.target_group_member.update;
  static deleteMany = dbClient.target_group_member.deleteMany;
}
