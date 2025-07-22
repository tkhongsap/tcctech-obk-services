import { Dayjs } from 'dayjs';
import { Prisma } from '../../db/client';
import { MembersShowResponse, PassData, TowerData } from './members_controller.interfaces';
import { OutdoorZone } from '../services/tower_service';

const formatISOString = (value: Date | Dayjs | string): string => {
  return typeof value === 'string' ? value : value.toISOString();
};
function passSerializer(
  passes: Prisma.PassGetPayload<{
    include: {
      visitor: true;
      visitor_schedule: true;
    };
  }>[],
): PassData[] {
  return passes.map((pass) => {
    return {
      id: pass.id,
      uid: pass.uid,
      from: formatISOString(pass.from),
      to: formatISOString(pass.to),
      visitor_id: pass.visitor_id,
      issuer_id: pass.issuer_id,
      status: pass.status,
      consent: pass.consent,
      visit_schedule_id: pass.visit_schedule_id,
      created_at: formatISOString(pass.created_at),
      updated_at: formatISOString(pass.updated_at),
      visitor_schedule: {
        id: pass.visitor_schedule.id,
        visitor_id: pass.visitor_schedule.visitor_id,
        tower_id: pass.visitor_schedule.tower_id,
        floor_id: pass.visitor_schedule.floor_id,
        from: pass.visitor_schedule.from,
        to: pass.visitor_schedule.to,
        repetition: pass.visitor_schedule.repetition,
        created_at: formatISOString(pass.visitor_schedule.created_at),
        updated_at: formatISOString(pass.visitor_schedule.updated_at),
        deleted_at: pass.visitor_schedule.deleted_at
          ? formatISOString(pass.visitor_schedule.deleted_at)
          : pass.visitor_schedule.deleted_at,
      },
      visitor: {
        id: pass.visitor.id,
        name: pass.visitor.name,
        profile_image_url: pass.visitor.profile_image_url,
        email: pass.visitor.email,
        company_name: pass.visitor.company_name,
        reference: pass.visitor.reference,
        inviter_id: pass.visitor.inviter_id,
        created_at: formatISOString(pass.visitor.created_at),
        updated_at: formatISOString(pass.visitor.updated_at),
      },
    };
  });
}

export function membersShowSerializer(
  member: Prisma.MemberGetPayload<{
    include: {
      passes: {
        include: {
          visitor: true;
          visitor_schedule: true;
        };
        where: {
          // fix for test on 8 jan 2024
          status: 'confirmed';
        };
      };
      tenant_members: {
        include: {
          tenant: {
            include: {
              authorized_location: true;
            };
          };
        };
      };
    };
  }> | null,
  towers: Prisma.TowerGetPayload<{
    include: {
      locations: true;
      floors: true;
    };
  }>[],
  outdoor: OutdoorZone[],
  passed_turnstile: boolean,
): MembersShowResponse | null {
  if (!member) {
    return null;
  }

  const towerDatas: TowerData[] = [];
  for (const tower of towers) {
    const location = [];
    const floor = [];

    for (const authorizedLocation of tower.locations) {
      location.push({
        id: authorizedLocation.id,
        uid: authorizedLocation.uid,
        name: authorizedLocation.name,
        tower_id: tower.id,
        floor_id: authorizedLocation.floor_id,
        display_name: { en: authorizedLocation.name, th: authorizedLocation.name },
        created_at: formatISOString(authorizedLocation.created_at),
        updated_at: formatISOString(authorizedLocation.updated_at),
      });
    }

    for (const authorizedFloor of tower.floors) {
      floor.push({
        id: authorizedFloor.id,
        uid: authorizedFloor.uid,
        name: authorizedFloor.name,
        tower_id: tower.id,
        display_name: { en: authorizedFloor.name, th: authorizedFloor.name },
        created_at: formatISOString(authorizedFloor.created_at),
        updated_at: formatISOString(authorizedFloor.updated_at),
        image: authorizedFloor.image,
      });
    }

    towerDatas.push({
      id: tower.id,
      uid: tower.uid,
      name: tower.name,
      display_name: tower.display_name,
      project_id: tower.project_id,
      created_at: formatISOString(tower.created_at),
      updated_at: formatISOString(tower.updated_at),
      floors: floor,
      locations: location,
    });
  }

  return {
    id: member.id,
    uid: member.uid,
    defaultFloor: member.default_floor,
    account_id: member.account_id,
    metadata: member.metadata,
    created_at: formatISOString(member.created_at),
    updated_at: formatISOString(member.updated_at),
    passes: passSerializer(member.passes),
    towers: towerDatas,
    outdoor: outdoor,
    passed_turnstile: passed_turnstile,
  };
}
