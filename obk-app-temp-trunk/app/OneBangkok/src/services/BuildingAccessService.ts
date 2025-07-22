import * as OB_BMS_SDK from 'ob-bms-sdk';

import {logWrapper} from '~/utils/logWrapper';
import Config from 'react-native-config';

OB_BMS_SDK.setBaseUrl(Config.OB_BMS_URL!);
type ServiceBaseData = {
  [key: string]: any;
};

type ServiceBaseError = {
  statusCode: string;
};

type ServiceBaseResult = {
  data: ServiceBaseData | undefined;
  error: ServiceBaseError | undefined;
};

export class BuildingAccessService {
  constructor() {}

  private _serializeResponse(result: any): ServiceBaseResult {
    let data, error;

    const resStatus = result.response.status;
    if (resStatus === 200) {
      data = result?.data?.data;
    } else {
      error = {
        statusCode: resStatus.toString(),
      };
    }
    const serializedResponse = {data, error};

    return serializedResponse;
  }

  static create() {
    return logWrapper(new BuildingAccessService());
  }

  public async callElevator(
    memberId: string,
    floorId: string,
    locationId: string,
  ) {
    const body = {
      destination_floor_id: floorId,
      location_id: locationId,
    };

    const result = await OB_BMS_SDK.client.membersCommandsCreate(memberId, {
      name: 'lift.call',
      data: body,
    });

    return result.data.data;
  }

  public async getLastCall(memberId: string) {
    const result = await OB_BMS_SDK.client.membersCommandsIndex(
      memberId,
      'lift.call',
      'created_at',
      'desc',
      1,
      1,
    );

    return result.data.data;
  }

  public async getLocations() {
    const result = await OB_BMS_SDK.client.locationsIndex();
    return result.data.data;
  }
}
