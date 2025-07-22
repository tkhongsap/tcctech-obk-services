import React from 'react';
import {Dimensions, ImageBackground, Pressable, View} from 'react-native';
import {Text} from '~/components/atoms';
import {IProgram} from '~/models/ArtCulture';
import {useNavigation} from '~/navigations/AppNavigation';

interface IProgramItem {
  item: IProgram;
}

const ProgramItem = ({item}: IProgramItem) => {
  const navigation = useNavigation();

  return (
    <View className="w-1/2 px-2 pb-4">
      <Pressable
        onPress={() => {
          navigation.navigate('ArtCultureProgramScreen', {
            id: item.id,
          });
        }}>
        <ImageBackground
          className="w-full"
          resizeMode="cover"
          style={{
            height: Dimensions.get('screen').width * 0.45,
          }}
          source={{
            uri: item.programTranslations.thumbnail,
          }}
        />
      </Pressable>
      <View className="flex flex-row justify-between items-center pt-2">
        <Pressable
          className="pr-3 shrink"
          onPress={() =>
            navigation.navigate('ArtCultureProgramScreen', {
              id: item.id,
            })
          }>
          <Text
            numberOfLines={1}
            className="text-jet-black-light font-obMedium text-ellipsis overflow-hidden text-nowrap">
            {item.programTranslations.title}
          </Text>
        </Pressable>
        {/* <Image
          source={require('../../../assets/artc/icons/icon-star-outline.png')}
          className="w-[16px] h-[16px]"
        /> */}
      </View>
      {item.programTranslations.author && (
        <View>
          <Text className="text-sm">{item.programTranslations.author}</Text>
        </View>
      )}
    </View>
  );
};

export default ProgramItem;
