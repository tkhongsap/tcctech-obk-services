import { Controller, Get, OperationId, Route } from 'tsoa';
import { WrappedResponse } from './base_controller.interfaces';
import { TowerRepository } from '../repositories';
import { TowerIndexResponse } from './towers_controller.interfaces';
import { towersSerializer } from './towers_controller.serializer';
import TowerService, { OutdoorZone } from '../services/tower_service';

@Route('towers')
export class TowersController extends Controller {
  @Get('')
  @OperationId('towers.index')
  public async index(): Promise<WrappedResponse<TowerIndexResponse>> {
    const towers = await TowerRepository.findMany({
      include: {
        floors: true,
      },
    });

    const data = towersSerializer(towers);

    this.setStatus(200);
    return {
      data: data,
    };
  }

  @Get('outdoor')
  @OperationId('towers.outdoorindex')
  public async outdoorIndex(): Promise<WrappedResponse<OutdoorZone[]>> {
    const towerService = new TowerService();
    const outdoor = await towerService.index();

    this.setStatus(200);
    return {
      data: outdoor,
    };
  }
}
