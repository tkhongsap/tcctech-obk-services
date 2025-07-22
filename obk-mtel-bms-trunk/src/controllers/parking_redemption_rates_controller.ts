import { Controller, Get, OperationId, Route, Path, Query } from 'tsoa';
// import { WrappedResponse } from './base_controller.interfaces';
import { MemberRepository, PassRepository } from '../repositories';
import { CustomError } from '../middlewares/error';
import { OBError } from '../utils/error_spec';
import FSParkingClient from '../libs/fs_parking_client';
import { get, map, parseInt } from 'lodash';
import { WrappedResponse } from './base_controller.interfaces';
import { ParkingRedemptionRateResult } from './parking_redemption_rates_controller.interfaces';
import logging from '../utils/logging';
import TCCClient from '../libs/tcc_client';
import cache from '../libs/cache';

@Route('members')
export class ParkingRedemptionRatesController extends Controller {
  @Get('{id}/parking_redemption_rates')
  @OperationId('parking_redemption_rates.index')
  public async show(
    @Path('id') id: string,
    @Query() member_type_id: number,
    @Query() vehicle_type_id: number,
  ): Promise<WrappedResponse<ParkingRedemptionRateResult[]>> {
    const member = await MemberRepository.findFirst({ where: { id } });
    if (!member) throw new CustomError(OBError.BMS_MEMB_003);

    const memberFSEmail = get(member, 'metadata.emails', []);
    logging.info('checkRedemptionStatusByEmail body request', memberFSEmail);
    const fsUserResponse = await FSParkingClient.checkRedemptionStatusByEmail(memberFSEmail);
    logging.info('checkRedemptionStatusByEmail data', fsUserResponse.data);
    const { departmentId, tenantId } = fsUserResponse.data.data;

    logging.info('getDataRateCode body request', {
      vehicleType: vehicle_type_id,
      departmentID: parseInt(departmentId),
      tenantID: parseInt(tenantId),
      memberType: member_type_id,
    });

    const rateResponse = await FSParkingClient.getDataRateCode({
      vehicleType: vehicle_type_id,
      departmentID: parseInt(departmentId),
      tenantID: parseInt(tenantId),
      memberType: member_type_id,
    });

    logging.info('getDataRateCode data', rateResponse.data);

    const rates: ParkingRedemptionRateResult[] = map(rateResponse.data.data, (rate) => {
      return {
        code: rate.rateCode,
        detail: {
          en: rate.rateDetailEng,
          th: rate.rateDetail,
        },
      };
    });
    return { data: rates };
  }

  @Get('{tenantId}/parking_residential_redemption_rates')
  @OperationId('parking_residential_redemption_rates.index')
  public async showResidential(
    @Path('tenantId') tenantId: string,
    @Query() member_type_id: number,
    @Query() department_id: number,
    @Query() vehicle_type_id: number,
    @Query() invite_id?: string,
  ): Promise<WrappedResponse<ParkingRedemptionRateResult[]>> {
    let residence_id = tenantId;
    if (invite_id) {
      const passData = await PassRepository.findFirst({
        where: { uid: invite_id },
      });
      if (!passData) throw new CustomError(OBError.BMS_VIST_001);

      residence_id = JSON.parse(passData.metadata_resident as string)?.residence_id;

      if (!residence_id) throw new CustomError(OBError.BMS_PRK_RESI_001);
    }

    const request = {
      vehicleType: vehicle_type_id,
      departmentID: department_id,
      tenantID: parseInt(residence_id),
      memberType: member_type_id,
    };

    logging.info('getDataResidentialRateCode body request', request);
    await cache.getSet('TCC_ACCESS_TOKEN', async () => {
      const response = await TCCClient.getOauth2Token();
      return response.data.access_token;
    });

    const rateResponse = await TCCClient.getDataRateCode(request);
    logging.info('getDataResidentialRateCode data response', rateResponse.data);

    const rates: ParkingRedemptionRateResult[] = map(rateResponse.data, (rate) => {
      return {
        code: rate.rateCode,
        detail: {
          en: rate.rateDetailEng,
          th: rate.rateDetail,
        },
      };
    });
    return { data: rates };
  }
}
