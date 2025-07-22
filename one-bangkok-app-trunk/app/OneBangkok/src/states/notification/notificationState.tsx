import {hookstate} from '@hookstate/core';

export type NotificationData = {
  id: string;
  read: boolean;
  created_at: string;
  title: string;
  sub_title: string;
  thumnail?: string;
  deeplink?: string;
  category: string;
  data: {
    id: string;
    data: Record<string, never>;
  }[];
};

export type NotificationCategoryData = {
  id: string;
  name: string;
};

export type NotificationResponse = {
  data?: NotificationData[];
  category?: NotificationCategoryData[];
  hasUnreadNotification: boolean;
};

const initialState: NotificationResponse = {
  data: [],
  category: [],
  hasUnreadNotification: false,
};

const notificationState = hookstate<NotificationResponse>(initialState);
export const notificationActiveTabState = hookstate<string>('All');

export default notificationState;
