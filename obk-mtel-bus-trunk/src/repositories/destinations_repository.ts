import dbClient from '../../db/client';

export default class DestinationsRepository {
  static findMany = dbClient.destinations.findMany;
}
