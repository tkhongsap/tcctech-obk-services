import {hideLoading, showLoading} from '~/states/loadingState';

import * as OB_BUS_SDK from 'ob-bus-sdk';
import Config from 'react-native-config';
import {ShuttleBusResponse} from 'ob-bus-sdk/dist/api';
OB_BUS_SDK.setBaseUrl(Config.OB_BUS_URL!);

class BUSService {
  public getShuttleBusIndex = async () => {
    showLoading();
    try {
      const res = await OB_BUS_SDK.client.index();
      hideLoading();
      if (res.status !== 200) {
        return null;
      }
      if (res.data?.data) {
        return res.data?.data as ShuttleBusResponse;
      }
    } catch (error) {
      hideLoading();
    }
  };
}
const busService = new BUSService();
export default busService;
