import { AxiosHeaders } from 'axios';
import TCCClient from '../../src/libs/tcc_client';
let spy: any;

afterEach(() => {
  spy && spy.mockRestore();
});

beforeEach(() => [jest.restoreAllMocks()]);

export const updateTransactionParkingResponse = {
  message: 'Successfully!',
  status: 0,
  data: {
    logId: '2025020415190100145',
    uid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    appId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    algType: 'VisitorToApp',
  },
};

export const parkingQueryResponse = {
  msg: 'success!',
  code: '0',
  data: {
    total: 1,
    pageNo: 1,
    pageSize: 10,
    totalPage: 1,
    list: [
      {
        recordSyscode: '1',
        spaceSyscode: '1',
        spaceNo: '1',
        spacePicUri: 'image.url',
        parkingTime: '2024-01-05T01:57:38.000Z',
        parkSyscode: '1',
        parkName: 'park',
        floorSyscode: '1',
        floorName: 'floor',
        plateNoPicUri: 'image.url',
        aswSyscode: '1',
        plateNo: '0000000',
        spacePicUrl: 'image.url',
        plateNoPicUrl: 'image.url',
        spacePicBinary: 'image',
        ibeaconIpcUuid: 'uuid',
        ibeaconIpcMajor: 'major',
        ibeaconIpcMinor: 'minor',
      },
    ],
  },
};

export const parkingSpaceNoResponse = [
  {
    _id: '1',
    spaceSyscode: '1',
    __v: 0,
    alarmPlateNos: null,
    aswSyscode: null,
    floorName: 'B4',
    floorSyscode: '1',
    getTime: 1726217951976,
    ibeaconIpcMajor: null,
    ibeaconIpcMinor: null,
    ibeaconIpcUuid: null,
    latitude: '13.7841676500015',
    longitude: '100.751306737775',
    parkName: 'One Bangkok',
    parkSyscode: '1',
    parkingTime: '1',
    parkingTimeUTC: 1726195950000,
    plateNo: null,
    plateNoPicUri: null,
    plateNoPicUrl: null,
    plateNos: null,
    spaceNo: '1',
    spacePicUri: null,
    spacePicUrl: null,
    spaceType: 'Common Parking Space',
    spaceTypeKey: '0',
    state: 0,
    zoneId: '1',
    zoneName: 'A',
    carblockerDevice: {
      _id: '1',
      device_id: '1',
      status: 1,
      rssi: -67,
      time: '2024-09-13T08:33:12.153Z',
      createdAt: '2024-09-13T08:33:12.154Z',
      updatedAt: '2024-09-13T08:33:12.154Z',
    },
  },
];

export const getParkingDetailByPersonIDResponse = {
  message: 'Success!',
  status: 0,
  data: [
    {
      status: 'Success',
      message: 'คำนวณเรียบร้อยแล้ว ไม่มีการจ่ายเงินที่ตู้ KISOK หรือ จ่ายเงินทางระบบ ONLINE เข้ามา',
      exeption: null,
      logId: '2024010912303301',
      ticketNo: 'E0D53E98-AED2-4F70-826C-A10661A39F86',
      ticketUid: 'E0D53E98-AED2-4F70-826C-A10661A39F86',
      plateNo: ' 0000000',
      entryDateTime: '2024-01-05 08:57:38',
      logDateTime: '2024-02-05 15:09:52',
      exitStatus: 0,
      terminalInId: 3,
      terminalInName: 'ENT03',
      memberTypeId: 0,
      memberTypeName: 'VISITOR',
      vehicleTypeId: 1,
      vehicleTypeName: 'MOTORCYCLE',
      rateCode: '0',
      rateDetailTH: 'สิทธิจอดรถฟรี 30 นาทีแรก.,ส่วนเกินคิดชั่วโมงละ 30 บาท',
      rateDetailEN: 'Free 30 Minute.,After 30 Baht/Hour',
      tenantId: '0',
      tenantName: 'ไม่ระบุผู้เช่า',
      isCardLost: false,
      parkHH: 750,
      parkMM: 12,
      rateHH: 751,
      freeHH: 0,
      subTotal: 22530,
      discount: 30,
      parkFee: 22500,
      cardLostFine: 0,
      overNightFine: 0,
      total: 22500,
      isInv: false,
      invRateHH: 0,
      invFee: 0,
      isPayAtKiosk: false,
      lastDateTimePaymentAtKiosk: null,
      payAtKioskAll: 0,
      durationInMinute: 30,
      timeUsedInMinute: 0,
      remainInMinute: 0,
    },
  ],
  count: 0,
};

export const mockOauth2Token = {
  status: 200,
  headers: {},
  statusText: '',
  config: { headers: new AxiosHeaders() },
  data: { token_type: 'Bearer', access_token: '2215012i093921', expires_in: 99999 },
};

describe('TCCClient', () => {
  describe('when token is invalid', () => {
    it('it calls getOauth2Token and setToken', async () => {
      // TODO
    });
  });
  describe('getAirQualityFeed', () => {
    it('it return data', async () => {
      const expectedData = [
        {
          siteid: 'Air Quality Sensor',
          deviceName: 'CUP Fl. L2 Facility Management Manager Room 2 AQS',
          channelDescription: 'Co2',
          offset: 0,
          cal: 1,
          labelName: 'Ready for Service',
          labelColor: '#337ab7',
          netid: 'CUP-L2-AQS-48',
          chid: 3,
          tag: 'CUP-L2-Z02-AQS-048',
          unit: 'PPM',
          sensorType: 'Part Per Million',
          id: '650aad19721778f88c0d8ca6',
          minVal: null,
          maxVal: null,
          data: [
            {
              timestamp: '2023-10-12 10:00:00.000',
              value: 512.817,
            },
          ],
          limitData: false,
          limitOutput: false,
          timezone: 'UTC',
        },
      ];

      spy = jest.spyOn(TCCClient.httpClient, 'get').mockResolvedValueOnce({
        data: expectedData,
      });

      const res = await TCCClient.getAirQualityFeed('pm10', 'T04');
      expect(res.data).not.toBe(null);
    });
  });
  describe('updateTransaction', () => {
    it('should return updated response', async () => {
      spy = jest.spyOn(TCCClient.httpClient, 'post').mockResolvedValue({ data: updateTransactionParkingResponse });
      const response = await TCCClient.updateTransactionCarpark({
        logId: '2025020415190100145',
        uid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        appId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        algType: 'VisitorToApp',
      });
      expect(response.data).toEqual(updateTransactionParkingResponse);
    });
  });
});
