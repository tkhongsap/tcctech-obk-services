import {Dimensions, Image, Platform, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ScreenContainer} from '../components';
import {Header} from '../components/Header';
import {Spacing} from '~/components/atoms';
import t from '~/utils/text';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '~/navigations/AppNavigation';
import ImageZoom from '../components/ImageZoom';

type ImageDimension = {
  width: number;
  height: number;
};
type Props = NativeStackScreenProps<
  RootStackParamList,
  'ResidentialParcelBoxImagePreviewScreen'
>;

const ResidentialParcelBoxImagePreviewScreen = ({
  route: {
    params: {imageUrl},
  },
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageDimension, setImageDimension] = useState<ImageDimension>();

  useEffect(() => {
    preload(imageUrl);
  }, [imageUrl]);

  const preload = async (uri: string) => {
    try {
      setIsLoading(true);
      const dimension = await getImageDimension(uri);
      setImageDimension(dimension);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const getImageDimension = (uri: string): Promise<ImageDimension> => {
    return new Promise(resolve => {
      Image.getSize(uri, (width, height) => {
        resolve({width, height});
      });
    });
  };

  return (
    <ScreenContainer
      bgColor="#FFFFFF"
      barStyle="dark-content"
      isLoading={isLoading}>
      <Header
        leftAction="goBack"
        title={t('Residential__Parcel_Detail', 'Parcel Detail')}
      />
      {imageDimension && (
        <View className="bg-jet-black-light w-full flex-1 overflow-hidden">
          <View
            className="w-full h-screen flex items-center justify-center p-[12px]"
            style={{height: Dimensions.get('screen').height - 160}}>
            <ImageZoom
              imgClass="aspect-[4/2]"
              uri={imageUrl}
              styles={{
                width: '100%',
                maxHeight:
                  Dimensions.get('screen').height -
                  (Platform.OS === 'ios' ? 250 : 220),
                aspectRatio: imageDimension.width / imageDimension.height,
              }}
              onLoadStart={() => {
                setIsLoading(true);
              }}
              onLoadEnd={() => {
                setIsLoading(false);
              }}
            />
            {Platform.OS === 'ios' && <Spacing height={50} />}
          </View>
        </View>
      )}
    </ScreenContainer>
  );
};

export default ResidentialParcelBoxImagePreviewScreen;
