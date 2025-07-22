import React from 'react';
import Header from '~/components/Header';
import Screen from '~/components/Screen';
import {useHookstate} from '@hookstate/core';
import appLanguageActions from '~/states/appLanguage/appLanguageActions';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import _firebaseState from '~/states/firebase';

import t from '~/utils/text';
import {ScrollView} from 'react-native';
import {Spacing} from '~/components/atoms';
import SelectList, {ListSelect} from '~/components/molecules/SelectList';

const LanguageSettingsScreen = (_props: any) => {
  const state = useHookstate(appLanguageState);
  const firebaseState = useHookstate(_firebaseState);

  const defaultSelected =
    state.currentLanguage.get() !== ''
      ? state.currentLanguage.get()
      : state.defaultLanguage.get();

  const languageOptions: ListSelect[] = firebaseState.app_language.value.map(
    row => ({
      name: row.name,
      value: row.value,
      description: row.description,
    }),
  );

  const onPress = (value: string) => {
    appLanguageActions.setLanguage(value); // Update the language using setLanguage from appLanguageActions
  };
  return (
    <Screen>
      <Header title={t('General__Language', 'Language')} />
      <ScrollView className="w-full px-8">
        <Spacing height={24} />
        <SelectList
          data={languageOptions}
          onPress={onPress}
          selected={defaultSelected}
        />
      </ScrollView>
    </Screen>
  );
};

export default LanguageSettingsScreen;
