import WifiManager from 'react-native-wifi-reborn';

export interface LocationData {
  accuracy: number;
  floor: number;
  latitude: number;
  longitude: number;
  timestamp: number;
}

class OBKLocationService {
  constructor() {}

  refreshWifiData = async () => {
    try {
      const wifiList = await WifiManager.reScanAndLoadWifiList();
      return wifiList;
    } catch (e) {
      return [];
    }
  };
}

const obkLocationService = new OBKLocationService();
export default obkLocationService;
