import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import {Icon, Text} from '~/components/atoms';
import AddPicture from '~/features/residential/components/AddPicture';
import React, {useEffect, useState} from 'react';
import t from '~/utils/text';
import ServiceRequestModal from '~/features/residential/components/ServiceRequestModal';
import LiveChatAttachPhotoModal from '~/features/residential/components/LiveChatAttachPhotoModal';
import {modalActions} from '~/features/residential/components/ResidentialModal';
import * as ImagePicker from 'react-native-image-picker';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import {
  check,
  PERMISSIONS,
  PermissionStatus,
  request,
  RESULTS,
} from 'react-native-permissions';
import {useNavigation} from '~/navigations/AppNavigation';

export type ServiceRequestType = {
  orgId: string;
  id: string;
  mozartId: string;
  name: string;
  code: string;
  description: string;
  eventCategoryId: string;
  priorityLevelId: string;
  isManualEvent: string;
  isCritical: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
};

interface Props {
  serviceRequestTypes: ServiceRequestType[];
  initialType?: string;
  onSelectedType: (value: string) => void;
  initialPicture?: string;
  onUploadedPicture: (value?: string) => void;
  onUpdatedPictureName: (value: string) => void;
  hasError?: boolean;
  initialDescription?: string;
  onDescriptionChanged: (value: string) => void;
  disabled?: boolean;
}

const UPLOAD_FILE_MAX_SIZE = 83886080; // byte => (80 mb)
const UPLOAD_FILE_MAX_SIZE_MB = 80; // byte => (80 mb)

const CreateServiceRequestFirstStep = ({
  serviceRequestTypes,
  initialType,
  onSelectedType,
  initialPicture,
  onUploadedPicture,
  onUpdatedPictureName,
  hasError = false,
  initialDescription,
  onDescriptionChanged,
  disabled = false,
}: Props) => {
  const navigation = useNavigation();
  const [description, setDescription] = useState<string | undefined>(
    initialDescription,
  );
  const typeOptions = serviceRequestTypes.map(e => ({
    value: e.id,
    name: e.name,
  }));
  const [isPickingImage, setIsPickingImage] = useState(false);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [isLoading, setIsLoading] = useState(disabled);
  const [selectedType, setSelectedType] = useState<string | undefined>(
    initialType,
  );
  const [picture, setPicture] = useState<string | undefined>(initialPicture);
  const requiredType = hasError && !initialType;
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

  const handleOnSelectedType = (value: string) => {
    onSelectedType(value);
    setSelectedType(value);
  };

  const onChangeText = (value: string) => {
    setDescription(value);
    onDescriptionChanged(value);
  };

  const onPressRequestModal = () => {
    modalActions.setContent(
      <ServiceRequestModal
        options={typeOptions}
        initialValue={initialType}
        onValueChanged={handleOnSelectedType}
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
    <View className="px-4 pb-10 flex flex-col" style={{gap: 32}}>
      <View className="item flex flex-col space-y-1">
        <Text color="dark-gray" size="B1" weight="regular">
          {t('Residential__Service_request__Service_type', 'Service type')}
        </Text>
        <TouchableOpacity
          className={`flex flex-row justify-between items-center px-4 py-3 border ${
            requiredType
              ? 'border-fire-engine-red-light bg-error-light'
              : 'border-dark-gray-light'
          }`}
          onPress={onPressRequestModal}
          disabled={isLoading || disabled}>
          <Text
            color="dark-gray"
            weight="regular"
            style={
              selectedType === undefined
                ? {fontFamily: 'OneBangkok-Italic'}
                : {}
            }
            className={
              selectedType === undefined ? 'text-subtitle-muted-light' : ''
            }>
            {selectedType
              ? typeOptions.find(e => e.value === selectedType)?.name
              : t('Residential__Service_request__Service_type', 'Service type')}
          </Text>
          <Icon type="scArrowDownIcon" width={20} height={20} color="#000000" />
        </TouchableOpacity>
        {requiredType && (
          <Text color="fire-engine-red" size="B1" weight="regular">
            {t(
              'Residential__Service_request__Create_Service_type_warning',
              'Please select service type',
            )}
          </Text>
        )}
      </View>
      <View className="item flex flex-col space-y-1">
        <Text color="dark-gray" size="B1" weight="regular">
          {t('Residential__Maintenance__Description', 'Description')}
        </Text>
        <TextInput
          className="font-obRegular"
          style={[
            styles.input,
            description ? styles.normalText : styles.placeholderText,
          ]}
          placeholder={t(
            'Residential__Service_request__Description_Example',
            'Example: Add more details and specify date and time',
          )}
          placeholderTextColor="#989898"
          value={description}
          onChangeText={onChangeText}
          multiline={true}
          aria-disabled={isLoading || disabled}
        />
      </View>
      <View style={{opacity: isUploadingPicture ? 0.5 : 1}}>
        <AddPicture
          onPress={onPressPhotoModal}
          disabled={isLoading || disabled || isUploadingPicture}
          picture={preloadPicture}
          onPressRemovePicture={onPressRemovePicture}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 205,
    borderColor: '#777777',
    borderWidth: 1,
    fontSize: 16,
    padding: 16,
    textAlignVertical: 'top',
  },
  placeholderText: {
    fontFamily: 'OneBangkok-Italic',
  },
  normalText: {
    fontStyle: 'normal',
  },
});

export default CreateServiceRequestFirstStep;
