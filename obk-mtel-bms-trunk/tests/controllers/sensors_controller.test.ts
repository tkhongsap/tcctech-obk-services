import request from 'supertest';
import app from '../../src/app';
import TCCClient from '../../src/libs/tcc_client';
import { mockC02, mockHumidity, mockPM10, mockPM25, mockTemperature } from '../fixtures';

beforeEach(() => {
  jest.restoreAllMocks;
});

describe('SensorsController', () => {
  describe('GET /sensors', () => {
    it('return 200', async () => {
      jest
        .spyOn(TCCClient.httpClient, 'get')
        .mockResolvedValueOnce({ data: mockPM25 })
        .mockResolvedValueOnce({ data: mockPM10 })
        .mockResolvedValueOnce({ data: mockC02 })
        .mockResolvedValueOnce({ data: mockTemperature })
        .mockResolvedValueOnce({ data: mockHumidity });

      const response = await request(app).get('/sensors').query({ tower_id: 'mock' });

      expect(response.status).toEqual(200);
    });

    it('return 200 with set header language th', async () => {
      jest
        .spyOn(TCCClient.httpClient, 'get')
        .mockResolvedValueOnce({ data: mockPM25 })
        .mockResolvedValueOnce({ data: mockPM10 })
        .mockResolvedValueOnce({ data: mockC02 })
        .mockResolvedValueOnce({ data: mockTemperature })
        .mockResolvedValueOnce({ data: mockHumidity });

      const response = await request(app).get('/sensors').query({ tower_id: 'mock' }).set({ 'accept-language': 'th' });

      expect(response.status).toEqual(200);
    });

    it('return 200 with set header language cs', async () => {
      jest
        .spyOn(TCCClient.httpClient, 'get')
        .mockResolvedValueOnce({ data: mockPM25 })
        .mockResolvedValueOnce({ data: mockPM10 })
        .mockResolvedValueOnce({ data: mockC02 })
        .mockResolvedValueOnce({ data: mockTemperature })
        .mockResolvedValueOnce({ data: mockHumidity });

      const response = await request(app).get('/sensors').query({ tower_id: 'mock' }).set({ 'accept-language': 'cs' });

      expect(response.status).toEqual(200);
    });

    it('return 200', async () => {
      jest
        .spyOn(TCCClient.httpClient, 'get')
        .mockResolvedValueOnce({ data: mockPM25 })
        .mockResolvedValueOnce({ data: mockPM10 })
        .mockResolvedValueOnce({ data: mockC02 })
        .mockResolvedValueOnce({ data: mockTemperature })
        .mockResolvedValueOnce({ data: mockHumidity });

      const response = await request(app).get('/sensors').query({ tower_id: 'mock', member_id: 'mock' });

      expect(response.status).toEqual(200);
    });
  });
});
