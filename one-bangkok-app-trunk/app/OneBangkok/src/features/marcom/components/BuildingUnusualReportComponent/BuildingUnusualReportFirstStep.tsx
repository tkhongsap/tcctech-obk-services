import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import {Icon, Spacing, Text} from '~/components/atoms';
import AddPicture from '~/features/residential/components/AddPicture';
import React, {useEffect, useState} from 'react';
import t from '~/utils/text';
import ServiceRequestModal from '~/features/residential/components/ServiceRequestModal';
import LiveChatAttachPhotoModal from '~/features/residential/components/LiveChatAttachPhotoModal';
import {modalActions} from '~/features/residential/components/ResidentialModal';
import * as ImagePicker from 'react-native-image-picker';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {useNavigation} from '~/navigations/AppNavigation';
import {Checkbox} from '~/components/atoms/Checkbox';
import {CheckField} from '~/components/molecules/CheckField';
import DropDownPicker from 'react-native-dropdown-picker';
import BuildingModal from './BuildingModal';
import SelectMultipleList from '~/components/molecules/SelectMultipleList';
import BuildingMultipleModal from './BuildingMultipleModal';

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
  initialType?: string[];
  onSelectedType: (value: string[]) => void;
  onSelectedBuilding: (value: string) => void;
  onSelectedFloor: (value: string) => void;
  initialPicture?: string;
  onUploadedPicture: (value?: string) => void;
  onUpdatedPictureName: (value: string) => void;
  hasError?: boolean;
  initialDescription?: string;
  allLocation: any[];
  onDescriptionChanged: (value: string) => void;
  onSelectedTypeChanged: (value: string[]) => void;
  onSelectedBuildingChanged: (value: string) => void;
  onSelectedFloorChanged: (value: string) => void;
  requireForm: string[];

  disabled?: boolean;
  typeDropdown: DropdownOptions[];
  buildingDropdown: DropdownOptions[];
}
interface DropdownOptions {
  name: string;
  value: string;
}

const UPLOAD_FILE_MAX_SIZE = 83886080; // byte => (80 mb)
const UPLOAD_FILE_MAX_SIZE_MB = 80; // byte => (80 mb)

