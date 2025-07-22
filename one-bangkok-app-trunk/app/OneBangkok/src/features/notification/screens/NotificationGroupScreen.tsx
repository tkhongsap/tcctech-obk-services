import React, {useCallback, useEffect, useState} from 'react';
import {Screen} from '~/components/templates/Screen';
import {Header} from '~/components/molecules/Header';
import t from '~/utils/text';
import {ScrollView} from 'react-native';
import {Spacing} from '~/components/atoms/Spacing';
import {ItemList, ListSection, modalActions} from '~/components/molecules';
import {Confirmation} from '~/components/organisms/GenericModal';
import {hideLoading, showLoading} from '~/states/loadingState';
import notificationSettingService from '~/services/NotificationSettingService';
import NotificationSettingList from '../components/NotificationSettingList';
import {NotificationSettingResult} from 'ob-notification-sdk/dist/api';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '~/navigations/AppNavigation';
import {logScreenView} from '~/utils/logGA';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'NotificationGroupScreen'
>;

const NotificationGroupScreen = ({
  route: {
    params: {notificationGroupSetting},
  },
}: Props) => {
  const [enableSettingLists, setEnableSettingLists] = useState({
    email: [],
    in_app: [],
    push_noti: [],
    sms: [],
  });
  const [dataSetting, setDataSetting] = useState<NotificationSettingResult[]>(
    notificationGroupSetting,
  );

  const fetchData = useCallback(async () => {
    try {
      showLoading();
      const notificationGroupSetting =
        await notificationSettingService.getNotificationGroupSetting();
      if (notificationGroupSetting.data) {
        setDataSetting(
          notificationGroupSetting.data as NotificationSettingResult[],
        );
      }
      hideLoading();
    } catch (error) {
      hideLoading();
      console.error('Cannot fetch notification group: ', error);
    }
  }, []);

  const mapData = useCallback(() => {
    const notificationMap = {
      email: [],
      in_app: [],
      push_noti: [],
      sms: [],
    };

    dataSetting.forEach((notification: any) => {
      const {
        setting_email_enabled,
        setting_in_app_enabled,
        setting_push_enabled,
        setting_sms_enabled,
      } = notification.notification_group;

      if (setting_email_enabled) {
        notificationMap.email.push(notification);
      }
      if (setting_in_app_enabled) {
        notificationMap.in_app.push(notification);
      }
      if (setting_push_enabled) {
        notificationMap.push_noti.push(notification);
      }
      if (setting_sms_enabled) {
        notificationMap.sms.push(notification);
      }
    });
    setEnableSettingLists(notificationMap);
  }, [dataSetting]);

  useEffect(() => {
    mapData();
  }, [mapData]);

  const checkAllEnabled = () => {
    if (!dataSetting) {
      return false;
    }
    for (const item of dataSetting) {
      if (
        item.email_enabled === false ||
        item.in_app_enabled === false ||
        item.push_enabled === false ||
        item.sms_enabled === false
      ) {
        return false; // At least one object has a false value, return false
      }
    }
    return true; // All objects have true values, return true
  };

  const handleOnPress = (isEnable: boolean) => {
    const handleOnContinue = async () => {
      modalActions.hide();
      const confirmDeactivated =
        await notificationSettingService.activateOrDeactivateAll(isEnable);
      if (confirmDeactivated) {
        fetchData();
      }
    };
    if (isEnable) {
      handleOnContinue();
    } else {
      modalActions.setContent(
        <Confirmation
          title={t(
            'Drawer__Deactivate_notification__Header',
            'Deactivate all optional notifications?',
          )}
          textConfirmButton={t(
            'Drawer__Deactivate_notification__Button_done',
            'Deactivate notifications',
          )}
          description={t(
            'Drawer__Deactivate_notification__Body',
            'You will still receive security and activity alerts that are critical to your account.',
          )}
          onCancel={() => modalActions.hide()}
          onContinue={handleOnContinue}
        />,
      );
      modalActions.show();
    }
  };
  useEffect(() => {
    logScreenView('NotificationGroupScreen');
  }, []);
  return (
    <Screen>
      <Header
        leftAction="goBack"
        title={t('General__Notifications', 'Notifications')}
      />
      <ScrollView className="w-full px-5">
        <Spacing height={10} />
        <ListSection title={''}>
          <ItemList
            items={[
              {
                toggle: checkAllEnabled(),
                rightElement: 'switch',
                title: t(
                  'Setting__Notification__Allow_all_notifications',
                  'Allow all notifications',
                ),
                onSwitch: () => {
                  handleOnPress(!checkAllEnabled());
                },
                key: 'allow_all_notifications',
                textDescriptionColor: 'muted',
                textTitleWeight: 'medium',
                description: t(
                  'Setting__Notification__Allow_all_notifications_body',
                  'Stay informed by enabling all notifications',
                ),
              },
            ]}
          />
        </ListSection>
        <Spacing height={10} />
        <NotificationSettingList
          data={enableSettingLists.email}
          keyValue="email_enabled"
          setDataSetting={setDataSetting}
          dataSetting={dataSetting}
        />
        <NotificationSettingList
          data={enableSettingLists.push_noti}
          keyValue="push_enabled"
          setDataSetting={setDataSetting}
          dataSetting={dataSetting}
        />
        {/* <NotificationSettingList
          data={enableSettingLists.sms}
          keyValue="sms_enabled"
          setDataSetting={setDataSetting}
          dataSetting={dataSetting}
        />
        <NotificationSettingList
          data={enableSettingLists.in_app}
          keyValue="in_app_enabled"
          setDataSetting={setDataSetting}
          dataSetting={dataSetting}
        /> */}

        <Spacing height={30} />
      </ScrollView>
    </Screen>
  );
};

export default NotificationGroupScreen;
