import { SigninIdentityLogResultData } from './sign_in_identity_log_controller.interfaces';

export function signInidentityLogSerializer(signInidentity: SigninIdentityLogResultData): SigninIdentityLogResultData {
  return {
    id: signInidentity.id,
    account_id: signInidentity.account_id,
    identity_id: signInidentity.identity_id,
    identity: signInidentity.identity,
    activityLog: signInidentity.activityLog,
    externalIdentities: signInidentity.externalIdentities,
    created_at: signInidentity.created_at,
    updated_at: signInidentity.updated_at,
  };
}
