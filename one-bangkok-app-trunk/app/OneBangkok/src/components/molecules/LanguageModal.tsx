import React, {useState} from 'react';
import {useHookstate} from '@hookstate/core';
import appLanguageActions from '~/states/appLanguage/appLanguageActions';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import _firebaseState from '~/states/firebase';

import {View} from 'react-native';
import {Spacing, Text} from '~/components/atoms';
import t from '~/utils/text';
import {useModal} from './Modal';
import SelectList, {ListSelect} from './SelectList';

const LanguageModal = (_props: any) => {
  const [_modalState, modalActions] = useModal();
  const state = useHookstate(appLanguageState);
  const firebaseState = useHookstate(_firebaseState);
  const defaultSelected =
    state.currentLanguage.get() !== ''
      ? state.currentLanguage.get()
      : state.defaultLanguage.get();

  const [onSelected, setSelect] = useState(defaultSelected);

  const languageOptions: ListSelect[] = firebaseState.app_language.value.map(
    row => ({
      name: row.name,
      value: row.value,
      description: row.description,
    }),
  );

  const onPress = () => {
    appLanguageActions.setLanguage(onSelected);
    modalActions.hide();
  };
  const onSelect = (value: string) => {
    setSelect(value);
  };
  const onCancel = () => {
    modalActions.hide();
  };
  return (
    <View className="flex flex-col">
      <View className="flex flex-row justify-between">
        <Text onPress={onCancel} color="primary" weight="medium">
          {t('General__Cancel', 'Cancel')}
        </Text>
        <Text weight="medium">{t('General__Language', 'Language')}</Text>
        <Text onPress={onPress} color="primary" weight="medium">
          {t('General__Done', 'Done')}
        </Text>
      </View>
      <Spacing height={24} />
      <SelectList
        data={languageOptions}
        onPress={onSelect}
        selected={defaultSelected}
      />
    </View>
  );
};

export default LanguageModal;
