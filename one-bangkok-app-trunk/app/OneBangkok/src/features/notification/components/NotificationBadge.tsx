import React, {useCallback, useEffect} from 'react';
import {IconButtonWithBadge} from '~/components/IconButtonWithBadge';
import {useNavigation} from '~/navigations/AppNavigation';
import notificationAction, {useNotificationCategoryState} from '../store';
// import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import {WebSocketEventNames} from '~/screens/WebSocketEvent';
import {useScreenHook} from '~/services/EventEmitter';
import {View} from 'react-native';
import clsx from 'clsx';

interface NotificationBadgeProps {
  isDark: boolean;
  isRefreshing?: boolean;
  onPress?: () => void;
}

export const NotificationBadge = ({
  isDark,
  isRefreshing = false,
  onPress,
}: NotificationBadgeProps) => {
  const navigation = useNavigation();
  const notificationCategoryState = useNotificationCategoryState();
  const unreadMessageCount =
    notificationCategoryState.unreadMessageCount.value ?? 0;

  const handleSetIconBadgeCount = (badgeCount: number) => {
    // PushNotificationIOS.setApplicationIconBadgeNumber(badgeCount);
    PushNotification.setApplicationIconBadgeNumber(badgeCount);
  };

  const fetchUnreadMessageCategories = useCallback(async () => {
    await notificationAction.getAllUnreadMessageCount();
    handleSetIconBadgeCount(notificationCategoryState.unreadMessageCount.get());
  }, [notificationCategoryState]);

  useEffect(() => {
    fetchUnreadMessageCategories();
  }, [fetchUnreadMessageCategories]);

  useEffect(() => {
    if (isRefreshing) {
      fetchUnreadMessageCategories();
    }
  }, [isRefreshing, fetchUnreadMessageCategories]);

  useScreenHook('WebSocket', async event => {
    const data = event.data;
    switch (event.name) {
      case WebSocketEventNames.NOTIFICATION_COUNTING_UPDATED:
        notificationCategoryState.unreadMessageCount.set(
          data.unread_message_count,
        );
        handleSetIconBadgeCount(data.unread_message_count);
        break;
      default:
        break;
    }
  });

  return (
    <View
      className={clsx({
        'mr-4': unreadMessageCount > 99,
      })}>
      <IconButtonWithBadge
        badgeCount={unreadMessageCount}
        color={isDark ? '#000' : '#FFFFFF'}
        type="bell"
        width={24}
        height={24}
        onPress={() => {
          navigation.navigate('AllNotificationsScreen');
          if (onPress) {
            onPress();
          }
        }}
        rotation={0}
      />
    </View>
  );
};
