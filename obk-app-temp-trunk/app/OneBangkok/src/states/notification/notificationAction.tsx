import authenState from '../authen/authenState';
import notificationState from './notificationState';
import {showLoading, hideLoading} from '../loadingState';
import {schemas} from '~/utils/ob_sdk/services/ob_notification/index.interface';
import {some} from 'lodash';

import {headerAccessToken} from '~/helpers/api';
import * as OB_NOTI_SDK from 'ob-notification-sdk';

const notificationAction = {
  fetchNotifcation: async (category?: string) => {
    try {
      showLoading();

      if (authenState.token.value) {
        const response = await OB_NOTI_SDK.client.messageShow('','',undefined,undefined,undefined,undefined,undefined,category,headerAccessToken())
      
        const res = response?.data.data;

        let messageResponse: schemas['FindAllMessageResponse']['data'];

        if (res) {
          messageResponse = res.data;

          notificationState.set(p => {
            p.data = res.data;
            p.hasUnreadNotification = some(messageResponse, {read: false});
            return p;
          });
        }
      }

      hideLoading();
    } catch (error: any) {
      hideLoading();
    }
  },
  findMessageType: async () => {
    try {
      showLoading();
      if (authenState.token.value) {
        const response = await OB_NOTI_SDK.client.messageCategoryShow('','',headerAccessToken())

        const res = response?.data;

        if (res) {
          notificationState.set(p => {
            p.category = res.data;
            return p;
          });
        }
      }

      hideLoading();
    } catch (error: any) {
      console.log(error);
      hideLoading();
    }
  },
  fetchNotificationPagiantion: async (
    category: string,
    page: number,
    limit?: number,
  ) => {
    try {
      if (authenState.token.value) {
        const response = await OB_NOTI_SDK.client.messageShow('','',limit ?? 25,page,undefined,undefined,true,category,headerAccessToken())


        return response?.data.data;
      }
    } catch (error: any) {
      console.log(error);
    }
  },
  getMessage: async (messageId: string) => {
    if (authenState.token.value) {
      const result = await OB_NOTI_SDK.client.messageIndex('','',messageId,undefined,headerAccessToken())
      if (result) {
        return result.data?.data;
      } else {
        return null;
      }
    }
  },
};

export default notificationAction;
