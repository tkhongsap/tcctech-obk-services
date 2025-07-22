import dayjs from 'dayjs';
import React from 'react';
import {Dimensions, ImageBackground, Pressable, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import t from '~/utils/text';
import {Text} from '~/components/atoms';
import {IArtCType, IProgram} from '~/models/ArtCulture';
import {useNavigation} from '~/navigations/AppNavigation';
import {logEvent} from '~/utils/logGA';

interface IProgramSliderItem {
  item: IProgram;
  artCType?: IArtCType;
}

const ProgramSliderItem = ({item, artCType}: IProgramSliderItem) => {
  const navigation = useNavigation();
  const {width} = Dimensions.get('screen');

  const handlePress = () => {
    const eventParams = {
      title: item.programTranslations.title,
      screen_name: 'ArtCultureLandingScreen',
      feature_name: 'Highlighted Home Event',
      action_type: 'click',
      bu: 'Art & Culture',
    };

    logEvent('button_click', eventParams);
    navigation.navigate('ArtCultureProgramScreen', {
      id: item.id,
    });
  };

  return (
    <ImageBackground
      className="h-[560px]"
      style={{width}}
      source={{
        uri: item.programTranslations.banner,
      }}
      resizeMode="cover">
      <Pressable
        className="flex flex-row items-end h-full w-full"
        onPress={handlePress}>
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0)',
            'rgba(0, 0, 0, .25)',
            'rgba(0, 0, 0, .75)',
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 1)',
          ]}
          start={{x: 0.5, y: 0}}
          end={{x: 0.5, y: 1}}
          locations={[0.05, 0.1, 0.3, 0.5, 1]}
          className="w-full">
          <View className="w-full pt-4 pb-4">
            {artCType && (
              <Text className="text-xs text-subtitle-light font-obBold text-center">
                {artCType.artCTranslation.title}
              </Text>
            )}
            {item.periodAt && item.periodEnd && (
              <Text className="text-white font-obBold text-center">
                {dayjs(item.periodAt).format('DD MMM YYYY')} -{' '}
                {dayjs(item.periodEnd).format('DD MMM YYYY')}
              </Text>
            )}
            <Text className="text-3xl text-white font-obBold text-center">
              {item.programTranslations.title}
            </Text>
            {item.programTranslations.author && (
              <Text className="text-white font-obBold text-center -mt-1">
                {t('ArtCulture__Program_By', 'by')}{' '}
                {item.programTranslations.author}
              </Text>
            )}
            <Text className="text-light-gray-light text-center pt-2">
              {item.programTranslations.locations.join(', ')}
            </Text>
          </View>
        </LinearGradient>
      </Pressable>
    </ImageBackground>
  );
};

export default ProgramSliderItem;
