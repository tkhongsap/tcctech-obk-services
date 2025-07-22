import {View, TouchableOpacity, Image, Dimensions} from 'react-native';
import {Icon, Text} from '~/components/atoms';
import React, {useEffect, useState} from 'react';
import t from '~/utils/text';

interface Props {
  onPress: () => void;
  disabled?: boolean;
  picture?: string;
  onPressRemovePicture: () => void;
  required?: boolean;
  valid?: boolean;
}
const AddPicture = ({
  onPress,
  disabled,
  picture,
  onPressRemovePicture,
  required,
  valid,
}: Props) => {
  const [imageHeight, setImageHeight] = useState(0);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (picture) {
      Image.getSize(
        picture,
        (width, height) => {
          const aspectRatio = height / width;
          setImageHeight(screenWidth * aspectRatio);
        },
        error => {
          console.log('Error loading image size:', error);
        },
      );
    }
  }, [picture]);

  return (
    <View>
      {picture ? (
        <View className="w-full relative p-0 bg-subtitle-muted-light">
          <TouchableOpacity
            className="z-10 absolute top-2 right-2 w-[36px] h-[36px] bg-[#ffffff80] flex flex-col justify-center items-center"
            disabled={disabled}
            onPress={onPressRemovePicture}>
            <Icon type="cancel" width={20} height={20} color="#000000" />
          </TouchableOpacity>
          <Image
            className="z-0"
            style={{width: '100%', height: imageHeight}}
            resizeMode="cover"
            source={{
              uri: picture,
            }}
          />
        </View>
      ) : (
        <TouchableOpacity
          className={`flex flex-col space-y-4 px-4 pt-8 pb-7 items-center border border-line-light ${
            valid && required ? 'bg-red-50 border-red-500' : ''
          }`}
          onPress={onPress}
          disabled={disabled}>
          <Icon type="addIconWhite" width={48} height={48} color="#DCDCDC" />
          <Text color="dark-teal" size="B1" weight="medium">
            {t('Residential__Add_picture', 'Add picture')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AddPicture;
