import { ACRequestRepository, ACZoneRepository } from '../repositories';
import {
  ACRequestBody,
  ACRequestQuery,
  ACRequestResponse,
  ACRequestUpdateBody,
  CreateACRequestResponse,
} from './ac_requests_controller.interfaces';
import { BaseController } from './base_controller';
import { WrappedArrayResponse, WrappedOneResponse } from './base_controller.interfaces';
import { Body, Get, OperationId, Path, Post, Put, Queries, Route } from 'tsoa';
import { dayjs } from '../libs/dayjs';
import { CustomError } from '../middlewares/error';
import { OBError } from '../utils/error_spec';
import { MINIMUM_ESTIMATED_COST } from '../consts';
import { acRequestShowSerializer, acRequestsSerializer } from './ac_requests_controller.serializer';
import { EventProducer } from '../utils/kafka';
import { formatReference } from '../utils/references_code';
import { AC_REFERENCES_LENGTH, AC_REFERENCES_PREFIX } from '../consts/ac_requests';
import { isEmpty } from 'lodash';
import { Prisma } from '../../db/client';
import ActivityLog from '../utils/activity_log';

@Route('ac_request')
export class ACRequestsController extends BaseController {
  @Post('')
  @OperationId('ac_request.create')
  @ActivityLog('ac_request.create')
  public async create(@Body() body: ACRequestBody): Promise<WrappedOneResponse<CreateACRequestResponse>> {
    try {
      const { ac_zone_id, floor_id, tower_id, requester_id, date, duration } = body;

      const acZones = await ACZoneRepository.findMany({
        where: {
          id: { in: ac_zone_id },
        },
      });

      if (isEmpty(acZones)) {
        throw new CustomError(OBError.BMS_ACR_002);
      }

      // Calculate estimated cost and total area size
      let estimated_cost = 0;
      let total_area_size = 0;
      acZones.forEach((acZone) => {
        estimated_cost += duration * acZone.area_size * +acZone.rate;
        total_area_size += acZone.area_size;
      });

      if (estimated_cost <= MINIMUM_ESTIMATED_COST) {
        estimated_cost = MINIMUM_ESTIMATED_COST;
      }

      estimated_cost = Math.ceil(estimated_cost * 100) / 100;

      const dateTime = dayjs(date);
      const endTime = dateTime.add(duration, 'hour').toISOString();

      const acRequest = await ACRequestRepository.create({
        data: {
          tower_id,
          floor_id,
          estimated_cost: estimated_cost,
          total_area_size,
          from: date,
          to: endTime,
          duration_hour: duration,
          requester_id,
          status: 'submitted',
          ac_request_zones: {
            create: acZones.map((acZone) => ({
              ac_zone_id: acZone.id,
              rate: acZone.rate,
              area_size: acZone.area_size,
            })),
          },
        },
        include: ACRequestRepository.defaultInclude,
      });

      const serializedACRequest = acRequestShowSerializer(acRequest);

      EventProducer.send({
        name: 'ob-bms.air_condition_request.created',
        payload: {
          data: serializedACRequest,
        },
      });

      this.setStatus(200);

      return {
        data: {
          references: formatReference(
            acRequest.created_at.toISOString(),
            acRequest.references.toString(),
            AC_REFERENCES_LENGTH,
            AC_REFERENCES_PREFIX,
          ),
        },
      };
    } catch (error) {
      throw new CustomError(OBError.BMS_ACR_002);
    }
  }

  @Get('')
  @OperationId('ac_request.index')
  public async index(@Queries() query?: ACRequestQuery): Promise<WrappedArrayResponse<ACRequestResponse>> {
    const _query = this.buildQuery<Prisma.ACRequestFindManyArgs>({ ...query });

    const acRequests = await ACRequestRepository.findMany({
      ..._query,
      include: ACRequestRepository.defaultInclude,
    });

    const data = acRequestsSerializer(acRequests);
    this.setStatus(200);
    return { data: data };
  }

  @Get('{id}')
  @OperationId('ac_request.show')
  public async show(@Path() id: string): Promise<WrappedOneResponse<ACRequestResponse>> {
    const acRequest = await ACRequestRepository.findFirst({
      where: { id },
      include: ACRequestRepository.defaultInclude,
    });

    if (!acRequest) throw new CustomError(OBError.BMS_ACR_001);

    const data = acRequestShowSerializer(acRequest);
    this.setStatus(200);
    return { data: data };
  }

  @Put('{id}')
  @OperationId('ac_request.update')
  public async update(
    @Path() id: string,
    @Body() body: ACRequestUpdateBody,
  ): Promise<WrappedOneResponse<ACRequestResponse>> {
    const acRequest = await ACRequestRepository.update({
      where: { id },
      data: { ...body },
      include: ACRequestRepository.defaultInclude,
    });

    const data = acRequestShowSerializer(acRequest);

    EventProducer.send({
      name: 'ob-bms.air_condition_status.updated',
      payload: {
        data: acRequest,
      },
    });

    this.setStatus(200);

    return { data: data };
  }
}
