import { BaseController } from './base_controller';
import { OperationId, Get, Route, Queries, Path } from 'tsoa';
import { AccountsIndexQuery, AccountsIndexResponse } from './account_controller.interfaces';
import { Pagination, WrappedResponse } from './index.interface';
import AccountRepository from '../repositories/account_repository';
import { filter, find, first, get, values } from 'lodash';
import { AccountDataResponse } from './accounts_controller.interfaces';
import AccountService from '../services/account_service';
import AttachedPermissionRepository from '../repositories/attached_permission_repository';
import { PermissionResponse, availablePermission } from './permissions_controller.interfaces';
import { Prisma } from '../../db/client';
import Enumerable = Prisma.Enumerable;
import accountsWhereInput = Prisma.accountWhereInput;
import { getTenantNameForAccount } from '../utils/cache_map_data';

@Route('accounts')
export class AccountsController extends BaseController {
  @Get('')
  @OperationId('accounts.index')
  public async index(@Queries() query?: AccountsIndexQuery): Promise<WrappedResponse<AccountsIndexResponse>> {
    // TODO Sanitize response
    const _query = this.buildQuery({ ...query }) as { where: object };
    const { search = '' } = query || {};
    const OR: Enumerable<accountsWhereInput> = [
      {
        profile: {
          some: {
            OR: [
              { first_name: { contains: search, mode: 'insensitive' } },
              { middle_name: { contains: search, mode: 'insensitive' } },
              { last_name: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
      },
      { identities: { some: { identifier: { contains: search, mode: 'insensitive' } } } },
    ];
    const accounts = await AccountRepository.findMany({
      ..._query,
      include: { profile: true, identities: true, external_identity: { where: { type: 'fs' } } },
      where: {
        ..._query.where,
        OR,
      },
    });

    const totalData = await AccountRepository.count({
      where: {
        ..._query.where,
        OR,
      },
    });

    const pagination = this.paginationBuilder(
      totalData,
      query?.page_size || this.DEFAULT_PAGE_SIZE,
      query?.page_number || this.DEFAULT_PAGE_NUMBER,
    ) as Pagination;
    const tenants = await getTenantNameForAccount();
    const sanitizedAccounts = await Promise.all(
      accounts.map(async (acc) => {
        let companyName = '';
        if (tenants && acc?.external_identity?.length) {
          const tenantID = get(acc.external_identity, ['0', 'meta', 'tenantIDs', '0'], '');
          const tenant = find(tenants, { uid: String(tenantID) });
          if (tenant) {
            companyName = tenant.name;
          }
        }
        return {
          id: acc.id,
          created_at: acc.created_at,
          updated_at: acc.updated_at,
          deleted_at: acc.deleted_at,
          profile: first(acc.profile),
          identities: acc.identities,
          external_identity: acc.external_identity,
          company_name: companyName,
        };
      }),
    );

    return {
      data: sanitizedAccounts,
      pagination,
    };
  }
  @Get('{id}')
  @OperationId('account.show')
  public async show(@Path() id: string): Promise<WrappedResponse<AccountDataResponse>> {
    const accountService = new AccountService();
    const response = await accountService.getAccountDetail(id);
    return {
      data: response,
    };
  }

  @Get('{id}/permissions')
  @OperationId('account.permission')
  public async permission(@Path() id: string): Promise<WrappedResponse<PermissionResponse[]>> {
    const permissions = await AttachedPermissionRepository.findMany({
      where: { account_id: id },
    });

    const filteredPermission = filter(permissions, (permission) => {
      const permissionValue = permission.value;
      const permissionName = get(permissionValue, 'resource_type', '');
      return values(availablePermission).includes(permissionName);
    });

    return {
      data: filteredPermission,
    };
  }
}
