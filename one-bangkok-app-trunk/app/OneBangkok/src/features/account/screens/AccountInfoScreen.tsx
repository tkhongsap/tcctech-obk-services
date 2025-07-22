import {DrawerActions} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, ScrollView, Pressable} from 'react-native';
import {Screen} from '~/components/templates';
import {Button, Header, useModal} from '~/components/molecules';
import {useNavigation} from '~/navigations/AppNavigation';
import accountAction from '~/states/account/accountAction';
import t from '~/utils/text';
import {Spacing, Text} from '~/components/atoms';
import {authenStateAction} from '~/states/authen/authenState';
import SecurityList from '../components/SecurityList';
import {ScreenHookEventType, useScreenHook} from '~/services/EventEmitter';
import {OTPVerificationScreenEventNames} from '~/features/otp/screens/OTPVerificationScreenEvent';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import IdentityList from '../components/IdentitylList';
import PersonalInfoList from '../components/PersonalInfoList';
import {errorCodeOBIAM} from '~/utils/errorCode';
import {accountState, accountStateAction} from '~/states/account/accountState';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {find, first, get, isEmpty, isUndefined} from 'lodash';
import {ProviderType} from '~/utils/ob_sdk/services/ob_iam/index.interface';
import BuildingAccessList from '../components/BuildingAccessList';
import {
  memberAction,
  memberState,
} from '~/features/buildingAccess/store/member';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import DateTime from '~/utils/datetime';
import {resetHeader} from '~/helpers/api';
import locationUtils, {Location} from '~/utils/beacon/locations';
import {logScreenView} from '~/utils/logGA';
import residentialTenantState from '~/states/residentialTenant/residentialTenantState';
import notificationAction from '~/features/notification/store';
// import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

const SignOutConfirmation = () => {
  const navigation = useNavigation();
  const [_modalState, modalActions] = useModal();

  return (
    <>
      <Text weight="medium">{t('General__Sign_out', 'Sign out')}</Text>
      <Text>
        {t('Drawer__Sign_out__Body', 'Are you sure you want to sign out?')}
      </Text>
      <Spacing height={16} />
      <View className="space-y-3">
        <Button
          color="navy"
          testID="account-info-confirm-sign-out-id"
          title={t('General__Sign_out', 'Sign out')}
          onPress={async () => {
            memberAction.reset();
            modalActions.hide();
            await authenStateAction.logout();
            notificationAction.resetBadgeCount();
            // PushNotificationIOS.setApplicationIconBadgeNumber(0);
            PushNotification.setApplicationIconBadgeNumber(0);
            resetHeader();
            navigation.dispatch(DrawerActions.closeDrawer());
            navigation.reset({routes: [{name: 'SignInScreen'}]});
          }}
        />
        <Button
          title={t('General__Cancel', 'Cancel')}
          outlined={true}
          onPress={modalActions.hide}
        />
      </View>
    </>
  );
};

const DeleteAccountConfirmation = () => {
  const navigation = useNavigation();
  const [_modalState, modalActions] = useModal();

  return (
    <>
      <Text weight="medium">
        {t(
          'Drawer__Delete_account__Header',
          'Are you sure you want to delete account?',
        )}
      </Text>
      <Text color="subtitle-muted">
        {t(
          'Drawer__Delete_account__Body',
          'You have 30 days to reactivate your account by signing in. After this period all the data will be lost.',
        )}
      </Text>
      <Spacing height={16} />
      <View className="space-y-3">
        <Button
          title={t('Drawer__Delete_account__Button_done', 'Delete my account')}
          color="fire-engine-red"
          outlined={true}
          onPress={async () => {
            await accountAction.deleteAccount();
            modalActions.hide();
            memberAction.reset();
            await authenStateAction.logout(true);
            navigation.navigate('AnnouncementScreen', {
              type: 'success',
              title: t(
                'Announcement__Delete_account_success__Header',
                'Account deleted\nsuccessfully',
              ),
              message: t(
                'Announcement__Delete_account_success__Body',
                'Thanks for using our application.\nWe look forward to seeing you again.',
              ),
              buttonText: t(
                'Announcement__Delete_account_success__Button',
                'Explore One Bangkok',
              ),
              screenHook: 'AccountInfoScreen',
            });
          }}
        />
        <Button
          title={t('General__Cancel', 'Cancel')}
          outlined={true}
          onPress={modalActions.hide}
        />
      </View>
    </>
  );
};

