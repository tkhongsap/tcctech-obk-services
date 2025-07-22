import React from 'react';
import {Dimensions, ImageBackground, Pressable, View} from 'react-native';
import {Text} from '~/components/atoms';
import {IArtCType} from '~/models/ArtCulture';
import {useNavigation} from '~/navigations/AppNavigation';

interface IArtCMenuItem {
  item: IArtCType;
}

const ArtCMenuItem = ({item}: IArtCMenuItem) => {
  const navigation = useNavigation();

  return (
    <Pressable
      className="w-1/2 px-1 mb-2"
      onPress={() =>
        navigation.navigate('ArtCultureArtCScreen', {
          id: item.id,
        })
      }>
      <ImageBackground
        className="flex flex-row items-center w-full overflow-hidden"
        style={{height: Dimensions.get('screen').width / 2 - 16}}
        source={{uri: item.artCTranslation.thumbnail}}>
        <View className="w-full p-3">
          <View className="w-4/6">
            <Text className="leading-5 font-obBold text-white">
              {item.artCTranslation.title}
            </Text>
          </View>
          {item.artCTranslation.shortDesc && (
            <View className="w-[90%]">
              <Text className="text-xs text-white">
                {item.artCTranslation.shortDesc}
              </Text>
            </View>
          )}
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default ArtCMenuItem;
