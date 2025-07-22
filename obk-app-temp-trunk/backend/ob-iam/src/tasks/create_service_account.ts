// TEMP SCRIPT TO CREATE SERVICE ACCOUNT

import { FS_PERMISSION } from "../constants/base_permission";
import { AccountService } from "../services";

const accountService = new AccountService;

(async () => {
  const account = await accountService.createServiceAccount({
    permissions: FS_PERMISSION.map(permission => {
      return {
        permittee_type: 'account',
        value: permission
      }
    })
  })

  console.dir(account, { depth: null })
})()
