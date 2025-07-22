import React, {useEffect, useState} from 'react';
import {
  Alert,
  Linking,
  NativeSyntheticEvent,
  Platform,
  TextInputFocusEventData,
  View,
} from 'react-native';
import {Spacing, Text} from '~/components/atoms';
import t from '~/utils/text';
import {TQuestionnaireQuestion} from '../screens/QuestionnaireDetailScreen';
import * as ImagePicker from 'react-native-image-picker';
import {
  check,
  PERMISSIONS,
  PermissionStatus,
  request,
  RESULTS,
} from 'react-native-permissions';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import AddPicture from '../../components/AddPicture';
import {modalActions} from '../../components/ResidentialModal';
import LiveChatAttachPhotoModal from '../../components/LiveChatAttachPhotoModal';
import {useNavigation} from '../../../../navigations/AppNavigation';
interface Props {
  question: TQuestionnaireQuestion;
  onFocus:
    | ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void)
    | undefined;

  images?: string[];
  required: boolean;

  validationError?: Record<number, {type: number; message?: string}> | null;
  onImagesChange?: (value: string[]) => void;
}

const UPLOAD_FILE_MAX_SIZE = 83886080; // byte => (80 mb)
const UPLOAD_FILE_MAX_SIZE_MB = 80; // byte => (80 mb)

