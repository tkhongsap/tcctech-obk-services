export type DeviceCreateData = {
  accountId: string;
  deviceId: string;
  os: string;
  pushToken?: {
    value: string;
    type: string;
  };
};