const ExitConfirmation = ({onContinue, onCancel}: any) => {
  return (
    <>
      <Text size="B1" weight="medium">
        {t('General__Leave_now?', 'Leave now?')}
      </Text>
      <Text color="muted" size="B2">
        {t(
          'Drawer__Warning_leave_page__Body',
          'All previous information entered will be lost.',
        )}
      </Text>
      <Spacing height={16} />
      <View className="space-y-3">
        <Button
          color="navy"
          title={t('General__Leave_this_page', 'Leave this page')}
          onPress={onContinue}
        />
        <Button
          title={t('General__Cancel', 'Cancel')}
          outlined={true}
          onPress={onCancel}
        />
      </View>
    </>
  );
};

const AccountDetailSection = ({locations}: {locations?: Location[]}) => {
  const language =
    appLanguageState.currentLanguage.get() === 'th' ? 'nameTh' : 'nameEn';
  const languages = appLanguageState.currentLanguage.get()
    ? appLanguageState.currentLanguage.get()
    : appLanguageState.defaultLanguage.get();
  const companyName = memberState.tenant.value?.display_name[language] || '';
  const defaultFloor = memberState.default_floor.value;
  const towers = memberState.towers.value;
  const tower = first(towers);
  const towerName = tower?.display_name[language] || tower?.name;

  let floorName = '-';
  if (!isEmpty(locations)) {
    const language =
      appLanguageState.currentLanguage.get() === 'th' ? 'en' : 'th';
    const floor = find(locations, {id: defaultFloor});
    if (!isUndefined(floor)) {
      if (!isEmpty(floor.floor?.display_name)) {
        floorName = floor.floor?.display_name[language];
      } else {
        floorName = floor.floor?.name;
      }
    }
  }

  const joinedDate =
    (!isEmpty(accountState.profile.value) &&
      DateTime.formatDate(
        accountState.profile.value!.created_at,
        'DD MMMM YYYY',
        languages,
      )) ||
    '';

  return (
    <View>
      <Text size="H1" weight="bold" className="text-[40px]">
        {accountStateAction.getFullName()}
      </Text>
      <Text size="B2" weight="regular" color="subtitle-muted">
        {t('General__Member_since', 'Member since: {{joinedDate}}', {
          joinedDate,
        })}
      </Text>
      {!isEmpty(companyName) && (
        <View>
          <Spacing height={16} />
          <Text size="C1" weight="regular" color="subtitle-muted">
            {t('General__Company', 'Company')}
          </Text>
          <Text size="B1" weight="regular">
            {companyName}
          </Text>
          <Spacing height={16} />
          <View className="flex-row ">
            <View className="w-1/2">
              <Text size="C1" weight="regular" color="subtitle-muted">
                {t('General__Building', 'Building')}
              </Text>
              <Text size="B1" weight="regular">
                {towerName}
              </Text>
            </View>
            <View className="w-1/2">
              <Text size="C1" weight="regular" color="subtitle-muted">
                {t('General__Floor', 'Floor')}
              </Text>
              <Text size="B1" weight="regular">
                {floorName}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const AccountInfoScreen = () => {
  const [_modalState, modalActions] = useModal();
  const [locations, setLocations] = useState<Location[]>();
  const navigation = useNavigation();
  const {getIdentities} = accountAction;
  const insets = useSafeAreaInsets();

  const getLocations = async () => {
    const result = await locationUtils.getLocation();
    if (result) {
      setLocations(result.locations);
    }
  };

  useEffect(() => {
    logScreenView('AccountInfoScreen');
  }, []);

  useEffect(() => {
    getLocations();
    getIdentities();
  }, [getIdentities]);

  const handleOnSignOut = () => {
    modalActions.setContent(<SignOutConfirmation />);
    modalActions.show();
  };

  const handleOnDeleteAccount = () => {
    modalActions.setContent(<DeleteAccountConfirmation />);
    modalActions.show();
  };

  const handleOnPressLeftAction = () => {
    modalActions.setContent(
      <ExitConfirmation
        onContinue={() => {
          modalActions.hide();
          navigation.goBack();
        }}
        onCancel={() => modalActions.hide()}
      />,
    );
    modalActions.show();
  };

  const goToOtpScreen = (
    isEmailProvider: boolean,
    identity: object,
    screenHook: string,
  ) => {
    navigation.navigate('OTPVerificationScreen', {
      headText: {
        title: isEmailProvider
          ? t('General__Confirm_number', 'Confirm your phone number')
          : t('General__Confirm_your_email', 'Confirm your email'),
      },
      identity: {
        identifier: get(identity, 'identifier', ''),
        provider: get(identity, 'provider', '') as ProviderType,
      },
      description: t('General__Enter_code', 'Enter the code we just sent you'),
      screenHook: screenHook,
      leftAction: 'close',
      title: t('General__Change_password', 'Change Password'),
      allowChangeIdentifier: false,
    });
  };

  const handleOnContinueEvent = (
    event: ScreenHookEventType,
    prevEvent: ScreenHookEventType,
  ) => {
    if (prevEvent?.name === 'OTPVerificationScreen.OTP_INVALID') {
      const {isEmailProvider, identity, screenHook} = event.data;
      goToOtpScreen(isEmailProvider, identity, screenHook);
    } else if (
      event.from.params.type === 'success' ||
      (event.from.params.type === 'wait' &&
        event.data?.error?.code === errorCodeOBIAM.IAM_OTP_001)
    ) {
      navigation.dispatch(DrawerActions.closeDrawer());
      navigation.reset({routes: [{name: 'SignInScreen'}]});
    }
  };

  useScreenHook('AccountInfoScreen', async (event, prevEvent) => {
    const {name} = event;
    switch (name) {
      case OTPVerificationScreenEventNames.OTP_VERIFIED:
        navigation.navigate('ChangeOrSetPasswordScreen', {
          header: t('General__Change_password', 'Change password'),
          isSetupPassword: false,
        });
        break;
      case OTPVerificationScreenEventNames.ABORT:
        handleOnPressLeftAction();
        break;
      case AnnouncementScreenEventNames.CONTINUE:
        handleOnContinueEvent(event, prevEvent);
        break;
      default:
        break;
    }
  });

  return (
    <Screen>
      <Header
        title={t('General__My_account', 'My account')}
        leftAction="goBack"
      />
      <ScrollView
        className="px-8 w-full"
        testID="account-info-scroll-view-id"
        contentContainerStyle={{paddingBottom: insets.bottom}}>
        <Pressable>
          <Spacing height={24} />
          <AccountDetailSection locations={locations} />
          <Spacing height={24} />
          <PersonalInfoList />
          <BuildingAccessList
            isFsMember={memberState.is_fs_member.value}
            isActiveResidential={residentialTenantState.isActive.value}
          />
          <SecurityList />
          <IdentityList />
          <Spacing height={40} />
          <Button
            testID="account-info-sign-out-id"
            title={t('General__Sign_out', 'Sign out')}
            outlined={true}
            onPress={handleOnSignOut}
          />
          <Spacing height={8} />
          <Button
            title={t('General__Delete_account', 'Delete account')}
            color="fire-engine-red"
            ghost={true}
            onPress={handleOnDeleteAccount}
          />
        </Pressable>
      </ScrollView>

      {/* <InfoList /> */}
    </Screen>
  );
};

export default AccountInfoScreen;
