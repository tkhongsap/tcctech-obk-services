import { filter, find, first, get, inRange, isNull, isUndefined, map } from 'lodash';
import { AirQualityIndex, SensorData, SensorIndicatorData } from '../controllers/sensors_controller.interfaces';
import TCCClient, { AirQualityFeedData, SensorType } from '../libs/tcc_client';
import cache from '../libs/cache';
import { dayjs } from '../libs/dayjs';
import { TowerRepository } from '../repositories';
import AirQualityRepository from '../repositories/aqi_repository';
import { Prisma } from '../../db/client';

type SensorServiceFindInput = {
  towerId: string;
  floorIds: string[];
  types?: SensorType[];
  language?: string;
};

type SensorServiceOutdoorFindInput = {
  types?: SensorType[];
  zone: string;
  language?: string;
};

export default class SensorService {
  public async find(input: SensorServiceFindInput): Promise<SensorIndicatorData[]> {
    await cache.getSet('TCC_ACCESS_TOKEN', async () => {
      const response = await TCCClient.getOauth2Token();
      return response.data.access_token;
    });

    const tower = await TowerRepository.findFirst({
      where: {
        id: input.towerId,
      },
      include: {
        floors: true,
      },
    });

    const aqBuildingId = get(tower?.mapping, 'aq.uid', '');
    const arggreatedData: SensorData[] = [];
    const aqResponse = await TCCClient.getAllAirQualityFeed(aqBuildingId);
    const aqiIndicator = await AirQualityRepository.findMany({
      include: {
        air_quality_index_indicator: {
          include: {
            air_quality_index_indicator_range: {
              orderBy: { sequence: 'asc' },
            },
          },
          orderBy: { sequence: 'asc' },
        },
      },
      orderBy: { sequence: 'asc' },
    });
    const data = aqResponse.data as AirQualityFeedData[];
    for (const _data of data) {
      let updatedAt: string = '';
      let value: string = '';
      const sensorType: string = _data.channel;

      const targetData = first(_data.data);
      if (targetData) {
        updatedAt = dayjs.tz(targetData.timestamp, _data.timezone).toISOString();
        value = targetData.value.toString();
      }

      const floor = tower?.floors.find((floor) => get(floor.mapping, 'aq.uid') === _data.floorCode);

      const indicator = find(aqiIndicator, { name: sensorType });
      let indicatorLevel;
      if (!isUndefined(indicator)) {
        indicatorLevel = await this.findIndicatorLevel(
          {
            tower_id: input.towerId,
            floor_id: floor?.id,
            zone_id: 'mock',
            sensor_type: sensorType,
            value,
            unit: '',
            updated_at: updatedAt,
          } as SensorData,
          indicator.air_quality_index_indicator,
          input.language || 'en',
        );
      }

      arggreatedData.push({
        tower_id: input.towerId,
        floor_id: floor?.id,
        zone_id: 'mock',
        sensor_type: sensorType,
        value,
        unit: '',
        indicator: indicatorLevel?.title,
        color_code: indicatorLevel?.colorCode,
        updated_at: updatedAt,
      } as SensorData);
    }

    const floorData = map(input.floorIds, (floorId) => {
      return {
        floor_id: floorId,
        sensors: filter(arggreatedData, { floor_id: floorId }),
      };
    });

    return [{ floors: floorData, indicator: aqiIndicator as AirQualityIndex[] }];
  }

  public async findOutdoor(input: SensorServiceOutdoorFindInput): Promise<SensorIndicatorData[]> {
    await cache.getSet('TCC_ACCESS_TOKEN', async () => {
      const response = await TCCClient.getOauth2Token();
      return response.data.access_token;
    });

    const arggreatedData: SensorData[] = [];

    const aqResponse = await TCCClient.getAllAirQualityFeed('OUT');
    const aqiIndicator = await AirQualityRepository.findMany({
      where: {
        name: { not: 'TVOC' },
      },
      include: {
        air_quality_index_indicator: {
          include: {
            air_quality_index_indicator_range: {
              orderBy: {
                sequence: 'asc',
              },
            },
          },
          orderBy: {
            sequence: 'asc',
          },
        },
      },
      orderBy: {
        sequence: 'asc',
      },
    });
    const data = aqResponse.data as AirQualityFeedData[];
    const floorIds = data.map((x) => x.floorCode);
    for (const _data of data.filter((x) => x.zone.toUpperCase().replace(/ /g, '_') === input.zone)) {
      let updatedAt: string = '';
      let value: string = '';
      const sensorType: string = _data.channel;

      const targetData = first(_data.data);
      if (targetData) {
        updatedAt = dayjs.tz(targetData.timestamp, _data.timezone).toISOString();
        value = targetData.value.toString();
      }

      const indicator = find(aqiIndicator, { name: sensorType });
      let indicatorLevel;
      if (!isUndefined(indicator)) {
        indicatorLevel = await this.findIndicatorLevel(
          {
            tower_id: 'OUT',
            floor_id: _data.floorCode,
            zone_id: _data.zone,
            sensor_type: sensorType,
            value,
            unit: '',
            updated_at: updatedAt,
          } as SensorData,
          indicator.air_quality_index_indicator,
          input.language || 'en',
        );
      }

      arggreatedData.push({
        tower_id: 'OUT',
        floor_id: _data.floorCode,
        zone_id: _data.zone,
        sensor_type: sensorType,
        value,
        unit: '',
        indicator: indicatorLevel?.title,
        color_code: indicatorLevel?.colorCode,
        updated_at: updatedAt,
      } as SensorData);
    }

    const floorData = map(floorIds, (floorId) => {
      return {
        floor_id: floorId,
        sensors: filter(arggreatedData, { floor_id: floorId }),
      };
    });

    return [{ floors: floorData, indicator: aqiIndicator as AirQualityIndex[] }];
  }

  public async findIndicatorLevel(
    sensor: SensorData,
    indicators: Prisma.AirQualityIndexIndicatorGetPayload<{ include: { air_quality_index_indicator_range: true } }>[],
    language: string,
  ): Promise<{ title: string; colorCode: string }> {
    const sensorValue = parseFloat(sensor.value);

    for (const indicator of indicators) {
      const expectedRange = find(indicator.air_quality_index_indicator_range, (range) => {
        const minValue = range.min_value;
        const maxValue = range.max_value;
        if (!isNull(minValue) && !isNull(maxValue)) {
          return inRange(sensorValue, minValue, maxValue);
        } else if (!isNull(maxValue)) {
          return sensorValue < maxValue;
        } else if (!isNull(minValue)) {
          return sensorValue > minValue;
        }
      });

      if (expectedRange) {
        const title = get(expectedRange, ['title', language], '');
        return { title, colorCode: indicator.color_code };
      }
    }

    return { title: '', colorCode: '' };
  }
}
