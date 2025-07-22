import { Controller, Get, OperationId, Route } from 'tsoa';
import { WrappedResponse } from './base_controller.interfaces';
import { TenantIndexResponse } from './tenants_controller.interfaces';
import TenantRepository from '../repositories/tenant_repository';
import { tenantsSerializer } from './tenants_controller.serializer';
import cache from '../libs/cache';
import { isEmpty } from 'lodash';
import { Prisma } from '../../db/client';
import { CustomError } from '../middlewares/error';
import { OBError } from '../utils/error_spec';

@Route('tenants')
export class TenantsController extends Controller {
  @Get('')
  @OperationId('tenants.index')
  public async index(): Promise<WrappedResponse<TenantIndexResponse>> {
    const tenants = await cache.getSet('TENANT_LIST', async () => {
      const tenants = await TenantRepository.findMany();

      if (tenants) {
        return JSON.stringify(tenants);
      } else {
        return '';
      }
    });
    if (isEmpty(tenants)) {
      throw new CustomError(OBError.BMS_TEN_001);
    }

    const data = tenantsSerializer(JSON.parse(tenants) as Prisma.TenantGetPayload<null>[]);

    this.setStatus(200);
    return {
      data,
    };
  }
}
