import { Pass, Prisma, VisitorSchedule } from '../../db/client/';
import PassRepository from '../repositories/pass_repository';
import dayjs from 'dayjs';
import { integer } from 'aws-sdk/clients/cloudfront';
import FSClient, { InvitePreRegisterResponse, WrappedResponse } from '../libs/fs_client';
import { map } from 'lodash';
import { JsonValue } from '../../db/client/runtime/library';
import logging from '../utils/logging';
import { TowerRepository } from '../repositories';
import { EventProducer } from '../utils/kafka';
import TCCClient, {
  DeactivateVisitorPassResponse,
  GetTermsAndConditionsResidenceParkingInput,
  GetTermsAndConditionsResidenceParkingResponse,
} from '../libs/tcc_client';
import { AxiosResponse } from 'axios';
import cache from '../libs/cache';
import { DeactiveVisitorResidentBody } from '../controllers/visitors_controller.interfaces';

// TODO: move types and interfaces to a proper place
type StandardError = {
  code: string;
  message: string;
};

interface StandardOutput<data> {
  data: data;
  error?: StandardError;
}

interface RepetitionType {
  type: string;
  until: string;
  value?: integer;
  values?: integer[];
}

interface InviteSchedulePass {
  startDate: string;
  endDate: string;
}

interface PassServiceCreateInput {
  visitor: Prisma.VisitorGetPayload<{
    include: {
      inviter: { include: { tenant_members: { include: { tenant: true } } } };
      visitor_schedules: {
        orderBy: { created_at: 'desc' };
        take: 1;
        include: {
          location: true;
        };
      };
    };
  }>;
  schedule: Prisma.VisitorScheduleGetPayload<{ include: { location: true } }>;
  durationInMinutes: number;
}

interface PassResidenceServiceCreateInput {
  visitor: Prisma.VisitorGetPayload<{
    include: {
      inviter: true;
      visitor_schedules: {
        orderBy: { created_at: 'desc' };
        take: 1;
        include: {
          location: true;
        };
      };
    };
  }>;
  schedule: Prisma.VisitorScheduleGetPayload<{ include: { location: true } }>;
  durationInMinutes: number;
  residenceID: string;
  locationID: number;
  inviteName: string;
  inviteHouseNumber: string;
  inviteZone: string;
  tenantId: string;
  projectId: number;
}

interface BuildMultiplePassesDataInput {
  visitor: {
    id: string;
    inviter_id: string;
  };
  schedule: {
    id: string;
    repetition: JsonValue;
    from: Date;
    to: Date;
  };
  durationInMinutes: number;
}

export class PassService {
  public async create(input: PassServiceCreateInput): Promise<StandardOutput<Pass[]>> {
    const { visitor, schedule, durationInMinutes } = input;
    const tenantUid = visitor.inviter.tenant_members[0].tenant!.uid;

    const passesData = schedule.repetition
      ? this.buildMultiplePassesData({ visitor, schedule, durationInMinutes })
      : this.buildSinglePassData({ visitor, schedule });
    logging.info(passesData);
    await PassRepository.createMany({
      data: passesData,
    });

    // TODO: this include is super ugly, must find a better way
    const passes = await PassRepository.findMany({
      where: {
        visit_schedule_id: schedule.id,
      },
      include: {
        visitor: {
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
          },
        },
      },
    });

    const inviteSchedulePass = this.buildDataFS(passes);

    const data = {
      guestInviteDocNo: schedule.id,
      guestInviteName: visitor.name,
      tenantID: tenantUid,
      locationID: schedule.location.uid,
      personID: visitor.inviter.uid,
      inviteSchedule: inviteSchedulePass,
    };

    // create FS once and sent the whole date object to fs

    logging.info(data);

    const res = await FSClient.invitePreRegister(data);

    logging.info(res.data.data);

    const inviteID = res.data.data.inviteID;

    // supposed to be updateMany n times
    const _pass = await PassRepository.updateMany({
      where: {
        visit_schedule_id: schedule.id,
      },
      data: {
        uid: inviteID,
        status: 'confirmed',
      },
    });
    console.debug({ _pass }, { depth: null });

    const baseWebviewUrl = process.env.WEB_VIEW_URL;

    const visitorPassScheduleId = passes.map((pass) => pass.visit_schedule_id)[0];
    const webviewUrl = `${baseWebviewUrl}?visit_schedule_id=${visitorPassScheduleId}`;
    const accountId = visitor.inviter.account_id;
    let towerNameValue: Prisma.JsonValue | undefined = {};

