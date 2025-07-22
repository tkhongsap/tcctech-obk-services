import { get } from 'lodash';
import { CreateVisitorBody, VisitorSchedule } from '../controllers/visitors_controller.interfaces';
import { Prisma } from '../../db/client/';
import VisitorRepository from '../repositories/visitors_repository';
import { FloorRepository, LocationRepository, MemberRepository, TowerRepository } from '../repositories';

interface VisitorServiceCreateInput extends CreateVisitorBody {}

export default class VisitorService {
  async create(input: VisitorServiceCreateInput): Promise<typeof visitor> {
    const visitorInput: Prisma.VisitorCreateInput = {
      name: input.name,
      company_name: input.company_name,
      email: input.email,
      reference: input.reference,
      profile_image_url: input.profile_image_url,
      inviter: {
        connect: {
          id: input.inviter_id,
        },
      },
      visitor_schedules: {
        create: [
          {
            from: input.visitor_schedule.from,
            to: this.computeVisitScheduleTo(input.visitor_schedule),
            tower_id: input.visitor_schedule.tower_id,
            floor_id: input.visitor_schedule.floor_id,
            repetition: input.visitor_schedule.repetition,
          },
        ],
      },
    };
    const visitor = await VisitorRepository.create({
      data: visitorInput,
      include: {
        inviter: {
          include: {
            tenant_members: {
              include: {
                tenant: true,
              },
            },
          },
        },
        visitor_schedules: {
          orderBy: {
            created_at: 'desc',
          },
          take: 1,
          include: {
            location: true,
          },
        },
      },
    });

    return visitor;
  }

  computeVisitScheduleTo(schedule: VisitorSchedule): Date {
    let toDate: Date = new Date(schedule.to);
    const repitionUntil = get(schedule, 'repetition.until');
    if (repitionUntil) {
      const hours = toDate.getHours();
      const minutes = toDate.getMinutes();

      toDate = new Date(repitionUntil);
      toDate.setHours(hours, minutes);
    }
    return toDate;
  }

  async createResident(input: VisitorServiceCreateInput): Promise<typeof visitor> {
    let towerID = input.visitor_schedule.tower_id;
    let floorID = input.visitor_schedule.floor_id;
    let inviterID = input.inviter_id;
    const inviterData = await MemberRepository.findFirst({
      where: {
        uid: input.inviter_id,
      },
      select: {
        id: true,
      },
    });
    inviterID = inviterData?.id ?? '';

    const towerData = await TowerRepository.findFirst({
      where: {
        uid: input.visitor_schedule.tower_id,
      },
      select: {
        id: true,
      },
    });

    towerID = towerData?.id ?? '';
    const floorData = await FloorRepository.findFirst({
      where: {
        uid: input.visitor_schedule.floor_id,
        tower_id: towerID,
      },
      select: {
        id: true,
      },
    });

    const locationData = await LocationRepository.findFirst({
      where: {
        tower_id: towerID,
        floor_id: floorData?.id,
      },
      select: {
        id: true,
      },
    });

    floorID = locationData?.id ?? '';

    const visitorInput: Prisma.VisitorCreateInput = {
      name: input.name,
      company_name: input.company_name,
      email: input.email,
      reference: input.reference,
      profile_image_url: input.profile_image_url,
      inviter: {
        connect: {
          id: inviterID,
        },
      },
      visitor_schedules: {
        create: [
          {
            from: input.visitor_schedule.from,
            to: this.computeVisitScheduleTo(input.visitor_schedule),
            tower_id: towerID,
            floor_id: floorID,
            repetition: input.visitor_schedule.repetition,
          },
        ],
      },
    };

    const visitor = await VisitorRepository.create({
      data: visitorInput,
      include: {
        inviter: true,
        visitor_schedules: { orderBy: { created_at: 'desc' }, take: 1, include: { location: true } },
      },
    });

    return visitor;
  }
}
