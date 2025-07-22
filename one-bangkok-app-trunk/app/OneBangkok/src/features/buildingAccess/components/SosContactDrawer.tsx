import React from 'react';
import {useHookstate} from '@hookstate/core';
import {useState} from 'react';
import {Linking, Pressable, TouchableOpacity, View} from 'react-native';
import {Icon, Spacing, Text} from '~/components/atoms';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import _firebaseState from '~/states/firebase';
import {formatPhoneNumber} from '~/utils/phoneFormat';
import t from '~/utils/text';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import residentialTenantState from '~/states/residentialTenant/residentialTenantState';

export const SosContactDrawer = ({onClose}: {onClose: () => void}) => {
  const firebaseState = useHookstate(_firebaseState);
  const language = useHookstate(appLanguageState);
  const [sosContactValue] = useState(firebaseState.sos_contact.value);

  const defaultLanguageSelected =
    language.currentLanguage.get() !== ''
      ? language.currentLanguage.get()
      : language.defaultLanguage.get();

  const descriptionMapper = {
    en: 'descriptionEn',
    th: 'descriptionTh',
    zh: 'descriptionZh',
  };

  const descriptionKey =
    descriptionMapper[
      defaultLanguageSelected as keyof typeof descriptionMapper
    ];
  const description =
    sosContactValue &&
    sosContactValue[descriptionKey as keyof typeof sosContactValue];

  const onPressTel = () => {
    try {
      if (residentialTenantState.isActive.value) {
        serviceMindService.saveLog('SOS');
      }
      Linking.openURL(`tel://${sosContactValue.phoneNumber}`);
    } catch (error) {}
  };

  return (
    <View>
      <Text weight="medium" color="dark-gray">
        {sosContactValue?.title ||
          t('General__Sos_emergency', 'SOS / Emergency Service')}
      </Text>
      <Text color="subtitle-muted">
        {description ||
          t(
            'General__Sos_emergency_description',
            'If you need assistance from us, immediately call us to get personal escort service.',
          )}
      </Text>
      <Spacing height={20} />
      {sosContactValue?.phoneNumber && (
        <TouchableOpacity
          className="flex flex-row items-center space-x-3 border border-[#BDBDBD] py-3 px-4"
          onPress={onPressTel}>
          <Icon type="phoneIcon" color="#292929" />
          <Text>{formatPhoneNumber(sosContactValue.phoneNumber)}</Text>
        </TouchableOpacity>
      )}
      <Spacing height={20} />
      <TouchableOpacity
        className="border border-[#ED2015] py-3 px-4"
        onPress={() => onClose()}>
        <Text weight="medium" color="fire-engine-red" className="text-center">
          {t('General__Cancel', 'Cancel')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
