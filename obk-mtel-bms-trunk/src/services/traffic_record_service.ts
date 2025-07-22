import { get, uniqWith } from 'lodash';
import {
  SensorTrafficData,
  TrafficRecordData,
  TrafficRecordDataMeta,
} from '../controllers/traffic_records_controller.interfaces';
import TCCClient from '../libs/tcc_client';
import logging from '../utils/logging';
import SensorRepository from '../repositories/sensor_repository';

export default class TrafficRecordService {
  public async getLatestRecords(): Promise<TrafficRecordData[]> {
    logging.info('start call getting traffic records');

    const currentPage = 1;

    const trafficSensors = await SensorRepository.findMany({
      where: {
        type: 'traffic',
      },
    });

    logging.info(`getting traffic records page ${currentPage}`);
    const response = await TCCClient.getTrafficRecords({ pageNo: currentPage, pageSize: 1000 });
    const list = get(response, 'data.data.list', []);

    const latestRecords = this.getUniqueFromList(list);

    logging.info('traffic records:', latestRecords);
    logging.info('finish call getting traffic records');

    const data = latestRecords.map((record) => {
      const sensor = trafficSensors.find((s) => s.uid === record.monitoringPointSyscode);
      return {
        uid: record.monitoringPointSyscode,
        name: get(sensor, 'name', 'unknown'),
        type: get(sensor, 'type', 'unknown'),
        data: get(sensor, 'data', {}) as SensorTrafficData,
        meta: record,
      };
    });
    return data;
  }

  private getUniqueFromList(list: TrafficRecordDataMeta[]): TrafficRecordDataMeta[] {
    return uniqWith(
      list,
      (a: TrafficRecordDataMeta, b: TrafficRecordDataMeta) =>
        a.monitoringPointSyscode === b.monitoringPointSyscode && a.laneNo === b.laneNo,
    );
  }
}
