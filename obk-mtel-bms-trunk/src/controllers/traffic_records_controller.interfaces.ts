// Original response from TCCT
export type TrafficRecordDataMeta = {
  eventId: string;
  monitoringPointSyscode: string;
  monitoringPointName: string;
  downwardFlow: number;
  upwardFlow: number;
  jamFlow: number;
  jamLevel: number;
  laneNo: number;
  laneState: number;
  queueLen: number;
  time: string;
  vehicleSpeed: number;
};

type LocaleData = {
  en: string;
  cs: string;
  th: string;
};

export type SensorTrafficData = {
  direction: string;
  description?: LocaleData;
};

export type TrafficRecordData = {
  uid: string; // monitoringPointSyscode
  name: string;
  type: string;
  data: SensorTrafficData;
  meta: TrafficRecordDataMeta;
};

export type TrafficRecordsIndexResponseData = TrafficRecordData[];
