export interface shuttleBusPayload {
  version_id: string;
  vendor_id: number;
  vehicle_id: string;
  chassis_number: string;
  mobileunitid: string;
  device_id: string;
  imei_id: string;
  imei_sim: string;
  ccid_number_sim: string;
  firmware_version: number;
  data_status: string;
  gps_status: number;
  server_time: string;
  gps_time: string;
  latitude: number;
  longitude: number;
  altitude: number;
  course: number;
  pdop: number;
  hdop: number;
  speed: number;
  satellite: number;
  gsm: number;
  external_battery: number;
  internal_battery: number;
  jammer_counter: number;
  sleep_mode: string;
  fence_id: number;
  driver_id: string;
  acc_on_time: number;
  acc_off_time: number;
  acc_idle_time: number;
  fuel_consomtion: number;
  rpm: number;
  fuel_percent: number;
  fuel_liter: number;
  air_temperature: number;
  air_pressure: number;
  coolant_temperature: number;
  fuel_pressure: number;
  atmospheric_pressure: number;
  clutch_switch: string;
  brake_switch: string;
  brake_hand_switch: string;
  throttle_valve_position: number;
  accelerator: string;
  engine_load: string;
  engine_oil_level: number;
  engine_oil_pressure: number;
  engine_oil_temperature: number;
  coolant_liquid_level: number;
  endurance_milage: number;
  acc: number;
  belt_driver: string;
  belt_copilot: string;
  trunk: string;
  engine_cover: string;
  wiper: string;
  horn: string;
  gear: string;
  arm_status: string;
  dtc_code: string;
  door_lf: string;
  door_rf: string;
  door_lb: string;
  door_rb: string;
  door_lock_lf: string;
  door_lock_rf: string;
  door_lock_lb: string;
  door_lock_rb: string;
  window_lf: string;
  window_rf: string;
  window_lb: string;
  window_rb: string;
  sunroof_switch: string;
  left_turn: number;
  right_turn: number;
  reading_lights: string;
  low_beam_lights: number;
  high_beam_lights: string;
  front_fog_lamps: string;
  back_fog_lamps: string;
  emergency_lights: string;
  brake_lights: number;
  reversing_lights: string;
  mdvr_status: number;
  mdvr_record_status: string;
  mdvr_cut_status: string;
  mdvr_hdd_error: string;
  mdvr_communication_status: number;
  gforce_alarm: number;
  collision_alarm: number;
  tire_pressure_alarm: string;
  jammer_alarm: number;
  gps_antenna_short_circuit: number;
  gsm_antenna_short_circuit: string;
  gps_antenna_disconnect: number;
  gsm_antenna_disconnect: string;
  overspeed_alarm: number;
  simcard_remove: number;
  sudden_accelerator: number;
  sudden_brake: number;
  sudden_turn: number;
  emergency: number;
  vehicle_speed: number;
  mileage: number;
  odo: number;
  X: number;
  Y: number;
  Z: number;
  Total: number;
  speed_valid: number;
  hid: string;
  batt_volt: number;
}

export interface WebhookCreateBody {
  action: string;
  payload: shuttleBusPayload;
}