    if (visitor.visitor_schedules[0]?.tower_id) {
      const tower = await TowerRepository.findFirst({
        where: {
          id: visitor.visitor_schedules[0].tower_id,
        },
      });

      towerNameValue = tower?.display_name;
    }
    const payload = {
      visitor_email: visitor.email,
      invitation_link: webviewUrl,
      tower_name: towerNameValue,
      account_id: accountId,
    };

    EventProducer.send({
      name: 'ob-bms.visitor_pass.created',
      payload: payload,
    });

    return {
      data: passes,
    };
  }

  public findDatesInPeriod(
    from: Date,
    until: Date,
    condition: { type: string; value?: number; values?: number[] },
  ): Date[] {
    let date = dayjs(from);
    const endDate = dayjs(until);
    const dates: Date[] = [];

    while (date.isBefore(endDate)) {
      let matchedCondition = false;

      switch (condition.type) {
        case 'EVERYDAY':
          matchedCondition = true;
          break;
        case 'WEEKDAY':
          if (date.day() === dayjs(from).day()) {
            matchedCondition = true;
          }
          break;
        case 'DAY_IN_MONTH':
          if (condition.value) {
            if (date.date() === dayjs(from).date()) {
              matchedCondition = true;
            }
          }
          break;
        case 'DAY_IN_WEEK':
          if (condition.values && condition.values.length > 0) {
            if (condition.values.includes(date.day())) {
              matchedCondition = true;
            }
          }
          break;
      }

      if (matchedCondition) {
        dates.push(date.toDate());
      }

      date = date.add(1, 'day');
    }

    return dates;
  }

  public buildDataFS(passes: Pass[]): InviteSchedulePass[] {
    const inviteSchedulePass = [];
    for (const pass of passes) {
      const { from, to } = pass;
      const currentDate = dayjs().add(7, 'hours');
      let startDate = dayjs(from).add(7, 'hours');
      const endDate = dayjs(to).add(7, 'hours');

      if (currentDate.isAfter(startDate) && currentDate.isSame(startDate, 'day')) {
        startDate = dayjs().add(7, 'hours').add(2, 'minute');
      }

      if (currentDate.isAfter(endDate) && currentDate.isSame(endDate, 'day')) {
        logging.info('pass not valid', {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          currentDate: currentDate.toISOString(),
        });
        continue;
      }

      if (endDate.date() !== startDate.date()) {
        inviteSchedulePass.push(
          {
            startDate: startDate.toISOString(),
            endDate: startDate.format('YYYY-MM-DDT23:59:59').toString(),
          },
          {
            startDate: endDate.format('YYYY-MM-DDT00:00:00').toString(),
            endDate: endDate.toISOString(),
          },
        );
      } else {
        inviteSchedulePass.push({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });
      }
    }
    return inviteSchedulePass;
  }

  public buildSinglePassData(input: {
    visitor: Prisma.VisitorGetPayload<{ include: { inviter: true } }>;
    schedule: VisitorSchedule;
  }): Prisma.PassCreateManyInput[] {
    const { visitor, schedule } = input;
    return [
      {
        from: schedule.from,
        to: schedule.to,
        visitor_id: schedule.visitor_id,
        visit_schedule_id: schedule.id,
        issuer_id: visitor.inviter.id,
        status: 'pending',
      },
    ];
  }

  public buildMultiplePassesData(input: BuildMultiplePassesDataInput): Prisma.PassCreateManyInput[] {
    const { visitor, schedule, durationInMinutes } = input;

    // TODD: declare type for repetition
    const { type, value, values } = schedule.repetition as unknown as RepetitionType;
    const [fromHours, fromMinutes] = [schedule.from.getHours(), schedule.from.getMinutes()];

    const dates = this.findDatesInPeriod(schedule.from, schedule.to, { type, value, values });

    return map(dates, (date) => {
      const dateFromTime = dayjs(date).hour(fromHours).minute(fromMinutes);
      const dateToTime = dayjs(dateFromTime).add(durationInMinutes, 'minutes');
      return {
        from: dateFromTime.toDate(),
        to: dateToTime.toDate(),
        visitor_id: visitor.id,
        visit_schedule_id: schedule.id,
        issuer_id: visitor.inviter_id,
        status: 'pending',
      };
    });
  }

  public async createResident(input: PassResidenceServiceCreateInput): Promise<StandardOutput<Pass[]>> {
    const {
      visitor,
      schedule,
      durationInMinutes,
      residenceID,
      locationID,
      inviteName,
      inviteHouseNumber,
      inviteZone,
      tenantId,
      projectId,
    } = input;
    const passesData = schedule.repetition
      ? this.buildMultiplePassesData({ visitor, schedule, durationInMinutes })
      : this.buildSinglePassData({ visitor, schedule });
    logging.info(passesData);
    await PassRepository.createMany({
      data: passesData,
    });

    // TODO: this include is super ugly, must find a better way
    const passes = await PassRepository.findMany({
      where: {
        visit_schedule_id: schedule.id,
      },
      include: {
        visitor: {
          include: {
            inviter: true,
          },
        },
      },
    });

    const inviteSchedulePass = this.buildDataFS(passes);

    // create FS once and sent the whole date object to fs
    const fsData = {
      guestInviteName: visitor.name,
      personID: visitor.inviter.uid,
      inviteSchedule: inviteSchedulePass,
      residenceID: residenceID,
      locationID: locationID,
    };
    logging.info(fsData);
    await cache.getSet('TCC_ACCESS_TOKEN', async () => {
      const response = await TCCClient.getOauth2Token();
      return response.data.access_token;
    });
    const res = await TCCClient.invitePreRegisterResidential(fsData);

    logging.info(res.data.data);

    const inviteID = res.data.data.inviteID;

    // supposed to be updateMany n times
    const _pass = await PassRepository.updateMany({
      where: {
        visit_schedule_id: schedule.id,
      },
      data: {
        uid: inviteID,
        metadata_resident: JSON.stringify({
          invite_name: inviteName,
          invite_house_number: inviteHouseNumber,
          invite_zone: inviteZone,
          tenant_id: tenantId,
          project_id: projectId,
          residence_id: residenceID,
        }),
        status: 'confirmed',
      },
    });
    console.debug({ _pass }, { depth: null });

    const baseWebviewUrl = process.env.WEB_VIEW_RESIDENT_URL;

    const visitorPassScheduleId = passes.map((pass) => pass.visit_schedule_id)[0];
    const webviewUrl = `${baseWebviewUrl}?visit_schedule_id=${visitorPassScheduleId}`;
    const accountId = visitor.inviter.account_id;
    let towerNameValue: Prisma.JsonValue | undefined = {};

    if (visitor.visitor_schedules[0]?.tower_id) {
      const tower = await TowerRepository.findFirst({
        where: {
          id: visitor.visitor_schedules[0].tower_id,
        },
      });

      towerNameValue = tower?.display_name;
    }
    const payload = {
      visitor_email: visitor.email,
      invitation_link: webviewUrl,
      tower_name: towerNameValue,
      account_id: accountId,
      invite_house_number: inviteHouseNumber,
      invite_name: inviteName,
      project_id: projectId,
    };

    EventProducer.send({
      name: 'ob-bms.visitor_resident_pass.created',
      payload: payload,
    });

    const passesResident = await PassRepository.findMany({
      where: {
        visit_schedule_id: schedule.id,
      },
    });

    return {
      data: passesResident,
    };
  }

  public async getTermsAndConditionsResidenceParking(
    input: GetTermsAndConditionsResidenceParkingInput,
  ): Promise<StandardOutput<GetTermsAndConditionsResidenceParkingResponse>> {
    await cache.getSet('TCC_ACCESS_TOKEN', async () => {
      const response = await TCCClient.getOauth2Token();
      return response.data.access_token;
    });
    logging.info(`GetTermsAndConditionsResidenceParking:`, input);
    const res = await TCCClient.getTermsAndConditionsResidenceParking(input);

    return {
      data: res.data,
    };
  }

  public async deactivateVisitorPass(
    input: DeactiveVisitorResidentBody,
  ): Promise<StandardOutput<DeactivateVisitorPassResponse>> {
    await cache.getSet('TCC_ACCESS_TOKEN', async () => {
      const response = await TCCClient.getOauth2Token();
      return response.data.access_token;
    });

    logging.info(`DeactivateVisitorPass:`, input);
    const res = await TCCClient.deactivateVisitorPass({
      inviterId: input.invite_id,
    });

    return {
      data: res.data,
    };
  }
}
