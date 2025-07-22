import {hideLoading, showLoading} from '~/states/loadingState';

import * as OB_BMS_SDK from 'ob-bms-sdk';
import Config from 'react-native-config';
import {ValetParkingDetail, ValetStation} from 'ob-bms-sdk/dist/api';
OB_BMS_SDK.setBaseUrl(Config.OB_BMS_URL!);

class ParkingService {
  public getValetStation = async () => {
    showLoading();
    try {
      const res = await OB_BMS_SDK.client.stationRetrieve();
      hideLoading();
      if (res.status !== 200) {
        return null;
      }
      if (res.data?.data) {
        return res.data?.data as ValetStation[];
      }
    } catch (error) {
      hideLoading();
    }
  };

  public callingCar = async (carId: number, stationId: number) => {
    showLoading();
    try {
      const res = await OB_BMS_SDK.client.calling({
        valet_car_id: carId,
        drop_off_station_id: stationId,
      });
      hideLoading();
      if (res.status !== 200) {
        return false;
      }
      if (res.data?.data) {
        return true;
      }
    } catch (error) {
      hideLoading();
      return false;
    }
  };

  public getValetDetail = async () => {
    showLoading();

    try {
      const res = await OB_BMS_SDK.client.find();
      hideLoading();
      if (res.status !== 200) {
        return null;
      }
      if (res.data?.data) {
        return res.data?.data as ValetParkingDetail;
      }
    } catch (error) {
      hideLoading();
    }
  };
}
const parkingService = new ParkingService();
export default parkingService;
