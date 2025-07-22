import { logging } from 'ob-common-lib/dist';

export class HealthService {

//   constructor(
//   ) {
//   }

  public async checkHealth(): Promise<string> {
    logging.info('start call service health');

    return "ok";
  }

}
