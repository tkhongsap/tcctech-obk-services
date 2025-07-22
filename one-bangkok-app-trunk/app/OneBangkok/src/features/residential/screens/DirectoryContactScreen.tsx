import {Platform, ScrollView, View} from 'react-native';
import React, {useState} from 'react';
import {Spacing, Text} from '~/components/atoms';
import {HeadText} from '~/components/molecules';
import {Header} from '../components/Header';
import t from '~/utils/text';
import {DirectoryList} from '../components/DirectoryList';
import {ScreenContainer} from '../components/ScreenContainer';

export type DirectoryCategories = {
  id: string;
  name: string;
  contacts: [];
};

export const DirectoryContactScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ScreenContainer
      bgColor="#FFFFFF"
      barStyle="dark-content"
      isLoading={isLoading}>
      <Header
        title={t('Residential__Contact_directory', 'Contact Directory')}
        leftAction="goBack"
      />
      <ScrollView className="w-full bg-white">
        <View style={{flexDirection: 'column'}}>
          <View className="px-5">
            <Text className="text-subtitle-muted-light mt-5">
              {t('Residential__Description', 'Description')}
            </Text>
          </View>

          <DirectoryList setIsLoading={setIsLoading} />
        </View>
        {Platform.OS === 'ios' && <Spacing height={100} />}
      </ScrollView>
    </ScreenContainer>
  );
};
export default DirectoryContactScreen;
