import { ShuttleBusPositionsRepository } from '../repositories';
import { DateTimeUtils } from '../utils/datetime';
export default class TaskService {
  public async bulkDeleteShuttleBusPosition(): Promise<boolean> {
    const deletedDate = DateTimeUtils.getCurrentDateTime().subtract(30, 'minutes');

    const result = await ShuttleBusPositionsRepository.deleteMany({
      where: {
        created_at: {
          lte: deletedDate.toISOString(),
        },
      },
    });

    return result.count > 0;
  }
}
