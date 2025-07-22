import createClient, {FetchOptions, FilterKeys} from 'openapi-fetch';
import {paths} from './openapi_interfaces';

class OBIAMClient {
  private client;
  private sdk;

  constructor(sdk: any) {
    this.sdk = sdk;
    this.client = createClient<paths>({
      baseUrl: `${sdk.baseUrl}/ob-iam`,
    });
  }

  async getProfile(
    payload: FetchOptions<FilterKeys<paths['/me/profile'], 'get'>>,
  ) {
    return this.client.get(
      '/me/profile',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async updateProfile(
    payload: FetchOptions<FilterKeys<paths['/me/profile'], 'put'>>,
  ) {
    return this.client.put(
      '/me/profile',
      this.sdk.mergeDefaultPayload(payload),
    );
  }
  async requestOtp(
    payload: FetchOptions<FilterKeys<paths['/otp/request'], 'post'>>,
  ) {
    return this.client.post(
      '/otp/request',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async verifyOtp(
    payload: FetchOptions<FilterKeys<paths['/otp/verify'], 'post'>>,
  ) {
    return this.client.post(
      '/otp/verify',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async registerAuth(
    payload: FetchOptions<FilterKeys<paths['/auth/register'], 'post'>>,
  ) {
    return this.client.post(
      '/auth/register',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async loginAuth(
    payload: FetchOptions<FilterKeys<paths['/auth/login'], 'post'>>,
  ) {
    return this.client.post(
      '/auth/login',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async logoutAuth(
    payload: FetchOptions<FilterKeys<paths['/auth/logout'], 'delete'>>,
  ) {
    return this.client.del(
      '/auth/logout',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async deleteAccount(
    payload: FetchOptions<FilterKeys<paths['/me/account'], 'delete'>>,
  ) {
    return this.client.del(
      '/me/account',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async addIdentity(
    payload: FetchOptions<FilterKeys<paths['/identity'], 'post'>>,
  ) {
    return this.client.post('/identity', this.sdk.mergeDefaultPayload(payload));
  }

  async setDefaultIdentity(
    payload: FetchOptions<FilterKeys<paths['/identity/{id}/default'], 'put'>>,
  ) {
    return this.client.put(
      '/identity/{id}/default',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async getIdentities(
    payload: FetchOptions<FilterKeys<paths['/identity'], 'get'>>,
  ) {
    return this.client.get('/identity', this.sdk.mergeDefaultPayload(payload));
  }

  async deleteIdentity(
    payload: FetchOptions<FilterKeys<paths['/identity/{id}'], 'delete'>>,
  ) {
    return this.client.del(
      '/identity/{id}',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async validateCurrentPassword(
    payload: FetchOptions<
      FilterKeys<paths['/me/account/verify_password'], 'post'>
    >,
  ) {
    return this.client.post(
      '/me/account/verify_password',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async updatePassword(
    payload: FetchOptions<FilterKeys<paths['/me/account/password'], 'put'>>,
  ) {
    return this.client.put(
      '/me/account/password',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async resetPassword(
    payload: FetchOptions<
      FilterKeys<paths['/me/account/reset_password'], 'put'>
    >,
  ) {
    return this.client.put(
      '/me/account/reset_password',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async validate(
    payload: FetchOptions<FilterKeys<paths['/identity/validate'], 'get'>>,
  ) {
    return this.client.get(
      '/identity/validate',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async getSetting(
    payload: FetchOptions<FilterKeys<paths['/me/setting'], 'get'>>,
  ) {
    return this.client.get(
      '/me/setting',
      this.sdk.mergeDefaultPayload(payload),
    );
  }
  async updateSetting(
    payload: FetchOptions<FilterKeys<paths['/me/setting'], 'put'>>,
  ) {
    return this.client.put(
      '/me/setting',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async link(
    payload: FetchOptions<FilterKeys<paths['/external_identity/link'], 'post'>>,
  ) {
    return this.client.post(
      '/external_identity/link',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async reactivate(
    payload: FetchOptions<FilterKeys<paths['/auth/reactivate'], 'put'>>,
  ) {
    return this.client.put(
      '/auth/reactivate',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async getQrToken(
    payload: FetchOptions<FilterKeys<paths['/me/qr_token'], 'get'>>,
  ) {
    return this.client.get(
      '/me/qr_token',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async createQrToken(
    payload: FetchOptions<FilterKeys<paths['/me/qr_token'], 'post'>>,
  ) {
    return this.client.post(
      '/me/qr_token',
      this.sdk.mergeDefaultPayload(payload),
    );
  }
}

export default OBIAMClient;
