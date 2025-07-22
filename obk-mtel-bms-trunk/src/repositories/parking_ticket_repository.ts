import dbClient from '../../db/client';

export default class ParkingTicketsRepository {
  static findFirst = dbClient.parkingTicket.findFirst;
  static create = dbClient.parkingTicket.create;
}
