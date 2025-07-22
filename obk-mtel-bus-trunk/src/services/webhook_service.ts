import axios, { AxiosInstance } from 'axios';
import { WebhookCreateBody, shuttleBusPayload } from '../controllers/integrations/montri/webhook_controller_interface';
import { ShuttleBusPositionsRepository, ShuttleBusesRepository } from '../repositories';
import { WEBHOOK_TYPE } from './constants/webhook_type';
import logging from '../utils/logging';
import { BusPosition, Coordinate, Destination } from './webhook_service_interface';
import AreasRepository from '../repositories/areas_repository';
import ShuttleBusMappingDetailsRepository from '../repositories/shuttle_bus_mapping_details_repository';
import { get } from 'lodash';
import DestinationsRepository from '../repositories/destinations_repository';
import { shuttleBusSerializer } from '../controllers/shuttle_bus_controller.serializer';
import { CustomError } from '../middlewares/error';
import { OBError } from '../utils/error_spec';

export default class WebhookService {
  public googleMapClient: AxiosInstance;
  public wsClient: AxiosInstance;

  constructor() {
    this.googleMapClient = axios.create({
      baseURL: process.env.GOOGLEMAP_API_URL || '',
    });
    this.wsClient = axios.create({
      baseURL: process.env.OB_WEB_SOCKET_URL || '',
    });
  }

  public async handle(body: WebhookCreateBody): Promise<void> {
    switch (body.action) {
      case WEBHOOK_TYPE.SHUTTLE_BUS_POSITION_UPDATED:
        await this.shuttleBusUpdated(body);
        break;
      default:
        throw new CustomError(OBError.BUS_INT_001);
        break;
    }
  }

  private async shuttleBusUpdated(body: WebhookCreateBody): Promise<void> {
    try {
      logging.info('start updated shuttle bus position');
      const payload: shuttleBusPayload = body.payload as shuttleBusPayload;
      const shuttleBus = await ShuttleBusesRepository.upsert({
        create: { vehicle_id: payload.imei_id, vehicle_name: '' },
        update: {},
        where: {
          vehicle_id: payload.imei_id,
        },
      });

      const busPositionResult = await ShuttleBusPositionsRepository.create({
        data: {
          shuttle_bus_id: shuttleBus.id,
          latitude: payload.latitude.toString(),
          longitude: payload.longitude.toString(),
          course: payload.course.toString(),
          meta: JSON.parse(JSON.stringify(payload)),
        },
      });

      const busPosition = {
        id: busPositionResult.id,
        shuttleBusId: shuttleBus.id,
        coordinate: {
          latitude: payload.latitude.toString(),
          longitude: payload.longitude.toString(),
        },
        course: payload.course.toString(),
      };
      logging.info('#obBus busPosition : ', busPosition);
      const destinationDetail = await this.calculateAreaAndDestination(busPosition);
      logging.info('#obBus destinationDetail : ', destinationDetail);
      const origins = `${payload.latitude},${payload.longitude}`;
      logging.info('#obBus origins : ', origins);
      const destinations = `${destinationDetail.latitude},${destinationDetail.longitude}`;
      logging.info('#obBus destinations : ', destinations);

      const durationResponse = await this.googleMapClient.get('', {
        params: {
          origins,
          destinations,
          key: process.env.GOOGLE_API_KEY,
          departure_time: 'now',
        },
      });
      logging.info('#obBus durationResponse : ', durationResponse.data);
      if (durationResponse.data.rows.length === 0) {
        throw new CustomError(OBError.BUS_GOG_001);
      }

      const durationDetails = durationResponse.data.rows[0].elements[0];
      logging.info('#obBus durationDetails : ', durationResponse.data);

      const distance = get(durationDetails, ['distance'], {});
      const duration = get(durationDetails, ['duration'], {});
      const durationInTraffic = get(durationDetails, ['duration_in_traffic'], {});

      await ShuttleBusPositionsRepository.update({ 
        data: {
          processes: true
        }, 
        where: {
          id: busPosition.id
        }
      })

      await ShuttleBusMappingDetailsRepository.upsert({
        create: {
          shuttle_bus_id: shuttleBus.id!,
          destination_id: destinationDetail.id!,
          distance: distance,
          duration: duration,
          duration_in_traffic: durationInTraffic,
          latitude: busPosition.coordinate.latitude,
          longitude: busPosition.coordinate.longitude,
          course: busPosition.course
        },
        update: {
          destination_id: destinationDetail.id!,
          distance: distance,
          duration: duration,
          duration_in_traffic: durationInTraffic,
          latitude: busPosition.coordinate.latitude,
          longitude: busPosition.coordinate.longitude,
          course: busPosition.course
        },
        where: {
          shuttle_bus_id: shuttleBus.id,
        },
      });

      const stations = await DestinationsRepository.findMany({
        include: {
          shuttle_bus_mapping_details: {
            include: {
              shuttle_buses: true,
            }
          },
          time_tables: { orderBy: { time: 'asc' } },
          destination_flags: true,
        },
      });

      const shuttleBusSerializerRequest = shuttleBusSerializer(stations);
      try {
        logging.info('#obBus start send message to websocket');

        await this.wsClient.post('broadcast/all', {
          data: {
            type: 'shuttle_bus_position.updated',
            data: shuttleBusSerializerRequest,
          },
        });
      } catch (error) {
        logging.error('#obBus fail to send message to websocket');
      }
    } catch (error) {
      logging.error('#obBus fail update shuttle bus position : ', error);
    }
  }

  private isPointInArea(point: Coordinate, topLeft: Coordinate, bottomRight: Coordinate): boolean {
    return (
      parseFloat(point.latitude) <= parseFloat(topLeft.latitude) &&
      parseFloat(point.latitude) >= parseFloat(bottomRight.latitude) &&
      parseFloat(point.longitude) >= parseFloat(topLeft.longitude) &&
      parseFloat(point.longitude) <= parseFloat(bottomRight.longitude)
    );
  }

  private async calculateAreaAndDestination(busPosition: BusPosition): Promise<Destination> {
    const areas = await AreasRepository.findMany({
      include: {
        destination_criteria: {
          include: {
            destinations: true,
          },
        },
      },
      where: {
        status: true,
      },
    });

    const areaResult = areas.find((area) => {
      const topLeft = {
        latitude: area.top_left_latitude,
        longitude: area.top_left_longitude,
      };
      const bottomRight = {
        latitude: area.bottom_right_latitude,
        longitude: area.bottom_right_longitude,
      };
      const result = this.isPointInArea(busPosition.coordinate, topLeft, bottomRight);
      if (result) {
        return area;
      }
    });

    if (!areaResult) {
      const result = await ShuttleBusMappingDetailsRepository.findFirst({
        where: { shuttle_bus_id: busPosition.shuttleBusId },
      });
      if (result) {
        await ShuttleBusMappingDetailsRepository.delete({ where: { shuttle_bus_id: busPosition.shuttleBusId } });
      }
      throw new CustomError(OBError.BUS_ARE_001);
    }

    const destination = areaResult.destination_criteria.find((destination_criteria) => {
      if (
        parseFloat(busPosition.course) >= parseFloat(destination_criteria.min_angle) &&
        parseFloat(busPosition.course) <= parseFloat(destination_criteria.max_angle)
      ) {
        return destination_criteria;
      }
    });

    if (!destination) {
      throw new CustomError(OBError.BUS_DES_001);
    }

    return destination.destinations;
  }
}
