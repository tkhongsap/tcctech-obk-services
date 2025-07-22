import { Get, Header, OperationId, Queries, Route } from 'tsoa';
import { BaseController } from '../controllers/base_controller';
import { SensorsIndexQuery, SensorsIndexResponseData, SensorsOutdoorIndexQuery } from './sensors_controller.interfaces';
import { WrappedArrayResponse } from './base_controller.interfaces';
import { SensorService } from '../services';
import { FloorRepository } from '../repositories';
import { map } from 'lodash';
// import cache from '../libs/cache';

@Route('sensors')
export class SensorsController extends BaseController {
  @Get('')
  @OperationId('sensors.index')
  public async index(
    @Queries() query: SensorsIndexQuery,
    @Header('accept-language') language?: string,
  ): Promise<WrappedArrayResponse<SensorsIndexResponseData>> {
    let floorIds: string[] = [];
    if (query.member_id) {
      const floors = await FloorRepository.findMany({
        where: {
          tower_id: query.tower_id,
        },
        include: {
          locations: {
            include: {
              authorized_locations: {
                where: {
                  member_id: query.member_id,
                },
              },
            },
          },
        },
      });
      floorIds = map(floors, (floor) => floor.id);
    }

    let acceptLanguage;

    switch (language) {
      case 'en':
        acceptLanguage = 'en';
        break;
      case 'th':
        acceptLanguage = 'th';
        break;
      case 'cs':
        acceptLanguage = 'cs';
        break;
      default:
        acceptLanguage = 'en';
        break;
    }

    const service = new SensorService();

    const indicator = await service.find({ towerId: query.tower_id, floorIds: floorIds, language: acceptLanguage });

    this.setStatus(200);
    return {
      data: indicator,
    };
  }

  @Get('outdoor')
  @OperationId('sensors.indexoutdoor')
  public async indexOutdoor(
    @Queries() query: SensorsOutdoorIndexQuery,
    @Header('accept-language') language?: string,
  ): Promise<WrappedArrayResponse<SensorsIndexResponseData>> {
    let acceptLanguage;

    switch (language) {
      case 'en':
        acceptLanguage = 'en';
        break;
      case 'th':
        acceptLanguage = 'th';
        break;
      case 'cs':
        acceptLanguage = 'cs';
        break;
      default:
        acceptLanguage = 'en';
        break;
    }

    console.log('Accept127:', acceptLanguage);

    const service = new SensorService();

    const indicator = await service.findOutdoor({
      zone: query.zone,
      language: acceptLanguage,
    });

    this.setStatus(200);
    return {
      data: indicator,
    };
  }
}
