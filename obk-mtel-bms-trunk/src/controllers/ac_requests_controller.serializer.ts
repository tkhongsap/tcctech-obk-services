import { map } from 'lodash';
import { Prisma } from '../../db/client';
import { ACRequestResponse, ACRequestZone, ACZoneData, RequesterData } from './ac_requests_controller.interfaces';
import { FloorData, TowerData } from './locations_controller.interface';
import { formatReference } from '../utils/references_code';
import { AC_REFERENCES_LENGTH, AC_REFERENCES_PREFIX } from '../consts/ac_requests';

export function acRequestsSerializer(
  acRequests: Prisma.ACRequestGetPayload<{
    include: {
      floor: true;
      tower: true;
      requester: { include: { tenant_members: { include: { tenant: true } } } };
      ac_request_zones: { include: { ac_zone: true } };
    };
  }>[],
): ACRequestResponse[] {
  return map(acRequests, (acRequest) => {
    return acRequestShowSerializer(acRequest);
  });
}

export function acRequestShowSerializer(
  acRequest: Prisma.ACRequestGetPayload<{
    include: {
      floor: true;
      tower: true;
      requester: { include: { tenant_members: { include: { tenant: true } } } };
      ac_request_zones: { include: { ac_zone: true } };
    };
  }>,
): ACRequestResponse {
  const floorData: FloorData = {
    id: acRequest.floor.id,
    uid: acRequest.floor.uid,
    name: acRequest.floor.name,
    display_name: acRequest.floor.display_name,
    tower_id: acRequest.floor.tower_id,
    created_at: acRequest.floor.created_at.toISOString(),
    updated_at: acRequest.floor.updated_at.toISOString(),
  };
  const towerData: TowerData = {
    id: acRequest.tower.id,
    uid: acRequest.tower.uid,
    name: acRequest.tower.name,
    display_name: acRequest.tower.display_name,
    project_id: acRequest.tower.project_id,
    created_at: acRequest.tower.created_at.toISOString(),
    updated_at: acRequest.tower.updated_at.toISOString(),
  };

  const acRequestZones = acRequestZonesSerializer(acRequest.ac_request_zones);

  const requester: RequesterData = {
    ...acRequest.requester,
    id: acRequest.requester.id,
    uid: acRequest.requester.uid,
    account_id: acRequest.requester.account_id,
    metadata: acRequest.requester.metadata,
    created_at: acRequest.requester.created_at.toISOString(),
    updated_at: acRequest.requester.updated_at.toISOString(),
    tenant_members: acRequest.requester.tenant_members?.map((tenantMember) => ({
      tenant: tenantMember.tenant,
    })) as any,
  };
  return {
    id: acRequest.id,
    tower_id: acRequest.tower_id,
    floor_id: acRequest.floor_id,
    estimated_cost: acRequest.estimated_cost,
    from: acRequest.from.toISOString(),
    to: acRequest.to.toISOString(),
    duration_hour: acRequest.duration_hour,
    total_area_size: acRequest.total_area_size,
    status: acRequest.status,
    requester_id: acRequest.requester_id,
    created_at: acRequest.created_at.toISOString(),
    updated_at: acRequest.updated_at.toISOString(),
    references: formatReference(
      acRequest.created_at.toISOString(),
      acRequest.references.toString(),
      AC_REFERENCES_LENGTH,
      AC_REFERENCES_PREFIX,
    ),
    floor: floorData,
    tower: towerData,
    ac_zone: acRequestZones,
    requester: requester,
    reason: acRequest.reason,
    internal_remark: acRequest.internal_remark,
  };
}

export function acRequestZonesSerializer(
  acRequestZones: Prisma.ACRequestZoneGetPayload<{ include: { ac_zone: true } }>[],
): ACRequestZone[] {
  return map(acRequestZones, (acRequestZone) => {
    return acRequestZoneSerializer(acRequestZone);
  });
}

export function acRequestZoneSerializer(
  acRequestZone: Prisma.ACRequestZoneGetPayload<{ include: { ac_zone: true } }>,
): ACRequestZone {
  const acZoneData: ACZoneData = {
    id: acRequestZone.ac_zone.id,
    name: acRequestZone.ac_zone.name,
    area_size: acRequestZone.ac_zone.area_size,
    floor_id: acRequestZone.ac_zone.floor_id,
    created_at: acRequestZone.ac_zone.created_at.toISOString(),
    updated_at: acRequestZone.ac_zone.updated_at.toISOString(),
  };
  return {
    id: acRequestZone.id,
    name: acRequestZone.ac_zone.name,
    ac_request_id: acRequestZone.ac_request_id,
    ac_zone: acZoneData,
    area_size: acRequestZone.area_size,
    rate: acRequestZone.rate,
    created_at: acRequestZone.created_at.toISOString(),
    updated_at: acRequestZone.updated_at.toISOString(),
  };
}
