import { CreateRoleBody, UpdateRoleBody } from '../../controllers/roles_controller.interfaces';
import RoleRepository from '../../repositories/role_repository';
import { Prisma } from '../../../db/client';

export default class RoleService {
  public async create({ name, permissions }: CreateRoleBody): Promise<typeof role> {
    // no skip duplicate permission if you want to skip duplicate please add skipDuplicates: true
    const role = await RoleRepository.create({
      data: { name, permissions: { createMany: { data: [...permissions] } } },
      include: { permissions: true },
    });

    return role;
  }
  public async index(): Promise<typeof roles> {
    const roles = await RoleRepository.findMany({ include: { permissions: true } });

    return roles;
  }
  public async find(id: string): Promise<typeof role> {
    const role = await RoleRepository.findFirst({ where: { id }, include: { permissions: true } });

    return role;
  }
  public async update(id: string, { name, permissions }: UpdateRoleBody): Promise<typeof role> {
    const permissionData: Prisma.attached_permissionUpdateManyWithWhereWithoutRoleInput[] = permissions.map(
      (permission) => {
        return {
          where: { id: permission.id },
          data: {
            permittee_type: permission.permittee_type,
            value: permission.value,
          },
        };
      },
    );
    const role = await RoleRepository.update({
      where: { id },
      data: {
        name: name,
        permissions: {
          updateMany: permissionData,
        },
      },
      include: { permissions: true },
    });

    return role;
  }
  public async delete(id: string): Promise<void> {
    await RoleRepository.delete({
      where: { id },
    });
  }
}
