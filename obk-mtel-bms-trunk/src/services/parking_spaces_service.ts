import { ParkingLotRepository } from '../repositories';

export default class ParkingSpaceService {
  public async list(): Promise<typeof parkingSpaces> {
    const parkingSpaces = await ParkingLotRepository.findMany({
      where: {
        parking_spaces: { some: { available: true } },
      },
      include: ParkingLotRepository.defaultInclude,
    });

    return parkingSpaces;
  }
}
