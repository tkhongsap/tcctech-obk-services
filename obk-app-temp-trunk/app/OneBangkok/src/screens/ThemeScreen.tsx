import React from 'react';
import Header from '../components/Header';
import Screen from '../components/Screen';
import {Switch, Text} from 'react-native';

import t from '../utils/text';
import {useColorScheme} from 'nativewind';
import getTheme from '~/utils/themes/themeUtils';

const ThemeScreen = (_props: any) => {
  const {colorScheme, toggleColorScheme} = useColorScheme();

  return (
    <Screen className={getTheme('bg-default')}>
      <Header title={t('Theme', 'Change theme')} />
      <Text className={getTheme('text-primary text-xl')}>
        {t('Theme', 'Select theme')}
      </Text>
      <Switch
        value={colorScheme === 'dark'}
        onChange={() => {
          toggleColorScheme();
        }}
      />
      <Text
        className={getTheme(
          'text-default',
        )}>{`current theme = ${colorScheme}`}</Text>
    </Screen>
  );
};

export default ThemeScreen;
