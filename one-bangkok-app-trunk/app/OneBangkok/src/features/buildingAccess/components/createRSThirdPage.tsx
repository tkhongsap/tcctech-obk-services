import React, {useState} from 'react';
import t from '~/utils/text';

import {
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon, Spacing, Text} from '~/components/atoms';
import {useForm, SubmitHandler, FieldValues} from 'react-hook-form';
import {Button, HeadText, StickyButton, useModal} from '~/components/molecules';
import {
  createRequestServiceAction,
  useCreateRequestServiceState,
} from '../store/requestService';
import getTheme from '~/utils/themes/themeUtils';
import * as ImagePicker from 'react-native-image-picker';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import {CustomButton} from '~/components';
import RNFS from 'react-native-fs';
import {Image} from 'react-native-compressor';

const ModalLibrary = ({onPressCancel, onTakePhoto, onChooseLibrary}: any) => {
  return (
    <>
      <Button
        title={t('General__Take_a_photo', 'Take a photo')}
        color={'stroke'}
        outlined={true}
        onPress={onTakePhoto}
      />
      <Spacing height={12} />
      <Button
        title={t('General__Choose_library', 'Choose from library')}
        color={'stroke'}
        outlined={true}
        onPress={onChooseLibrary}
      />
      <Spacing height={24} />

      <Button
        title={t('General__Cancel', 'Cancel')}
        color={'fire-engine-red'}
        outlined={true}
        onPress={onPressCancel}
      />
    </>
  );
};
interface CreateRSThirdPageProps {
  onNextStep: Function;
}

const CreateRSThirdPage = ({onNextStep}: CreateRSThirdPageProps) => {
  const {image} = useCreateRequestServiceState();
  const [_modalState, modalActions] = useModal();
  const [selectedImage, setSelectedImage] = useState(image.value);

  const {...methods} = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      image: image.value,
    },
  });
  const handleOnPress: SubmitHandler<FieldValues> = async data => {
    createRequestServiceAction.setValueRSThirdPage(data.image);
    onNextStep && onNextStep();
  };

  const getImageSize = async (uri: string) => {
    try {
      const fileInfo = await RNFS.stat(uri);
      const fileSize = fileInfo.size;
      return fileSize;
    } catch (error) {
      console.error('Error getting image size:', error);
      return -1;
    }
  };

  const compressImage = async (imageUri: string) => {
    try {
      let compressedImageUri = imageUri;
      let compressedImageSize = await getImageSize(imageUri);
      let qualityOfImage = 0.8;
      const maxMB = 1; // 1MB
      const maxSizeInByte = maxMB * (1024 * 1024); //convert 1MB to bytes

      while (compressedImageSize > maxSizeInByte && qualityOfImage > 0.1) {
        compressedImageUri = await Image.compress(imageUri, {
          quality: qualityOfImage,
        });

        compressedImageSize = await getImageSize(compressedImageUri);
        qualityOfImage -= 0.1;
      }

      methods.setValue('image', compressedImageUri);
      setSelectedImage(compressedImageUri);
    } catch (error) {
      console.error('Error compressing image:', error);
    }
  };

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    ImagePicker.launchImageLibrary(options, async (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        modalActions.hide();
        await compressImage(imageUri);
      }
    });
  };

  const handleCameraLaunch = async () => {
    if (Platform.OS === 'ios') {
      request(PERMISSIONS.IOS.CAMERA).then(result => {
        if (result === RESULTS.GRANTED) {
          launchCamera();
        }
      });
    } else {
      const test = await check(PERMISSIONS.ANDROID.CAMERA);
      request(PERMISSIONS.ANDROID.CAMERA).then(result => {
        if (result === RESULTS.GRANTED) {
          launchCamera();
        }
      });
    }
  };

  const launchCamera = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    ImagePicker.launchCamera(options, async (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        modalActions.hide();
        await compressImage(imageUri);
      }
    });
  };

  const onPressRemoveImage = () => {
    setSelectedImage('');
    methods.setValue('image', '');
  };

  const ModalActionLibrary = () => {
    modalActions.setContent(
      <ModalLibrary
        onPressCancel={() => modalActions.hide()}
        onTakePhoto={() => handleCameraLaunch()}
        onChooseLibrary={() => openImagePicker()}
      />,
    );
    modalActions.show();
  };

  return (
    <>
      <ScrollView className="w-screen px-4 py-8">
        <Pressable>
          <HeadText
            tagline={t('General__Picture', 'Picture')}
            title={t(
              'General__Add_picture_header',
              'Would you like to add a picture?',
            )}
            titleSize="H3"
            titleClamps="leading-[26.4]"
          />
          <Spacing height={24} />
          {!selectedImage && (
            <TouchableOpacity onPress={() => ModalActionLibrary()}>
              <View
                className={`items-cemter py-8 ${getTheme(
                  'border-[1px] border-line',
                )}`}>
                <Icon type="addIcon" width={42} height={42} />
                <Spacing height={16} />
                <Text weight="medium" className="text-center">
                  {t('General__Add_picture', 'Add picture')}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          {selectedImage && (
            <ImageBackground
              source={{
                uri: selectedImage,
              }}
              resizeMode="contain"
              className="h-[262px] items-end pr-1 pt-2"
              style={{backgroundColor: '#EFEFEF'}}>
              <TouchableOpacity
                className={`w-[36px] h-[36px] justify-center ${getTheme(
                  'bg-default',
                )}`}
                onPress={() => onPressRemoveImage()}>
                <Icon type="close" />
              </TouchableOpacity>
            </ImageBackground>
          )}
          <Spacing height={24} />
        </Pressable>
      </ScrollView>
      {!selectedImage && (
        <View className="w-full h-[48px]">
          <CustomButton onPress={methods.handleSubmit(handleOnPress)}>
            <Text className="w-full h-full text-center" weight="medium">
              {t('General__Skip', 'Skip')}
            </Text>
          </CustomButton>
        </View>
      )}
      <StickyButton
        title={t('General__Next', 'Next')}
        onPress={methods.handleSubmit(handleOnPress)}
        rightIcon="next"
      />
    </>
  );
};
export default CreateRSThirdPage;

const styles = StyleSheet.create({
  disable: {
    borderColor: '#EFEFEF',
    borderWidth: 1,
    backgroundColor: '#EFEFEF',
    borderRadius: 0,
    height: 48,
    textAlign: 'left',
  },
});
