import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StatusBar, View, RefreshControl } from 'react-native';
import { Header } from '~/components/molecules/Header';
import { Spacing, TextInput } from '~/components/atoms';
import { logScreenView } from '~/utils/logGA';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  WhatHappeningProps,
  whatHappeningService,
} from '../../../services/whatHappeningService';
import { useHookstate } from '@hookstate/core';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import { WhatHappeningEvents } from '../components/WhatHappeningEvent';

export const AllEvents = () => {
  const insets = useSafeAreaInsets();
  const [events, setEvents] = useState<WhatHappeningProps[]>([]);
  const [searchEvent, setSearchEvents] = useState<WhatHappeningProps[]>([]);
  const language = useHookstate(appLanguageState);
  const [search, setSearch] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const defaultLanguageSelected =
    language.currentLanguage.get() !== ''
      ? language.currentLanguage.get()
      : language.defaultLanguage.get();

  useEffect(() => {
    const initialFetch = async () => {
      await whatHappeningService
        .getEvents(defaultLanguageSelected)
        .then(response => {
          if (response) {
            setEvents(response);
            setSearchEvents(response);
          }
        });
    };
    if (!refreshing) {
      initialFetch();
    }
  }, [defaultLanguageSelected, refreshing]);

  useEffect(() => {
    if (search) {
      const matchedEvent = events.filter(
        item =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase()),
      );
      setSearchEvents(matchedEvent);
    } else {
      setSearchEvents(events);
    }
  }, [search]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    logScreenView('AllEvents');
  }, []);

  const onChangeSearch = (text: string) => setSearch(text);

  return (
    <View className={getTheme('h-screen w-screen bg-default')}>
      <StatusBar barStyle={'light-content'} />
      <Header
        leftAction="goBack"
        title={t('General__All_events', 'General__All_events')}
      />
      <ScrollView
        className="px-4"
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <TextInput
          leftIcon={{ name: 'search', className: '!bg-black' }}
          placeholder="Search Here"
          style={{ backgroundColor: '#F4F6F7' }}
          className="border-0 "
          onChangeText={onChangeSearch}
        />
        <Spacing height={24} />
        <WhatHappeningEvents data={searchEvent} />
        <Spacing height={40} />
      </ScrollView>
    </View>
  );
};
