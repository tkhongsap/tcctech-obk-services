import axios, {AxiosInstance} from 'axios';
import Config from 'react-native-config';

class ArtCultureHttpClient {
  private static _instance: ArtCultureHttpClient;
  private static _axiosInstance: AxiosInstance;

  public static get instance() {
    if (!this._instance || !this._axiosInstance) {
      this._instance || (this._instance = new this());
      this._axiosInstance = axios.create({
        baseURL: Config.ART_C_BASEURL,
      });

      this._axiosInstance.interceptors.request.use(request => {
        request.headers = Object.assign({}, request.headers);

        if (
          request.method &&
          ['post', 'put', 'delete', 'patch'].includes(request.method)
        ) {
          request.data = {
            ...request.data,
          };
        }

        return request;
      });
    }

    return this._axiosInstance;
  }
}

export const artCultureHttpClient = ArtCultureHttpClient.instance;
