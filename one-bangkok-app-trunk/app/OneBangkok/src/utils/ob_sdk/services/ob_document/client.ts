import createClient, {FetchOptions, FilterKeys} from 'openapi-fetch';
import {paths} from './openapi_interfaces';

class OBDOCUMENTClient {
  private client;
  private sdk;

  constructor(sdk: any) {
    this.sdk = sdk;
    this.client = createClient<paths>({
      baseUrl: `${sdk.baseUrl}/ob-document`,
    });
  }

  async getCategory(
    payload: FetchOptions<FilterKeys<paths['/category'], 'get'>>,
  ) {
    return this.client.get('/category', this.sdk.mergeDefaultPayload(payload));
  }

  async getType(payload: FetchOptions<FilterKeys<paths['/type'], 'get'>>) {
    return this.client.get('/type', this.sdk.mergeDefaultPayload(payload));
  }

  async getDocuments(
    payload: FetchOptions<FilterKeys<paths['/documents'], 'get'>>,
  ) {
    return this.client.get('/documents', this.sdk.mergeDefaultPayload(payload));
  }

  async getDetail(
    payload: FetchOptions<FilterKeys<paths['/documents/{id}'], 'get'>>,
  ) {
    return this.client.get(
      '/documents/{id}',
      this.sdk.mergeDefaultPayload(payload),
    );
  }

  // feedback
  async createFeedback(
    payload: FetchOptions<FilterKeys<paths['/feedback'], 'post'>>,
  ) {
    return this.client.post('/feedback', this.sdk.mergeDefaultPayload(payload));
  }

  async getFeedback(
    payload: FetchOptions<FilterKeys<paths['/feedback'], 'get'>>,
  ) {
    return this.client.get('/feedback', this.sdk.mergeDefaultPayload(payload));
  }

  async updateFeedback(
    payload: FetchOptions<FilterKeys<paths['/feedback'], 'put'>>,
  ) {
    return this.client.put(
      '/feedback/{id}',
      this.sdk.mergeDefaultPayload(payload),
    );
  }
}

export default OBDOCUMENTClient;
