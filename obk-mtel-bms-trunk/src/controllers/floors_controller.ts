import { Controller, Get, OperationId, Route } from 'tsoa';
import { WrappedArrayResponse } from './base_controller.interfaces';
import { FloorRepository } from '../repositories';
import { floorsSerializer } from './floors_controller.serializer';
import { FloorData } from './floors_controller.interfaces';

@Route('floors')
export class FloorsController extends Controller {
  @Get('')
  @OperationId('floors.index')
  public async index(): Promise<WrappedArrayResponse<FloorData>> {
    const floors = await FloorRepository.findMany();

    const data = floorsSerializer(floors);

    this.setStatus(200);
    return {
      data: data,
    };
  }
}
