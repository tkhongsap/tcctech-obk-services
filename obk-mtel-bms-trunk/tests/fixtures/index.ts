import { AccessorType } from '../../src/controllers/building_access_log_controller.interface';
import { PositionStatus } from '../../src/controllers/parking_access_log_controller.interfaces';
import {
  FloorRepository,
  LocationRepository,
  MemberRepository,
  ParkingLogRepository,
  ParkingLotRepository,
  ParkingReservationRepository,
  ParkingSpaceRepository,
  ParkingTicketsRepository,
  ParkingTowerRepository,
  ProjectRepository,
  TowerRepository,
  ZoneRepository,
} from '../../src/repositories';
import AirQualityRepository from '../../src/repositories/aqi_repository';
import AuthorizedLocationRepository from '../../src/repositories/authorized_location_repository';
import ParkingFloorRepository from '../../src/repositories/parking_floor_repository';
import TenantMemberRepository from '../../src/repositories/tenant_member_repository';
import TenantRepository from '../../src/repositories/tenant_repository';
import VisitorRepository from '../../src/repositories/visitors_repository';

export * from './sensors';

export const createTestData = async () => {
  const member = await MemberRepository.create({
    data: {
      uid: crypto.randomUUID(),
      account_id: crypto.randomUUID(),
    },
  });
  const project = await ProjectRepository.create({
    data: {
      name: crypto.randomUUID(),
      display_name: {},
    },
  });
  const tower = await TowerRepository.create({
    data: {
      name: 'test',
      display_name: {},
      uid: crypto.randomUUID(),
      project: {
        connect: {
          id: project.id,
        },
      },
      mapping: {
        aq: {
          uid: 'T01',
        },
      },
    },
  });
  const zone = await ZoneRepository.create({
    data: {
      name: 'test',
      display_name: {},
      uid: crypto.randomUUID(),
      tower: {
        connect: {
          id: tower.id,
        },
      },
    },
  });
  const floor = await FloorRepository.create({
    data: {
      name: 'test',
      display_name: {},
      uid: crypto.randomUUID(),
      tower: {
        connect: {
          id: tower.id,
        },
      },
      mapping: {
        aq: {
          uid: '001',
        },
      },
    },
  });
  const location = await LocationRepository.create({
    data: {
      name: 'test',
      uid: crypto.randomUUID(),
      tower_id: tower.id,
      zone_id: zone.id,
      floor_id: floor.id,
      beacons: {
        create: {
          uid: '0',
          name: 'test',
          major: '123',
          minor: '456',
        },
      },
    },
  });

  const aqi = await AirQualityRepository.create({
    data: {
      name: 'Temperature',
      display_name: {},
      short_description: {},
      description: {},
      sequence: 1,
      air_quality_index_indicator: {
        create: {
          title: { en: 'slightly cold / hot' },
          description: {},
          sequence: 1,
          color_code: 'code3',
          air_quality_index_indicator_range: {
            createMany: {
              data: [
                {
                  title: { en: 'slightly cold' },
                  min_value: null,
                  max_value: 19.0,
                  min_display: '18.0',
                  max_display: '19.0',
                  sequence: 1,
                },
                {
                  title: { en: 'slightly hot' },
                  min_value: 30.0,
                  max_value: null,
                  min_display: '30.0',
                  max_display: '31.0',
                  sequence: 2,
                },
              ],
            },
          },
        },
      },
    },
  });

  const tenant = await TenantRepository.create({
    data: {
      uid: crypto.randomUUID(),
      name: 'Test',
      display_name: {
        nameEn: 'Test',
        nameTh: 'Test',
      },
      email: 'Test',
      phone_number: '00',
      address: 'OB',
      metadata: {},
    },
  });

  const tenantMember = await TenantMemberRepository.create({
    data: {
      tenant_id: tenant.id,
      member_id: member.id,
      role: 'staff',
      setting: {},
    },
  });
  const visitor = await VisitorRepository.create({
    data: {
      name: 'test',
      email: 'test@mtel.co.th',
      company_name: 'mtel',
      reference: 'test',
      inviter_id: member.id,
    },
  });

  const parkingLog = await ParkingLogRepository.createMany({
    data: [
      {
        uid: 'Mock UID',
        identifier: member.account_id!,
        type: 'member',
        status: PositionStatus.onsite,
        terminal_id: '10',
        transaction_date: '2024-04-30T18:10:48',
        name: 'MOCK NAME',
        plate_number: 'MOCKPlateNumber1',
      },
      {
        uid: 'Mock UID',
        identifier: member.account_id!,
        type: 'member',
        status: PositionStatus.leave,
        terminal_id: '10',
        transaction_date: '2024-04-30T19:12:58',
        name: 'MOCK NAME',
        plate_number: 'MOCKPlateNumber2',
      },
    ],
  });

  const parkingTicket = await ParkingTicketsRepository.create({
    data: {
      plate_number: '3MTEL123',
      member_id: member.id,
    },
  });

  const authorizedLocations = await AuthorizedLocationRepository.create({
    data: {
      member_id: member.id,
      default: true,
      location_id: location.id,
      accessor_type: AccessorType.member,
    },
  });

  const parkingTower = await ParkingTowerRepository.create({
    data: {
      uid: '4',
      name: 'Building 1',
      display_name: { en: 'Building 1', th: 'Building 1' },
    },
  });

  const parkingFloor = await ParkingFloorRepository.create({
    data: {
      uid: '1',
      name: 'A1',
      display_name: { en: 'A1', th: 'A1' },
      parking_tower_id: parkingTower.id,
    },
  });

  const parkingLot = await ParkingLotRepository.create({
    data: {
      name: 'One Bangkok Park',
      display_name: { en: 'One Bangkok Park', th: 'One Bangkok Park' },
      parking_floor_id: parkingFloor.id,
      uid: '1',
    },
  });

  const parkingSpace = await ParkingSpaceRepository.createMany({
    data: [
      {
        id: 'testID1',
        name: 'A1',
        parking_lot_id: parkingLot.id,
        available: true,
      },
      {
        id: 'testID2',
        name: 'B1',
        parking_lot_id: parkingLot.id,
        available: false,
      },
      {
        id: 'testID3',
        name: 'C1',
        parking_lot_id: parkingLot.id,
        available: true,
      },
      {
        id: 'testID4',
        name: 'D1',
        parking_lot_id: parkingLot.id,
        available: true,
      },
    ],
  });

  const parkingReservation = await ParkingReservationRepository.create({
    data: {
      member_id: member.id,
      reservation_number: 'test',
      parking_space_id: 'testID1',
      start_time: '2023-10-05T12:00:00.000Z',
      fee: 30,
      status: 'pending',
    },
  });

  return {
    member,
    project,
    tower,
    zone,
    floor,
    location,
    aqi,
    tenant,
    tenantMember,
    visitor,
    parkingLog,
    parkingTicket,
    authorizedLocations,
    parkingTower,
    parkingFloor,
    parkingLot,
    parkingSpace,
    parkingReservation,
  };
};