const QuestionImage = ({
  question,
  onFocus,
  onImagesChange = () => {},
  required,
  validationError,
  ...props
}: Props) => {
  const navigation = useNavigation();
  const [isPickingImage, setIsPickingImage] = useState(false);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [indexImage, setIndexImage] = useState<number>(0);

  const validator = validationError?.[question.id];
  const [valid, setValid] = useState<boolean>(false);
  useEffect(() => {
    if (required && validator && validator.type === 5) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [validator]);

  const [images, setImages] = useState<string[]>(props.images ?? ['', '']);
  const [preloadImages, setPreloadImages] = useState<string[]>(
    props.images ?? ['', ''],
  );
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([
    false,
    false,
  ]);

  useEffect(() => {
    isPickingImage && setTimeout(() => handleImagePicker(indexImage), 400);
  }, [isPickingImage]);

  useEffect(() => {
    isTakingPhoto && setTimeout(() => handleTakingPhoto(indexImage), 400);
  }, [isTakingPhoto]);

  useEffect(() => {
    onImagesChange(images);
  }, [images]);

  const onPressPhotoModal = (index: number) => {
    setIndexImage(index);
    modalActions.setContent(
      <LiveChatAttachPhotoModal
        onPressTakePhoto={() => {
          setIsTakingPhoto(true);
        }}
        onPressChooseFromLibrary={() => {
          setIsPickingImage(true);
        }}
      />,
    );
    modalActions.show();
  };

  const handleImagePicker = async (index: number) => {
    try {
      let permissionStatus: PermissionStatus;
      if (Platform.OS === 'ios') {
        permissionStatus = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      } else {
        permissionStatus = await check(
          Number(Platform.Version) >= 33
            ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        );
      }
      if (
        permissionStatus === RESULTS.UNAVAILABLE ||
        permissionStatus === RESULTS.BLOCKED
      ) {
        Alert.alert(
          t(
            'Residential_Photo_Library_Unavailable',
            'Photo Library Unavailable',
          ),
          t(
            'Residential_Photo_Library_Unavailable_desc',
            'To include photo library images in your \nmessages, change your settings to \nallow One Bangkok to access your \nphotos.',
          ),
          [
            {
              text: t('Residential_Photo_Library_Unavailable_cancel', 'Cancel'),
            },
            {
              text: t(
                'Residential_Photo_Library_Unavailable_open_settings',
                'Open Settings',
              ),
              onPress: () => {
                setTimeout(() => {
                  Linking.openSettings();
                }, 0);
              },
            },
          ],
        );

        return;
      }
      await ImagePicker.launchImageLibrary(
        {
          mediaType: 'photo',
          includeBase64: true,
          selectionLimit: 1,
          quality: Platform.OS === 'ios' ? 0.8 : 1,
        },
        async response => {
          const {assets} = response;
          if (!assets) return;
          const {fileSize} = assets[0];
          if (fileSize && fileSize > UPLOAD_FILE_MAX_SIZE) {
            alertUploadExceedSizeLimit();
            return;
          }
          await uploadImage(indexImage, assets[0]);
          setIsPickingImage(false);
        },
      );
    } catch (error) {}
  };

  const handleTakingPhoto = async (index: number) => {
    try {
      const isGrantedCameraPermission = await requestCameraPermission();
      if (!isGrantedCameraPermission) {
        navigation.navigate('ResidentialCameraDisableScreen');
        return;
      }
      const {assets} = await ImagePicker.launchCamera({
        mediaType: 'photo',
        cameraType: 'back',
      });
      if (assets && assets?.length > 0) {
        const {fileSize} = assets[0];
        if (fileSize && fileSize > UPLOAD_FILE_MAX_SIZE) {
          alertUploadExceedSizeLimit();
          return;
        }
        await uploadImage(indexImage, assets[0]);
      }
    } catch (error) {
      console.log('handleTakingPhoto ERROR => ', error);
    } finally {
      setIsTakingPhoto(false);
    }
  };

  const uploadImage = async (
    index: number,
    image: ImagePicker.Asset,
    retry: number = 2,
  ) => {
    try {
      setUploadingImages(prev => {
        const updated = [...prev];
        updated[index] = true;
        return updated;
      });
      const {uri, type, fileName} = image;
      setPreloadImages(prev => {
        const updated = [...prev];
        updated[index] = uri ?? '';
        return updated;
      });
      const filename = fileName ?? `${Date.now()}.png`;
      const mimeType = type ?? 'image/png';
      const {data} = await serviceMindService.presignedUploadUrl({
        filename,
        mimeType,
        type: 'cm_cases',
      });
      const uploadURL = data.data.uploadUrlData.uploadURL;
      const resourceUrl = data.data.uploadUrlData.resourceUrl;
      const formData = new FormData();
      formData.append('uploadURL', uploadURL);
      formData.append('image', {uri, type, name: fileName});
      await serviceMindService.uploadImageUrl(formData);
      setImages(prev => {
        const updated = [...prev];
        updated[index] = resourceUrl;
        return updated;
      });
    } catch (error) {
      if (retry >= 1) {
        await uploadImage(index, image, retry - 1);
      }
    } finally {
      setUploadingImages(prev => {
        const updated = [...prev];
        updated[index] = false;
        return updated;
      });
    }
  };

  const alertUploadExceedSizeLimit = () => {
    Alert.alert(
      t(
        'Residential__LiveChat__File_exceeds_size_limit',
        'File exceeds size limit',
      ),
      `${t(
        'Residential__LiveChat__Maximum_upload_size',
        'maximum upload size',
      )}: ${UPLOAD_FILE_MAX_SIZE_MB} MB.`,
      [{text: t('General_OK', 'OK')}],
    );
  };

  const onPressRemovePicture = (index: number) => {
    setImages(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    setPreloadImages(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      updated.push('');
      return updated;
    });
  };

  const requestCameraPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        let status = await check(PERMISSIONS.IOS.CAMERA);
        if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
          return true;
        }
        status = await request(PERMISSIONS.IOS.CAMERA);
        return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
      }

      if (Platform.OS === 'android') {
        let status = await check(PERMISSIONS.ANDROID.CAMERA);
        if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
          return true;
        }
        status = await request(PERMISSIONS.ANDROID.CAMERA);
        return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  return (
    <>
      {preloadImages.map((image, index) =>
        preloadImages[index - 1] !== '' ? (
          <>
            <View
              key={`image_${index}`}
              style={{opacity: uploadingImages[index] ? 0.5 : 1}}>
              <Spacing height={24} />
              {question.question && (
                <Text
                  weight="regular"
                  color="default"
                  size="B1"
                  numberOfLines={2}
                  className="max-w-[310px]">
                  {question.question || ''}
                </Text>
              )}
              <Spacing height={12} />
              <AddPicture
                onPress={() => onPressPhotoModal(index)}
                disabled={uploadingImages[index]}
                picture={image}
                onPressRemovePicture={() => onPressRemovePicture(index)}
                required={required}
                valid={valid}
              />
            </View>
            <View className="mt-2 mb-4">
              {valid && required && (
                <Text
                  className="text-red-500 mt-[-10px]"
                  style={{
                    fontFamily: 'OneBangkok-Regular',
                    fontSize: 14,
                  }}>
                  {validator?.message || ''}
                </Text>
              )}
            </View>
          </>
        ) : null,
      )}
      <Spacing height={24} />
    </>
  );
};

export default QuestionImage;
