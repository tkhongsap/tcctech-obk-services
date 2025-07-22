import { map } from 'lodash';
import { Prisma } from '../../../db/client';
import { FindMemberResult } from '../members_controller.interfaces';

export function membersSerializer(members: Prisma.MemberGetPayload<null>[]): FindMemberResult[] {
  return map(members, (member) => {
    return memberSerializer(member);
  });
}

export function memberSerializer(member: Prisma.MemberGetPayload<null>): FindMemberResult {
  return {
    id: member.id,
    uid: member.uid,
    metadata: member.metadata,
    account_id: member.account_id,
    created_at: member.created_at.toISOString(),
    updated_at: member.updated_at.toISOString(),
  };
}
