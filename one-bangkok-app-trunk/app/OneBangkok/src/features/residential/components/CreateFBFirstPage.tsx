import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import t from '~/utils/text';
import {Text, Spacing} from '~/components/atoms';
import AddPicture from './AddPicture';
import {modalActions} from '../components/ResidentialModal';
import {
  check,
  PERMISSIONS,
  PermissionStatus,
  request,
  RESULTS,
} from 'react-native-permissions';
import LiveChatAttachPhotoModal from './LiveChatAttachPhotoModal';
import * as ImagePicker from 'react-native-image-picker';
import {useNavigation} from '~/navigations/AppNavigation';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import SelectionModal from './SelectionModal';
import InputSelection from './InputSelection';

export type FeedbackTopic = {
  orgId: string;
  id: string;
  mozartId: string;
  name: string;
  code: string;
  description: string;
  eventCategoryId: string;
  priorityLevelId: string;
  isManualEvent: boolean;
  isCritical: boolean;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
};
interface Props {
  topics: FeedbackTopic[];
  initialTopic?: string;
  onSelectedTopic: (value: string) => void;
  initialPicture?: string;
  onUploadedPicture: (value?: string) => void;
  onUpdatedPictureName: (value: string) => void;
  hasError?: boolean;
  initialDescription?: string;
  onDescriptionChanged: (value: string) => void;
  disabled?: boolean;
  errorRequireDescription?: boolean;
  setErrorRequireDescription?: (value: boolean) => void;
}

const UPLOAD_FILE_MAX_SIZE = 83886080; // byte => (80 mb)
const UPLOAD_FILE_MAX_SIZE_MB = 80; // byte => (80 mb)

const CreateFBFirstPage = ({
  topics,
  initialTopic,
  onSelectedTopic,
  initialPicture,
  onUploadedPicture,
  onUpdatedPictureName,
  hasError = false,
  initialDescription,
  onDescriptionChanged,
  disabled = false,
  errorRequireDescription = false,
  setErrorRequireDescription = () => {},
}: Props) => {
  const navigation = useNavigation();
  const [isPickingImage, setIsPickingImage] = useState(false);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [picture, setPicture] = useState<string | undefined>(initialPicture);
  const [description, setDescription] = useState<string | undefined>(
    initialDescription,
  );
  const topicOptions = topics.map(e => ({value: e.id, name: e.name}));
  const [preloadPicture, setPreloadPicture] = useState<string | undefined>(
    initialPicture,
  );
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);

  useEffect(() => {
    isPickingImage && setTimeout(() => handleImagePicker(), 400);
  }, [isPickingImage]);

  useEffect(() => {
    isTakingPhoto && setTimeout(() => handleTakingPhoto(), 400);
  }, [isTakingPhoto]);

  const onChangeDescription = (value: string) => {
    setDescription(value);
    onDescriptionChanged(value);
    setErrorRequireDescription(false);
  };

  const onPressLocationDropdown = () => {
    modalActions.setContent(
      <SelectionModal
        title={t('Residential__Topic', 'Topic')}
        options={topicOptions}
        initialValue={selectedTopic}
        onValueChanged={value => {
          setSelectedTopic(value);
          onSelectedTopic(value);
        }}
      />,
    );
    modalActions.show();
  };

  const onPressPhotoModal = () => {
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

  const handleImagePicker = async () => {
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
          await uploadImage(assets[0]);
        },
      );
    } catch (error) {
      console.log('Catch error: ', error);
    } finally {
      setIsPickingImage(false);
    }
  };

  const handleTakingPhoto = async () => {
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
        await uploadImage(assets[0]);
      }
    } catch (error) {
      console.log('handleTakingPhoto ERROR => ', error);
    } finally {
      setIsTakingPhoto(false);
    }
  };

  const uploadImage = async (image: ImagePicker.Asset, retry: number = 2) => {
    try {
      setIsLoading(true);
      setIsUploadingPicture(true);
      const {uri, type, fileName} = image;
      setPreloadPicture(uri);
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
      setPicture(resourceUrl);
      onUploadedPicture(resourceUrl);
      onUpdatedPictureName(filename);
    } catch (error) {
      if (retry >= 1) {
        await uploadImage(image, retry - 1);
      }
    } finally {
      setIsLoading(false);
      setIsUploadingPicture(false);
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

  const onPressRemovePicture = () => {
    if (picture) {
      setPicture(undefined);
      onUploadedPicture(undefined);
      setPreloadPicture(undefined);
    }
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
      <Spacing height={32} />
      <InputSelection
        title={t('Residential__Topic', 'Topic')}
        placeholder={t('Residential__Topic', 'Topic')}
        errorMessage={t(
          'Residential__Feedback__Please_select_the_topic',
          'Please select the topic',
        )}
        disabled={isLoading || disabled}
        onPress={onPressLocationDropdown}
        selected={topicOptions.find(e => e.value === selectedTopic)?.name}
        hasError={hasError && !selectedTopic}
      />
      <Spacing height={32} />
      <View className={`item flex flex-col space-y-1`}>
        <Text color="dark-gray" size="B1" weight="regular">
          {t('Residential__Maintenance__Description', 'Description')}
        </Text>
        <TextInput
          className={`font-obRegular ${
            errorRequireDescription
              ? 'border-fire-engine-red-light bg-error-light'
              : ''
          }`}
          style={[
            styles.input,
            description ? styles.normalText : styles.placeholderText,
          ]}
          placeholder={t(
            'Residential__Feedback__Example',
            'Example: Add more details and specify date and time',
          )}
          placeholderTextColor="#989898"
          value={description}
          onChangeText={onChangeDescription}
          multiline={true}
        />
        {errorRequireDescription && (
          <Text color="fire-engine-red" size="B1" weight="regular">
            {t(
              'Residential__Feedback__Please_enter_the_description',
              'Please enter the description',
            )}
          </Text>
        )}
      </View>
      <Spacing height={32} />
      <View style={{opacity: isUploadingPicture ? 0.5 : 1}}>
        <AddPicture
          onPress={onPressPhotoModal}
          disabled={isLoading || disabled || isUploadingPicture}
          picture={preloadPicture}
          onPressRemovePicture={onPressRemovePicture}
        />
      </View>
      <Spacing height={180} />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 205,
    borderColor: '#DCDCDC',
    borderWidth: 1,
    fontSize: 16,
    padding: 16,
    textAlignVertical: 'top',

    // fontFamily: 'oneBangkok-Regular',
  },
  placeholderText: {
    fontFamily: 'OneBangkok-Italic',
    // fontFamily: 'oneBangkok-Regular',
    // fontStyle: 'italic',
  },
  normalText: {
    fontStyle: 'normal',
  },
});

export default CreateFBFirstPage;
