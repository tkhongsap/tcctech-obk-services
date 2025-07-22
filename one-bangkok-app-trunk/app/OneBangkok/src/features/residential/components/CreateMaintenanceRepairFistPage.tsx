import {
  Alert,
  Linking,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import AddPicture from '~/features/residential/components/AddPicture';
import InputSelection from '~/features/residential/components/InputSelection';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';
import React, {useEffect, useState} from 'react';
import t from '~/utils/text';
import {
  check,
  PERMISSIONS,
  PermissionStatus,
  request,
  RESULTS,
} from 'react-native-permissions';
import * as ImagePicker from 'react-native-image-picker';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import LiveChatAttachPhotoModal from './LiveChatAttachPhotoModal';
import {modalActions} from './ResidentialModal';
import SelectionModal from './SelectionModal';
import {Text} from '~/components/atoms';

export type MaintenanceRepairEventType = {
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

type MozartLocation = {
  name: string;
  fullName: string;
  code: string;
  description: string;
  mozartLocationId: number;
  locationTypeId: number;
};
export type CommonArea = {
  commonAreaId: string;
  commonAreaNumber: string;
  commonAreaName: string;
  buildingPhaseCode: string;
  buildingId: string;
  buildingPhaseName: string;
  projectCode: string;
  projectId: string;
  projectsName: string;
  projectsNameThai: string;
  companyName: string;
  companyId: string;
  mozartLocation: MozartLocation;
  sqNo: string;
};

interface Props {
  maintenanceRepairTypes: MaintenanceRepairEventType[];
  commonAreas: CommonArea[];
  initialType?: string;
  onSelectedType: (value: string) => void;
  initialArea?: string;
  onSelectedArea: (value: string) => void;
  initialLocation?: string;
  onSelectedLocation: (value?: string) => void;
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

export const defaultAreaOptions = [
  {
    name: t('Residential__Maintenance__In_residence', 'In-residence'),
    value: '1',
  },
  {
    name: t('Residential__Maintenance__Common_facility', 'Common Facility'),
    value: '2',
  },
];

const CreateMaintenanceRepairFistPage = ({
  maintenanceRepairTypes,
  commonAreas,
  initialType,
  onSelectedType,
  initialArea,
  onSelectedArea,
  initialLocation,
  onSelectedLocation,
  initialPicture,
  onUploadedPicture,
  onUpdatedPictureName,
  hasError,
  initialDescription,
  onDescriptionChanged,
  disabled = false,
}: Props) => {
  const navigation = useNavigation<StackNavigation>();
  const [isPickingImage, setIsPickingImage] = useState(false);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string | undefined>(
    initialType,
  );
  const [selectedArea, setSelectedArea] = useState<string | undefined>(
    initialArea,
  );
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(
    initialLocation,
  );
  const [picture, setPicture] = useState<string | undefined>(initialPicture);
  const [description, setDescription] = useState<string | undefined>(
    initialDescription,
  );
  const [preloadPicture, setPreloadPicture] = useState<string | undefined>(
    initialPicture,
  );
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);

  const typeOptions = maintenanceRepairTypes.map(e => ({
    value: e.id,
    name: e.description,
  }));
  const areaOptions = [
    {
      name: t('Residential__Maintenance__In_residence', 'In-residence'),
      value: '1',
    },
    {
      name: t('Residential__Maintenance__Common_facility', 'Common Facility'),
      value: '2',
    },
  ];
  const locationOptions = commonAreas.map(e => ({
    value: e.commonAreaId,
    name: e.commonAreaName,
  }));

  useEffect(() => {
    isPickingImage && setTimeout(() => handleImagePicker(), 400);
  }, [isPickingImage]);

  useEffect(() => {
    isTakingPhoto && setTimeout(() => handleTakingPhoto(), 400);
  }, [isTakingPhoto]);

  const onChangeDescription = (value: string) => {
    setDescription(value);
    onDescriptionChanged(value);
  };

  const onPressTypeDropdown = () => {
    modalActions.setContent(
      <SelectionModal
        title={t(
          'Residential__Maintenance__Maintenance_and_Repair_Type',
          'Maintenance & repair type',
        )}
        options={typeOptions}
        initialValue={selectedType}
        onValueChanged={(value: string) => {
          onSelectedType(value);
          setSelectedType(value);
        }}
      />,
    );
    modalActions.show();
  };

  const onPressAreaDropdown = () => {
    modalActions.setContent(
      <SelectionModal
        title={t('Residential__Maintenance__Area', 'Area')}
        options={areaOptions}
        initialValue={selectedArea}
        onValueChanged={value => {
          setSelectedArea(value);
          onSelectedArea(value);
          onSelectedLocation(value === '1' ? '1' : undefined);
        }}
      />,
    );
    modalActions.show();
  };

  const onPressLocationDropdown = () => {
    modalActions.setContent(
      <SelectionModal
        title={t('Residential__Maintenance__Location', 'Location')}
        options={locationOptions}
        initialValue={selectedLocation}
        onValueChanged={value => {
          setSelectedLocation(value);
          onSelectedLocation(value);
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
    <View className="px-4 pb-10 flex flex-col" style={{gap: 28}}>
      <InputSelection
        title={t('Residential__Maintenance__Area', 'Area')}
        placeholder={t('Residential__Maintenance__Area', 'Area')}
        errorMessage={t(
          'Residential__Maintenance__Please_Select_Area',
          'Please select Area',
        )}
        disabled={isLoading || disabled}
        onPress={onPressAreaDropdown}
        selected={areaOptions.find(e => e.value === selectedArea)?.name}
        hasError={hasError && !selectedArea}
      />
      {selectedArea === '2' && (
        <InputSelection
          title={t('Residential__Maintenance__Location', 'Location')}
          placeholder={t(
            'Residential__Maintenance__Select_Location',
            'Select location',
          )}
          errorMessage={t(
            'Residential__Maintenance__Please_Select_Location',
            'Please select location',
          )}
          disabled={isLoading}
          onPress={onPressLocationDropdown}
          selected={
            locationOptions.find(e => e.value === selectedLocation)?.name
          }
          hasError={hasError && !selectedLocation}
        />
      )}
      <InputSelection
        title={t(
          'Residential__Maintenance__Maintenance_and_Repair_Type',
          'Maintenance & repair type',
        )}
        placeholder={t(
          'Residential__Maintenance__Maintenance_and_Repair_Type',
          'Maintenance & repair type',
        )}
        errorMessage={t(
          'Residential__Maintenance__Please_Select_Maintenance',
          'Please select maintenance & repair type',
        )}
        disabled={isLoading || disabled}
        onPress={onPressTypeDropdown}
        selected={typeOptions.find(e => e.value === selectedType)?.name}
        hasError={hasError && !selectedType}
      />
      <View className="item flex flex-col space-y-1">
        <Text color="dark-gray" size="B1" weight="regular">
          {t('Residential__Maintenance__Description', 'Description')}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              fontFamily: description
                ? 'OneBangkok-Regular'
                : 'OneBangkok-Italic',
            },
          ]}
          placeholder={t(
            'Residential__Service_request__Description_Example',
            'Example: Add more details and specify date and time',
          )}
          placeholderTextColor="#989898"
          value={description}
          onChangeText={onChangeDescription}
          multiline={true}
          aria-disabled={disabled}
        />
      </View>
      <View style={{opacity: isUploadingPicture ? 0.5 : 1}}>
        <AddPicture
          onPress={onPressPhotoModal}
          disabled={isLoading || isUploadingPicture || disabled}
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
  normalText: {
    fontStyle: 'normal',
  },
});
export default CreateMaintenanceRepairFistPage;
