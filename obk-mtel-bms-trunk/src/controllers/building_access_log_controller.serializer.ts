import {
  BuildingAccessLogResult,
  MemberDataResult,
  TenantMemberResult,
  VisitorResult,
} from './building_access_log_controller.interface';

export function buildingAccessLogsSerializer(buildingLogs: BuildingAccessLogResult[]): BuildingAccessLogResult[] {
  return buildingLogs.map((buildingLog) => {
    return buildingAccessLogSerializer(buildingLog);
  });
}

export function buildingAccessLogSerializer(buildingLog: BuildingAccessLogResult): BuildingAccessLogResult {
  let member: MemberDataResult | null = null;
  let visitor: VisitorResult | null = null;
  if (buildingLog.member) {
    member = {
      id: buildingLog.member.id,
      uid: buildingLog.member.uid,
      account_id: buildingLog.member.account_id,
      metadata: buildingLog.member.metadata,
      created_at: buildingLog.member.created_at,
      updated_at: buildingLog.member.updated_at,
      tenant_members: buildingLog.member.tenant_members?.map((tenantMember: TenantMemberResult) => ({
        id: tenantMember.id,
        tenant_id: tenantMember.tenant_id,
        tenant: tenantMember.tenant,
        member_id: tenantMember.member_id,
        role: tenantMember.role,
        setting: tenantMember.setting,
        created_at: tenantMember.created_at,
        updated_at: tenantMember.updated_at,
      })),
    };
  } else if (buildingLog.visitor) {
    visitor = {
      id: buildingLog.visitor.id,
      name: buildingLog.visitor.name,
      profile_image_url: buildingLog.visitor.profile_image_url,
      email: buildingLog.visitor.email,
      company_name: buildingLog.visitor.company_name,
      reference: buildingLog.visitor.reference,
      inviter_id: buildingLog.visitor.inviter_id,
      created_at: buildingLog.visitor.created_at,
      updated_at: buildingLog.visitor.updated_at,
      inviter: buildingLog.visitor.inviter,
    };
  }

  return {
    id: buildingLog.id,
    uid: buildingLog.uid,
    fs_account_id: buildingLog.fs_account_id,
    type: buildingLog.type,
    status: buildingLog.status,
    transaction_date: buildingLog.transaction_date,
    turnstile_id: buildingLog.turnstile_id,
    data: buildingLog.data,
    name: buildingLog.name,
    display_status: buildingLog.display_status,
    display_tower: buildingLog.display_tower,
    display_turnstile: buildingLog.display_turnstile,
    created_at: buildingLog.created_at,
    updated_at: buildingLog.updated_at,
    member,
    visitor,
  };
}
