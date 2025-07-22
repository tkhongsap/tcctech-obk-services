import {ScrollView, View, Linking, Pressable} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '~/navigations/AppNavigation';
import {Screen} from '~/components/templates/Screen';
import {Button, HeadText, Header} from '~/components/molecules';
import t from '~/utils/text';
import {IconType, Spacing, Text} from '~/components/atoms';
import accountAction from '~/states/account/accountAction';
import {useAuthenState} from '~/states/authen/authenState';
import {DrawerActions, StackActions} from '@react-navigation/native';
import {settingStateAction} from '~/features/setting/store';
import {ListSection} from '~/components/molecules/ListSection';
import {ItemList} from '~/components/molecules/ItemList';
import {ListItem, ListItemProps} from '~/components/molecules/ListItem';
import firebaseConfigState from '~/states/firebase';
import {version} from '../../../../package.json';
import {useAccountState} from '~/states/account/accountState';
import {
  memberAction,
  memberState,
} from '~/features/buildingAccess/store/member';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {HeaderImage} from '~/components/molecules/HeaderImage';
import getTheme from '~/utils/themes/themeUtils';
import {hideLoading, showLoading} from '~/states/loadingState';
import notificationSettingService from '~/services/NotificationSettingService';
import {NotificationSettingResult} from 'ob-notification-sdk/dist/api';
interface SettingListsType {
  title: string;
  icon: IconType;
  items: ListItemProps[];
}

interface SettingBodyProps {
  SettingLists: SettingListsType[];
}
const SettingBody = ({SettingLists}: SettingBodyProps) => {
  const lists = SettingLists.map(section => {
    return (
      <View key={`list-section-${section.title}`}>
        <Spacing height={24} />
        <ListSection title={section.title} icon={section.icon}>
          <ItemList items={section.items} />
        </ListSection>
      </View>
    );
  });
  return <View>{lists}</View>;
};

