import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
  View,
  Platform,
  Alert,
} from 'react-native';
import {Button, Header, useModal} from '~/components/molecules';
import getTheme from '~/utils/themes/themeUtils';
import t from '~/utils/text';
import {Icon, IconType, Spacing, Text} from '~/components/atoms';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import {activeOpacity} from '~/constants';
import {Screen} from '~/components/templates';
import {
  request,
  PERMISSIONS,
  PermissionStatus,
  openSettings,
  check,
  RESULTS,
  Permission,
} from 'react-native-permissions';
import {logScreenView} from '~/utils/logGA';
import * as ImagePicker from 'react-native-image-picker';
import {imageUploader} from '~/utils/imageUploader';
import * as OB_PARKING_SDK from 'ob-parking-sdk';
import {ParkingDetailsGetParkingDetailUid200Response} from 'ob-parking-sdk/dist/api';
import clsx from 'clsx';
import {useScreenHook} from '~/services/EventEmitter';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import firebaseConfigState from '~/states/firebase';
import {alertTypeAction, useAlertTypeState} from '../store/permissionAlert';
import Loading from '~/components/organisms/Loading';
import axios from 'axios';
import Config from 'react-native-config';

type IParkingPaymentAndRedemptionScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ParkingPaymentAndRedemptionScreen'
>;

type MenuItem = {
  name: string;
  iconName: IconType;
  disabled?: boolean;
  onPress?: () => void;
};