const BuildingUnusualReportFirstStep = ({
  serviceRequestTypes,
  initialType,
  onSelectedType,
  initialPicture,
  onUploadedPicture,
  onUpdatedPictureName,
  hasError = false,
  initialDescription,
  onDescriptionChanged,
  onSelectedTypeChanged,
  onSelectedBuildingChanged,
  onSelectedFloorChanged,
  disabled = false,
  allLocation,
  typeDropdown,
  buildingDropdown,
  requireForm,
}: Props) => {
  const navigation = useNavigation();
  const [description, setDescription] = useState<string | undefined>(
    initialDescription,
  );
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<string>();
  const [selectedFloors, setSelectedFloors] = useState<string>();
  const [floorOptions, setFloorOptions] = useState<DropdownOptions[]>([]);

  const [isFloorSelectDisable, setIsFloorSelectDisable] =
    useState<boolean>(true);

  const [isPickingImage, setIsPickingImage] = useState(false);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [isLoading, setIsLoading] = useState(disabled);
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

  const onChangeText = (value: string) => {
    setDescription(value);
    onDescriptionChanged(value);
  };

  const onPressTypeModal = () => {
    modalActions.setContent(
      <BuildingMultipleModal
        options={typeDropdown}
        initialValue={selectedType}
        onValueChanged={val => {
          onSelectedTypeChanged(val);
          setSelectedType(val);
        }}
        title="Select Type"
        multiple={true}
      />,
    );
    modalActions.show();
  };

  const onPressBuildingModal = () => {
    modalActions.setContent(
      <BuildingModal
        options={buildingDropdown}
        initialValue={selectedBuilding}
        onValueChanged={val => {
          onChangeBuilding(val as string);
          onSelectedBuildingChanged(val);
          setSelectedBuilding(val as string);
        }}
        title="Select Building"
      />,
    );
    modalActions.show();
  };

  const onChangeBuilding = (value: string) => {
    const buildingData = (allLocation as {[key: string]: any})[value];
    const floors = buildingData?.floors;
    if (Array.isArray(floors) && floors.length > 0) {
      var floorOptions: DropdownOptions[] = buildingData.floors.map(x => ({
        name: x,
        value: x,
      }));
      setFloorOptions(floorOptions);
      setIsFloorSelectDisable(false);
    } else {
      setFloorOptions([]);
      setIsFloorSelectDisable(true);
    }
  };

  const onPressFloorModal = () => {
    modalActions.setContent(
      <BuildingModal
        options={floorOptions}
        initialValue={selectedFloors}
        onValueChanged={val => {
          onSelectedFloorChanged(val as string);
          setSelectedFloors(val as string);
        }}
        title="Select Floor"
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
      const permissionStatus = await request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : Number(Platform.Version) >= 33
          ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );
      if (
        permissionStatus === RESULTS.UNAVAILABLE ||
        permissionStatus === RESULTS.BLOCKED ||
        permissionStatus === RESULTS.DENIED
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
      const {base64, fileName, uri} = image;
      if (!base64 && uri) {
        const response = await fetch(uri);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result;
          if (base64data) {
            setPreloadPicture(base64data as string);
            setPicture(base64data as string);
            onUploadedPicture(base64data as string);
          }
        };
      }
      const filename = fileName ?? `${Date.now()}.png`;
      const base64Uri = `data:image/png;base64,${base64}`; // or change image/png as needed
      setPreloadPicture(base64Uri); // for previewing
      setPicture(base64Uri); // just the raw base64 if needed elsewhere
      onUploadedPicture(base64Uri);
      onUpdatedPictureName(filename);
    } catch (error) {
      console.error('Error uploading image:', error);
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
      <View style={{opacity: isUploadingPicture ? 0.5 : 1}}>
        <AddPicture
          onPress={onPressPhotoModal}
          disabled={isLoading || disabled || isUploadingPicture}
          picture={preloadPicture}
          onPressRemovePicture={onPressRemovePicture}
        />
      </View>
      <View className="item flex flex-col space-y-1">
        <Text color="dark-gray" size="B1" weight="regular">
          {'Detail of unusual *'}
        </Text>
        <TextInput
          className="font-obRegular"
          style={[
            styles.input,
            description !== undefined
              ? styles.normalText
              : styles.placeholderText,
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
      <View className="item flex flex-col space-y-1">
        <Text color="dark-gray" size="B1" weight="regular">
          {'Type *'}
        </Text>
        <View>
          <TouchableOpacity
            className={`flex flex-row justify-between items-center px-4 py-3 border ${
              requireForm.find(x => x === 'R_TYPE')
                ? 'border-fire-engine-red-light bg-error-light'
                : 'border-dark-gray-light'
            }`}
            onPress={onPressTypeModal}
            disabled={isLoading || disabled}>
            <Text
              color="dark-gray"
              weight="regular"
              style={selectedType === undefined ? {fontStyle: 'italic'} : {}}
              className={
                selectedType === undefined ? 'text-subtitle-muted-light' : ''
              }>
              {selectedType && selectedType.length > 0
                ? `Selected ${selectedType.length} Type${
                    selectedType.length > 1 ? 's' : ''
                  }`
                : 'Select Type'}
            </Text>
            <Icon
              type="scArrowDownIcon"
              width={20}
              height={20}
              color="#000000"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View className="item flex flex-col space-y-1">
        <Text color="dark-gray" size="B1" weight="regular">
          {'building *'}
        </Text>
        <View>
          <TouchableOpacity
            className={`flex flex-row justify-between items-center px-4 py-3 border ${
              requireForm.find(x => x === 'R_BUILDING')
                ? 'border-fire-engine-red-light bg-error-light'
                : 'border-dark-gray-light'
            }`}
            onPress={onPressBuildingModal}
            disabled={isLoading || disabled}>
            <Text
              color="dark-gray"
              weight="regular"
              style={
                selectedBuilding === undefined ? {fontStyle: 'italic'} : {}
              }
              className={
                selectedBuilding === undefined
                  ? 'text-subtitle-muted-light'
                  : ''
              }>
              {selectedBuilding
                ? buildingDropdown.find(e => e.value === selectedBuilding)?.name
                : 'Select Building'}
            </Text>
            <Icon
              type="scArrowDownIcon"
              width={20}
              height={20}
              color="#000000"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View className="item flex flex-col space-y-1">
        <Text color="dark-gray" size="B1" weight="regular">
          {'Floor (Optional)'}
        </Text>
        <View>
          <TouchableOpacity
            className={`flex flex-row justify-between items-center px-4 py-3 border ${
              requiredType
                ? 'border-fire-engine-red-light bg-error-light'
                : 'border-dark-gray-light'
            }`}
            onPress={onPressFloorModal}
            disabled={isLoading || isFloorSelectDisable}>
            <Text
              color="dark-gray"
              weight="regular"
              style={selectedFloors === undefined ? {fontStyle: 'italic'} : {}}
              className={
                selectedFloors === undefined ? 'text-subtitle-muted-light' : ''
              }>
              {selectedFloors
                ? floorOptions.find(e => e.value === selectedFloors)?.name
                : 'Select Floor'}
            </Text>
            <Icon
              type="scArrowDownIcon"
              width={20}
              height={20}
              color="#000000"
            />
          </TouchableOpacity>
        </View>
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
    fontStyle: 'italic',
  },
  normalText: {
    fontStyle: 'normal',
  },
});

export default BuildingUnusualReportFirstStep;
