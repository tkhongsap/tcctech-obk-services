import { SensorType } from '../libs/tcc_client';

export interface SensorsIndexQuery {
  tower_id: string;
  member_id?: string;
}

export interface SensorsOutdoorIndexQuery {
  zone: string;
}

export type SensorsIndexResponseData = SensorIndicatorData;

export interface SensorData {
  tower_id: string;
  floor_id: string;
  zone_id: string;
  sensor_type: SensorType;
  value: string;
  unit: string;
  updated_at: string;
  indicator: string;
  color_code: string;
}

export type FloorSensorData = {
  floor_id: string;
  sensors: SensorData[];
};

export type SensorIndicatorData = {
  floors: FloorSensorData[];
  indicator: AirQualityIndex[];
};

export type AirQualityIndex = {
  id: string;
  name: string;
  display_name: Record<string, unknown>;
  short_description: Record<string, unknown>;
  description: Record<string, unknown>;
  sequence: number;
  created_at: Date;
  updated_at: Date;
  air_quality_index_indicator: AirQualityIndexIndicator[];
};

export type AirQualityIndexIndicator = {
  id: string;
  air_quality_index_id: string;
  title: Record<string, unknown>;
  description: Record<string, unknown>;
  sequence: number;
  color_code: string;
  created_at: Date;
  updated_at: Date;
  air_quality_index: AirQualityIndex;
  air_quality_index_indicator_range: AirQualityIndexIndicatorRange[];
};

export type AirQualityIndexIndicatorRange = {
  id: string;
  air_quality_index_indicator_id: string;
  title: Record<string, unknown>;
  min_value: number | null;
  max_value: number | null;
  min_display: string;
  max_display: string;
  sequence: number;
  created_at: Date;
  updated_at: Date;
  air_quality_index_indicator: AirQualityIndexIndicator;
};
