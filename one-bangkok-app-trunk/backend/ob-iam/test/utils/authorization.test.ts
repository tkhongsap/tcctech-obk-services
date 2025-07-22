import { DateTimeUtils } from 'ob-common-lib/dist';
import {
  attachedPermission,
  authorizePermission,
} from '../../src/utils/authorization';
import { CustomError } from '../../src/middlewares/error';
import { OBError } from '../../src/openapi/error_spec';

describe('authorization', () => {
  const stringDate = DateTimeUtils.getCurrentDateTime().toISOString();
  const mockPermissions: attachedPermission[] = [
    {
      id: '1',
      permittee_type: 'test',
      value: {
        name: 'read',
        service: 'iam',
        actions: ['read'],
        resource_type: 'test',
        resource: {
          info: 'test',
        },
      },
      created_at: stringDate,
      updated_at: stringDate,
      account_id: '01',
    },
    {
      id: '2',
      permittee_type: 'test',
      value: {
        name: 'read',
        service: 'iam',
        actions: ['*'],
        resource_type: 'test',
        resource: {
          info: 'test',
        },
      },
      created_at: stringDate,
      updated_at: stringDate,
      account_id: '01',
    },
  ];
  const mockPermissions2: attachedPermission[] = [
    {
      id: '1',
      permittee_type: 'test',
      value: {
        name: 'read',
        service: 'iam',
        actions: ['read'],
        resource_type: 'test',
        resource: {
          info: 'test',
        },
      },
      created_at: stringDate,
      updated_at: stringDate,
      account_id: '01',
    },
  ];
  it('should return true when has permission', () => {
    const result1 = authorizePermission(mockPermissions, 'read', 'test', {
      info: 'test',
    });
    expect(result1).toBe(true);
    const result2 = authorizePermission(mockPermissions, '*', 'test', {
      info: 'test',
    });
    expect(result2).toBe(true);
  });
  it('should throw OBError.OB_008 when has no validateResourceType permission', () => {
    try {
      expect(
        authorizePermission(mockPermissions, 'read', 'test001', {
          info: 'test',
        }),
      ).toThrowError();
    } catch (error) {
      expect(error).toStrictEqual(new CustomError(OBError.OB_008));
    }
  });

  it('should throw OBError.OB_008 when has no validateAction permission', () => {
    try {
      expect(
        authorizePermission(mockPermissions2, 'delete', 'test', {
          info: 'test',
        }),
      ).toThrowError();
    } catch (error) {
      expect(error).toStrictEqual(new CustomError(OBError.OB_008));
    }
  });
  it('should throw OBError.OB_008 when has no validateResource permission', () => {
    try {
      expect(
        authorizePermission(mockPermissions, '*', 'test', {
          info: 'mock01',
        }),
      ).toThrowError();
    } catch (error) {
      expect(error).toStrictEqual(new CustomError(OBError.OB_008));
    }
  });
});
