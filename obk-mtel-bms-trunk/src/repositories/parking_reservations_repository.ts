import dbClient from '../../db/client';

export default class ParkingReservationRepository {
  static create = dbClient.parkingReservation.create;
  static findMany = dbClient.parkingReservation.findMany;
  static upsert = dbClient.parkingReservation.upsert;
  static createMany = dbClient.parkingReservation.createMany;
  static findFirst = dbClient.parkingReservation.findFirst;
  static updateMany = dbClient.parkingReservation.updateMany;
  static update = dbClient.parkingReservation.update;

  static defaultInclude = {
    parking_space: {
      include: {
        blocker: true,
        parking_lot: { include: { parking_floors: true } },
      },
    },
    payment: true,
  };
}
