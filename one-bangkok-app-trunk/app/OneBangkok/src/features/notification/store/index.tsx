import authenState from '~/states/authen/authenState';

import {headerAccessToken} from '~/helpers/api';
import * as OB_NOTI_SDK from 'ob-notification-sdk';
import {hookstate, useHookstate} from '@hookstate/core';

interface Notification {
  unreadMessageCount: number;
}

export const notificationCategoryState = hookstate<Notification>({
  unreadMessageCount: 0,
});

export const useNotificationCategoryState = () =>
  useHookstate(notificationCategoryState);

const notificationAction = {
  getAllUnreadMessageCategory: async () => {
    try {
      if (authenState.token.value) {
        const response = await OB_NOTI_SDK.client.messageCategoryCount(
          '',
          '',
          '',
          false,
          headerAccessToken(),
        );

        return response.data?.data;
      }
      return;
    } catch (error) {
      console.log(error);
    }
  },
  fetchNotificationPagiantion: async (
    category: string,
    page: number,
    totalPage: number,
  ) => {
    try {
      if (page > 0 && page > totalPage) {
        return;
      }
      if (authenState.token.value) {
        const response = await OB_NOTI_SDK.client.messageShow(
          '',
          '',
          25,
          page,
          undefined,
          undefined,
          true,
          category === 'All' ? undefined : category,
          headerAccessToken(),
        );

        return response?.data?.data;
      }
    } catch (error: any) {
      console.log(error);
    }
  },
  getMessage: async (messageId: string) => {
    if (authenState.token.value) {
      const result = await OB_NOTI_SDK.client.messageIndex(
        '',
        '',
        messageId,
        undefined,
        headerAccessToken(),
      );

      if (result) {
        return result.data?.data;
      } else {
        return null;
      }
    }
  },
  markAsRead: async (messageId: string) => {
    if (authenState.token.value) {
      const result = await OB_NOTI_SDK.client.messageUpdate(
        '',
        '',
        messageId,
        {read: true},
        headerAccessToken(),
      );

      if (result) {
        return result.data?.data;
      } else {
        return null;
      }
    }
  },
  reads: async (
    include?: string[],
    exclude?: string[],
  ): Promise<boolean | null | undefined> => {
    if (authenState.token.value) {
      const result = await OB_NOTI_SDK.client.messageRead(
        '',
        '',
        {
          include,
          exclude,
        },
        headerAccessToken(),
      );
      if (result) {
        return result.data.data?.result;
      } else {
        return null;
      }
    }
  },
  deletes: async (
    include?: string[],
    exclude?: string[],
  ): Promise<boolean | null | undefined> => {
    if (authenState.token.value) {
      const result = await OB_NOTI_SDK.client.messageDestroy(
        '',
        {
          include,
          exclude,
        },
        headerAccessToken(),
      );
      if (result) {
        return result.data.data?.result;
      } else {
        return null;
      }
    }
    return null;
  },
  getCategoryList: async () => {
    if (authenState.token.value) {
      const result = await OB_NOTI_SDK.client.messageCategoryShow(
        '',
        '',
        headerAccessToken(),
      );
      if (result) {
        return result.data?.data;
      } else {
        return null;
      }
    }
  },
  getAllUnreadMessageCount: async () => {
    if (authenState.token.value) {
      const unreadMessageCategories =
        await notificationAction.getAllUnreadMessageCategory();
      if (unreadMessageCategories) {
        const formattedCategories = new Map<string, number>(
          unreadMessageCategories.map((data: {name: any; total: any}) => {
            return [data.name, data.total];
          }),
        );
        const allUnreadMessageCount = formattedCategories.get('All');
        if (!allUnreadMessageCount) {
          notificationCategoryState.unreadMessageCount.set(0);
        } else {
          notificationCategoryState.unreadMessageCount.set(
            allUnreadMessageCount,
          );
        }
      }
    }
  },
  resetBadgeCount: () => {
    notificationCategoryState.unreadMessageCount.set(0);
  },
};

export default notificationAction;
