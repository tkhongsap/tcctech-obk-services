import { newEnforcer } from 'casbin'
import { model, adapter } from './accessControl'

export const accessControlProvider = {
  can: async ({
    resource,
    action,
    params,
    role = 'admin',
  }: {
    resource: any
    action: any
    params?: any
    role?: string
  }) => {
    const enforcer = await newEnforcer(model, adapter)
    if (action === 'delete' || action === 'edit' || action === 'show') {
      return Promise.resolve({
        can: await enforcer.enforce(role, `${resource}/${params?.id}`, action),
      })
    }
    if (action === 'field') {
      return Promise.resolve({
        can: await enforcer.enforce(
          role,
          `${resource}/${params?.field}`,
          action
        ),
      })
    }
    return {
      can: await enforcer.enforce(role, resource, action),
    }
  },
}
