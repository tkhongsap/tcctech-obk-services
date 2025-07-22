import React from 'react';
import {useHookstate} from '@hookstate/core';
import {useEffect, useState} from 'react';
import {Linking, TouchableOpacity, View} from 'react-native';
import {Icon, Spacing, Text} from '~/components/atoms';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import _firebaseState from '~/states/firebase';
import {formatPhoneNumber} from '~/utils/phoneFormat';
import t from '~/utils/text';
import remoteConfig from '@react-native-firebase/remote-config';
import {logScreenView} from '~/utils/logGA';

export const EmergencyContactDrawer = ({onClose}: {onClose: () => void}) => {
  const firebaseState = useHookstate(_firebaseState);
  const language = useHookstate(appLanguageState);
  const [emergencyContactValue] = useState(
    firebaseState.emergency_contact.value,
  );

  console.log('Emergency Value:', firebaseState.emergency_contact.value);

  const defaultLanguageSelected =
    language.currentLanguage.get() !== ''
      ? language.currentLanguage.get()
      : language.defaultLanguage.get();

  const titleMapper = {
    en: 'title',
    th: 'titleTh',
    zh: 'titleZh',
  };

  const descriptionMapper = {
    en: 'descriptionEn',
    th: 'descriptionTh',
    zh: 'descriptionZh',
  };

  const titleKey =
    titleMapper[defaultLanguageSelected as keyof typeof titleMapper];

  const descriptionKey =
    descriptionMapper[
      defaultLanguageSelected as keyof typeof descriptionMapper
    ];

  const title =
    emergencyContactValue &&
    emergencyContactValue[titleKey as keyof typeof emergencyContactValue];

  const description =
    emergencyContactValue &&
    emergencyContactValue[descriptionKey as keyof typeof emergencyContactValue];

  useEffect(() => {
    logScreenView('Emergency Contact');
  });
  useEffect(() => {
    const initialFetchEvents = async () => {
      try {
        await remoteConfig().setConfigSettings({
          minimumFetchIntervalMillis: 5000,
        });
        await remoteConfig().fetchAndActivate();
        const fetchedEmergencyContact = remoteConfig()
          .getValue('emergency_contact')
          .asString();
        const emergencyContactObject = JSON.parse(fetchedEmergencyContact);
        _firebaseState.emergency_contact.set(emergencyContactObject);
      } catch (error) {
        console.log('Fetch Directory Contact error :', error);
      }
    };
    initialFetchEvents();
  }, []);

  return (
    <View>
      <Text weight="medium" color="dark-gray">
        {title || t('General__Emergency_contact', 'Emergency Contact')}
      </Text>
      <Text color="subtitle-muted">
        {description ||
          t(
            'General__Emergency_description',
            'In case of emergency incident, immediately contact us for quick resolutions.',
          )}
      </Text>
      <Spacing height={20} />
      {emergencyContactValue?.phoneNumber && (
        <TouchableOpacity
          className="flex flex-row items-center space-x-3 border border-[#BDBDBD] py-3 px-4"
          onPress={() =>
            Linking.openURL(`tel://${emergencyContactValue.phoneNumber}`)
          }>
          <Icon type="phoneIcon" color="#292929" />
          <Text>{formatPhoneNumber(emergencyContactValue.phoneNumber)}</Text>
        </TouchableOpacity>
      )}
      <Spacing height={20} />
      <TouchableOpacity
        className="border border-[#ED2015] py-3 px-4"
        onPress={onClose}>
        <Text weight="medium" color="fire-engine-red" className="text-center">
          {t('General__Cancel', 'Cancel')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
