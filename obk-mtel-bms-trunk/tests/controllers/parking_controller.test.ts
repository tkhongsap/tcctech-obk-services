import app from '../../src/app';
import request from 'supertest';

import { resetDB } from '../helpers/db';
import { createTestData } from '../fixtures';
import { ParkingService } from '../../src/services';
import FSParkingClient from '../../src/libs/fs_parking_client';

const headers: { [key: string]: string } = {};
const parkingService = new ParkingService();

beforeEach(async () => {
  headers['x-permissions'] =
    'eyJwZXJtaXNzaW9uIjogWyAgeyAidmFsdWUiOiB7InJlc291cmNlX3R5cGUiOiAiZnMiLCAiYWN0aW9ucyI6IFsiKiJdIH0gfV19';

  await resetDB();
  await createTestData();
});

describe('ParkingController', () => {
  describe('GET /integrations/fs/parking', () => {
    it('should return 200 OK', async () => {
      jest.spyOn(FSParkingClient.httpClient, 'get').mockResolvedValueOnce({
        data: [
          {
            id: 4,
            createdAt: '2024-01-28T07:06:54.446Z',
            updatedAt: '2024-01-28T07:06:54.446Z',
            deletedAt: null,
            name: 'Building 1',
            floors: [
              {
                id: 197495,
                createdAt: '2024-01-28T07:06:54.990Z',
                updatedAt: '2024-01-28T07:06:54.990Z',
                deletedAt: null,
                name: 'G',
                buildingId: 4,
                zones: [
                  {
                    id: 20,
                    createdAt: '2024-01-28T07:06:54.990Z',
                    updatedAt: '2024-01-28T07:06:54.990Z',
                    deletedAt: null,
                    name: 'P1',
                    floorId: 197495,
                    totalSpot: 30,
                    availableSpot: 26,
                    unavailableSpot: 28,
                    reserveSpot: -24,
                    types: [
                      { name: 'VIP1', totalSpot: 37, availableSpot: 51, unavailableSpot: 6, reserveSpot: -20 },
                      { name: 'VIP2', totalSpot: 26, availableSpot: 3, unavailableSpot: 58, reserveSpot: -35 },
                      { name: 'VIP3', totalSpot: 92, availableSpot: 11, unavailableSpot: 38, reserveSpot: 43 },
                      { name: 'HADICAP', totalSpot: 77, availableSpot: 81, unavailableSpot: 9, reserveSpot: -13 },
                      { name: 'LAY', totalSpot: 24, availableSpot: 79, unavailableSpot: 48, reserveSpot: -103 },
                    ],
                  },
                  {
                    id: 22,
                    createdAt: '2024-01-28T07:06:54.990Z',
                    updatedAt: '2024-01-28T07:06:54.990Z',
                    deletedAt: null,
                    name: 'P2',
                    floorId: 197495,
                    totalSpot: 82,
                    availableSpot: 74,
                    unavailableSpot: 78,
                    reserveSpot: -70,
                    types: [
                      { name: 'VIP1', totalSpot: 37, availableSpot: 20, unavailableSpot: 4, reserveSpot: 13 },
                      { name: 'VIP2', totalSpot: 32, availableSpot: 96, unavailableSpot: 71, reserveSpot: -135 },
                      { name: 'VIP3', totalSpot: 62, availableSpot: 78, unavailableSpot: 50, reserveSpot: -66 },
                      { name: 'HADICAP', totalSpot: 75, availableSpot: 39, unavailableSpot: 34, reserveSpot: 2 },
                      { name: 'LAY', totalSpot: 52, availableSpot: 92, unavailableSpot: 83, reserveSpot: -123 },
                    ],
                  },
                  {
                    id: 25,
                    createdAt: '2024-01-28T07:06:54.990Z',
                    updatedAt: '2024-01-28T07:06:54.990Z',
                    deletedAt: null,
                    name: 'P3',
                    floorId: 197495,
                    totalSpot: 92,
                    availableSpot: 73,
                    unavailableSpot: 69,
                    reserveSpot: -50,
                    types: [
                      { name: 'VIP1', totalSpot: 18, availableSpot: 56, unavailableSpot: 53, reserveSpot: -91 },
                      { name: 'VIP2', totalSpot: 97, availableSpot: 89, unavailableSpot: 34, reserveSpot: -26 },
                      { name: 'VIP3', totalSpot: 48, availableSpot: 19, unavailableSpot: 89, reserveSpot: -60 },
                      { name: 'HADICAP', totalSpot: 87, availableSpot: 10, unavailableSpot: 29, reserveSpot: 48 },
                      { name: 'LAY', totalSpot: 94, availableSpot: 74, unavailableSpot: 65, reserveSpot: -45 },
                    ],
                  },
                  {
                    id: 28,
                    createdAt: '2024-01-28T07:06:54.990Z',
                    updatedAt: '2024-01-28T07:06:54.990Z',
                    deletedAt: null,
                    name: 'P4',
                    floorId: 197495,
                    totalSpot: 81,
                    availableSpot: 86,
                    unavailableSpot: 3,
                    reserveSpot: -8,
                    types: [
                      { name: 'VIP1', totalSpot: 100, availableSpot: 44, unavailableSpot: 59, reserveSpot: -3 },
                      { name: 'VIP2', totalSpot: 7, availableSpot: 74, unavailableSpot: 51, reserveSpot: -118 },
                      { name: 'VIP3', totalSpot: 30, availableSpot: 52, unavailableSpot: 60, reserveSpot: -82 },
                      { name: 'HADICAP', totalSpot: 81, availableSpot: 55, unavailableSpot: 22, reserveSpot: 4 },
                      { name: 'LAY', totalSpot: 71, availableSpot: 24, unavailableSpot: 40, reserveSpot: 7 },
                    ],
                  },
                  {
                    id: 30,
                    createdAt: '2024-01-28T07:06:54.990Z',
                    updatedAt: '2024-01-28T07:06:54.990Z',
                    deletedAt: null,
                    name: 'P5',
                    floorId: 197495,
                    totalSpot: 61,
                    availableSpot: 41,
                    unavailableSpot: 9,
                    reserveSpot: 11,
                    types: [
                      { name: 'VIP1', totalSpot: 53, availableSpot: 77, unavailableSpot: 28, reserveSpot: -52 },
                      { name: 'VIP2', totalSpot: 94, availableSpot: 75, unavailableSpot: 87, reserveSpot: -68 },
                      { name: 'VIP3', totalSpot: 23, availableSpot: 14, unavailableSpot: 97, reserveSpot: -88 },
                      { name: 'HADICAP', totalSpot: 71, availableSpot: 59, unavailableSpot: 9, reserveSpot: 3 },
                      { name: 'LAY', totalSpot: 68, availableSpot: 13, unavailableSpot: 23, reserveSpot: 32 },
                    ],
                  },
                  {
                    id: 31,
                    createdAt: '2024-01-28T07:06:54.990Z',
                    updatedAt: '2024-01-28T07:06:54.990Z',
                    deletedAt: null,
                    name: 'P6',
                    floorId: 197495,
                    totalSpot: 34,
                    availableSpot: 8,
                    unavailableSpot: 25,
                    reserveSpot: 1,
                    types: [
                      { name: 'VIP1', totalSpot: 85, availableSpot: 35, unavailableSpot: 51, reserveSpot: -1 },
                      { name: 'VIP2', totalSpot: 57, availableSpot: 86, unavailableSpot: 88, reserveSpot: -117 },
                      { name: 'VIP3', totalSpot: 4, availableSpot: 59, unavailableSpot: 58, reserveSpot: -113 },
                      { name: 'HADICAP', totalSpot: 78, availableSpot: 48, unavailableSpot: 7, reserveSpot: 23 },
                      { name: 'LAY', totalSpot: 98, availableSpot: 70, unavailableSpot: 24, reserveSpot: 4 },
                    ],
                  },
                ],
                totalSpot: 67,
                availableSpot: 63,
                unavailableSpot: 60,
                reserveSpot: -56,
              },
            ],
            totalSpot: 56,
            availableSpot: 14,
            unavailableSpot: 46,
            reserveSpot: -4,
          },
        ],
      });

      jest.spyOn(parkingService.wsClient, 'post').mockResolvedValueOnce({});
      const response = await request(app).get('/integrations/fs/parking').set(headers);
      expect(response.status).toBe(200);
    });
  });
});
