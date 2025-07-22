import React from 'react';
import {View, ScrollView, TouchableOpacity, Platform} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';
import {useNavigation} from '~/navigations/AppNavigation';
import {Text, Spacing} from '~/components/atoms';
import {isTablet} from '../utils/device';
import t from '~/utils/text';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import DatetimeParser from '../utils/reformatter/datetime';

export type Announcement = {
  id: string;
  title: string;
  imageUrl: string | null;
  description: string;
  dateTime?: string;
  pinnedToHome: boolean;
  pinnedToHomeEndDate: string;
  announcementDate: string;
};

export type AnnouncementProps = {
  title: string;
  announcementList: Announcement[];
  contents: Announcement[];
};

export const Announcements = ({
  title,
  contents,
  announcementList,
}: AnnouncementProps) => {
  const navigation = useNavigation();
  const now = Date.now();
  const language =
    appLanguageState.currentLanguage.get() ||
    appLanguageState.defaultLanguage.get();

  const notExpired = (announcementDate: number) => announcementDate >= now;
  const validContents = contents.filter(
    content =>
      content.pinnedToHome && notExpired(parseInt(content.pinnedToHomeEndDate)),
  );
  const lineBreak = (description: string) => {
    if (Platform.OS === 'ios') {
      const splitText = description.split('\n');
      const displayText = splitText.slice(0, 2).join('\n');
      return displayText.length < description.length
        ? `${displayText}...`
        : displayText;
    }
    return description;
  };
  const parseDateFormat = (timestamp: number) => {
    try {
      return `${DatetimeParser.toDMY({language, timestamp})} ${
        language === 'en' ? 'at ' : ''
      }${DatetimeParser.toHM({language, timestamp})}`;
    } catch (error) {
      return '';
    }
  };

  if (announcementList.length == 0 && contents.length == 0) return null;

  return (
    <View className={'flex flex-col pb-6'}>
      <View className={'flex flex-col px-4'}>
        {/* <Text className={getTheme('text-default text-2xl font-medium')}>
          {title}
        </Text> */}
        <View className={'flex flex-row justify-between items-center'}>
          <Text size="H4" color="default" weight="medium">
            {title}
          </Text>

          <TouchableOpacity
            className={getTheme('text-dark-teal text-sm font-medium')}
            onPress={() => navigation.navigate('AnnouncementsScreen')}>
            <Text size="B2" color="dark-teal" weight="medium">
              {t('Residential__Home_Automation__View_All', 'View All')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        horizontal={true}
        className={'flex-1 gap-x-3 mt-4'}
        showsHorizontalScrollIndicator={false}>
        <Spacing width={16} />
        {validContents.map(
          ({id, title, imageUrl, description, announcementDate}) => (
            <View key={id} className="w-[276px]">
              <View
                className={
                  isTablet
                    ? getTheme(
                        'p-6 border flex-1 flex-col border-[#DCDCDC] h-fit max-w-[30vw]',
                      )
                    : getTheme(
                        'p-6 border flex-1 flex-col border-[#DCDCDC] h-fit max-w-[75vw]',
                      )
                }>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('AnnouncementDetailScreen', {
                      id,
                      title,
                      imageUrl,
                      description,
                    });
                  }}>
                  <Text
                    size="B2"
                    weight="medium"
                    numberOfLines={1}
                    className={getTheme('mb-2 text-[#1B1B1B]')}>
                    {title}
                  </Text>
                  <Text
                    size="C1"
                    color="subtitle-muted"
                    weight="regular"
                    className={getTheme('break-all mb-3')}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {lineBreak(description)}
                  </Text>
                  {announcementDate !== undefined && (
                    <Text
                      size="C1"
                      color="subtitle-muted"
                      weight="regular"
                      numberOfLines={1}>
                      {parseDateFormat(parseInt(announcementDate))}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ),
        )}
        <Spacing width={16} />
      </ScrollView>
    </View>
  );
};
