import jwtDecode from 'jwt-decode';
import {find, isEmpty} from 'lodash';
import {useEffect, useState} from 'react';
import {useAuthenState} from '~/states/authen/authenState';
import {PERMISSIONS_NAME} from './const';

type UserPermissionOutput = {
  permissionList: PermissionList;
};

type PermissionList = {
  canDoServiceRequest: boolean;
  canDoACRequest: boolean;
};

export const usePermission = (): UserPermissionOutput => {
  const {token} = useAuthenState();
  const [permissionList, setPermissionList] = useState<PermissionList>({
    canDoServiceRequest: false,
    canDoACRequest: false,
  });

  const checkPermission = (permission: any, name: string, action: string) => {
    const test = find(permission, ['value.name', name]);

    return test?.value?.actions?.indexOf(action) >= 0;
  };

  useEffect(() => {
    if (!isEmpty(token.value)) {
      const decoded: any = jwtDecode(token.value as string);
      const attachedPermission = decoded?.permission;

      if (attachedPermission) {
        const canList = {
          canDoServiceRequest: checkPermission(
            attachedPermission,
            PERMISSIONS_NAME.SERVICE_REQUEST,
            'create',
          ),
          canDoACRequest: checkPermission(
            attachedPermission,
            PERMISSIONS_NAME.AC_REQUEST,
            'create',
          ),
        };

        setPermissionList(canList);
      }
    }
  }, [token]);

  return {
    permissionList: permissionList,
  };
};
