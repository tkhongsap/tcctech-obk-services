import { Body, Delete, Get, OperationId, Path, Post, Route } from 'tsoa';
import {
  CreateVisitorBody,
  CreateVisitorResidentBody,
  CreateVisitorResponse,
  DeactiveVisitorResidentBody,
  ShowVisitorResponse,
  WrappedResponse,
} from './visitors_controller.interfaces';
import { BaseController } from './base_controller';
import VisitorRepository from '../repositories/visitors_repository';
import { CustomError } from '../middlewares/error';
import { OBError } from '../utils/error_spec';
import { VisitorService, PassService } from '../services';
import dayjs from 'dayjs';
import ActivityLog from '../utils/activity_log';
import cache from '../libs/cache';
import { DeactivateVisitorPassResponse } from '../libs/tcc_client';

@Route('visitors')
export class VisitorsController extends BaseController {
  @Get('{id}')
  @OperationId('visitors.show')
  public async show(@Path() id: string): Promise<WrappedResponse<ShowVisitorResponse>> {
    const visitor = await VisitorRepository.findFirst({
      where: {
        id,
      },
      include: {
        visitor_schedules: {
          include: {
            passes: true,
          },
        },
      },
    });
    if (!visitor) {
      throw new CustomError(OBError.BMS_VIST_001);
    }
    this.setStatus(200);
    return {
      data: visitor,
    };
  }
  @OperationId('visitors.create')
  @ActivityLog('visitors.create')
  @Post()
  public async create(@Body() body: CreateVisitorBody): Promise<WrappedResponse<CreateVisitorResponse>> {
    const visitorService = new VisitorService();
    const visitor = await visitorService.create(body);

    const durationInMinutes = dayjs(body.visitor_schedule.to).diff(dayjs(body.visitor_schedule.from), 'minutes');
    const recentSchedule = visitor.visitor_schedules[0];

    await new PassService().create({ visitor, schedule: recentSchedule, durationInMinutes });
    await cache.delete(`member_data_${body.inviter_id}_undefined`);

    this.setStatus(200);
    return {
      data: visitor,
    };
  }

  @OperationId('visitors.destroy')
  @ActivityLog('visitors.destroy')
  @Delete('{id}')
  public async destroy(@Path() id: string): Promise<WrappedResponse<null>> {
    try {
      const visitor = await VisitorRepository.findFirst({ where: { id } });
      await VisitorRepository.delete({ where: { id } });
      await cache.delete(`member_data_${visitor?.inviter_id}_undefined`);
      this.setStatus(200);
      return {
        data: null,
      };
    } catch (error) {
      throw new CustomError(OBError.BMS_VIST_003);
    }
  }

  @OperationId('visitors.resident.create')
  @ActivityLog('visitors.resident.create')
  @Post('resident')
  public async createResident(
    @Body() body: CreateVisitorResidentBody,
  ): Promise<WrappedResponse<CreateVisitorResponse>> {
    const visitorService = new VisitorService();
    const visitor = await visitorService.createResident(body);

    const durationInMinutes = dayjs(body.visitor_schedule.to).diff(dayjs(body.visitor_schedule.from), 'minutes');
    const recentSchedule = visitor.visitor_schedules[0];
    const residenceID = body.residence_id;
    const locationID = body.location_id;
    const inviteName = body.invite_name;
    const inviteHouseNumber = body.invite_house_number;
    const inviteZone = body.invite_zone;
    const tenantId = body.tenant_id;
    const projectId = body.project_id;

    const passes = await new PassService().createResident({
      visitor,
      schedule: recentSchedule,
      durationInMinutes,
      residenceID,
      locationID,
      inviteName,
      inviteHouseNumber,
      inviteZone,
      tenantId,
      projectId,
    });
    visitor.inviter_id = passes.data[0].uid as string;

    this.setStatus(200);
    return {
      data: visitor,
    };
  }

  @OperationId('visitors.resident.deactive')
  @ActivityLog('visitors.resident.deactive')
  @Post('resident/deactive')
  public async deactiveResident(
    @Body() body: DeactiveVisitorResidentBody,
  ): Promise<WrappedResponse<DeactivateVisitorPassResponse>> {
    const visitor = await new PassService().deactivateVisitorPass(body);

    this.setStatus(200);
    return visitor;
  }
}
