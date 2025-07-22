import { CallingBody } from '../controllers/valet_controller.interfaces';
import cache from '../libs/cache';
import TCCClient, { ValetParkingDetail, ValetStation } from '../libs/tcc_client';
import { CustomError } from '../middlewares/error';
import { MemberRepository } from '../repositories';
import { OBError } from '../utils/error_spec';
import { orderBy, first } from 'lodash';

export default class ValetService {
  public async findStations(): Promise<ValetStation[]> {
    await cache.getSet('TCC_ACCESS_TOKEN', async () => {
      const response = await TCCClient.getOauth2Token();
      return response.data.access_token;
    });

    const result = await TCCClient.getValetStations();
    return result.data;
  }

  public async calling(body: CallingBody): Promise<[]> {
    await cache.getSet('TCC_ACCESS_TOKEN', async () => {
      const response = await TCCClient.getOauth2Token();
      return response.data.access_token;
    });

    const result = await TCCClient.callValetCar({
      status: 'CALLING',
      valetCarId: body.valet_car_id,
      dropOffStationId: body.drop_off_station_id,
    });
    return result.data;
  }

  public async find(accountId: string): Promise<ValetParkingDetail> {
    const member = await MemberRepository.findFirst({ where: { account_id: accountId } });
    if (!member) {
      throw new CustomError(OBError.BMS_MEMB_003);
    }
    const uid = member.uid;
    await cache.getSet('TCC_ACCESS_TOKEN', async () => {
      const response = await TCCClient.getOauth2Token();
      return response.data.access_token;
    });
    const result = await TCCClient.getValetParkingFromUID({ uid });
    if (!result) {
      throw new CustomError(OBError.BMS_VAL_002);
    }
    const valetDetails = result.data.entities;
    const valetDetail = first(orderBy(valetDetails, ['createdAt'], ['desc']));

    const isValidValetDetail = valetDetail !== undefined && valetDetail !== null;
    const isStatusValid = valetDetail?.status !== 'DONE';

    if (!isValidValetDetail || !isStatusValid) {
      throw new CustomError(OBError.BMS_VAL_003);
    }

    return valetDetail;
  }
}
