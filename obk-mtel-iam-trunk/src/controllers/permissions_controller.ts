import { Controller, Get, OperationId, Route, Put, Path, Body } from 'tsoa';

import {
  IndexPermissionResponse,
  actions,
  availablePermission,
  updatePermissionRequestBody,
} from './permissions_controller.interfaces';
import { PERMISSION_REGISTRY } from '../constants/permission_registry';
import { ResultResponseData, WrappedResponse } from './index.interface';
import AttachedPermissionRepository from '../repositories/attached_permission_repository';
import { CustomError } from '../midlewares/error';
import { OBError } from '../utils/error_spec';
import { get, values } from 'lodash';
import { JsonConvert } from '../utils/json_convert';

@Route('permissions')
export class PermissionsController extends Controller {
  @Get('')
  @OperationId('permissions.index')
  public async index(): Promise<WrappedResponse<IndexPermissionResponse | null>> {
    return {
      data: { permissions: PERMISSION_REGISTRY },
    };
  }

  @Put('{id}')
  @OperationId('permissions.update')
  public async update(
    @Body() body: updatePermissionRequestBody,
    @Path() id: string,
  ): Promise<WrappedResponse<ResultResponseData>> {
    const accountId = body.account_id;
    const permission = await AttachedPermissionRepository.findFirst({ where: { id, account_id: accountId } });

    if (!permission) {
      throw new CustomError(OBError.OB_008);
    }

    let value = JsonConvert.objectToJson(permission.value);
    const permissionName = get(value, 'resource_type', '');

    if (!values(availablePermission).includes(permissionName)) {
      throw new CustomError(OBError.OB_008);
    }

    if (body.action !== actions.create && body.action !== actions.empty) {
      throw new CustomError(OBError.OB_008);
    }

    value = {
      ...value,
      actions: body.action === actions.empty ? [] : [body.action],
    };

    await AttachedPermissionRepository.update({ where: { id, account_id: accountId }, data: { value } });

    return {
      data: {
        result: true,
      },
    };
  }
}
