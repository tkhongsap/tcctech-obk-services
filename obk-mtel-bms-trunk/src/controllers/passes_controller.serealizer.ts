import { VisitorToken } from '../../db/client/';
import { Prisma } from '../../db/client';
import { VisitorSchedulePassesRepeat, PassConsentResponse, ShowPassResponse } from './passes_controller.interfaces';

export function passSerializer(
  pass: Prisma.PassGetPayload<{
    include: {
      visitor_schedule: {
        include: {
          tokens: true;
        };
      };
      issuer: true;
      visitor: true;
    };
  }>,
  location: Prisma.LocationGetPayload<{
    include: {
      floor: true;
      tower: true;
    };
  }>,
  token: VisitorToken,
): ShowPassResponse {
  const metaDataPasses = JSON.parse(pass.metadata_resident as string);
  const repetitionSchedule = (pass.visitor_schedule.repetition as unknown as VisitorSchedulePassesRepeat) ?? null;
  const dateRepeat = findRepeatText(repetitionSchedule);
  return {
    id: pass.id,
    uid: pass.uid,
    from: pass.from.toISOString(),
    to: pass.to.toISOString(),
    visitor_id: pass.visitor_id,
    issuer_id: pass.issuer_id,
    status: pass.status,
    visit_schedule_id: pass.visit_schedule_id,
    created_at: pass.created_at.toISOString(),
    updated_at: pass.updated_at.toISOString(),
    metadata_resident: {
      invite_name: metaDataPasses?.invite_name,
      invite_house_number: metaDataPasses?.invite_house_number,
      invite_zone: metaDataPasses?.invite_zone,
      tenant_id: metaDataPasses?.tenant_id,
      project_id: metaDataPasses?.project_id,
    },
    repeatInvite: dateRepeat,
    consent: pass.consent,
    visitor_schedule: {
      tower_id: pass.visitor_schedule.tower_id,
      floor_id: pass.visitor_schedule.floor_id,
      from: pass.visitor_schedule.from.toISOString(),
      to: pass.visitor_schedule.to.toISOString(),
      repetition: (pass.visitor_schedule.repetition as unknown as object) ?? null,
      created_at: pass.visitor_schedule.created_at.toISOString(),
      updated_at: pass.visitor_schedule.updated_at.toISOString(),
      tokens: [token],
    },
    visitor: {
      name: pass.visitor.name,
      profile_image_url: pass.visitor.profile_image_url,
      email: pass.visitor.email,
      company_name: pass.visitor.company_name,
      reference: pass.visitor.reference,
      inviter_id: pass.visitor.inviter_id,
      created_at: pass.visitor.created_at.toISOString(),
      updated_at: pass.visitor.updated_at.toISOString(),
    },
    issuer: {
      uid: pass.issuer.uid,
      metadata: pass.issuer.metadata,
      account_id: pass.issuer.account_id,
      created_at: pass.issuer.created_at.toISOString(),
      updated_at: pass.issuer.updated_at.toISOString(),
    },
    location: {
      id: location.id,
      uid: location.uid,
      name: location.name,
      tower_id: location.tower_id,
      floor_id: location.floor_id,
      zone_id: location.zone_id,
      tower: {
        id: location.tower.id,
        uid: location.tower.uid,
        name: location.tower.name,
        display_name: location.tower.display_name,
        project_id: location.tower.project_id,
        created_at: location.tower.created_at.toISOString(),
        updated_at: location.tower.updated_at.toISOString(),
      },
      floor: {
        id: location.floor.id,
        uid: location.floor.uid,
        name: location.floor.name,
        display_name: location.floor.display_name,
        tower_id: location.floor.tower_id,
        created_at: location.floor.created_at.toISOString(),
        updated_at: location.floor.updated_at.toISOString(),
      },
      created_at: location.created_at.toISOString(),
      updated_at: location.updated_at.toISOString(),
    },
  };
}

function findRepeatText(repetitionSchedule: VisitorSchedulePassesRepeat) {
  let dateRepeat = '';
  if (repetitionSchedule != null) {
    if (repetitionSchedule.type === 'DAY_IN_WEEK') {
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      const hasSunday = repetitionSchedule.values?.includes(0) ?? false;
      const daysList = repetitionSchedule.values?.filter((day) => day !== 0).map((day) => daysOfWeek[day]) ?? [];

      dateRepeat = 'Every ' + daysList.join(', ');

      if (hasSunday) {
        if (daysList.length > 0) dateRepeat += ', ';
        dateRepeat += 'Sunday';
      }
    } else if (repetitionSchedule.type === 'DAY_IN_MONTH') {
      dateRepeat = `Every ${repetitionSchedule.value} of the month`;
    } else if (repetitionSchedule.type === 'EVERYDAY') {
      dateRepeat = 'Everyday';
    }
  }
  return dateRepeat;
}

export function passConsentSerializer(pass: Prisma.PassGetPayload<true>): PassConsentResponse {
  return {
    id: pass.id,
    uid: pass.uid,
    from: pass.from.toISOString(),
    to: pass.to.toISOString(),
    visitor_id: pass.visitor_id,
    issuer_id: pass.issuer_id,
    status: pass.status,
    visit_schedule_id: pass.visit_schedule_id,
    created_at: pass.created_at.toISOString(),
    updated_at: pass.updated_at.toISOString(),
    consent: pass.consent,
  };
}
