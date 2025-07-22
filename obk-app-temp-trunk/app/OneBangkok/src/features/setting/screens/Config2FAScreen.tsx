import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';

import {Screen} from '~/components/templates';
import {Button, Header, useModal} from '~/components/molecules';
import getTheme from '~/utils/themes/themeUtils';
import {settingStateAction, useSettingState} from '../store';
import t from '~/utils/text';
import {Spacing, Text} from '~/components/atoms';
import Switch from '~/components/atoms/Switch';
import {useAccountState} from '~/states/account/accountState';
import {ListItemProps} from '~/components/molecules/ListItem';
import {ItemList} from '~/components/molecules/ItemList';

const ConfirmDisableOrEnableTwoFA = ({onContinue, onCancel, enable}: any) => {
  let title, description: String;
  if (enable) {
    title = t('Drawer__2fa_enable__Header', 'Confirm enable 2FA?');
    description = t(
      'Drawer__2fa_enable__Body',
      'An additional layer of security will be automatically added to your account.',
    );
  } else {
    title = t('Drawer__2fa_disable__Header', 'Confirm disable 2FA?');
    description = t(
      'Drawer__2fa_disable__Body',
      'Are you sure you want to disable Two-Factor Authentication (2FA)? This will remove the additional layer of security for your account.',
    );
  }
  return (
    <>
      <Text size="B1" weight="medium">
        {title}
      </Text>
      <Text color="muted" size="B2">
        {description}
      </Text>
      <Spacing height={16} />
      <View>
        <Button
          color="navy"
          title={t('General__Confirm', 'Confirm')}
          onPress={onContinue}
        />
        <Spacing height={10} />
        <Button
          title={t('General__Cancel', 'Cancel')}
          outlined={true}
          onPress={onCancel}
        />
      </View>
    </>
  );
};

const translateProvider = (providerValue: string) => {
  switch (providerValue) {
    case 'email':
      return t('General__Email', 'Email');
    case 'phone':
      return t('General__Phone_number', 'Phone number');
    case 'sso':
      return t('General__SSO', 'SSO');
    default:
      return '';
  }
};

const Config2FAScreen = () => {
  const {twoFactorAuthenticationEnabled} = useSettingState();
  const [_modalState, modalActions] = useModal();
  const {identifiers} = useAccountState();
  const [identifiersList, setIdentifiersList] = useState<ListItemProps[]>([]);

  const handleOnToggle = (value: boolean) => {
    settingStateAction.toggle2FA(value);
    modalActions.hide();
  };

  const handleOnPressToggle = () => {
    modalActions.setContent(
      <ConfirmDisableOrEnableTwoFA
        onContinue={() => handleOnToggle(!twoFactorAuthenticationEnabled.value)}
        onCancel={() => modalActions.hide()}
        enable={!twoFactorAuthenticationEnabled.value}
      />,
    );
    modalActions.show();
  };

  const IdentifiersList: ListItemProps[] = [];

  const mapIdentifiersList = useCallback(() => {
    if (identifiers.value) {
      identifiers.value.map((identifier: any) => {
        if (identifier.default) {
          IdentifiersList.push({
            rightElement: identifier.default ? 'tag' : undefined,
            title: identifier.identifier,
            description: translateProvider(identifier.provider),
            onPress: () => {},
            key: `${identifier.id}`,
            textDescriptionColor: 'muted',
            rightText: t('General__Default', 'Default'),
          });
        }
      });
    }
    setIdentifiersList(IdentifiersList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mapIdentifiersList();
  }, [mapIdentifiersList]);

  return (
    <Screen>
      <Header
        title={t('General__2FA', 'Two-Factor Authentication')}
        leftAction="goBack"
      />
      <ScrollView className="w-full px-6">
        <Spacing height={24} />

        <Text size="B1" weight="medium">
          {t('Account__2fa_manage__Body1', 'Strengthen your account security')}
        </Text>
        <Spacing height={12} />
        <Text color="subtitle-muted" size="B2">
          {t(
            'Account__2fa_manage__Caption1',
            'Enabling Two-Factor Authentication (2FA) adds an extra layer of protection to your account.',
          )}
        </Text>
        <Spacing height={16} />
        <View className={getTheme('w-full border-[1px] border-line px-[16px]')}>
          <Spacing height={20} />
          <View className="flex flex-row gap-2 items-center">
            <View className="flex-1">
              <Text size="B1" weight="medium">
                {t('Account__2fa_manage__Body2', 'Enable 2FA')}
              </Text>
              <Spacing height={6} />
              <Text color="subtitle-muted" size="B2">
                {t(
                  'Account__2fa_manage__Caption2',
                  'The security code will be sent to both the default email and phone. ',
                )}
              </Text>
            </View>
            <TouchableOpacity onPress={handleOnPressToggle} activeOpacity={1}>
              <View className="flex justify-center" pointerEvents="none">
                <Switch
                  value={twoFactorAuthenticationEnabled.value as boolean}
                  onValueChange={handleOnPressToggle}
                  disabled={false}
                />
              </View>
            </TouchableOpacity>
          </View>
          <Spacing height={20} />
        </View>
        <Spacing height={44} />
        <Text size="B1" weight="medium">
          {t('Account__2fa_manage__Body3', 'Methods')}
        </Text>
        <Text color="subtitle-muted" size="B2">
          {t(
            'Account__2fa_manage__Caption3',
            "Choose how you receive security codes by changing the default email or phone in 'My Account'.",
          )}
        </Text>
        <Spacing height={16} />
        <View className={getTheme('border-[1px] border-line px-[16px]')}>
          {identifiersList && <ItemList items={identifiersList} />}
        </View>
      </ScrollView>
    </Screen>
  );
};

export default Config2FAScreen;
