import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Image, Platform, ScrollView} from 'react-native';
import {View, TouchableOpacity} from 'react-native';
import {request, PERMISSIONS, PermissionStatus} from 'react-native-permissions';
import {
  Camera,
  PhotoFile,
  useCameraDevice,
  useCameraFormat,
} from 'react-native-vision-camera';
import {Icon, Spacing, Text} from '~/components/atoms';
import {Header, StickyButton} from '~/components/molecules';
import {logScreenView} from '~/utils/logGA';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import * as OB_PARKING_SDK from 'ob-parking-sdk';
import RNFS from 'react-native-fs';
import {hideLoading, showLoading} from '~/states/loadingState';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import {imageUploader} from '~/utils/imageUploader';
import {useScreenHook} from '~/services/EventEmitter';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import axios from 'axios';
import Config from 'react-native-config';
import firebaseConfigState from '~/states/firebase';

interface ScannedReceiptScreenProps {
  url: string;
  onRepeatScan: () => void;
  onConfirm: () => void;
  disableSubmit: boolean;
}

const ScannedReceiptScreen = ({
  url,
  onRepeatScan,
  onConfirm,
  disableSubmit,
}: ScannedReceiptScreenProps) => {
  return (
    <View className="flex-1">
      <Header
        leftAction="goBack"
        title={t('General__Scan_receipts', 'Scanned receipt')}
      />
      <ScrollView className="flex-1 px-3">
        <Image
          source={{
            uri: Platform.OS === 'android' ? `file://${url}` : url,
          }}
          className="w-full h-auto aspect-[7/10] rounded-md"
          resizeMode="cover"
        />
        <Spacing height={10} />
        <View
          className={getTheme(
            'w-full flex flex-row items-center bg-yellow rounded-sm p-1',
          )}>
          <Icon type="infoCirIcon" />
          <Spacing width={10} />
          <Text size="C1" weight="regular" className="flex-1 flex-wrap">
            {t(
              'General__Clear_invoice',
              'Ensure the receipt is clearly visible, with legible text and the entire receipt fully displayed.',
            )}
          </Text>
        </View>
        <Spacing height={10} />
        <TouchableOpacity onPress={onRepeatScan}>
          <Text
            size="B1"
            weight="medium"
            className="text-center py-6"
            color="navy">
            {t('General__Scan_receipts_again', 'Scan receipt again')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <StickyButton
        title={t('General__Confirm', 'Confirm')}
        rightIcon="next"
        iconHeight={25}
        iconWidth={25}
        onPress={onConfirm}
        disabled={disableSubmit}
      />
    </View>
  );
};

type IParkingRedemptionCameraScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ParkingRedemptionCameraScreen'
>;

const ParkingRedemptionCameraScreen = ({
  route: {
    params: {parkingDetailId},
  },
}: IParkingRedemptionCameraScreenProps) => {
  const navigation = useNavigation();
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('back');
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>();
  const isFocused = useIsFocused();
  const [photoFile, setPhotoFile] = useState<PhotoFile>();
  const [disableCamera, setDisableCamera] = useState<boolean>(false);
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const UPLOAD_FILE_MAX_SIZE_MB =
    firebaseConfigState.parking_redemption_file_max_size.value || 10;

  const checkPermission = () => {
    if (Platform.OS === 'ios') {
      request(PERMISSIONS.IOS.CAMERA).then(result => {
        setPermissionStatus(result);
      });
    } else {
      request(PERMISSIONS.ANDROID.CAMERA).then(result => {
        setPermissionStatus(result);
      });
    }
  };

  useEffect(() => {
    logScreenView('ParkingRedemptionCameraScreen');
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (permissionStatus !== 'granted') {
        checkPermission();
      } else {
        clearInterval(intervalId);
      }
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [permissionStatus]);

  useScreenHook('ParkingRedemptionCameraScreen', async event => {
    switch (event.name) {
      case AnnouncementScreenEventNames.CONTINUE:
        if (event.from.params.type === 'error') {
          navigation.navigate('ParkingAllRecieptScreen', {
            parkingDetailId: parkingDetailId,
          });
        }
    }
  });

  const onCancle = () => {
    navigation.goBack();
  };

  const onTakePhoto = async () => {
    setDisableCamera(true);
    const photo = await camera.current?.takePhoto();
    setPhotoFile(photo);
    setDisableCamera(false);
  };

  const onConfirm = async () => {
    try {
      if (!photoFile) return;
      showLoading();
      setDisableSubmit(true);
      const filePath =
        Platform.OS === 'android'
          ? `file://${photoFile.path}`
          : photoFile?.path;
      const timestamp = Date.now();
      const fileName = `photo_${timestamp}.jpg`;
      const base64Data = await RNFS.readFile(filePath || '', 'base64');
      const type = 'image/png';
      const bucket = 'obk-ocr-receipt';
      const imageData = await imageUploader(base64Data, fileName, type, bucket);
      const imageUrl = imageData.imageUrl;

      if (!imageUrl) return;
      const newReceipt = await OB_PARKING_SDK.client.receiptCreateReceipt({
        parkingDetailId,
        imageUrl: imageUrl,
      });
      if (newReceipt.status === 200 && newReceipt.data) {
        setPhotoFile(undefined);
        navigation.navigate('ParkingAllRecieptScreen', {
          parkingDetailId: parkingDetailId,
        });
      } else {
        setPhotoFile(undefined);
        navigation.navigate('AnnouncementScreen', {
          type: 'error',
          title: t(
            'Receipt__Redemption_create_error',
            'Something went wrong while sending your receipt. Please try again.',
          ),
          message: t(
            'Receipt__Redemption_create_error_description',
            'Please wait a moment and try submitting your photo again. If the problem continues, you can visit the nearest information counter for assistance.',
          ),
          buttonText: t('General__Try_again', 'Try Again'),
          screenHook: 'ParkingRedemptionCameraScreen',
        });
      }
    } catch (error) {
      setPhotoFile(undefined);
      console.log('Create receipt failed :', error);
      if (
        axios.isAxiosError(error) &&
        error.config?.url === Config.IMAGE_UPLOAD_URL
      ) {
        if (error.status === 413) {
          navigation.navigate('AnnouncementScreen', {
            type: 'error',
            title: t(
              'Receipt__Redemption_image_upload_max_size_error',
              'There was a problem with the selected image. Please try a different one.',
            ),
            message: t(
              'Receipt__Redemption_image_upload_max_size_error_description',
              'Please try a different image. For best results, use a standard JPEG or PNG file that is less than 10MB.',
            ),
            buttonText: t('General__Try_again', 'Try Again'),
            screenHook: 'ParkingRedemptionCameraScreen',
          });
        } else {
          navigation.navigate('AnnouncementScreen', {
            type: 'error',
            title: t(
              'Residential__LiveChat__File_exceeds_size_limit',
              'File exceeds size limit',
            ),
            message: `${t(
              'Residential__LiveChat__Maximum_upload_size',
              'maximum upload size',
            )}: ${UPLOAD_FILE_MAX_SIZE_MB} MB.`,
            buttonText: t('General__Try_again', 'Try Again'),
            screenHook: 'ParkingRedemptionCameraScreen',
          });
        }
      } else if (
        axios.isAxiosError(error) &&
        error.config?.baseURL === Config.OB_PARKING_URL
      ) {
        if (error.status === 400) {
          navigation.navigate('AnnouncementScreen', {
            type: 'error',
            title: t(
              'Receipt__Redemption_create_error',
              'Something went wrong while sending your receipt. Please try again.',
            ),
            message: t(
              'Receipt__Redemption_create_error_description',
              'Please wait a moment and try submitting your photo again. If the problem continues, you can visit the nearest information counter for assistance.',
            ),
            buttonText: t('General__Try_again', 'Try Again'),
            screenHook: 'ParkingRedemptionCameraScreen',
          });
        } else {
          navigation.navigate('AnnouncementScreen', {
            type: 'error',
            title: t('General__Something_went_wrong', 'Something\nwent wrong'),

            message: t(
              'Announcement__Error_generic__Body',
              'Please wait and try again soon.',
            ),
            buttonText: t('General__Try_again', 'Try Again'),
            screenHook: 'ParkingRedemptionCameraScreen',
          });
        }
      } else {
        navigation.navigate('AnnouncementScreen', {
          type: 'error',
          title: t('General__Something_went_wrong', 'Something\nwent wrong'),

          message: t(
            'Announcement__Error_generic__Body',
            'Please wait and try again soon.',
          ),
          buttonText: t('General__Try_again', 'Try Again'),
          screenHook: 'ParkingRedemptionCameraScreen',
        });
      }
    } finally {
      setDisableSubmit(false);
      hideLoading();
    }
  };

  if (photoFile) {
    return (
      <ScannedReceiptScreen
        url={photoFile.path}
        onRepeatScan={() => setPhotoFile(undefined)}
        onConfirm={onConfirm}
        disableSubmit={disableSubmit}
      />
    );
  }
  return (
    <View className="flex-1">
      <Camera
        ref={camera}
        device={device!}
        isActive={isFocused}
        className="flex-1"
        photo
        onError={error => {
          console.error('Camera error:', error);
        }}
      />
      <View className="absolute top-14 px-6 w-full items-end">
        <TouchableOpacity
          disabled={disableCamera}
          onPress={onCancle}
          className="rounded-full"
          activeOpacity={0.5}>
          <Icon type="close" width={20} height={20} color="white" />
        </TouchableOpacity>
      </View>
      <View className="absolute bottom-10 w-full items-center">
        <TouchableOpacity
          disabled={disableCamera}
          onPress={onTakePhoto}
          className="rounded-full border border-white p-1"
          activeOpacity={0.8}>
          <View className="w-[50px] h-[50px] rounded-full bg-white items-center justify-center">
            <Icon type="camera" width={24} height={24} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ParkingRedemptionCameraScreen;
