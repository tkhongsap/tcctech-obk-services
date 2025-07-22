import logging from '../../utils/logging';
export class HealthService {

//   constructor(
//   ) {
//   }

  public async checkHealth(): Promise<string> {
    logging.info('start call service health');

    return "ok";
  }

}
