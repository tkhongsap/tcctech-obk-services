import { Body, Controller, Delete, Get, OperationId, Path, Post, Put, Route } from 'tsoa';

import {
  CreateRoleBody,
  CreateRoleResponse,
  IndexRolesResponse,
  ShowRolesResponse,
  UpdateRoleBody,
} from './roles_controller.interfaces';
import RoleService from '../services/role_service';
import { roleListSerializer, roleSerializer } from './roles_controller.serializer';
import { WrappedResponse } from './index.interface';

@Route('roles')
export class RoleController extends Controller {
  @Post('')
  @OperationId('roles.create')
  public async create(@Body() body: CreateRoleBody): Promise<WrappedResponse<CreateRoleResponse>> {
    const roleService = new RoleService();
    const result = await roleService.create(body);

    return {
      data: roleSerializer(result),
    };
  }
  @Get('')
  @OperationId('roles.index')
  public async index(): Promise<WrappedResponse<IndexRolesResponse>> {
    const roleService = new RoleService();
    const result = await roleService.index();

    return {
      data: roleListSerializer(result),
    };
  }
  @Get('{id}')
  @OperationId('roles.show')
  public async show(@Path() id: string): Promise<WrappedResponse<ShowRolesResponse | null>> {
    const roleService = new RoleService();
    const result = await roleService.find(id);

    return {
      data: result ? roleSerializer(result) : null,
    };
  }
  @Put('{id}')
  @OperationId('roles.update')
  public async update(
    @Path() id: string,
    @Body() body: UpdateRoleBody,
  ): Promise<WrappedResponse<ShowRolesResponse | null>> {
    const roleService = new RoleService();
    const result = await roleService.update(id, body);

    return {
      data: result ? roleSerializer(result) : null,
    };
  }
  @Delete('{id}')
  @OperationId('roles.destroy')
  public async destroy(@Path() id: string): Promise<WrappedResponse<boolean | null>> {
    const roleService = new RoleService();
    await roleService.delete(id);

    return {
      data: true,
    };
  }
}
