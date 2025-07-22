import React, {useEffect, useState} from 'react';
import {View, Image} from 'react-native';
import {Text} from '~/components/atoms';
import getTheme from '~/utils/themes/themeUtils';
import LinearGradient from 'react-native-linear-gradient';
import {isTablet, deviceWidth} from '../utils/device';
interface BlockUnitProps {
  title: string;
  image: string;
  subtitle: string;
  isActive: boolean;
  logo: string;
  isShowLogo: boolean;
}

export const BLOCK_UNIT_MARGIN_RIGHT = 14;

const BlockUnit = ({
  title,
  image,
  subtitle,
  logo,
  isActive,
  isShowLogo,
}: BlockUnitProps) => {
  const padding = 28;
  const blockUnitWidth = isTablet ? 780 - padding - 12 : deviceWidth - padding;
  const [aspectRatio, setAspectRatio] = useState<number>(1);

  useEffect(() => {
    Image.getSize(logo, (width, height) => {
      setAspectRatio(width / height);
    });
  }, [logo]);

  return (
    <View
      className={getTheme('flex-row overflow-hidden bg-white')}
      style={[
        {
          width: blockUnitWidth,
          marginRight: BLOCK_UNIT_MARGIN_RIGHT,
          marginLeft: BLOCK_UNIT_MARGIN_RIGHT,
        },
      ]}>
      <Image
        source={{uri: image}}
        style={{
          width: '100%',
          height: 80,
          // aspectRatio: aspectRatio,
        }}
        resizeMethod="scale"
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(240, 240, 240,0.1)', 'rgba(240, 240, 240,0.1)']}
        start={{x: 0, y: 0}} // Start from the left
        end={{x: 1, y: 0}} // End at the right
        style={styles.gradient}>
        <View
          className={getTheme('flex-1 justify-center')}
          style={{paddingLeft: 20}}>
          {subtitle !== undefined && !isShowLogo && (
            <Text className={getTheme('text-[12px] text-white')} weight="bold">
              {subtitle}
            </Text>
          )}
          <Text className={getTheme('text-[20px] text-white')} weight="bold">
            {title}
          </Text>
        </View>

        {isShowLogo && (
          <Image
            source={{uri: logo}}
            className={getTheme('absolute right-5')}
            resizeMode="contain"
            style={{
              height: 40,
              aspectRatio,
              zIndex: 1,
            }}
          />
        )}
      </LinearGradient>
    </View>
  );
};

const styles = {
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
};

export default BlockUnit;
