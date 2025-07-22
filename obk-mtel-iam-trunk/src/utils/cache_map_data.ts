import { isEmpty } from 'lodash';
import cache from '../libs/cache';
import BMSService from '../services/bms_service';
import { TenantData } from 'ob-bms-sdk/dist/api';

async function getTenantNameForAccount() {
  const tenantStr = await cache.getSet('TENANT_LIST', async () => {
    const bmsService = new BMSService();
    const tenants = await bmsService.getTenants();
    if (!tenants) {
      return '';
    }
    return JSON.stringify(tenants);
  });

  if (isEmpty(tenantStr)) {
    return null;
  }
  let tenants: TenantData[];
  try {
    tenants = JSON.parse(tenantStr) as TenantData[];
    return tenants;
  } catch (error) {
    return '';
  }
}
export { getTenantNameForAccount };
