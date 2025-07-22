import OBDOCUMENTClient from './services/ob_document/client';
import OBIAMClient from './services/ob_iam/client';
import {get, merge} from 'lodash';
import OBNotificationClient from './services/ob_notification/client';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import Config from 'react-native-config';

const GATEWAY_BASEURL: Record<string, string> = {
  dev: Config.GATEWAY_BASEURL!,
};

class OBSDK {
  public env: string = 'dev';
  public baseUrl: string = 'https://dev.glorymtel.xyz';
  public iam;
  public notification;
  public document;
  public accessToken?: string;

  constructor(options?: OBSDKInitOptions) {
    if (options?.env) {
      this.env = options.env;
    }

    if (options?.baseUrl) {
      this.baseUrl = options.baseUrl;
    } else {
      this.baseUrl = GATEWAY_BASEURL[this.env];
    }

    this.iam = new OBIAMClient(this);
    this.notification = new OBNotificationClient(this);
    this.document = new OBDOCUMENTClient(this);
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  mergeDefaultPayload(payload: Record<string, any>) {
    const currentLanguage = appLanguageState.currentLanguage.get();
    const defaultPayload = {
      headers: {
        'accept-language': currentLanguage,
        ...get(payload, 'params.header', {}),
      },
    };

    return merge(defaultPayload, payload);
  }
}

export default new OBSDK();
