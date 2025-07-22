import { Body, Get, OperationId, Path, Post, Put, Queries, Route } from 'tsoa';
import { WrappedArrayResponse, WrappedOneResponse } from './base_controller.interfaces';
import { ServiceRequestRepository } from '../repositories';
import {
  CreateServiceRequestResponse,
  ServiceRequestBody,
  ServiceRequestData,
  ServiceRequestQuery,
  ServiceRequestsUpdateRequestBody,
} from './service_requests_controller.interface';
import { serviceRequestsSerializer, serviceRequestSerializer } from './service_requests_controller.serializer';
import { CustomError } from '../middlewares/error';
import { OBError } from '../utils/error_spec';
import { BaseController } from './base_controller';
import { formatReference } from '../utils/references_code';
import { SR_REFERENCES_LENGTH, SR_REFERENCES_PREFIX } from '../consts/service_request';
import { EventProducer } from '../utils/kafka';
import ActivityLog from '../utils/activity_log';

@Route('service_requests')
export class ServiceRequestsController extends BaseController {
  @Get('')
  @OperationId('service_requests.index')
  public async index(@Queries() query: ServiceRequestQuery): Promise<WrappedArrayResponse<ServiceRequestData>> {
    const _query = this.buildQuery({ ...query }) as object;

    const serviceRequests = await ServiceRequestRepository.findMany({
      ..._query,
      include: ServiceRequestRepository.defaultInclude,
    });

    const data = serviceRequestsSerializer(serviceRequests);

    this.setStatus(200);
    return {
      data: data,
    };
  }

  @Post('')
  @OperationId('service_requests.create')
  @ActivityLog('service_requests.create')
  public async create(@Body() body: ServiceRequestBody): Promise<WrappedOneResponse<CreateServiceRequestResponse>> {
    const serviceRequest = await ServiceRequestRepository.create({
      data: {
        image_url: body.image_url,
        issue_type_id: body.issue_type_id,
        tower_id: body.tower_id,
        floor_id: body.floor_id,
        title: body.title,
        description: body.description,
        requester_id: body.requester_id,
        status: 'submitted',
      },
      include: ServiceRequestRepository.defaultInclude,
    });

    const serializedServiceRequest = serviceRequestSerializer(serviceRequest);

    EventProducer.send({
      name: 'ob-bms.service_request.created',
      payload: {
        data: serializedServiceRequest,
      },
    });

    this.setStatus(200);
    return {
      data: {
        references: formatReference(
          serviceRequest.created_at.toISOString(),
          serviceRequest.references.toString(),
          SR_REFERENCES_LENGTH,
          SR_REFERENCES_PREFIX,
        ),
      },
    };
  }

  @Get('{id}')
  @OperationId('service_requests.show')
  public async show(@Path() id: string): Promise<WrappedOneResponse<ServiceRequestData>> {
    const serviceRequest = await ServiceRequestRepository.findFirst({
      where: { id: id },
      include: ServiceRequestRepository.defaultInclude,
    });

    if (!serviceRequest) {
      throw new CustomError(OBError.BMS_SR_001);
    }

    const data = serviceRequestSerializer(serviceRequest);

    this.setStatus(200);
    return {
      data: data,
    };
  }

  @Put('{id}')
  @OperationId('service_requests.update')
  public async update(
    @Path() id: string,
    @Body() body: ServiceRequestsUpdateRequestBody,
  ): Promise<WrappedOneResponse<ServiceRequestData>> {
    const serviceRequest = await ServiceRequestRepository.update({
      where: { id },
      data: {
        ...body,
      },
      include: ServiceRequestRepository.defaultInclude,
    });

    const data = serviceRequestSerializer(serviceRequest);

    EventProducer.send({
      name: 'ob-bms.service_request_status.updated',
      payload: {
        data: serviceRequest,
      },
    });

    this.setStatus(200);
    return {
      data: data,
    };
  }
}
