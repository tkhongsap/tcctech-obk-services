import axios, { AxiosInstance } from 'axios';
import FSParkingClient from '../libs/fs_parking_client';
import { ParkingLotRepository, ParkingTowerRepository } from '../repositories';
import ParkingFloorRepository from '../repositories/parking_floor_repository';
import SpotTypeRepository from '../repositories/spot_type_repository';
import { map } from 'lodash';
import { parkingSerializer } from '../controllers/parking_lots_controller.serializer';
import { ParkingLotDecorator } from '../decorators/parking_lot_decorator';
import logging from '../utils/logging';

export default class ParkingService {
  public wsClient: AxiosInstance;

  constructor() {
    this.wsClient = axios.create({
      baseURL: process.env.OB_WEB_SOCKET_URL || '',
    });
  }

  public async getParkingAvailabilityData(): Promise<boolean> {
    try {
      const result = await FSParkingClient.getParkingAvailabilityData();
      logging.info('getParkingAvailabilityData data', result.data);

      for (const tower of result.data) {
        const towerUpsertedData = {
          name: tower.name,
          display_name: { en: tower.name, th: tower.name },
          uid: tower.id.toString(),
        };
        const towerResult = await ParkingTowerRepository.upsert({
          create: towerUpsertedData,
          update: towerUpsertedData,
          where: { uid: tower.id.toString() },
        });

        for (const floor of tower.floors) {
          const floorUpsertedData = {
            uid: floor.id.toString(),
            name: floor.name,
            display_name: { en: floor.name, th: floor.name },
            parking_towers: {
              connect: { id: towerResult.id },
            },
          };

          const floorData = await ParkingFloorRepository.findFirst({
            where: { name: floor.name, parking_tower_id: towerResult.id },
          });

          if (floorData && floorData?.uid != floor.id.toString()) {
            await ParkingFloorRepository.delete({ where: { id: floorData?.id } });
          }
          const floorResult = await ParkingFloorRepository.upsert({
            create: floorUpsertedData,
            update: floorUpsertedData,
            where: {
              uid: floor.id.toString(),
            },
          });

          for (const zone of floor.zones) {
            const zoneUpsertedData = {
              uid: zone.id.toString(),
              name: zone.name,
              display_name: { en: zone.name, th: zone.name },
              parking_floors: {
                connect: { id: floorResult.id },
              },
              total_spots: zone.totalSpot,
            };

            const zoneResult = await ParkingLotRepository.upsert({
              create: zoneUpsertedData,
              update: zoneUpsertedData,
              where: {
                uid: zone.id.toString(),
              },
            });

            for (const spotType of zone.types) {
              const spotTypeUpsertedData = {
                name: spotType.name,
                display_name: { en: spotType.name, th: spotType.name },
                available_spots: spotType.availableSpot,
                parking_lot: {
                  connect: {
                    id: zoneResult.id,
                  },
                },
                total_spots: spotType.totalSpot,
              };
              await SpotTypeRepository.upsert({
                create: spotTypeUpsertedData,
                update: spotTypeUpsertedData,
                where: {
                  name_parking_lot_id: {
                    name: spotType.name,
                    parking_lot_id: zoneResult.id,
                  },
                },
              });
            }
          }
        }
      }

      const parkingFloors = await ParkingFloorRepository.findMany({
        include: {
          parking_lots: {
            include: {
              spot_types: true,
            },
            orderBy: {
              name: 'asc',
            },
          },
        },
      });
      const decoratedParkingLots = new ParkingLotDecorator(parkingFloors, { withTotalAvailableSpots: true }).decorate();
      const serializedParkingLots = map(decoratedParkingLots, parkingSerializer);

      const response = await this.wsClient.post('broadcast/all', {
        data: {
          type: 'parking_availability.updated',
          data: serializedParkingLots,
        },
      });

      logging.info(response.data);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
