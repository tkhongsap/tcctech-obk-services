import { Body, Get, OperationId, Path, Put, Route } from 'tsoa';
import { BaseController } from './base_controller';
import { PassRepository, VisitorTokenRepository, LocationRepository } from '../repositories';
import {
  PassConsentResponse,
  ShowPassResponse,
  WrappedResponse,
  consentRequestBody,
} from './passes_controller.interfaces';
import { passConsentSerializer, passSerializer } from './passes_controller.serealizer';
import { CustomError } from '../middlewares/error';
import { OBError } from '../utils/error_spec';
import dayjs from 'dayjs';
import { first } from 'lodash';
import OBSDK from '../libs/ob_sdk';
import logging from '../utils/logging';
import cache from '../libs/cache';

@Route('passes')
export class PassesController extends BaseController {
  @Get('{visit_schedule_id}')
  @OperationId('passes.show')
  public async show(@Path() visit_schedule_id: string): Promise<WrappedResponse<ShowPassResponse | null>> {
    // Get the current date in UTC

    logging.info('#obVisitorPass open visitor pass : ', visit_schedule_id);
    const currentDateInBKK = new Date();

    currentDateInBKK.setUTCHours(currentDateInBKK.getUTCHours() + 7);

    currentDateInBKK.setUTCHours(0, 0, 0, 0);

    currentDateInBKK.setUTCHours(currentDateInBKK.getUTCHours() - 7);

    const pass = await PassRepository.findFirst({
      where: {
        visit_schedule_id,
        to: {
          gte: currentDateInBKK.toISOString(),
        },
      },
      include: {
        visitor_schedule: {
          include: {
            tokens: {
              where: {
                expired_date: {
                  gt: dayjs().toISOString(),
                },
              },
              take: 1,
              orderBy: {
                expired_date: 'desc',
              },
            },
          },
        },
        issuer: true,
        visitor: true,
      },
      orderBy: {
        from: 'asc',
      },
    });

    if (!pass) {
      throw new CustomError(OBError.BMS_PASS_002);
    }

    let visitorToken = first(pass.visitor_schedule.tokens);
    logging.info('#obVisitorPass visitor pass token : ', visitorToken);
    if (!visitorToken) {
      const expiredDate = dayjs().add(10, 'minutes').toISOString();
      const startDate = dayjs(pass.visitor_schedule?.from)
        .utc()
        .format('YYYY-MM-DD HH:mm:ss');
      const endDate = dayjs(pass.visitor_schedule?.to)
        .utc()
        .format('YYYY-MM-DD HH:mm:ss');
      const vistorPassTokenId = await this.createVisitorPassToken(
        pass.uid!,
        expiredDate,
        pass.issuer.account_id!,
        startDate,
        endDate,
      );
      logging.info('#obVisitorPass done visitor pass token expiry : ', expiredDate);
      visitorToken = await VisitorTokenRepository.create({
        data: {
          token_id: vistorPassTokenId,
          expired_date: expiredDate,
          visitor_schedule: {
            connect: {
              id: pass.visit_schedule_id,
            },
          },
        },
      });
    }

    const locations = await LocationRepository.findFirst({
      where: {
        tower_id: pass?.visitor_schedule.tower_id,
        id: pass?.visitor_schedule.floor_id,
      },
      include: {
        floor: true,
        tower: true,
      },
    });

    this.setStatus(200);
    const data = pass && locations ? passSerializer(pass, locations, visitorToken) : null;
    return {
      data: data,
    };
  }

  @Put('consent/{visit_schedule_id}')
  @OperationId('passes.consent')
  public async consent(
    @Path() visit_schedule_id: string,
    @Body() body: consentRequestBody,
  ): Promise<WrappedResponse<PassConsentResponse>> {
    try {
      await PassRepository.updateMany({
        where: {
          visit_schedule_id,
        },
        data: body,
      });

      const pass = await PassRepository.findFirst({
        where: {
          visit_schedule_id,
        },
      });

      if (!pass) {
        throw new CustomError(OBError.BMS_PASS_002);
      }
      await cache.delete(`member_data_${pass.issuer_id}_undefined`);

      const data = passConsentSerializer(pass!);
      this.setStatus(200);

      return {
        data: data,
      };
    } catch (error) {
      throw new CustomError(OBError.BMS_PASS_001);
    }
  }

  // TODO: Refactor this part once dynamic QR is done
  private async createVisitorPassToken(
    inviteID: string,
    expiredDate: string,
    accountId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<string> {
    const res = await OBSDK.IAM.client.tokensCreate(
      {
        type: 'visitor_pass',
        expired_at: expiredDate,
        value: [
          {
            name: 'fs',
            data: {
              invite_id: inviteID,
              expired_date: expiredDate,
            },
          },
          {
            name: 'fs_parking',
            data: {
              invite_id: inviteID,
              expired_date: expiredDate,
            },
          },
          {
            name: 'kgi',
            data: {
              invite_id: inviteID,
              expired_date: expiredDate,
            },
          },
          {
            name: 'sm',
            data: {
              invite_id: inviteID,
              expired_date: expiredDate,
            },
          },
          {
            name: 'fs_resident_booking',
            data: {
              invite_id: inviteID,
              expired_date: expiredDate,
            },
          },
          {
            name: 'innoflex',
            data: {
              invite_id: inviteID,
              start_date: startDate,
              end_date: endDate,
              expired_date: expiredDate,
            },
          },
        ],
      },
      accountId,
    );

    return res.data.data!.token.id;
  }
}
