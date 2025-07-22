import {DrawerActions} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {ListSection, ItemList, ListItemProps} from '~/components/molecules';
import {useNavigation} from '~/navigations/AppNavigation';
import t from '~/utils/text';
import {useAccountState} from '~/states/account/accountState';
import {Spacing} from '~/components/atoms';
import {useSettingState} from '~/features/setting/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Identity} from '~/utils/ob_sdk/services/ob_iam/index.interface';

interface SecurityListsType {
  title: string;
  items: ListItemProps[];
}

interface SecurityBodyProps {
  SecurityLists: SecurityListsType[];
}
const SecurityBody = ({SecurityLists}: SecurityBodyProps) => {
  const lists = SecurityLists.map(section => {
    return (
      <View key={`list-section-${section.title}`}>
        <Spacing height={24} />
        <ListSection title={section.title}>
          <ItemList items={section.items} />
        </ListSection>
      </View>
    );
  });
  return <View>{lists}</View>;
};

const SecurityList = () => {
  const navigation = useNavigation();
  const {identifiers} = useAccountState();
  const [validation, setValidation] = useState({
    hasEmail: false,
    hasPhone: false,
  });
  const {twoFactorAuthenticationEnabled, passwordEnabled} = useSettingState();

  useEffect(() => {
    const identities = identifiers.value;
    if (identities) {
      setValidation(() => {
        return {
          hasEmail: identities.some(identity => identity.provider === 'email'),
          hasPhone: identities.some(identity => identity.provider === 'phone'),
        };
      });
    }
  }, [identifiers]);

  const onPressTwoFactorAuthentication = () => {
    validation.hasEmail && validation.hasPhone
      ? navigation.navigate('Config2FAScreen')
      : navigation.navigate('Setup2FAScreen', {
          provider: validation.hasEmail ? 'phone' : 'email',
        });
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  const OnPressChangeOrSetPassword = () => {
    if (!passwordEnabled.value) {
      navigation.navigate('ChangeOrSetPasswordScreen', {
        header: t('Account__Set_new_password__Header', 'Set new password'),
        isSetupPassword: true,
      });
    } else {
      if (twoFactorAuthenticationEnabled.value) {
        onPressChangePassword();
      } else {
        navigation.navigate('CurrentPasswordScreen');
      }
    }
  };

  const SecurityLists: SecurityListsType[] = [
    {
      title: t('General__Security', 'Security'),
      items: [
        {
          rightElement: 'right',
          title: !passwordEnabled.value
            ? t('Account__Set_new_password__Header', 'Set new password')
            : t('General__Change_password', 'Change password'),
          onPress: () => {
            OnPressChangeOrSetPassword();
          },
          key: 'account-info-change-password-item',
        },
        {
          rightElement: 'right',
          title: t('General__2FA_full', 'Two-Factor Authentication (2FA)'),
          onPress: () => {
            onPressTwoFactorAuthentication();
          },
          key: 'account-info-2fa-item',
        },
      ],
    },
  ];
  const onPressChangePassword = async () => {
    const strIdentity = await AsyncStorage.getItem('identity');
    var jsonIdentity: Identity;
    if (strIdentity) {
      jsonIdentity = JSON.parse(strIdentity);
    }
    const identities = identifiers.value;

    var identity: Identity = {identifier: '', provider: 'phone'};
    if (identities) {
      const findIdentity = identities.find(
        item =>
          item.provider !== jsonIdentity.provider && item.default === true,
      );
      if (findIdentity) {
        identity.identifier = findIdentity!.identifier;
        identity.provider = findIdentity!.provider;
      }
    }
    if (identity.identifier === '') {
      return;
    }

    navigation.navigate('OTPVerificationScreen', {
      headText: {
        title:
          identity!.provider === 'phone'
            ? t('General__Confirm_number', 'Confirm your phone number')
            : t('General__Confirm_your_email', 'Confirm your email'),
      },
      identity: {
        identifier: identity!.identifier,
        provider: identity!.provider,
      },
      description: t('General__Enter_code', 'Enter the code we just sent you'),
      screenHook: 'AccountInfoScreen',
      leftAction: 'close',
      title: t('General__Change_password', 'Change Password'),
      allowChangeIdentifier: false,
    });
  };

  return <SecurityBody SecurityLists={SecurityLists} />;
};

export default SecurityList;