export const ParkingPaymentAndRedemptionScreen = (
  props: IParkingPaymentAndRedemptionScreenProps,
) => {
  const [_modalState, modalActions] = useModal();

  const UPLOAD_FILE_MAX_SIZE_MB =
    firebaseConfigState.parking_redemption_file_max_size.value || 10;

  const {fee, logId} = props.route.params;
  const navigation = useNavigation();

  const [parkingDetail, setParkingDetail] =
    useState<ParkingDetailsGetParkingDetailUid200Response>();

  const [loading, setLoading] = useState<boolean>(false);
  const alertTypeState = useAlertTypeState();

  useEffect(() => {
    logScreenView('ParkingPaymentAndRedemptionScreen');
  }, []);

  useEffect(() => {
    // Fetch parking detail for parking detail id
    (async () => {
      const parkingDetailResponse =
        await OB_PARKING_SDK.client.parkingDetailsGetParkingDetailUid(logId);

      parkingDetailResponse.data &&
        setParkingDetail(parkingDetailResponse.data);
    })();
  }, [logId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const type = alertTypeState.alertType.get();
      if (type === 'camera') {
        AlertCameraPermission();
      }
      if (type === 'gallery') {
        AlertGalleryPermission();
      }
    });
    return unsubscribe;
  }, [navigation]);

  const AlertCameraPermission = () =>
    Alert.alert(
      t(
        'General__Access_camera',
        '"One Bangkok" Would Like to access the Camera',
      ),
      undefined,
      [
        {
          text: t('General__Not_allow', "Don't Allow"),
          onPress: () => {
            alertTypeAction.set('camera');
            modalActions.hide();
            navigation.navigate('ParkingAllowCameraOrGallery', {
              type: 'camera',
            });
          },
          style: 'cancel',
        },
        {
          text: t('General__Allow', 'Allow'),
          onPress: () => {
            modalActions.hide();
            openSettings();
          },
        },
      ],
    );

  const AlertGalleryPermission = () =>
    Alert.alert(
      t('Residential_Photo_Library_Unavailable', 'Photo Library Unavailable'),
      t(
        'Residential_Photo_Library_Unavailable_desc',
        'To include photo library images in your \nmessages, change your settings to \nallow One Bangkok to access your \nphotos.',
      ),
      [
        {
          text: t('Residential_Photo_Library_Unavailable_cancel', 'Cancel'),
          onPress: () => {
            alertTypeAction.set('gallery');
            modalActions.hide();
            navigation.navigate('ParkingAllowCameraOrGallery', {
              type: 'gallery',
            });
          },
        },
        {
          text: t(
            'Residential_Photo_Library_Unavailable_open_settings',
            'Open Settings',
          ),
          onPress: () => {
            openSettings();
          },
        },
      ],
    );

  const openModal = () => {
    modalActions.setContent(
      <View>
        <Text size="B1" className="font-medium">
          {t(
            'General__Scan_receipt_redeem',
            'Scan Receipt to Redeem Free Parking',
          )}
        </Text>
        <Spacing height={24} />
        <View>
          <Button
            title={t('General__Enter_discount_code', 'Enter discount code')}
            color="navy"
          />
          <Spacing height={12} />
          <Button
            title={t('General__Open_camera', 'Open camera')}
            outlined
            color="light-gray"
          />
          <Spacing height={12} />
          <Button
            title={t('General__Choose_from_gallery', 'Choose from gallery')}
            outlined
            color="light-gray"
          />
        </View>
      </View>,
    );
    modalActions.show();
  };

  const handleScanReceipt = () => {
    if (!parkingDetail) return;
    modalActions.hide();
    navigation.navigate('ParkingRedemptionCameraScreen', {
      parkingDetailId: parkingDetail.id,
      fee,
    });
  };

  const onOpenCamera = async () => {
    const permissionType =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

    const currentPermission: PermissionStatus = await check(permissionType);

    if (currentPermission === 'granted') {
      handleScanReceipt();
    } else if (currentPermission === 'denied') {
      const requestPermission: PermissionStatus = await request(permissionType);
      if (requestPermission === 'granted') {
        handleScanReceipt();
      } else {
        alertTypeAction.set('camera');
        modalActions.hide();
        navigation.navigate('ParkingAllowCameraOrGallery', {
          type: 'camera',
        });
      }
    } else {
      AlertCameraPermission();
    }
  };

  const onOpenGallery = async () => {
    try {
      let permissionType: Permission;
      if (Platform.OS === 'ios') {
        permissionType = PERMISSIONS.IOS.PHOTO_LIBRARY;
      } else {
        permissionType =
          Number(Platform.Version) >= 33
            ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      }

      let permissionStatus: PermissionStatus = await check(permissionType);

      if (
        permissionStatus === RESULTS.UNAVAILABLE ||
        permissionStatus === RESULTS.BLOCKED
      ) {
        AlertGalleryPermission();
        return;
      }

      if (permissionStatus === RESULTS.DENIED) {
        permissionStatus = await request(permissionType);
        if (
          permissionStatus === RESULTS.BLOCKED ||
          permissionStatus === RESULTS.UNAVAILABLE
        ) {
          alertTypeAction.set('gallery');
          modalActions.hide();
          navigation.navigate('ParkingAllowCameraOrGallery', {
            type: 'gallery',
          });
          return;
        }
      }

      if (permissionStatus !== RESULTS.GRANTED) return;
      setLoading(true);
      await ImagePicker.launchImageLibrary(
        {
          mediaType: 'photo',
          includeBase64: true,
          selectionLimit: 1,
          quality: Platform.OS === 'ios' ? 0.8 : 1,
        },
        async response => {
          try {
            const {assets} = response;
            if (!assets || assets?.length === 0 || !parkingDetail) return;
            const {base64, fileName, type} = assets[0];
            if (!base64 || !fileName || !type) {
              navigation.navigate('AnnouncementScreen', {
                type: 'error',
                title: t(
                  'General__Redemption_gallery_error',
                  "Oops! We couldn't read the photo. Please try taking it again.",
                ),
                message: t(
                  'Receipt__Redemption_invalid_image_description',
                  'The image might be corrupted or unsupported. Please try a different one.',
                ),
                buttonText: t('General__Try_again', 'Try Again'),
                screenHook: 'AnnouncementScreen',
              });
              return;
            }

            const imageData = await imageUploader(
              base64,
              fileName,
              'image/png',
              'obk-ocr-receipt',
            );

            const imageUrl = imageData.imageUrl;
            if (!imageUrl) return;
            const newReceipt = await OB_PARKING_SDK.client.receiptCreateReceipt(
              {
                // TODO : use parking ticket detail id
                parkingDetailId: parkingDetail?.id,
                imageUrl: imageUrl,
              },
            );
            if (newReceipt.status === 200 && newReceipt.data) {
              // TODO : implement navigate to all receipt screen
              navigation.navigate('ParkingAllRecieptScreen', {
                parkingDetailId: parkingDetail.id,
              });
            } else {
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
                screenHook: 'AnnouncementScreen',
              });
            }
          } catch (error) {
            console.log('Gallery upload failed', JSON.stringify(error));
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
                  screenHook: 'AnnouncementScreen',
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
                  screenHook: 'AnnouncementScreen',
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
                  screenHook: 'AnnouncementScreen',
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
                  screenHook: 'AnnouncementScreen',
                });
              }
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
                screenHook: 'AnnouncementScreen',
              });
            }
          } finally {
            setLoading(false);
          }
        },
      );
    } catch (error) {
      console.log('Catch error: ', error);
      navigation.navigate('AnnouncementScreen', {
        type: 'error',
        title: t('General__Something_went_wrong', 'Something\nwent wrong'),
        message: t(
          'Announcement__Error_generic__Body',
          'Please wait and try again soon.',
        ),
        buttonText: t('General__Try_again', 'Try Again'),
        screenHook: 'AnnouncementScreen',
      });
    } finally {
      modalActions.hide();
    }
  };

  const openScanReceiptModal = () => {
    modalActions.setContent(
      <View>
        <Text size="B1" className="font-medium">
          Scan Receipt to Redeem Free Parking
        </Text>
        <Spacing height={24} />
        <View>
          <Button
            title={t('General__Open_camera', 'Open camera')}
            color="navy"
            onPress={onOpenCamera}
          />
          <Spacing height={12} />
          <Button
            title={t('General__Choose_from_gallery', 'Choose from gallery')}
            outlined
            color="light-gray"
            onPress={onOpenGallery}
          />
        </View>
      </View>,
    );
    modalActions.show();
  };

  const menuList: MenuItem[] = [
    {
      name: t(
        'General__Scan_receipt_redeem',
        'Scan Receipt to Redeem Free Parking',
      ),
      iconName: 'scan',
      onPress: () => {
        openScanReceiptModal();
      },
    },
    // TODO : Coupon
    // {
    //   name: t('General__Scan_or_code', 'Scan or enter discount code'),
    //   iconName: 'ticket',
    //   onPress: () => {
    //     openModal();
    //   },
    // },
    {
      name: t('General__Make_payment', 'Make Payment'),
      iconName: 'wallet',
      disabled: fee <= 0,
      onPress: () => {
        navigation.navigate('ParkingPaymentScreen', {
          logId,
          fee,
        });
      },
    },
  ];

  useScreenHook('AnnouncementScreen', async event => {
    switch (event.name) {
      case AnnouncementScreenEventNames.CONTINUE:
        if (event.from.params.type === 'error') {
          navigation.goBack();
          break;
        }
        break;
      default:
        break;
    }
  });

  if (loading) {
    return (
      <Screen>
        <Loading isLoading={loading} />
      </Screen>
    );
  }

  return (
    <Screen className={getTheme('bg-default h-screen')}>
      <Header
        leftAction="goBack"
        title={t(
          'General__Parking_payment_redeem',
          'Parking payment and redemption',
        )}
      />
      <ScrollView className="h-full w-full px-4 py-6">
        <View>
          <FlatList
            scrollEnabled={false}
            data={menuList}
            renderItem={({item, index}) => {
              return (
                <View
                  className={clsx({
                    'py-4 border-b border-gray-300 justify-center': true,
                    'opacity-20': item.disabled,
                  })}
                  key={`${item.name}_${index}`}>
                  <TouchableOpacity
                    disabled={item.disabled}
                    testID="drawer-settings-id"
                    activeOpacity={activeOpacity}
                    onPress={item.onPress}>
                    <View className="flex flex-row items-center justify-between">
                      <Icon type={item.iconName} width={24} height={24} />
                      <Spacing width={12} />
                      <Text size="B1" color="dark-gray" className="flex-1">
                        {item.name}
                      </Text>
                      <Icon type="right" width={12} height={12} />
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
      </ScrollView>
    </Screen>
  );
};
