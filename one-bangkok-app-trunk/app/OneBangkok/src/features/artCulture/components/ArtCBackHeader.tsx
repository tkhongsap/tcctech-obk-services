import {useNavigation} from '@react-navigation/native';
import clsx from 'clsx';
import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icon} from '~/components/atoms';

interface IArtCBackHeader {
  title: string;
  hide?: boolean;
  hideBackBtn?: boolean;
}

const ArtCBackHeader = ({title, hide, hideBackBtn}: IArtCBackHeader) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View
      className={clsx([
        'relative flex w-full flex-row py-4 px-12 z-20 bg-white',
        hide && 'hidden',
      ])}
      style={{marginTop: insets.top}}>
      {!hideBackBtn && (
        <Pressable
          className="absolute z-50 w-9 h-9 items-center justify-center rounded-[4px] top-[10px] left-2"
          onPress={() => navigation.goBack()}>
          <Icon
            type="back"
            className="invert mix-blend-difference"
            width={20}
            height={20}
            color="#000"
          />
        </Pressable>
      )}

      <Text
        className="text-base font-obMedium text-center w-full"
        numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
};

export default ArtCBackHeader;
