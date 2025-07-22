import ParkingFloorRepository from '../../src/repositories/parking_floor_repository';

export const createParkingLot = async (
  name: string,
  uid: string,
  floorUid: string,
  towerUid: string,
): Promise<typeof parkingFloor> => {
  const parkingFloor = await ParkingFloorRepository.create({
    data: {
      display_name: {
        en: 'floor1',
        th: 'floor1',
      },
      name: 'floor1',
      uid: floorUid,
      parking_towers: {
        create: {
          uid: towerUid,
          name: 'test',
          display_name: {},
        },
      },
      parking_lots: {
        create: {
          name: name,
          display_name: {
            en: 'test',
            th: 'test',
          },
          uid: uid,
          spot_types: {
            createMany: {
              data: [
                {
                  name: 'test1',
                  display_name: {},
                  available_spots: 5,
                },
                {
                  name: 'test2',
                  display_name: {},
                  available_spots: 10,
                },
              ],
            },
          },
        },
      },
    },
    include: {
      parking_lots: {
        include: {
          spot_types: true,
        },
      },
    },
  });

  return parkingFloor;
};