const SettingScreen = () => {
  const navigation = useNavigation();

  const {token} = useAuthenState();
  const {profile: globalProfile} = useAccountState();
  const [profile, setProfile] = useState<any>(globalProfile.value || null);

  const getMemberId = useCallback(async () => {
    await memberAction.getMemberId();
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      const _profile = await accountAction.getProfile();
      setProfile(_profile);
      await settingStateAction.load();
    };

    loadProfile();
    getMemberId();
  }, [getMemberId, token]);

  const firstName = globalProfile.value?.first_name;
  const middleName = globalProfile.value?.middle_name;
  const lastName = globalProfile.value?.last_name;
  const language =
    appLanguageState.currentLanguage.get() === 'th' ? 'nameTh' : 'nameEn';

  const companyName = memberState.tenant.value?.display_name[language] || '';

  const fetchNotificationsData = useCallback(async () => {
    try {
      showLoading();
      const notificationGroupSetting =
        await notificationSettingService.getNotificationGroupSetting();
      if (notificationGroupSetting.data) {
        navigation.navigate('NotificationGroupScreen', {
          notificationGroupSetting:
            notificationGroupSetting.data as NotificationSettingResult[],
        });
      }
      hideLoading();
    } catch (error) {
      hideLoading();
      console.error('Cannot fetch notification group: ', error);
    }
  }, []);

  const SettingLists: SettingListsType[] = [
    {
      title: t('General__App_preferences', 'App preferences'),
      icon: 'cog',
      items: [
        {
          rightElement: 'right',
          title: t('General__Languages', 'Languages'),
          onPress: () => {
            navigation.navigate('LanguageSettingsScreen');
          },
          key: 'setting-language-item',
        },
        {
          rightElement: 'right',
          title: t('General__Notifications', 'Notifications'),
          onPress: () => {
            fetchNotificationsData();
          },
          key: 'setting-notification-item',
        },
      ],
    },
    {
      title: t('General__Support', 'Support'),
      icon: 'support',
      items: [
        ...(firebaseConfigState.enable_faq_section.value
          ? [
              {
                rightElement: 'right',
                title: t('General__FAQs', 'FAQs'),
                onPress: () => {
                  navigation.navigate('FaqScreen');
                },
                key: 'support-faq-item',
              } as ListItemProps,
            ]
          : []),
        {
          rightElement: 'text',
          rightText: `${firebaseConfigState.contract.call_contract_center.value}`,
          title: t('General__Call_center', 'Call center'),
          onPress: () => {
            Linking.openURL(
              `tel://${firebaseConfigState.contract.call_contract_center.value}`,
            );
          },
          key: 'support-call-contact-center-item',
        },
        {
          rightElement: 'text',
          rightText: `${firebaseConfigState.contract.email_contract_center.value}`,
          title: t('General__Email', 'Email'),
          onPress: () => {
            Linking.openURL(
              `mailto:${firebaseConfigState.contract.email_contract_center.value}`,
            );
          },
          key: 'support-email-contact-center-item',
        },
        {
          rightElement: 'text',
          rightText: `${version}`,
          title: t('General__App_version', 'App version'),
          onPress: () => {},
          key: 'support-app-version-item',
        },
      ],
    },
    {
      title: t('General__Legal', 'Legal'),
      icon: 'legal',
      items: [
        {
          rightElement: 'right',
          title: t('General__About_Us', 'About us'),
          onPress: () => {
            navigation.navigate('LegalScreen', {
              title: 'General__About_Us',
              type: 'AboutUs',
            });
          },
          key: 'legal-about-us-item',
        },
        {
          rightElement: 'right',
          title: t('General__Privacy_Policy', 'Privacy Policy'),
          onPress: () => {
            navigation.navigate('LegalScreen', {
              title: 'General__Privacy_Policy',
              type: 'PPC',
            });
          },
          key: 'legal-ppc-item',
        },
        {
          rightElement: 'right',
          title: t('General__Terms_and_conditions', 'Terms and Conditions'),
          onPress: () => {
            navigation.navigate('LegalScreen', {
              title: 'General__Terms_and_conditions',
              type: 'TnC',
            });
          },
          key: 'legal-tnc-item',
        },
        {
          rightElement: 'right',
          title: t('General__PDPA', 'PDPA'),
          onPress: () => {
            navigation.navigate('LegalScreen', {
              title: 'General__PDPA',
              type: 'PDPA',
            });
          },
          key: 'legal-pdpa-item',
        },
      ],
    },
  ];

  return (
    <Screen>
      <HeaderImage
        defaultImage={require('../../../assets/images/bg_setting.png')}>
        <Header
          leftAction="goBack"
          bgColor={getTheme('bg-transparent')}
          leftColor={'#ffffff'}
        />
        <Spacing height={8} />
        <View className="px-5">
          <HeadText
            tagline={t('General__One_bangkok', 'One Bangkok')}
            title={t('General__Settings', 'Settings')}
            titleColor="default-inverse"
            taglineColor="sky-blue"
            titleClamps="leading-[41px]"
          />
        </View>
      </HeaderImage>
      <ScrollView className="w-full px-8">
        <Pressable>
          <Spacing height={40} />
          <View className="flex flex-col">
            <ListSection
              title={t('General__My_account', 'My Account')}
              icon="user">
              {profile ? ( // move to component
                <ListItem
                  testID="settings-my-account-id"
                  paddingY={20}
                  onPress={() => {
                    navigation.navigate('AccountInfoScreen');
                  }}
                  title={[firstName, middleName, lastName].join(' ')}
                  description={companyName}
                  rightElement="right"
                />
              ) : (
                // copy from the old one need to revise later
                <View>
                  <Spacing height={12} />
                  <Text weight="medium">
                    {t('General__Sign_in/sign_up', 'Sign in/Sign up')}
                  </Text>
                  <Spacing height={12} />
                  <Text size="B2" color="muted">
                    {t(
                      'Settings__Settings__Description',
                      'Please sign in or create account to receive more offers and privileges',
                    )}
                  </Text>
                  <Spacing height={20} />
                  <Button
                    color="primary"
                    title={t('General__Get_started', 'Get started')}
                    onPress={() => {
                      navigation.dispatch(
                        StackActions.replace('AskToSignUpScreen'),
                      );
                      navigation.dispatch(DrawerActions.closeDrawer());
                    }}
                  />
                  <Spacing height={12} />
                </View>
              )}
            </ListSection>
            <SettingBody SettingLists={SettingLists} />
          </View>
          <Spacing height={24} />
        </Pressable>
      </ScrollView>
    </Screen>
  );
};
export default SettingScreen;
