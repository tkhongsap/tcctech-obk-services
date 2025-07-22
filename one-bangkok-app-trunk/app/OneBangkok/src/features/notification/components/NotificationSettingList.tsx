import {View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import notificationSettingService, {
  NotificationSetting,
} from '~/services/NotificationSettingService';
import {ItemList, ListItemProps, ListSection} from '~/components/molecules';
import t from '~/utils/text';
import {Spacing} from '~/components/atoms';
import {isEmpty} from 'lodash';
import {NotificationSettingResult} from 'ob-notification-sdk/dist/api';
import appLanguageState from '~/states/appLanguage/appLanguageState';

interface NotificationSettingListsType {
  title: string;
  items: ListItemProps[];
}

interface NotificationSettingListProps {
  data: NotificationSettingResult[];
  keyValue: keyof NotificationSetting;
  setDataSetting: any;
  dataSetting: NotificationSettingResult[];
}

interface NotificationSettingListsProps {
  notificationSettingLists?: NotificationSettingListsType;
}

const NotificationSettingBody = ({
  notificationSettingLists,
}: NotificationSettingListsProps) => {
  if (isEmpty(notificationSettingLists)) {
    return <View />;
  }
  return (
    <View key={`list-section-${notificationSettingLists.title}`}>
      <Spacing height={24} />
      <ListSection title={notificationSettingLists.title}>
        <ItemList items={notificationSettingLists.items} />
      </ListSection>
    </View>
  );
};

const NotificationSettingList = (props: NotificationSettingListProps) => {
  const {data, keyValue, dataSetting, setDataSetting} = props;
  const [mappedLists, setMappedLists] =
    useState<NotificationSettingListsProps>();
  let currentLanguage =
    appLanguageState.currentLanguage.get() ||
    appLanguageState.defaultLanguage.get();

  const mapDescription = (notiGroup: string) => {
    switch (notiGroup) {
      case 'Visitor checked in':
        return t(
          'Setting__Notification__Visitor_checked_in_body',
          'Instantly identify arrivals through real-time alerts',
        );
      case 'News and events':
        return t('General__Noti_promotion_description', 'Get notified about Events, News and Promotions');
      case 'App update':
        return t('Settings__Notification__App_update_body', 'Stay ahead with the latest enhancements');
      case 'Announcement':
        return t(
          'Settings__Notification__Announcement_body',
          'Stay informed about critical updates and important information',
        );
      case 'Building service':
        return t('Setting__Notification__Building_service_body', 'Building update with maintenance notifications');
      case 'Security notification':
        return t(
          'Setting__Notification__Security_notification_body',
          'Stay informed with updates, activities, and important account events sent to your inbox.',
        );
      case 'Booking':
        return t(
          'Setting__Notification__Booking_body', 
          'Receive notifications for booking status'
        );
      default:
        return t('no_key', 'default description');
    }
  };
  const notiSetting: {[key: string]: string} = {
    email_enabled: t('General__Email', 'Email'),
    in_app_enabled: t('General__In-App', 'In-App'),
    push_enabled: t('General__Push_noti', 'Push notification'),
    sms_enabled: t('General__SMS', 'SMS'),
  };
  const renderData = useCallback(async () => {
    const notificationGroup: ListItemProps[] = [];
    data?.forEach(item => {
      notificationGroup.push({
        rightElement: 'switch',
        title: item.notification_group.display_name[currentLanguage ?? 'en'],
        onSwitch: async (newValue: boolean) => {
          const notificationSetting =
            await notificationSettingService.updateSetting({
              id: item.id,
              [keyValue]: !item[keyValue],
            });
          if (notificationSetting.data?.result) {
            const index =
              dataSetting?.findIndex(setting => setting.id === item.id) ?? -1;
            if (index > -1) {
              setDataSetting(prevState => {
                const newState = [...prevState]; // Create a new array
                newState[index] = {...prevState[index]}; // Create a new object
                newState[index][keyValue] = newValue; // Update the property in the object
                return newState; // Return the new array
              });
            }
          }
        },
        key: `${item.id}_${keyValue}`,
        textDescriptionColor: 'muted',
        textTitleWeight: 'medium',
        description: mapDescription(item.notification_group.name),
        toggle: item[keyValue] as boolean,
      });
    });

    const newMappedLists: NotificationSettingListsProps = {
      notificationSettingLists: {
        title: notiSetting[keyValue],

        items: notificationGroup.map(item => ({
          ...item,
        })),
      },
    };
    setMappedLists(newMappedLists);
  }, [data]);

  useEffect(() => {
    renderData();
  }, [renderData]);

  return (
    <NotificationSettingBody
      notificationSettingLists={mappedLists?.notificationSettingLists}
    />
  );
};
export default NotificationSettingList;
