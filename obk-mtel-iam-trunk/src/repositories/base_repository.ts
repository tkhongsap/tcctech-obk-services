import { DBClient } from '../utils/prisma/client';

export default class BaseRepository extends DBClient {
  constructor() {
    super();
  }
}
