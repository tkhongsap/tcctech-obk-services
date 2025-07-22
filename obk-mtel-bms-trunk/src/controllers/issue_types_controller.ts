import { Body, Controller, Get, OperationId, Path, Post, Put, Route } from 'tsoa';
import { issueTypeSerializer, issueTypsSerializer } from './issue_types_controller.serializer';
import { IssueTypeData, IssueTypeRequest, IssueTypeUpdate } from './issue_types_controller.interface';
import { IssueTypeRepository } from '../repositories';
import { WrappedOneResponse } from './base_controller.interfaces';
import { WrappedArrayResponse } from './base_controller.interfaces';
import { CustomError } from '../middlewares/error';
import { OBError } from '../utils/error_spec';

@Route('issue_types')
export class IssueTypesController extends Controller {
  @Get('')
  @OperationId('issue_types.index')
  public async index(): Promise<WrappedArrayResponse<IssueTypeData>> {
    const issueTypes = await IssueTypeRepository.findMany({ where: { deleted_at: { equals: null } } });

    const data = issueTypsSerializer(issueTypes);

    this.setStatus(200);
    return {
      data: data,
    };
  }

  @Post('')
  @OperationId('issue_types.create')
  public async create(@Body() body: IssueTypeRequest): Promise<WrappedOneResponse<IssueTypeData>> {
    const issueTypes = await IssueTypeRepository.create({
      data: { name: body.name, display_name: body.display_name, internal_remark: body.internal_remark },
    });
    const data = issueTypeSerializer(issueTypes);

    this.setStatus(200);
    return {
      data: data,
    };
  }
  @Put('{id}')
  @OperationId('issue_types.update')
  public async update(@Path() id: string, @Body() body: IssueTypeUpdate): Promise<WrappedOneResponse<IssueTypeData>> {
    const issueTypes = await IssueTypeRepository.update({ where: { id }, data: { ...body } });

    const data = issueTypeSerializer(issueTypes);

    this.setStatus(200);
    return {
      data: data,
    };
  }
  @Get('{id}')
  @OperationId('issue_types.show')
  public async show(@Path() id: string): Promise<WrappedOneResponse<IssueTypeData>> {
    const issueType = await IssueTypeRepository.findFirst({ where: { id } });

    if (!issueType) {
      throw new CustomError(OBError.BMS_IST_001);
    }
    const data = issueTypeSerializer(issueType);

    this.setStatus(200);
    return {
      data: data,
    };
  }
}
