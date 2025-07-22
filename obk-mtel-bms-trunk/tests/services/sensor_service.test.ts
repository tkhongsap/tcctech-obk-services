import { Floor, Tower } from '../../db/client/';
import TCCClient from '../../src/libs/tcc_client';
import { SensorService } from '../../src/services';
import { createTestData } from '../fixtures';
import { resetDB } from '../helpers/db';
import { mockPM25, mockPM10, mockC02, mockTemperature, mockHumidity } from '../fixtures/sensors';
import AirQualityRepository from '../../src/repositories/aqi_repository';
import cache from '../../src/libs/cache';

let tower: Tower;
let floor: Floor;

beforeEach(async () => {
  await resetDB();
  const data = await createTestData();
  tower = data.tower;
  floor = data.floor;
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

describe('SensorService', () => {
  describe('find air quality', () => {
    it('return correct data', async () => {
      jest.spyOn(cache, 'get').mockResolvedValue('mocked');
      jest.spyOn(cache, 'set').mockResolvedValue();
      jest.spyOn(cache, 'getSet').mockResolvedValue('mocked');
      jest
        .spyOn(TCCClient.httpClient, 'get')
        .mockResolvedValueOnce({ data: [mockPM25[0], mockPM10[0], mockC02[0], mockTemperature[0], mockHumidity[0]] });

      const aqi = await AirQualityRepository.findMany({
        include: { air_quality_index_indicator: { include: { air_quality_index_indicator_range: true } } },
      });
      const expectedResult = [
        {
          floors: [
            {
              floor_id: floor.id,
              sensors: [
                {
                  color_code: undefined,
                  indicator: undefined,
                  tower_id: tower.id,
                  floor_id: floor.id,
                  zone_id: 'mock',
                  sensor_type: 'PM2.5',
                  value: '4.728',
                  unit: '',
                  updated_at: '2024-02-20T04:00:01.000Z',
                },
                {
                  color_code: undefined,
                  indicator: undefined,
                  tower_id: tower.id,
                  floor_id: floor.id,
                  zone_id: 'mock',
                  sensor_type: 'PM10',
                  value: '5.168',
                  unit: '',
                  updated_at: '2024-02-20T04:00:01.000Z',
                },
                {
                  color_code: undefined,
                  indicator: undefined,
                  tower_id: tower.id,
                  floor_id: floor.id,
                  zone_id: 'mock',
                  sensor_type: 'CO2',
                  value: '5.168',
                  unit: '',
                  updated_at: '2024-02-20T04:00:01.000Z',
                },
                {
                  color_code: 'code3',
                  indicator: 'slightly cold',
                  tower_id: tower.id,
                  floor_id: floor.id,
                  zone_id: 'mock',
                  sensor_type: 'Temperature',
                  value: '18.494',
                  unit: '',
                  updated_at: '2024-02-20T04:18:01.000Z',
                },
                {
                  color_code: undefined,
                  indicator: undefined,
                  tower_id: tower.id,
                  floor_id: floor.id,
                  zone_id: 'mock',
                  sensor_type: 'Humidity',
                  value: '75.099',
                  unit: '',
                  updated_at: '2024-02-20T04:18:01.000Z',
                },
              ],
            },
          ],
          indicator: aqi,
        },
      ];

      const service = new SensorService();
      const result = await service.find({ towerId: tower.id, floorIds: [floor.id] });

      expect(result).toEqual(expectedResult);
    });
  });
});
