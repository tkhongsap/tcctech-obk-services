import createClient, {FetchOptions, FilterKeys} from 'openapi-fetch';
import {paths} from './openapi_interfaces';

class OBNotificationClient {
  private client;
  private sdk;

  constructor(sdk: any) {
    this.sdk = sdk;
    this.client = createClient<paths>({
      baseUrl: `${sdk.baseUrl}/ob-notification`,
    });
  }

  async createRecipient(
    payload: FetchOptions<FilterKeys<paths['/me/recipient'], 'post'>>,
  ) {
    return this.client.post(
      '/me/recipient',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async fetchMessage(
    payload: FetchOptions<FilterKeys<paths['/me/message'], 'get'>>,
  ) {
    return this.client.get(
      '/me/message',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async findAllMessageCategory(
    payload: FetchOptions<FilterKeys<paths['/message_category'], 'get'>>,
  ) {
    return this.client.get(
      '/message_category',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async updateMessage(
    payload: FetchOptions<FilterKeys<paths['/me/message/{id}'], 'put'>>,
  ) {
    return this.client.put(
      '/me/message/{id}',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async fetchTotalUnreadMessageCategories(
    payload: FetchOptions<
      FilterKeys<paths['/me/category/message/count'], 'get'>
    >,
  ) {
    return this.client.get(
      '/me/category/message/count',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async reads(
    payload: FetchOptions<FilterKeys<paths['/me/message/read'], 'put'>>,
  ) {
    return this.client.put(
      '/me/message/read',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async deletes(
    payload: FetchOptions<FilterKeys<paths['/me/message'], 'delete'>>,
  ) {
    return this.client.del(
      '/me/message',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async getMessage(
    payload: FetchOptions<FilterKeys<paths['/me/message/{id}'], 'get'>>,
  ) {
    return this.client.get(
      '/me/message/{id}',
      this.sdk.mergeDefaultPayload(payload),
    );
  }
  async getCategoryList(
    payload: FetchOptions<FilterKeys<paths['/message_category'], 'get'>>,
  ) {
    return this.client.get(
      '/message_category',
      this.sdk.mergeDefaultPayload(payload),
    );
  }
  async getNotificationGroup(
    payload: FetchOptions<FilterKeys<paths['/notification_group'], 'get'>>,
  ) {
    return this.client.get(
      '/notification_group',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async getNotificationSetting(
    payload: FetchOptions<FilterKeys<paths['/notification_setting'], 'get'>>,
  ) {
    return this.client.get(
      '/notification_setting',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async updateNotification(
    payload: FetchOptions<FilterKeys<paths['/notification_setting'], 'put'>>,
  ) {
    return this.client.put(
      '/notification_setting',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  async deactivateAllNotificationSetting(
    payload: FetchOptions<
      FilterKeys<paths['/notification_setting/deactivate'], 'put'>
    >,
  ) {
    return this.client.put(
      '/notification_setting/deactivate',
      this.sdk.mergeDefaultPayload(payload),
    );
  }
}

export default OBNotificationClient;
