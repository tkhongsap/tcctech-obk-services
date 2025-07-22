import React, {useEffect, useState} from 'react';
import {
  Alert,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  request,
  PERMISSIONS,
  RESULTS,
  PermissionStatus,
  check,
} from 'react-native-permissions';
import {HeaderBar} from '~/components/molecules';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import {
  Camera,
  useCodeScanner,
  getCameraDevice,
} from 'react-native-vision-camera';
import t from '~/utils/text';
import {first, get, last, size, split} from 'lodash';
import {useIsFocused} from '@react-navigation/native';
import {ScreenContainer} from '~/components/templates';
import {Icon} from '~/components/atoms';
import * as ImagePicker from 'react-native-image-picker';
import jsQR from 'jsqr';
import jpeg from 'jpeg-js';
import {Buffer} from 'buffer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useModal} from '../../components/ResidentialModal';
import {CarParkConfirmationModal} from '../components/CarParkConfirmationModal';
import {logScreenView} from '~/utils/logGA';

const PNG = require('pngjs/browser').PNG;

type FilterStyle = {
  width: number;
  height: number;
};
type TQRCodeData = {
  id: string;
  expired_date: string;
};

const FilterLine = ({width, height}: FilterStyle) => {
  return <View style={{backgroundColor: 'white', width, height}} />;
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ResidentialParkingRedemptionScreen'
>;

const ResidentialParkingRedemptionScreen = ({
  route: {
    params: {hookFrom},
  },
}: Props) => {
  const navigation = useNavigation();
  const devices = Camera.getAvailableCameraDevices();
  const isFocused = useIsFocused();

  const [permissionStatus, setPermissionStatus] = useState('');
  const [_modalState, modalActions] = useModal();
  const [device, setDevice] = useState(getCameraDevice(devices, 'back'));
  const [torch, setTorch] = useState(false);
  const [isPickingImage, setIsPickingImage] = useState(false);

  useEffect(() => {
    logScreenView('ResidentialParkingRedemptionScreen');
    checkPermission();
    const intervalId = setInterval(() => {
      if (permissionStatus !== 'granted') {
        checkPermission();
      } else {
        clearInterval(intervalId); // Stop checking when permission is granted
      }
    }, 5000); // Check every 5 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [permissionStatus]);

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

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      if (codes.length > 0) {
        const data = first(codes)?.value;

        try {
          if (!data?.includes('id')) {
            showErrorModal();
            return;
          }
          const jsonData = JSON.parse(data);
          const id = get(jsonData, ['id']);
          if (id) {
            validateQrCode(id);
          } else {
            showErrorModal();
          }
        } catch (error) {
          const stringArray = split(data, '/');
          if (size(stringArray) !== 0) {
            const id = last(stringArray);
            validateQrCode(id!);
          } else {
            showErrorModal();
          }
        }
      }
    },
  });

  const handleFlipCamera = () => {
    const position = device?.position === 'front' ? 'back' : 'front';
    setDevice(getCameraDevice(devices, position));
  };

  const handleSetTorch = () => {
    if (!device?.hasTorch) return;
    setTorch(!torch);
  };

  const handleImagePicker = async () => {
    try {
      setIsPickingImage(true);
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
          maxHeight: 2000,
          maxWidth: 2000,
          selectionLimit: 1,
        },
        async response => {
          const {errorCode, errorMessage, didCancel, assets} = response;
          if (didCancel) {
            console.log('User canceled');
          } else if (errorCode || errorMessage) {
            console.log(`Error code: ${errorCode} | msg: ${errorMessage}`);
          } else if (assets) {
            const {base64, width, height, type: imageType} = assets[0];
            if (base64) {
              readQrCodeFromImageBase64(base64, width, height, imageType);
            }
          }
        },
      );
    } catch (error) {
      console.log('Catch error: ', error);
      showErrorModal();
    } finally {
      setIsPickingImage(false);
    }
  };

  const readQrCodeFromImageBase64 = (
    base64: string,
    width: number = 2000,
    height: number = 2000,
    imageType: string = 'image/jpeg',
  ) => {
    const base64Buffer = Buffer.from(base64, 'base64');
    let pixelData: jpeg.UintArrRet & {
      comments?: string[];
    };
    let imageBuffer: Uint8Array;
    if (imageType === 'image/jpeg') {
      pixelData = jpeg.decode(base64Buffer, {useTArray: true});
      imageBuffer = pixelData.data;
    } else {
      pixelData = PNG.sync.read(base64Buffer);
      imageBuffer = pixelData.data;
    }

    const data = Uint8ClampedArray.from(imageBuffer);
    const code = jsQR(data, width, height);
    if (code) {
      const value = JSON.parse(code.data) as TQRCodeData;
      validateQrCode(value.id);
    }
  };

  const validateQrCode = async (value: string) => {
    if (hookFrom === 'CAR_PARK_PAYMENT') {
      navigation.navigate('ResidentialCarParkPaymentDetailScreen', {
        token: value,
        internalQr: true,
      });
    } else if (hookFrom === 'REDEMPTION_CAR_PARK') {
      navigation.navigate('ResidentialParkingRedemptionDetailScreen', {
        token: value,
        internalQr: true,
      });
    }
  };

  const showErrorModal = () => {
    modalActions.setOnBackdropPress({enabled: true, func: () => {}});
    modalActions.setContent(
      <CarParkConfirmationModal
        title={t(
          'Residential__Car_Park_Payment__Something_went_wrong',
          'Something went wrong',
        )}
        ConfirmButtonColor="dark-teal"
        description={t(
          'Residential__Car_Park_Payment__Can_not_scan',
          'We’re unable to scan the parking ticket. Please check your camera before trying again.',
        )}
        textConfirmButton={t(
          'Residential__Car_Park_Payment__Try_Again',
          'Try again',
        )}
        onContinue={() => {
          modalActions.hide();
        }}
        onCancel={() => {
          modalActions.hide();
          navigation.navigate('ResidentialVisitorPassHomeScreen');
        }}
      />,
    );
    modalActions.show();
  };

  return (
    <ScreenContainer bgColor="#ffffff" barStyle="dark-content">
      <HeaderBar
        title={t('General__Scan_qr', 'Scan QR Code')}
        leftAction="goBack"
      />
      <View style={styles.cameraContainer}>
        {/* Camera Filter */}
        <View
          className="p-8 flex"
          style={{
            justifyContent: 'space-between',
            position: 'absolute',
            height: '100%',
            width: '100%',
            zIndex: 1,
          }}>
          <View
            style={{
              flexDirection: 'column-reverse',
              alignItems: 'flex-start',
              display: 'flex',
              justifyContent: 'flex-end',
              alignContent: 'flex-end',
            }}>
            {/* Flash button */}
            <TouchableOpacity onPress={handleSetTorch}>
              {torch ? (
                <View className="w-[44px] h-[44px] rounded-full bg-light-gray-light flex flex-row items-center justify-center">
                  <Icon type="scLightonIcon" width={12} height={16} />
                </View>
              ) : (
                <View className="w-[44px] h-[44px] rounded-full bg-light-gray-light flex flex-row items-center justify-center">
                  <Icon type="scLightIcon" width={12} height={16} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Left Top  */}
          <View>
            {FilterLine({width: 50, height: 5})}
            {FilterLine({width: 5, height: 50})}
          </View>

          {/* Right Bottom  */}
          <View
            style={{
              flexDirection: 'column-reverse',
              alignItems: 'flex-end',
              display: 'flex',
              justifyContent: 'flex-end',
              alignContent: 'flex-end',
            }}>
            {FilterLine({width: 50, height: 5})}
            {FilterLine({width: 5, height: 50})}
          </View>

          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'flex-end',
              display: 'flex',
              justifyContent: 'space-between',
              alignContent: 'flex-end',
            }}>
            {/* Flip camera button */}
            <TouchableOpacity onPress={handleFlipCamera}>
              <View className="w-[44px] h-[44px] rounded-full bg-light-gray-light flex flex-row items-center justify-center rotate-90">
                <Icon type="Swap" width={12} height={16} color="#7C7C7C" />
              </View>
            </TouchableOpacity>

            {/* Pick image button */}
            <TouchableOpacity
              onPress={handleImagePicker}
              disabled={isPickingImage}>
              <View className="w-[44px] h-[44px] rounded-full bg-light-gray-light flex flex-row items-center justify-center">
                <Icon
                  type="greyPicture"
                  width={12}
                  height={16}
                  color="#7C7C7C"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Camera
          device={device!}
          isActive={isFocused}
          codeScanner={codeScanner}
          style={styles.camera}
          torch={torch && device?.hasTorch ? 'on' : 'off'}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    height: '87%',
    width: '90%',
    borderRadius: 4,
    overflow: 'hidden',
    alignContent: 'center',
    alignSelf: 'center',
  },
  camera: {
    height: '100%',
  },
});
export default ResidentialParkingRedemptionScreen;
