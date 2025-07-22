import { Prisma } from '../../db/client';
import { IssueTypeData, IssueTypeResponse } from './issue_types_controller.interface';

function issueTypsSerializer(issueTypes: Prisma.IssueTypeGetPayload<null>[]): IssueTypeResponse {
  return issueTypes?.map((issueType) => issueTypeSerializer(issueType));
}
function issueTypeSerializer(issueType: Prisma.IssueTypeGetPayload<null>): IssueTypeData {
  const issueTypesData: IssueTypeData = {
    id: issueType.id,
    name: issueType.name,
    display_name: issueType.display_name,
    internal_remark: issueType.internal_remark,
    created_at: issueType.created_at.toISOString(),
    updated_at: issueType.updated_at.toISOString(),
  };
  return issueTypesData;
}

export { issueTypeSerializer, issueTypsSerializer };
