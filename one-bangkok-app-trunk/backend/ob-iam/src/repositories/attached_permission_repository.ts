import { logging } from 'ob-common-lib/dist';
import { PermitteeType, Prisma, attached_permission } from 'ob-iam/db/client';
import { CustomError } from '../middlewares/error';
import { DBClient } from '../utils/prisma/client';
import { OBError } from '../openapi/error_spec';

export type attachedPermissionType = {
  id: string;
  permittee_type: PermitteeType;
  value: Prisma.JsonValue;
  account_group_id: string | null;
  role_id: string | null;
};

export default class AttachedPermissionRepository extends DBClient {
  constructor() {
    super();
  }

  public async create(
    data: Prisma.attached_permissionCreateInput,
  ): Promise<attached_permission | never> {
    logging.info('create attached permission');
    try {
      return await this.prisma.attached_permission.create({
        data,
      });
    } catch (error) {
      logging.error('Cannot create attached permission', { error });
      throw new CustomError(OBError.OB_001);
    }
  }

  public async findMany(
    where: Prisma.attached_permissionWhereInput,
  ): Promise<attachedPermissionType[] | null> {
    logging.info('find many attached permissions');
    try {
      const attachedPermission = await this.prisma.attached_permission.findMany(
        {
          select: {
            id: true,
            permittee_type: true,
            value: true,
            account_group_id: true,
            role_id: true,
          },
          where,
        },
      );
      return attachedPermission;
    } catch (error) {
      logging.error('Cannot find attached permission', { error });
      throw new CustomError(OBError.OB_001);
    }
  }
}
